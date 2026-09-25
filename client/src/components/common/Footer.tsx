import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, MapPin, Cpu, ArrowUpRight } from 'lucide-react';
import { EVENT_CONFIG } from '../../config/eventConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-olympus-bg border-t border-olympus-border relative overflow-hidden text-slate-400">
      {/* Subtle top cyan line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-olympus-cyan/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 flex items-center justify-center bg-black/60 border border-olympus-cyan/50 rounded-xl p-1 shadow-cyan-glow overflow-hidden shrink-0">
                <img
                  src="/aces-logo.png"
                  alt="ACES Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-tech text-2xl font-extrabold text-white tracking-wider block">
                  {EVENT_CONFIG.name}
                </span>
                <span className="block text-[11px] font-mono tracking-widest text-olympus-cyan font-bold">
                  ACES // ASSOCIATION OF ELECTRONICS AND COMPUTER STUDENTS
                </span>
                <span className="block text-[9px] font-mono text-slate-400">
                  CONNECT • CREATE • INNOVATE
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              {EVENT_CONFIG.heroSubtext}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="px-2.5 py-1 rounded bg-olympus-blue/10 border border-olympus-blue/30 text-xs font-mono text-olympus-cyan">
                {EVENT_CONFIG.tagline}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {EVENT_CONFIG.supportingText}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-white text-xs font-mono uppercase tracking-wider font-semibold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-olympus-cyan rounded-full" />
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-olympus-cyan transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-olympus-cyan transition-colors">
                  Event Arenas
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-olympus-cyan transition-colors">
                  Timeline & Schedule
                </Link>
              </li>
              <li>
                <Link to="/rules" className="hover:text-olympus-cyan transition-colors">
                  Official Rule Book
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-olympus-cyan transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-olympus-cyan transition-colors">
                  Hall of Winners
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-olympus-cyan transition-colors">
                  Contact Desk
                </Link>
              </li>
              <li>
                <Link to="/qr" className="hover:text-olympus-cyan transition-colors flex items-center gap-1.5 text-cyan-300">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full" />
                  Website QR Code & Poster
                </Link>
              </li>
              <li>
                <Link to="/scanner" className="hover:text-olympus-cyan transition-colors flex items-center gap-1.5 text-cyan-300">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full" />
                  Camera QR Scanner
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Department & Contact */}
          <div>
            <h4 className="text-white text-xs font-mono uppercase tracking-wider font-semibold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-olympus-cyan rounded-full" />
              Organizer Desk
            </h4>
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-olympus-cyan shrink-0 mt-0.5" />
                <span>Idea Lab, SVERI's College of Engineering</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-olympus-cyan shrink-0" />
                <span>Department of Electronics and Computer Engineering</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-olympus-cyan shrink-0" />
                <span>ece.olympus2026@sveri.ac.in</span>
              </div>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">
                  OFFICIAL COMMUNITY CHANNELS
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded bg-olympus-card border border-olympus-border text-[11px] font-mono text-slate-300">
                    Instagram
                  </span>
                  <span className="px-2 py-1 rounded bg-olympus-card border border-olympus-border text-[11px] font-mono text-slate-300">
                    LinkedIn
                  </span>
                  <span className="px-2 py-1 rounded bg-olympus-card border border-olympus-border text-[11px] font-mono text-slate-300">
                    WhatsApp Group
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-olympus-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <p className="text-slate-400">
            © {EVENT_CONFIG.year} {EVENT_CONFIG.name} — {EVENT_CONFIG.department}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/rules" className="hover:text-olympus-cyan transition-colors">
              Terms & Rules
            </Link>
            <span>•</span>
            <Link to="/dashboard" className="hover:text-olympus-cyan transition-colors">
              Participant Pass Lookup
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
