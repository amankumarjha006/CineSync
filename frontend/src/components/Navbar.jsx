import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, Home, Film } from 'lucide-react';
import { useState } from 'react';
function Navbar() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[#0a0f18]/90 border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center mt-2">
                        <Link to="/" className="flex items-center group">
                            <div className="relative flex items-center h-32 w-auto overflow-visible -mt-6">
                                {/* Optional subtle glow behind the logo */}
                                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-orange-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-500"></div>

                                <img
                                    src="/cineSync logo.png"
                                    alt="CineSync Logo"
                                    className="h-full w-auto object-contain relative z-10 transform scale-[1.5] group-hover:scale-[1.6] transition-transform duration-300 drop-shadow-xl"
                                    style={{ maxHeight: '140px', minWidth: '240px' }}
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className={`text-sm font-medium transition-colors flex items-center gap-2 group ${location.pathname === '/' ? 'text-white' : 'text-slate-300 hover:text-white'}`}>
                            <span className="relative flex items-center gap-2">
                                <Home size={16} className={`${location.pathname === '/' ? 'text-rose-400' : 'text-slate-400 group-hover:text-rose-400'} transition-colors duration-300`} />
                                Home
                                <span className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-300 ${location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                            </span>
                        </Link>
                        <Link to="/genres" className={`text-sm font-medium transition-colors flex items-center gap-2 group ${location.pathname.startsWith('/genres') ? 'text-white' : 'text-slate-300 hover:text-white'}`}>
                            <span className="relative flex items-center gap-2">
                                <Film size={16} className={`${location.pathname.startsWith('/genres') ? 'text-rose-400' : 'text-slate-400 group-hover:text-rose-400'} transition-colors duration-300`} />
                                Genres
                                <span className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-300 ${location.pathname.startsWith('/genres') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                            </span>
                        </Link>
                        <div className="relative group cursor-pointer ml-4">
                            <div className="absolute -inset-2 rounded-full border border-rose-500/0 group-hover:border-rose-500/30 scale-90 group-hover:scale-100 transition-all duration-300"></div>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-[#0a0f18]/95 backdrop-blur-3xl border-b border-white/5 shadow-2xl">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${location.pathname === '/' ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                        >
                            <Home size={18} className={location.pathname === '/' ? 'text-rose-400' : 'text-slate-400'} />
                            Home
                        </Link>
                        <Link
                            to="/genres"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${location.pathname.startsWith('/genres') ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                        >
                            <Film size={18} className={location.pathname.startsWith('/genres') ? 'text-rose-400' : 'text-slate-400'} />
                            Genres
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
