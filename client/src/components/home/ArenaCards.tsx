import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, ArrowDown, ArrowRight, Video, Palette, Users, Layers } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { HUDFrame } from '../common/HUDFrame';
import { EVENT_CONFIG } from '../../config/eventConfig';

export const ArenaCards: React.FC = () => {
  return (
    <section className="py-20 bg-olympus-bg/80 relative" id="arenas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="COMPETITIVE DOMAINS"
          title="CHOOSE YOUR"
          highlight="ARENA"
          subtitle="Select your track to prove your engineering, algorithmic, and creative expertise."
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* ============================================================== */}
          {/* ARENA 01: FULL STACK DEVELOPMENT WITH AI */}
          {/* ============================================================== */}
          <HUDFrame
            tag="ARENA 01"
            className="flex flex-col justify-between hover:border-olympus-cyan transition-all duration-300 group"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="px-2.5 py-1 rounded bg-olympus-blue/20 border border-olympus-blue/40 text-xs font-mono text-olympus-cyan">
                  {EVENT_CONFIG.arena01.badge}
                </span>
                <span className="text-xs font-mono text-slate-400">TRACK 01</span>
              </div>

              <h3 className="font-tech text-3xl font-extrabold text-white group-hover:text-olympus-cyan transition-colors mb-3">
                {EVENT_CONFIG.arena01.title}
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {EVENT_CONFIG.arena01.tagline}
              </p>

              {/* Visual Journey: FRONTEND -> BACKEND/API -> DEPLOYMENT */}
              <div className="my-6 p-4 rounded-xl bg-olympus-bg/90 border border-olympus-border">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block mb-3">
                  COMPETITIVE ROUND STAGES
                </span>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between p-2.5 rounded bg-olympus-card border border-olympus-border/70">
                    <span className="text-xs font-mono text-olympus-cyan font-bold">ROUND 01</span>
                    <span className="text-xs font-semibold text-white">FRONTEND ARCHITECTURE</span>
                  </div>
                  <div className="flex justify-center text-olympus-cyan">
                    <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded bg-olympus-card border border-olympus-border/70">
                    <span className="text-xs font-mono text-olympus-cyan font-bold">ROUND 02</span>
                    <span className="text-xs font-semibold text-white">BACKEND / API & AI</span>
                  </div>
                  <div className="flex justify-center text-olympus-cyan">
                    <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded bg-olympus-card border border-olympus-border/70">
                    <span className="text-xs font-mono text-olympus-cyan font-bold">ROUND 03</span>
                    <span className="text-xs font-semibold text-white">DEPLOYMENT & PRESENTATION</span>
                  </div>
                </div>
              </div>

              {/* Parameters list */}
              <div className="grid grid-cols-3 gap-2 py-4 border-t border-olympus-border/60 text-center font-mono">
                <div className="p-2 rounded bg-olympus-card">
                  <span className="block text-[10px] text-slate-400">ELIGIBILITY</span>
                  <span className="text-xs font-bold text-white">All Branches</span>
                </div>
                <div className="p-2 rounded bg-olympus-card">
                  <span className="block text-[10px] text-slate-400">TEAM SIZE</span>
                  <span className="text-xs font-bold text-white">2–4 Members</span>
                </div>
                <div className="p-2 rounded bg-olympus-card">
                  <span className="block text-[10px] text-slate-400">REGISTRATION</span>
                  <span className="text-xs font-bold text-olympus-cyan">₹100 / Person</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <Link
                to="/events/full-stack-ai"
                className="w-full cyber-button py-3 bg-olympus-blue hover:bg-olympus-blue-light text-white text-sm font-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-blue-glow group-hover:shadow-cyan-glow"
              >
                <span>ENTER ARENA</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </HUDFrame>

          {/* ============================================================== */}
          {/* ARENA 02: ENGINEER'S GOT TALENT (DRONE TECHNOLOGY) */}
          {/* ============================================================== */}
          <HUDFrame
            tag="ARENA 02"
            className="flex flex-col justify-between hover:border-olympus-cyan transition-all duration-300 group"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="px-2.5 py-1 rounded bg-olympus-cyan/10 border border-olympus-cyan/40 text-xs font-mono text-olympus-cyan">
                  THEME: {EVENT_CONFIG.arena02.theme}
                </span>
                <span className="text-xs font-mono text-slate-400">TRACK 02</span>
              </div>

              <h3 className="font-tech text-3xl font-extrabold text-white group-hover:text-olympus-cyan transition-colors mb-3">
                {EVENT_CONFIG.arena02.title}
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {EVENT_CONFIG.arena02.tagline}
              </p>

              {/* Two Category Cards */}
              <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-olympus-bg/90 border border-olympus-border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🎬</span>
                      <span className="font-tech font-bold text-sm text-white">VIDEO MAKING</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      "Create a creative or informative video based on Drone Technology."
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-olympus-cyan mt-3 block">
                    ORIGINAL CINEMATOGRAPHY
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-olympus-bg/90 border border-olympus-border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🎨</span>
                      <span className="font-tech font-bold text-sm text-white">POSTER MAKING</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      "Create an innovative poster based on Drone Technology."
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-olympus-cyan mt-3 block">
                    TECHNICAL INFOGRAPHICS
                  </span>
                </div>
              </div>

              {/* Parameters list */}
              <div className="grid grid-cols-3 gap-2 py-4 border-t border-olympus-border/60 text-center font-mono">
                <div className="p-2 rounded bg-olympus-card">
                  <span className="block text-[10px] text-slate-400">ELIGIBILITY</span>
                  <span className="text-xs font-bold text-white">All Branches</span>
                </div>
                <div className="p-2 rounded bg-olympus-card">
                  <span className="block text-[10px] text-slate-400">TEAM SIZE</span>
                  <span className="text-xs font-bold text-white">2–4 Members</span>
                </div>
                <div className="p-2 rounded bg-olympus-card">
                  <span className="block text-[10px] text-slate-400">REGISTRATION</span>
                  <span className="text-xs font-bold text-olympus-cyan">₹100 / Person</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <Link
                to="/events/engineers-got-talent"
                className="w-full cyber-button py-3 bg-gradient-to-r from-olympus-card to-olympus-cardHover hover:border-olympus-cyan border border-olympus-cyan/50 text-white text-sm font-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all group-hover:shadow-cyan-glow"
              >
                <span>EXPLORE DRONE ARENA</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-olympus-cyan" />
              </Link>
            </div>
          </HUDFrame>
        </div>
      </div>
    </section>
  );
};
