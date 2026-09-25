import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Video, Palette, CheckCircle2, AlertTriangle, Users, CreditCard, Layers, ChevronRight, Plane } from 'lucide-react';
import { HUDFrame } from '../components/common/HUDFrame';
import { SectionHeader } from '../components/common/SectionHeader';
import { EVENT_CONFIG } from '../config/eventConfig';

export const EngineersGotTalentPage: React.FC = () => {
  const arena = EVENT_CONFIG.arena02;

  return (
    <div className="pt-28 pb-20 bg-olympus-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-8">
          <Link to="/" className="hover:text-olympus-cyan">HOME</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/events" className="hover:text-olympus-cyan">ARENAS</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-olympus-cyan">ARENA 02</span>
        </div>

        {/* Hero Header */}
        <div className="relative p-8 sm:p-12 rounded-2xl bg-olympus-card border border-olympus-border overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-olympus-cyan/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded bg-olympus-cyan/15 border border-olympus-cyan/40 text-xs font-mono text-olympus-cyan uppercase tracking-wider">
                {arena.badge} • ARENA {arena.number}
              </span>
              <span className="px-3 py-1 rounded bg-olympus-blue/20 border border-olympus-blue/40 text-xs font-mono text-white uppercase tracking-wider flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-olympus-cyan" />
                THEME: {arena.theme}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-tech text-white uppercase mb-4 tracking-tight">
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

            <div className="flex flex-wrap gap-4">
              <Link
                to="/register?event=DRONE_VIDEO"
                className="cyber-button inline-flex items-center gap-2 px-6 py-3 bg-olympus-blue hover:bg-olympus-blue-light text-white font-tech text-sm font-bold uppercase tracking-wider transition-all shadow-blue-glow"
              >
                <span>REGISTER FOR VIDEO MAKING</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/register?event=DRONE_POSTER"
                className="cyber-button inline-flex items-center gap-2 px-6 py-3 bg-olympus-card hover:bg-olympus-cardHover border border-olympus-cyan/50 hover:border-olympus-cyan text-slate-200 hover:text-white font-tech text-sm font-bold uppercase tracking-wider transition-all"
              >
                <span>REGISTER FOR POSTER MAKING</span>
                <ArrowRight className="w-4 h-4 text-olympus-cyan" />
              </Link>
            </div>
          </div>
        </div>

        {/* Section 1: Categories */}
        <div className="mb-16">
          <SectionHeader
            badge="OFFICIAL CATEGORIES"
            title="DRONE TECHNOLOGY"
            highlight="TRACKS"
            subtitle="Two distinctive creative expressions centered exclusively on Drone Technology."
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {arena.categories.map((category) => (
              <HUDFrame key={category.id} tag={category.id.toUpperCase()} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{category.icon}</span>
                    <h3 className="font-tech text-2xl font-bold text-white">
                      {category.name}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {category.desc}
                  </p>

                  <div className="pt-4 border-t border-olympus-border/60">
                    <span className="text-[10px] font-mono text-olympus-cyan block mb-2 uppercase">
                      JUDGING FOCUS & CRITERIA:
                    </span>
                    <ul className="space-y-1.5">
                      {category.focus.map((f) => (
                        <li key={f} className="text-xs text-slate-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-olympus-cyan" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    to={`/register?event=${category.typeCode}`}
                    className="w-full cyber-button py-2.5 bg-olympus-card hover:bg-olympus-cardHover border border-olympus-border hover:border-olympus-cyan text-white text-xs font-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  >
                    <span>ENROLL IN {category.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-olympus-cyan" />
                  </Link>
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
              Arena Rules & Originality
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

          <HUDFrame tag="EVALUATION" className="p-6 border-olympus-cyan/30">
            <h3 className="font-tech text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-olympus-cyan" />
              Jury Defense Guidelines
            </h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                • Participants must stand before the judging panel and clearly defend the engineering concept behind their media or poster.
              </p>
              <p>
                • Video entries: File formats accepted (MP4 / WebM / Cloud Video Drive link).
              </p>
              <p>
                • Poster entries: Digital high-resolution PDF/PNG alongside printed physical showcase on exhibition day.
              </p>
              <p>
                • Unexplained or generated work without foundational drone comprehension will receive zero jury points.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-olympus-border">
              <Link
                to="/register"
                className="w-full cyber-button py-2.5 bg-olympus-blue hover:bg-olympus-blue-light text-white text-xs font-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>CHOOSE YOUR CATEGORY (₹100/PERSON)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </HUDFrame>
        </div>
      </div>
    </div>
  );
};
