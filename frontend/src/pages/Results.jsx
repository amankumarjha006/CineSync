import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRecommendations, getMoviePoster, getMovieDetails, getMovieCredits } from "../api/movieApi";
import { Star, Calendar, ArrowLeft, PlayCircle, Loader2, User, Clapperboard, Film, Popcorn } from "lucide-react";
import MovieCard from "../components/MovieCard";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie;

  const [searchedMovie, setSearchedMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [credits, setCredits] = useState({ director: "Unknown", cast: [], genres: "[]" });
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const parseGenres = (genreStr) => {
    try {
      if (!genreStr || genreStr === "[]" || genreStr === "NaN") return [];
      return JSON.parse(genreStr.replace(/'/g, '"'));
    } catch (e) {
      if (typeof genreStr === 'string') return genreStr.split(',').map(g => g.trim());
      return [];
    }
  };

  useEffect(() => {
    if (movie) {
      window.scrollTo(0, 0);
      setIsLoading(true);

      // Fetch details and recommendations in parallel
      Promise.all([
        getMovieDetails(movie),
        getRecommendations(movie),
        getMovieCredits(movie)
      ]).then(async ([details, recData, credsData]) => {
        if (!details || (recData && recData.error)) {
          setNotFound(true);
          return;
        }

        setNotFound(false);
        setSearchedMovie(details);
        setCredits(credsData);

        if (recData && recData.recommendations) {
          const moviesWithPosters = await Promise.all(
            recData.recommendations.map(async (m) => {
              const poster = await getMoviePoster(m.title);
              return { ...m, poster };
            })
          );
          setRecommendations(moviesWithPosters);
        }
      }).catch(() => {
        setNotFound(true);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [movie]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f18] flex flex-col items-center justify-center text-slate-400">
        <Loader2 size={48} className="animate-spin text-rose-500 mb-4" />
        <p className="text-xl font-medium">Curating your recommendations...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0a0f18] flex flex-col items-center justify-center text-slate-400 px-6 text-center">
        <Film size={64} className="text-slate-700 mb-6" />
        <h2 className="text-3xl font-bold text-slate-200 mb-4">Movie Not Found</h2>
        <p className="text-lg max-w-md mb-8">
          We couldn't find any details or recommendations for "<span className="text-rose-400">{movie}</span>". It may not exist in our database yet.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-medium transition-colors shadow-lg shadow-rose-600/20 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Search
        </button>
      </div>
    );
  }

  const parsedGenres = parseGenres(credits.genres);

  return (
    <div className="min-h-screen bg-[#0a0f18] text-slate-100 pb-20">

      {/* Dynamic Header Section for Searched Movie */}
      {searchedMovie && (
        <div className="relative w-full overflow-hidden border-b border-white/5 shadow-2xl">
          {/* Blurred Background Banner */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-[60px] opacity-30 scale-110"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${searchedMovie.backdrop_path || searchedMovie.poster_path})` }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0f18] via-[#0a0f18]/80 to-transparent" />
          <div className="absolute inset-0 z-0 bg-[#0a0f18]/40" />

          <div className="relative min-h-[50vh] flex flex-col items-center justify-center pt-24 pb-16 px-6 md:px-12 overflow-hidden">
            {/* Subtle Dynamic Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-rose-500/10 blur-[120px] pointer-events-none" />

            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="absolute top-6 left-6 md:top-8 md:left-12 z-50 p-3 rounded-full bg-black/40 hover:bg-rose-600 border border-white/10 hover:border-rose-500 transition-all text-slate-300 hover:text-white backdrop-blur-md group shadow-xl"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Foreground Content */}
            <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center gap-8 md:gap-12 backdrop-blur-md bg-black/40 p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl animate-fade-in-up">
              <div className="shrink-0">
                <div className="relative w-48 md:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 group">
                  <img
                    src={searchedMovie.poster_path ? `https://image.tmdb.org/t/p/w500${searchedMovie.poster_path}` : 'https://via.placeholder.com/500x750/1e293b/94a3b8?text=No+Poster'}
                    alt={searchedMovie.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-2xl pointer-events-none"></div>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-lg">
                  {searchedMovie.title}
                </h1>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-slate-300 font-medium shadow-sm">
                    <Calendar size={16} className="text-slate-400" />
                    <span>{searchedMovie.release_date?.split('-')[0] || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-slate-300 font-medium shadow-sm">
                    <Star size={16} className="text-yellow-500 fill-current drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                    <span className="text-white font-bold">{Number(searchedMovie.vote_average || 0).toFixed(1)}</span>
                  </div>
                  {searchedMovie.runtime && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-slate-300 font-medium shadow-sm">
                      <Film size={16} className="text-slate-400" />
                      <span>{Math.floor(searchedMovie.runtime / 60)}h {searchedMovie.runtime % 60}m</span>
                    </div>
                  )}
                </div>

                {/* Display Genres with beautiful pills */}
                {parsedGenres.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                    {parsedGenres.map((genre) => (
                      <Link
                        key={genre}
                        to={`/genres/${encodeURIComponent(genre)}`}
                        className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/40 transition-all duration-300 cursor-pointer shadow-sm"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t border-white/10 text-left w-full">
                  <h3 className="text-lg font-semibold text-white">Overview</h3>
                  <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light mx-auto md:mx-0">
                    {searchedMovie.overview || "No overview available for this title."}
                  </p>
                </div>

                {/* Credits Section */}
                <div className="pt-4 flex flex-col sm:flex-row gap-6 text-left">
                  {/* Director */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Clapperboard size={14} className="text-rose-400" /> Director
                    </h4>
                    <span className="font-medium text-slate-200">{credits.director}</span>
                  </div>

                  {/* Top Cast */}
                  {credits.cast && credits.cast.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <User size={14} className="text-rose-400" /> Top Cast
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {credits.cast.slice(0, 3).map((actor, i) => (
                          <span key={i} className="text-slate-300">
                            {actor}{i < Math.min(credits.cast.length, 3) - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:px-8 relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <PlayCircle className="text-rose-500" size={28} />
          <h2 className="text-2xl md:text-3xl font-bold">
            Because you searched <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-orange-400">{movie}</span>
          </h2>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
            {recommendations.map((m, idx) => (
              <div key={`${m.title}-${idx}`} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}>
                <MovieCard movie={m} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-black/20 rounded-3xl border border-white/5 backdrop-blur-sm">
            <Popcorn size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400 text-lg">No recommendations found for this title.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;