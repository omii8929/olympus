import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShieldAlert } from 'lucide-react';
import { EVENT_CONFIG } from '../../config/eventConfig';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-olympus-bg via-olympus-card to-olympus-bg border-t border-b border-olympus-border">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-olympus-blue/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-mono tracking-widest text-olympus-cyan uppercase block mb-3">
          // FINAL CALL TO ARENA
        </span>

        <h2 className="text-4xl sm:text-6xl font-extrabold text-white font-tech uppercase tracking-tight">
          READY TO ENTER{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-olympus-cyan via-olympus-blue-light to-white">
            {EVENT_CONFIG.name}?
          </span>
        </h2>

        <p className="mt-4 text-lg sm:text-xl text-slate-300 font-light max-w-xl mx-auto">
          "Build your idea. Showcase your skills. Step into the arena."
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto cyber-button px-8 py-3.5 bg-gradient-to-r from-olympus-blue to-olympus-blue-light hover:from-olympus-blue-light hover:to-olympus-cyan text-white font-tech text-base font-bold uppercase tracking-wider transition-all duration-300 shadow-blue-glow flex items-center justify-center gap-2 group"
          >
            <span>REGISTER NOW</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>

          <Link
            to="/events"
            className="w-full sm:w-auto cyber-button px-8 py-3.5 bg-olympus-card hover:bg-olympus-cardHover border border-olympus-border hover:border-olympus-cyan text-slate-200 hover:text-white font-tech text-base font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-olympus-cyan" />
            <span>EXPLORE EVENTS</span>
          </Link>
        </div>

        <div className="mt-8 text-xs font-mono text-slate-400">
          Registration Fee: ₹100 / Participant • Teams of 2–4 Members • All Branches Eligible
        </div>
      </div>
    </section>
  );
};
