import { useNavigate } from 'react-router-dom';
import { Star, Calendar } from 'lucide-react';

function MovieCard({ movie }) {
    const navigate = useNavigate();

    const getPosterUrl = () => {
        if (movie.poster) return movie.poster;
        if (movie.poster_path && typeof movie.poster_path === 'string') {
            if (movie.poster_path.startsWith('http')) return movie.poster_path;
            const path = movie.poster_path.startsWith('/') ? movie.poster_path : `/${movie.poster_path}`;
            return `https://image.tmdb.org/t/p/w500${path}`;
        }
        return 'https://via.placeholder.com/300x450/1e293b/94a3b8?text=No+Poster';
    };

    const getRatingColor = (rating) => {
        if (rating >= 7.5) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        if (rating >= 6.0) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    };

    const formattedRating = Number(movie.vote_average || 0).toFixed(1);

    return (
        <div
            onClick={() => navigate('/results', { state: { movie: movie.title } })}
            className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[2/3] transform hover:-translate-y-2 hover:scale-[1.03] transition-all duration-500 shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-rose-500/10 bg-[#0a0f18]"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-900 opacity-50" />

            <img
                src={getPosterUrl()}
                alt={movie.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-[#0a0f18]/40 to-transparent opacity-80" />

            <div className="absolute inset-0 p-5 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 drop-shadow-md">
                    {movie.title}
                </h3>

                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-slate-300 text-sm font-medium">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{movie.release_year || 'N/A'}</span>
                    </div>

                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-md text-sm font-bold shadow-sm ${getRatingColor(formattedRating)}`}>
                        <Star size={14} className="fill-current" />
                        <span>{formattedRating}</span>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none group-hover:ring-rose-500/20 transition-colors duration-500" />
        </div>
    );
}

export default MovieCard;
