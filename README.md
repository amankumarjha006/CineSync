# 🎬 CineSync — Content-Based Movie Recommender System

A full-stack movie recommendation system built with Python (FastAPI) and React. Users can search for a movie and get intelligent recommendations based on content similarity, or browse movies by genre.

**Live Demo:** [your-vercel-link-here]  
**Backend API:** [your-railway-link-here]  
**API Docs:** [your-railway-link-here/docs]

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Dataset](#dataset)
- [How the Model Works](#how-the-model-works)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Model Limitations](#model-limitations)
- [Future Improvements](#future-improvements)
- [Acknowledgements](#acknowledgements)

---

## Project Overview

CineSync is a content-based movie recommender system that suggests movies similar to one you already like. Unlike collaborative filtering (which relies on user behaviour data), content-based filtering analyses the actual content of movies — their plot, genres, cast, director, and keywords — to find similar titles.

The project was built as a learning exercise in machine learning, NLP, and full-stack development. It covers the entire pipeline from raw data collection and preprocessing, through model training and serialisation, to a REST API and a React frontend.

---

## Features

- **Movie Search** with fuzzy matching — handles typos and partial titles
- **Autocomplete suggestions** as you type
- **Content-based recommendations** — 10 similar movies per search
- **Movie detail view** — poster, overview, rating, release year
- **Browse by Genre** — explore top rated movies in any genre
- **Weighted ratings** using the IMDb formula to surface reliable results
- **Live posters** fetched from the TMDB API
- **Responsive UI** built with React and Tailwind CSS

---

## Tech Stack

| Layer | Technology |
|---|---|
| Machine Learning | scikit-learn (TF-IDF, Cosine Similarity) |
| Backend | FastAPI, Python 3.10+ |
| Frontend | React 18, Vite, Tailwind CSS |
| Data Processing | Pandas, NumPy |
| Fuzzy Search | RapidFuzz |
| Model Storage | Google Drive (via gdown) |
| Poster Images | TMDB API |
| Backend Deployment | Railway |
| Frontend Deployment | Vercel |

---

## Dataset

### Source
The dataset used is **The Movies Dataset** available on Kaggle:  
[kaggle.com/datasets/rounakbanik/the-movies-dataset](https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset)

Three files were used from this dataset:

| File | Description | Rows |
|---|---|---|
| `movies_metadata.csv` | Core movie information | 45,466 |
| `credits.csv` | Cast and crew data | 45,476 |
| `keywords.csv` | Plot keywords | 46,419 |

### Data Processing Steps
1. Loaded all three files and cleaned bad/non-numeric IDs
2. Removed duplicates from each file before merging
3. Merged all three on `movie_id` into one dataframe
4. Dropped irrelevant columns: `adult`, `belongs_to_collection`, `homepage`, `imdb_id`, `video`, `status`, `spoken_languages`, `tagline`, `production_countries`
5. Parsed JSON-like string columns (`genres`, `cast`, `crew`, `keywords`) using `ast.literal_eval`
6. Extracted only the top 3 cast members per movie
7. Extracted director name from the crew column
8. Extracted release year from `release_date`
9. Filtered out movies with missing overviews, missing titles, and fewer than 10 votes
10. Removed duplicate titles, keeping the entry with the most votes
11. Applied the IMDb weighted rating formula

### Final Dataset Size
After cleaning and filtering: **~44,000 movies**  
After sampling for TF-IDF training: **20,000 movies** (memory constraint — see limitations)

---

## How the Model Works

### Step 1 — Feature Engineering (Tag Soup)
Each movie's text features are combined into a single string called the **tag soup**:

```
tags = overview + genres + keywords + cast + director
```

Example for *The Dark Knight*:
```
a superhero film where batman faces a criminal mastermind known as the joker...
action crime drama thriller ChristianBale HeathLedger AaronEckhart ChristopherNolan
superhero chaos anarchy gotham city
```

Note: Multi-word names like `Tom Hanks` are collapsed to `TomHanks` to prevent the model treating them as separate features.

### Step 2 — TF-IDF Vectorisation
The tag soup for all 20,000 movies is converted into a numerical matrix using **TF-IDF (Term Frequency — Inverse Document Frequency)**:

- **Term Frequency (TF):** How often a word appears in a movie's tags
- **Inverse Document Frequency (IDF):** How rare the word is across all movies — rare words like "wizard" score higher than common words like "man"
- Parameters used: `max_features=5000`, `stop_words='english'`
- Output: A sparse matrix of shape `(20000, 5000)`

### Step 3 — Cosine Similarity
When a user searches for a movie, cosine similarity is computed **on the fly** between that movie's TF-IDF vector and all other movies:

```
similarity = cos(θ) = (A · B) / (||A|| × ||B||)
```

A similarity score of 1.0 means identical, 0.0 means completely different. The top 10 most similar movies are returned.

Computing on the fly (rather than precomputing the full matrix) was a deliberate choice to avoid memory issues — a 20,000 × 20,000 float64 matrix requires ~3GB of RAM.

### Step 4 — Weighted Rating (IMDb Formula)
For genre browsing, movies are ranked by weighted rating rather than raw average rating to prevent obscure movies with few votes from dominating:

```
Weighted Rating = (v / (v + m)) × R + (m / (v + m)) × C
```

Where:
- `v` = number of votes for the movie
- `m` = minimum votes required (90th percentile of vote counts)
- `R` = average rating of the movie
- `C` = mean rating across all movies

---

## Project Structure

```
movie-recommender/
│
├── backend/
│   ├── data/
│   │   └── processed/          ← downloaded from Google Drive at runtime
│   ├── notebooks/
│   │   ├── 01_EDA.ipynb        ← data loading and exploration
│   │   └── 02_model_building.ipynb  ← TF-IDF training
│   ├── src/                    ← preprocessing and feature engineering scripts
│   ├── models/                 ← downloaded from Google Drive at runtime
│   ├── api/
│   │   └── main.py             ← FastAPI application
│   ├── Procfile                ← Railway deployment config
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── movieApi.js     ← all API calls
    │   ├── components/         ← reusable UI components
    │   ├── pages/
    │   │   ├── Home.jsx        ← search page
    │   │   ├── Results.jsx     ← recommendations page
    │   │   ├── MovieDetail.jsx ← individual movie page
    │   │   └── Genre.jsx       ← browse by genre page
    │   └── App.jsx
    └── package.json
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- A free TMDB API key from [themoviedb.org](https://www.themoviedb.org)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/movie-recommender.git
cd movie-recommender/backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server (model files download automatically on first run)
cd api
uvicorn main:app --reload
```

The server will be available at `http://localhost:8000`  
API documentation at `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_TMDB_API_KEY=your_tmdb_key_here" > .env
echo "VITE_API_URL=http://localhost:8000" >> .env

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| GET | `/recommend/{title}` | Get 10 similar movies |
| GET | `/search?query={q}` | Fuzzy search movie titles |
| GET | `/genre/{genre}` | Top movies in a genre |
| GET | `/genres` | List all available genres |
| GET | `/credits/{title}` | Get cast and director |

### Example Response — `/recommend/Inception`

```json
{
  "recommendations": [
    {
      "title": "The Dark Knight",
      "poster_path": "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      "vote_average": 8.2,
      "release_year": "2008",
      "genres": "['Action', 'Crime', 'Drama', 'Thriller']"
    }
  ]
}
```

---

## Model Limitations

### 1. Dataset Coverage
The dataset covers movies up to approximately 2017. Movies released after this date are not in the system and cannot be recommended or searched.

### 2. 20,000 Movie Limit
The full dataset has ~44,000 movies but TF-IDF training was limited to a random sample of 20,000 due to memory constraints on standard hardware. A 44,000 × 44,000 cosine similarity matrix requires ~14GB of RAM which is not feasible on a personal laptop or free-tier cloud hosting.

### 3. No Personalisation
This is a pure content-based system. It has no concept of user preferences, watch history, or ratings. Every user searching for "Inception" gets the same 10 recommendations regardless of their taste.

### 4. Cold Start for New Movies
Any movie not in the dataset returns a "not found" error. There is no fallback mechanism to handle movies outside the training data.

### 5. Text-Only Similarity
The model only understands textual similarity — shared words in plots, genres, and keywords. It cannot capture more subtle qualities like cinematography style, pacing, emotional tone, or thematic depth.

### 6. Keyword Quality Dependency
Recommendation quality depends heavily on the richness of the plot keywords and overviews in the dataset. Poorly described movies or those with minimal metadata will produce weaker recommendations.

### 7. Language Bias
The dataset is heavily skewed towards English-language Hollywood films. International cinema is underrepresented, which means recommendations for non-English films may be poor.

### 8. No Real-Time Updates
The model is static — it was trained once and saved. It does not learn from user interactions or update as new movies are released.

---

## Future Improvements

- **Hybrid recommender** — combine content-based with collaborative filtering using user ratings data from MovieLens
- **BERT embeddings** — replace TF-IDF with sentence transformers (`all-MiniLM-L6-v2`) for semantically richer similarity
- **Expand dataset** — use the TMDB API to fetch movies released after 2017 and retrain
- **User accounts** — allow users to save favourites and get personalised recommendations
- **Explainability panel** — show users exactly why a movie was recommended (shared genres, cast, keywords)
- **Mood-based search** — map emotional moods to genre/keyword combinations
- **Better memory management** — use approximate nearest neighbour search (FAISS) instead of exact cosine similarity to handle the full 44,000 movie dataset

---

## Acknowledgements

- **Dataset:** [The Movies Dataset](https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset) by Rounak Banik on Kaggle
- **Poster Images & Movie Data:** [The Movie Database (TMDB)](https://www.themoviedb.org) API
- **IMDb Weighted Rating Formula:** Based on the methodology used by [IMDb's Top 250](https://www.imdb.com/chart/top/)
- **Libraries:** scikit-learn, FastAPI, React, Tailwind CSS, RapidFuzz, Pandas

---

## License

This project is open source and available under the [MIT License](LICENSE).
