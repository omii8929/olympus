import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ArrowRight, QrCode } from 'lucide-react';
import { EVENT_CONFIG } from '../../config/eventConfig';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Rules', path: '/rules' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Results', path: '/results' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
    { name: 'QR Portal', path: '/qr' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-olympus-bg/95 backdrop-blur-md border-b border-olympus-border shadow-lg shadow-black/50 py-3'
          : 'bg-transparent py-5 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Wordmark */}
        <Link to="/" className="flex items-center gap-3 group">
          {/* Official ACES Emblem */}
          <div className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-black/60 p-0.5 border border-olympus-cyan/50 shadow-cyan-glow group-hover:border-olympus-cyan transition-all overflow-hidden shrink-0">
            <img
              src="/aces-logo.png"
              alt="ACES - Association of Electronics and Computer Students"
              className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-tech text-2xl sm:text-3xl font-extrabold tracking-wider text-white leading-none group-hover:text-olympus-cyan transition-colors">
              {EVENT_CONFIG.name}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-mono font-bold tracking-widest text-olympus-cyan uppercase">
                ACES
              </span>
              <span className="text-[8px] text-slate-500">•</span>
              <span className="text-[9px] font-mono tracking-wider text-slate-300 uppercase">
                {EVENT_CONFIG.department}
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 relative ${
                isActive(link.path)
                  ? 'text-olympus-cyan bg-olympus-cyan/10 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-olympus-cyan rounded-full shadow-cyan-glow" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right CTA / Participant Controls */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/qr"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 text-xs font-mono text-cyan-300 hover:text-white transition-all shadow-sm"
            title="Scan & Share Website QR (Non-expiring)"
          >
            <QrCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>QR CODE</span>
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-olympus-card/80 border border-olympus-border hover:border-olympus-cyan/60 text-xs font-mono text-slate-300 hover:text-white transition-all"
          >
            <User className="w-3.5 h-3.5 text-olympus-cyan" />
            <span>MY PASS</span>
          </Link>

          <Link
            to="/register"
            className="relative group cyber-button px-5 py-2.5 bg-olympus-blue hover:bg-olympus-blue-light text-white text-xs sm:text-sm font-tech font-bold uppercase tracking-wider transition-all duration-200 shadow-blue-glow flex items-center gap-2"
          >
            <span>Register Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/register"
            className="cyber-button px-3 py-1.5 bg-olympus-blue text-white text-xs font-tech font-bold uppercase"
          >
            REGISTER
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-md focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-olympus-bg/98 border-b border-olympus-border px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.path)
                  ? 'text-olympus-cyan bg-olympus-cyan/10 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-olympus-border flex flex-col gap-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white text-sm"
            >
              <User className="w-4 h-4 text-olympus-cyan" />
              Participant Pass & Status Lookup
            </Link>
            <Link
              to="/register"
              className="cyber-button px-4 py-2.5 bg-olympus-blue text-white text-xs font-tech font-bold uppercase text-center mt-2"
            >
              Register Team Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
