import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMoviesByGenre, getMoviePoster } from "../api/movieApi";
import MovieCard from "../components/MovieCard";
import { Loader2, ArrowLeft, Film } from "lucide-react";

function GenreMovies() {
    const { genre } = useParams();
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        // Decode the genre parameter back to its original string
        const decodedGenre = decodeURIComponent(genre);
        getMoviesByGenre(decodedGenre, 40) // fetch up to 40 movies
            .then(async (data) => {
                const results = data.results || [];
                const moviesWithPosters = await Promise.all(
                    results.map(async (m) => {
                        const poster = await getMoviePoster(m.title);
                        return { ...m, poster };
                    })
                );
                setMovies(moviesWithPosters);
            })
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false));
    }, [genre]);

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-5rem)] bg-[#0a0f18] flex flex-col items-center justify-center text-slate-400">
                <Loader2 size={48} className="animate-spin text-rose-500 mb-4" />
                <p className="text-xl font-medium">Loading {decodeURIComponent(genre)} movies...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-[#0a0f18] p-6 lg:p-12 text-slate-100 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10 pt-4">
                <button
                    onClick={() => navigate('/genres')}
                    className="mb-8 p-3 rounded-full bg-white/5 hover:bg-rose-600 border border-white/10 hover:border-rose-500 transition-all text-slate-300 hover:text-white backdrop-blur-md group shadow-xl flex items-center gap-2 w-fit"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium pr-2">Back to Genres</span>
                </button>

                <div className="flex items-center gap-4 mb-12">
                    <Film className="text-rose-500 w-10 h-10" />
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
                        Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-400 to-rose-400 bg-[length:200%_auto] animate-gradient">{decodeURIComponent(genre)}</span> Movies
                    </h1>
                </div>

                {movies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 gap-y-10">
                        {movies.map((m, idx) => (
                            <MovieCard key={`${m.title}-${idx}`} movie={m} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-black/20 rounded-3xl border border-white/5 backdrop-blur-sm">
                        <Film size={48} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-400 text-lg">No movies found for this genre.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GenreMovies;
