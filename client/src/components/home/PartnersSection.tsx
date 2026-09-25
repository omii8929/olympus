import React from 'react';
import { ShieldCheck, Handshake } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';

export const PartnersSection: React.FC = () => {
  return (
    <section className="py-20 bg-olympus-bg relative overflow-hidden" id="partners">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="COLLABORATION ECOSYSTEM"
          title="OUR"
          highlight="PARTNERS"
          subtitle="Backed by academic innovation and engineering student alliances."
          align="center"
        />

        {/* Fallback announcement block respecting official rules */}
        <div className="max-w-xl mx-auto text-center p-8 rounded-2xl bg-olympus-card/70 border border-olympus-border backdrop-blur-md">
          <div className="w-12 h-12 rounded-full bg-olympus-blue/10 border border-olympus-cyan/30 flex items-center justify-center mx-auto mb-4">
            <Handshake className="w-6 h-6 text-olympus-cyan" />
          </div>
          <h4 className="font-tech text-xl font-bold text-white uppercase tracking-wider">
            PARTNERSHIP INQUIRIES OPEN
          </h4>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Partners and supporting industry bodies will be officially announced soon by the organizers.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="px-4 py-2 rounded-lg bg-olympus-bg/80 border border-dashed border-olympus-border text-xs font-mono text-slate-400">
              [ TITLE SPONSOR PLACEHOLDER ]
            </div>
            <div className="px-4 py-2 rounded-lg bg-olympus-bg/80 border border-dashed border-olympus-border text-xs font-mono text-slate-400">
              [ TECH POWERED BY PLACEHOLDER ]
            </div>
            <div className="px-4 py-2 rounded-lg bg-olympus-bg/80 border border-dashed border-olympus-border text-xs font-mono text-slate-400">
              [ COMMUNITY PARTNER ]
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
