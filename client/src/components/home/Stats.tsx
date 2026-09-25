import React from 'react';
import { Layers, Users, CreditCard, Award } from 'lucide-react';
import { HUDFrame } from '../common/HUDFrame';
import { EVENT_CONFIG } from '../../config/eventConfig';

export const Stats: React.FC = () => {
  const statIcons = [
    <Layers className="w-6 h-6 text-olympus-cyan" />,
    <Users className="w-6 h-6 text-olympus-cyan" />,
    <CreditCard className="w-6 h-6 text-olympus-cyan" />,
    <Award className="w-6 h-6 text-olympus-cyan" />,
  ];

  return (
    <section className="relative z-20 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {EVENT_CONFIG.stats.map((stat, idx) => (
          <HUDFrame
            key={stat.label}
            tag={`0${idx + 1}`}
            className="hover:border-olympus-cyan/60 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-2.5 rounded-lg bg-olympus-bg/80 border border-olympus-border group-hover:border-olympus-cyan/50 transition-colors mb-3">
                {statIcons[idx]}
              </div>
              <span className="font-tech text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                {stat.value}
              </span>
              <span className="text-[11px] font-mono tracking-wider text-olympus-cyan font-semibold uppercase mt-0.5">
                {stat.label}
              </span>
              <span className="text-xs text-slate-400 font-normal mt-1">
                {stat.subtext}
              </span>
            </div>
          </HUDFrame>
        ))}
      </div>
    </section>
  );
};
