import React from 'react';
import { Cpu, Code2, Video, Target, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { HUDFrame } from '../common/HUDFrame';

export const AboutSection: React.FC = () => {
  return (
    <section className="py-20 relative bg-olympus-bg overflow-hidden" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="ABOUT THE SYMPOSIUM"
          title="WHAT IS"
          highlight="OLYMPUS?"
          subtitle="A national-standard engineering arena bridging full-stack artificial intelligence with aerospace drone media."
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-12">
          {/* Left Column: Text & Core Pillars */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-olympus-card border border-olympus-border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-olympus-blue/10 rounded-full blur-2xl pointer-events-none" />
              <p className="text-lg sm:text-xl text-slate-200 font-light leading-relaxed">
                <span className="font-semibold text-white font-tech tracking-wider">OLYMPUS</span> is a{' '}
                <span className="text-olympus-cyan font-medium">Department of Electronics and Computer Engineering</span> event designed to give
                students a platform to build, create and present innovative ideas through technology and
                creativity.
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Engineered to challenge both software developers and creative thinkers, OLYMPUS unites
              modern engineering methodologies under one roof. Whether you engineer state-of-the-art
              AI-driven web platforms or produce technical cinematography and schematics on drone UAVs,
              this is your testing ground.
            </p>

            {/* Core Values / Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-olympus-card/50 border border-olympus-border/60">
                <CheckCircle2 className="w-4 h-4 text-olympus-cyan shrink-0" />
                <span className="text-xs font-mono text-slate-200">Open to All Engineering Branches</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-olympus-card/50 border border-olympus-border/60">
                <CheckCircle2 className="w-4 h-4 text-olympus-cyan shrink-0" />
                <span className="text-xs font-mono text-slate-200">Live Jury Evaluation & Q&A</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-olympus-card/50 border border-olympus-border/60">
                <CheckCircle2 className="w-4 h-4 text-olympus-cyan shrink-0" />
                <span className="text-xs font-mono text-slate-200">AI Integration Permitted</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-olympus-card/50 border border-olympus-border/60">
                <CheckCircle2 className="w-4 h-4 text-olympus-cyan shrink-0" />
                <span className="text-xs font-mono text-slate-200">Digital Pass & Verification</span>
              </div>
            </div>
          </div>

          {/* Right Column: Futuristic Technical Illustration */}
          <HUDFrame tag="SYSTEM.ARCHITECTURE" glow={true} className="p-8">
            <div className="relative flex flex-col items-center justify-center min-h-[340px]">
              {/* Central Core Circle */}
              <div className="relative w-36 h-36 rounded-full border-2 border-olympus-cyan/40 bg-olympus-bg/80 flex items-center justify-center shadow-cyan-glow">
                <div className="w-24 h-24 rounded-full border border-dashed border-olympus-blue animate-spin-slow flex items-center justify-center">
                  <Cpu className="w-10 h-10 text-olympus-cyan" />
                </div>
                <span className="absolute -bottom-3 px-2 py-0.5 bg-olympus-card border border-olympus-cyan text-[9px] font-mono text-olympus-cyan uppercase">
                  ECE CORE
                </span>
              </div>

              {/* Surrounding Interactive Node Tags */}
              <div className="absolute top-2 left-4 p-3 rounded-lg bg-olympus-bg/90 border border-olympus-border flex items-center gap-2 shadow-md">
                <Code2 className="w-4 h-4 text-olympus-cyan" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-white font-bold">ARENA 01</span>
                  <span className="text-[9px] text-slate-400">Full Stack & AI</span>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 p-3 rounded-lg bg-olympus-bg/90 border border-olympus-border flex items-center gap-2 shadow-md">
                <Video className="w-4 h-4 text-olympus-cyan" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-white font-bold">ARENA 02</span>
                  <span className="text-[9px] text-slate-400">Drone Technology</span>
                </div>
              </div>

              <div className="absolute top-4 right-6 p-2 rounded bg-olympus-blue/10 border border-olympus-blue/30 text-[10px] font-mono text-olympus-cyan">
                SYS_VER: 2026.1
              </div>

              <div className="absolute bottom-4 left-6 p-2 rounded bg-olympus-card border border-olympus-border text-[10px] font-mono text-slate-400">
                TEAM: 2–4 PARTICIPANTS
              </div>
            </div>
          </HUDFrame>
        </div>
      </div>
    </section>
  );
};
