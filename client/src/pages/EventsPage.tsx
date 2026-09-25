import React from 'react';
import { ArenaCards } from '../components/home/ArenaCards';
import { SectionHeader } from '../components/common/SectionHeader';
import { EVENT_CONFIG } from '../config/eventConfig';
import { Users, CreditCard, ShieldCheck } from 'lucide-react';

export const EventsPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 bg-olympus-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="OFFICIAL COMPETITIONS"
          title="OLYMPUS 2026"
          highlight="ARENAS"
          subtitle="Explore the two competitive arenas defined in the official ECE Department rule book."
          align="center"
        />

        {/* Global eligibility notice */}
        <div className="max-w-3xl mx-auto mb-12 p-4 rounded-xl bg-olympus-card border border-olympus-cyan/30 flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-olympus-cyan" />
            <span>TEAM SIZE: 2–4 PARTICIPANTS</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-olympus-cyan" />
            <span>FEE: ₹100 / PARTICIPANT</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-olympus-cyan" />
            <span>OPEN TO ALL BRANCHES</span>
          </div>
        </div>

        <ArenaCards />
      </div>
    </div>
  );
};
