import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { EVENT_CONFIG } from '../../config/eventConfig';

export const MissionJourney: React.FC = () => {
  return (
    <section className="py-20 bg-olympus-bg relative overflow-hidden" id="journey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="MISSION PROTOCOL"
          title="YOUR OLYMPUS"
          highlight="JOURNEY"
          subtitle="Follow the step-by-step roadmap from initial team enrollment to grand valedictory victory."
          align="center"
        />

        {/* Timeline Container */}
        <div className="mt-16 relative">
          {/* Connecting Line (Desktop: Horizontal, Mobile: Vertical) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-olympus-blue via-olympus-cyan to-olympus-violet -translate-y-1/2 z-0" />
          <div className="lg:hidden absolute top-0 bottom-0 left-6 w-0.5 bg-gradient-to-b from-olympus-blue via-olympus-cyan to-olympus-violet z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 relative z-10">
            {EVENT_CONFIG.journeySteps.map((step) => (
              <div
                key={step.step}
                className="flex lg:flex-col items-start lg:items-center gap-4 lg:gap-3 group"
              >
                {/* Node circle */}
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-olympus-bg border-2 border-olympus-cyan/60 group-hover:border-olympus-cyan group-hover:scale-110 group-hover:shadow-cyan-glow transition-all duration-300 shrink-0">
                  <span className="font-mono text-xs font-bold text-olympus-cyan">
                    {step.step}
                  </span>
                  <span className="absolute -inset-1 rounded-full bg-olympus-cyan/10 pointer-events-none" />
                </div>

                {/* Step Card Content */}
                <div className="p-4 rounded-xl bg-olympus-card/90 border border-olympus-border group-hover:border-olympus-cyan/40 transition-colors w-full lg:text-center">
                  <span className="text-[10px] font-mono tracking-widest text-olympus-cyan uppercase block mb-1">
                    PHASE {step.step}
                  </span>
                  <h4 className="font-tech text-base font-bold text-white tracking-wide uppercase">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
