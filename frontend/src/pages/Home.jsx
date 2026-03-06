import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, ArrowRight, Film, Popcorn } from 'lucide-react';
import { getMovieDetails, searchMovies } from '../api/movieApi';

function Home() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (val) => {
    setQuery(val);
    setHasSearched(true);
    if (val.length > 2) {
      try {
        const data = await searchMovies(val);
        setSuggestions(data.results || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleNavigate = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      await getMovieDetails(searchQuery);
      navigate('/results', { state: { movie: searchQuery } });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-3xl space-y-10 text-center relative z-10 flex flex-col items-center">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Discover Your Next <br />
            <span className="bg-gradient-to-r from-rose-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Favorite Movie</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Enter any movie you love, and we'll curate a personalized list of recommendations just for you.
          </p>
        </div>

        {/* Search Section */}
        <div className="w-full relative max-w-2xl mx-auto group" ref={dropdownRef}>
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-fuchsia-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500" />
          <div
            className={`relative flex items-center w-full px-4 py-2 rounded-full bg-[#0a0f18]/80 border backdrop-blur-xl transition-all duration-300 shadow-2xl ${isFocused ? "border-rose-500/50 ring-2 ring-rose-500/20" : "border-white/10 hover:border-white/20"
              }`}
          >
            <div className="pl-2 pr-2">
              <Search className={`transition-colors duration-300 w-6 h-6 ${isFocused ? 'text-rose-400' : 'text-slate-400 group-hover:text-rose-400'}`} />
            </div>
            <input
              type="text"
              placeholder="Enter a movie name..."
              value={query}
              onFocus={() => setIsFocused(true)}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNavigate(query)
              }}
              className="w-full bg-transparent text-white text-lg outline-none placeholder-slate-500 font-medium px-2 py-3"
              disabled={isLoading}
            />
            <button
              onClick={() => handleNavigate(query)}
              disabled={isLoading || !query.trim()}
              className="ml-2 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-400 hover:to-fuchsia-500 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                "Search"
              )}
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {isFocused && query.length > 2 && (
            <div className="absolute w-full mt-4 bg-[#0a0f18]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="py-2 max-h-72 overflow-y-auto no-scrollbar">
                {suggestions.length > 0 ? (
                  suggestions.map((title) => (
                    <div
                      key={title}
                      onClick={() => {
                        setQuery(title);
                        setSuggestions([]);
                        setIsFocused(false);
                        handleNavigate(title);
                      }}
                      className="flex items-center px-6 py-4 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0 group"
                    >
                      <Film className="w-5 h-5 mr-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
                      <span className="text-slate-200 group-hover:text-white font-medium">{title}</span>
                    </div>
                  ))
                ) : hasSearched ? (
                  <div className="px-6 py-8 text-slate-400 text-center flex flex-col items-center">
                    <Popcorn className="w-8 h-8 text-slate-500 mb-3 opacity-50" />
                    <span className="font-medium text-slate-300">No movies found for "{query}"</span>
                    <span className="text-sm mt-1 text-slate-500">Try a different search term</span>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
