import { useState, useEffect } from "react";
import { getAllGenres } from "../api/movieApi";
import GenreCard from "../components/GenreCard";
import { Loader2, Clapperboard } from "lucide-react";

function Genres() {
    const [genres, setGenres] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getAllGenres()
            .then((data) => {
                setGenres(data.genres || []);
            })
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
                <Loader2 size={48} className="animate-spin text-rose-500 mb-4" />
                <p className="text-xl font-medium">Loading genres...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-[#0a0f18] p-6 lg:p-12 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
                        Explore by <span className="bg-gradient-to-r from-rose-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Genre</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light">
                        Dive into our extensive collection of movies categorized by your favorite genres.
                    </p>
                </div>

                {genres.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
                        {genres.map((genre, index) => (
                            <div
                                key={index}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                            >
                                <GenreCard genre={genre} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-slate-500 mt-20">
                        No genres found.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Genres;
