import { useNavigate } from "react-router-dom";
import { Film } from "lucide-react";

function GenreCard({ genre }) {
    const navigate = useNavigate();

    const colors = [
        'from-rose-500 to-orange-500',
        'from-blue-500 to-cyan-500',
        'from-emerald-500 to-teal-500',
        'from-violet-500 to-fuchsia-500',
        'from-pink-500 to-rose-500',
        'from-amber-500 to-red-500'
    ];

    // Hash string to pick consistent color
    const colorIndex = genre.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    const gradient = colors[colorIndex];

    const handleClick = () => {
        navigate(`/genres/${encodeURIComponent(genre)}`);
    };

    return (
        <div
            onClick={handleClick}
            className="group relative overflow-hidden rounded-3xl cursor-pointer transform hover:-translate-y-2 hover:scale-[1.03] transition-all duration-500 shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] aspect-[16/9] bg-[#121826] border border-white/5 hover:border-white/20"
        >
            {/* Subtle background glow based on the hashed color, but very muted */}
            <div className={`absolute -right-10 -top-10 w-48 h-48 bg-gradient-to-br ${gradient} rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700`} />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] to-transparent opacity-80" />

            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col items-start justify-end z-10">
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex items-center justify-between w-full">
                        <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500">
                            <Film className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400 group-hover:text-rose-300 transition-colors" />
                        </div>
                        {/* A tiny subtle accent line that expands on hover */}
                        <div className="h-0.5 w-0 bg-gradient-to-r from-rose-500 to-orange-500 group-hover:w-12 transition-all duration-700 rounded-full"></div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide group-hover:-translate-y-1 transition-transform duration-500">
                        {genre}
                    </h3>
                </div>
            </div>
        </div>
    );
}

export default GenreCard;
