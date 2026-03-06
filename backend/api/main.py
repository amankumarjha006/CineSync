from fastapi import FastAPI
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from rapidfuzz import process
from fastapi.middleware.cors import CORSMiddleware
import pickle
import os
import gdown

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Download files from Google Drive if they don't exist
models_path = os.path.join(BASE_DIR, 'models/tfidf_matrix.pkl')
data_path = os.path.join(BASE_DIR, 'data/processed/movies_final.csv')

if not os.path.exists(models_path):
    os.makedirs(os.path.join(BASE_DIR, 'models'), exist_ok=True)
    gdown.download(f'https://drive.google.com/uc?id=1vWIGbGH4WfaOZCzmpzzMgo_VBES4qdvL', models_path, quiet=False)

if not os.path.exists(data_path):
    os.makedirs(os.path.join(BASE_DIR, 'data/processed'), exist_ok=True)
    gdown.download(f'https://drive.google.com/uc?id=1tOfJX3kFwF2rpOFBpzWUxjotv6AtOeSf', data_path, quiet=False)

movies = pd.read_csv(data_path)
tfidf_matrix = pickle.load(open(models_path, 'rb'))

@app.get("/")
def home():
    return {"message": "Movie Recommender Api is running"}

def get_movie_match(title: str):
    # Try exact case-insensitive match first
    matches = movies[movies['title'].str.lower() == title.lower()]
    if not matches.empty:
        return matches.iloc[0], matches.index[0]
        
    # If no exact match, try fuzzy matching
    best_match = process.extractOne(title, movies['title'], score_cutoff=80)
    if best_match:
        matched_title = best_match[0]
        matches = movies[movies['title'] == matched_title]
        if not matches.empty:
            return matches.iloc[0], matches.index[0]
            
    return None, None

@app.get("/recommend/{title}")
def recommend(title: str):
    row, idx = get_movie_match(title)
    
    if row is None:
        return {"error": f"Movie '{title}' not found in database"}
    
    sim_scores = cosine_similarity(tfidf_matrix[idx], tfidf_matrix).flatten()
    sim_scores[idx] = 0
    top_indices = sim_scores.argsort()[::-1][:10]
    
    results = []
    for i in top_indices:
        row = movies.iloc[i]
        results.append({
            "title": row["title"],
            "poster_path": row["poster_path"] if not pd.isna(row["poster_path"]) else None,
            "vote_average": row["vote_average"],
            "release_year": str(row["release_year"]),
            "genres": row["genres"],
            
        })
    return {"recommendations": results}

@app.get("/search")
def search(query: str):
    results = process.extract(query, movies['title'], limit = 5)
    titles = [item[0] for item in results]
    return {"results": titles}

@app.get("/credits/{title}")
def credits(title: str):
    row, idx = get_movie_match(title)
    
    if row is None:
        return {"error": f"Movie '{title}' not found in database"}
    
    # Cast is stored as a stringified list like "['Actor 1', 'Actor 2']" usually, so we can try to eval it safely or just return it as a string to be parsed on frontend.
    import ast
    try:
        cast_list = ast.literal_eval(row['cast']) if not pd.isna(row['cast']) else []
    except:
        cast_list = []
        
    return {
        "director": row['director'] if not pd.isna(row['director']) else "Unknown",
        "cast": cast_list,
        "genres": row['genres'] if not pd.isna(row['genres']) else "[]"
    }
    
@app.get("/genre/{genre}")
def get_by_genre(genre: str, n: int = 20):
    filtered = movies[movies['genres'].str.contains(genre, case=False, na=False)]
    filtered = filtered.sort_values('weighted_rating', ascending=False).head(n)
    results = []
    for _, row in filtered.iterrows():
        results.append({
            "title": row["title"],
            "poster_path": row["poster_path"] if not pd.isna(row["poster_path"]) else None,
            "vote_average": row["vote_average"],
            "release_year": str(row["release_year"]),
            "genres": row["genres"]
        })
    return {"results": results}

@app.get("/genres")
def get_all_genres():
    import ast
    all_genres = set()
    for genre_str in movies['genres'].dropna():
        try:
            # Try to parse stringified list
            genres_list = ast.literal_eval(genre_str)
            if isinstance(genres_list, list):
                all_genres.update(genres_list)
        except:
            # Fallback if it's just a comma-separated string
            parts = [g.strip() for g in str(genre_str).split(',')]
            all_genres.update(parts)
    return {"genres": sorted(list(all_genres))}
