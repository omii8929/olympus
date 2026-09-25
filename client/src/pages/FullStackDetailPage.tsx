import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, CheckCircle2, AlertTriangle, Layers, Users, CreditCard, ChevronRight } from 'lucide-react';
import { HUDFrame } from '../components/common/HUDFrame';
import { SectionHeader } from '../components/common/SectionHeader';
import { EVENT_CONFIG } from '../config/eventConfig';

export const FullStackDetailPage: React.FC = () => {
  const arena = EVENT_CONFIG.arena01;

  return (
    <div className="pt-28 pb-20 bg-olympus-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-8">
          <Link to="/" className="hover:text-olympus-cyan">HOME</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/events" className="hover:text-olympus-cyan">ARENAS</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-olympus-cyan">ARENA 01</span>
        </div>

        {/* Hero Header */}
        <div className="relative p-8 sm:p-12 rounded-2xl bg-olympus-card border border-olympus-border overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-olympus-blue/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="px-3 py-1 rounded bg-olympus-blue/20 border border-olympus-blue/40 text-xs font-mono text-olympus-cyan uppercase tracking-wider">
              {arena.badge} • ARENA {arena.number}
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-tech text-white uppercase mt-4 mb-4 tracking-tight">
              {arena.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed mb-6">
              {arena.tagline}
            </p>

            {/* Quick badges */}
            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-300 mb-8">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-olympus-bg border border-olympus-border">
                <Users className="w-4 h-4 text-olympus-cyan" />
                Team: {arena.teamSize}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-olympus-bg border border-olympus-border">
                <CreditCard className="w-4 h-4 text-olympus-cyan" />
                Fee: {arena.fee}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-olympus-bg border border-olympus-border">
                <Layers className="w-4 h-4 text-olympus-cyan" />
                Eligibility: {arena.eligibility}
              </span>
            </div>

            <Link
              to="/register?event=FULL_STACK_AI"
              className="cyber-button inline-flex items-center gap-2 px-8 py-3.5 bg-olympus-blue hover:bg-olympus-blue-light text-white font-tech text-base font-bold uppercase tracking-wider transition-all shadow-blue-glow"
            >
              <span>REGISTER FOR FULL STACK ARENA</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Section 1: Official Rounds */}
        <div className="mb-16">
          <SectionHeader
            badge="ARENA STRUCTURE"
            title="OFFICIAL"
            highlight="ROUNDS"
            subtitle="The three progressive stages of the Full Stack Development with AI challenge."
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {arena.rounds.map((round) => (
              <HUDFrame key={round.number} tag={round.number} className="flex flex-col justify-between">
                <div>
                  <h3 className="font-tech text-2xl font-bold text-white mb-2">
                    {round.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {round.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-olympus-border/60">
                  <span className="text-[10px] font-mono text-olympus-cyan block mb-2 uppercase">
                    EVALUATION PILLARS:
                  </span>
                  <ul className="space-y-1.5">
                    {round.focus.map((f) => (
                      <li key={f} className="text-xs text-slate-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-olympus-cyan" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </HUDFrame>
            ))}
          </div>
        </div>

        {/* Section 2: Official Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <HUDFrame tag="RULEBOOK" className="p-6">
            <h3 className="font-tech text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-olympus-cyan" />
              Arena Rules & Compliance
            </h3>
            <ul className="space-y-4 text-sm text-slate-300">
              {arena.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="font-mono text-olympus-cyan text-xs font-bold mt-1">
                    0{idx + 1}.
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </HUDFrame>

          <HUDFrame tag="IMPORTANT" className="p-6 border-amber-500/30">
            <h3 className="font-tech text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Technical Instructions
            </h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                • Teams must bring their own development laptops and power accessories to the venue.
              </p>
              <p>
                • Cloud deployment links (Vercel, Render, AWS, Firebase, etc.) must be accessible to the evaluation panel.
              </p>
              <p>
                • While AI generation tools are allowed, participants will be cross-questioned on code architecture, schema designs, and data flow.
              </p>
              <p>
                • Reporting venue: Idea Lab, SVERI's College of Engineering.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-olympus-border">
              <Link
                to="/register?event=FULL_STACK_AI"
                className="w-full cyber-button py-2.5 bg-olympus-blue hover:bg-olympus-blue-light text-white text-xs font-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>ENTER THIS ARENA (₹100/PERSON)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </HUDFrame>
        </div>
      </div>
    </div>
  );
};
