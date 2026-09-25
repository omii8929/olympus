import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Terminal, Compass, Calendar, Clock, QrCode } from 'lucide-react';
import { Countdown } from './Countdown';
import { EVENT_CONFIG } from '../../config/eventConfig';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-olympus-bg">
      {/* Background Engineering HUD & Circuit Grid */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-60" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* Futuristic SVG Circuit Lines & Drone Silhouette Visual Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0066FF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00F0FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Left Circuit Tracks */}
        <path
          d="M -50 200 L 180 200 L 260 280 L 400 280 L 440 320"
          fill="none"
          stroke="url(#circuitGrad)"
          strokeWidth="1.5"
          strokeDasharray="6,6"
        />
        <circle cx="260" cy="280" r="4" fill="#00F0FF" />
        <circle cx="440" cy="320" r="3" fill="#0066FF" />

        {/* Right Circuit Tracks */}
        <path
          d="M 1200 150 L 980 150 L 900 230 L 750 230 L 710 270"
          fill="none"
          stroke="url(#circuitGrad)"
          strokeWidth="1.5"
          strokeDasharray="6,6"
        />
        <circle cx="900" cy="230" r="4" fill="#00F0FF" />
        <circle cx="710" cy="270" r="3" fill="#0066FF" />

        {/* Central Ambient HUD Ring */}
        <circle
          cx="50%"
          cy="45%"
          r="280"
          fill="none"
          stroke="#00F0FF"
          strokeWidth="1"
          strokeDasharray="4,12"
          className="animate-spin-slow opacity-30"
          style={{ transformOrigin: 'center' }}
        />

        {/* Technical Drone / UAV Silhouette Schematics in Background */}
        <g transform="translate(480, 240) scale(0.6)" opacity="0.15" stroke="#00F0FF" fill="none" strokeWidth="1.5">
          <circle cx="0" cy="0" r="45" />
          {/* Rotors */}
          <line x1="-140" y1="-140" x2="140" y2="140" />
          <line x1="140" y1="-140" x2="-140" y2="140" />
          <circle cx="-140" cy="-140" r="30" />
          <circle cx="140" cy="-140" r="30" />
          <circle cx="-140" cy="140" r="30" />
          <circle cx="140" cy="140" r="30" />
        </g>
      </svg>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Department Badge with ACES Logo */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-olympus-card/90 border border-olympus-cyan/50 text-xs font-mono tracking-wider text-olympus-cyan mb-6 shadow-cyan-glow backdrop-blur-md">
          <img
            src="/aces-logo.png"
            alt="ACES Logo"
            className="w-5 h-5 object-contain rounded-full border border-olympus-cyan/50"
          />
          <span className="font-bold text-white tracking-widest">ACES</span>
          <span className="text-slate-500">•</span>
          <span>{EVENT_CONFIG.department} PRESENTS</span>
        </div>

        {/* Large Heading: OLYMPUS 2026 */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-white font-tech uppercase drop-shadow-2xl">
          {EVENT_CONFIG.name}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-olympus-cyan via-olympus-blue-light to-white">
            {EVENT_CONFIG.year}
          </span>
        </h1>

        {/* Main Headline: BUILD. CREATE. CONQUER. */}
        <div className="mt-3 flex items-center justify-center gap-3">
          <span className="h-px w-6 sm:w-12 bg-olympus-cyan/50" />
          <p className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wider font-tech text-olympus-cyan uppercase">
            {EVENT_CONFIG.tagline}
          </p>
          <span className="h-px w-6 sm:w-12 bg-olympus-cyan/50" />
        </div>

        {/* Supporting text */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
          {EVENT_CONFIG.heroSubtext}
        </p>

        {/* Official Event Date & Time Pill */}
        <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-5 py-2.5 rounded-xl bg-olympus-card/90 border border-olympus-cyan/50 shadow-cyan-glow text-xs sm:text-sm font-mono backdrop-blur-md">
          <div className="flex items-center gap-2 text-white">
            <Calendar className="w-4 h-4 text-olympus-cyan" />
            <span className="text-slate-400 font-medium">EVENT DATE:</span>
            <span className="font-bold text-olympus-cyan uppercase tracking-wider">{EVENT_CONFIG.eventDate}</span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-4 h-4 text-olympus-cyan" />
            <span className="text-slate-400 font-medium">TIME:</span>
            <span className="font-bold text-white uppercase tracking-wider">{EVENT_CONFIG.eventTime}</span>
          </div>
        </div>

        {/* Real Countdown Timer Card */}
        <div className="mt-6 mb-10">
          <Countdown />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            to="/register"
            className="w-full sm:w-auto cyber-button px-8 py-3.5 bg-gradient-to-r from-olympus-blue to-olympus-blue-light hover:from-olympus-blue-light hover:to-olympus-cyan text-white font-tech text-base font-bold uppercase tracking-wider transition-all duration-300 shadow-blue-glow flex items-center justify-center gap-2 group"
          >
            <span>Register Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>

          <Link
            to="/events"
            className="w-full sm:w-auto cyber-button px-8 py-3.5 bg-olympus-card hover:bg-olympus-cardHover border border-olympus-cyan/40 hover:border-olympus-cyan text-slate-200 hover:text-white font-tech text-base font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-olympus-cyan" />
            <span>Explore Events</span>
          </Link>

          <Link
            to="/qr"
            className="w-full sm:w-auto cyber-button px-6 py-3.5 bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white font-tech text-base font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>Event QR Portal</span>
          </Link>
        </div>

        {/* Quick HUD Labels */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-olympus-cyan" />
            SYS.STATUS: REGISTRATION_ONLINE
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-olympus-cyan font-semibold">DATE: 02 OCTOBER 2026 • 09:00 AM IST</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-slate-300 font-semibold">VENUE: IDEA LAB, SVERI'S COLLEGE OF ENGINEERING</span>
        </div>
      </div>
    </section>
  );
};
