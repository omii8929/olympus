import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { HUDFrame } from '../components/common/HUDFrame';
import { EVENT_CONFIG } from '../config/eventConfig';

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="pt-28 pb-20 bg-olympus-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="HELP DESK"
          title="FREQUENTLY ASKED"
          highlight="QUESTIONS"
          subtitle="Official answers regarding participation rules, team composition, evaluations, and policies."
          align="center"
        />

        <div className="space-y-4 mt-8">
          {EVENT_CONFIG.faq.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <HUDFrame
                key={idx}
                tag={`Q0${idx + 1}`}
                className={`transition-all ${isOpen ? 'border-olympus-cyan/50 shadow-cyan-glow' : ''}`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left py-2 focus:outline-none"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <HelpCircle className="w-5 h-5 text-olympus-cyan shrink-0" />
                    <span className="font-tech text-lg sm:text-xl font-bold text-white">
                      {item.q}
                    </span>
                  </div>

                  <div className="p-1 text-olympus-cyan shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-olympus-border/70 text-sm text-slate-300 font-light leading-relaxed">
                    {item.a}
                  </div>
                )}
              </HUDFrame>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="mt-12 text-center p-6 rounded-xl bg-olympus-card border border-olympus-border">
          <MessageSquare className="w-6 h-6 text-olympus-cyan mx-auto mb-2" />
          <h4 className="font-tech text-lg font-bold text-white uppercase">
            Have further questions?
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Reach out to the Department of Electronics and Computer Engineering organizing committee.
          </p>
        </div>
      </div>
    </div>
  );
};
