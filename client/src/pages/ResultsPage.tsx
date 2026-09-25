import React, { useState, useEffect } from 'react';
import { Trophy, Award, Clock, AlertCircle } from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { HUDFrame } from '../components/common/HUDFrame';
import { api } from '../services/api';
import { ResultItem } from '../types';

export const ResultsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'FULL_STACK_AI' | 'DRONE_VIDEO' | 'DRONE_POSTER'>('FULL_STACK_AI');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await api.getResults(activeTab);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [activeTab]);

  const tabs = [
    { id: 'FULL_STACK_AI', label: 'FULL STACK × AI' },
    { id: 'DRONE_VIDEO', label: 'VIDEO MAKING' },
    { id: 'DRONE_POSTER', label: 'POSTER MAKING' },
  ];

  return (
    <div className="pt-28 pb-20 bg-olympus-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="HALL OF GLORY"
          title="OLYMPUS"
          highlight="RESULTS"
          subtitle="Official honors, podium standings, and jury commendations."
          align="center"
        />

        {/* Tab Navigation */}
        <div className="flex items-center justify-center gap-3 mb-12 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`cyber-button px-6 py-2.5 font-tech text-sm uppercase tracking-wider transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-olympus-blue text-white shadow-blue-glow font-bold'
                  : 'bg-olympus-card text-slate-400 hover:text-white border border-olympus-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-olympus-cyan border-t-transparent rounded-full animate-spin" />
          </div>
        ) : results.length === 0 ? (
          /* Pre-Event / Unannounced State (Strictly as specified) */
          <div className="max-w-md mx-auto text-center p-12 rounded-2xl bg-olympus-card/70 border border-olympus-border backdrop-blur-md">
            <div className="w-16 h-16 rounded-full bg-olympus-blue/10 border border-olympus-cyan/40 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-olympus-cyan" />
            </div>
            <h3 className="font-tech text-2xl font-bold text-white uppercase tracking-wide">
              EVALUATION IN PROGRESS
            </h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Results will be announced after the event.
            </p>
            <div className="mt-6 inline-block px-3 py-1 rounded bg-olympus-bg border border-olympus-border text-[11px] font-mono text-slate-500">
              Awaiting official jury sign-off & admin broadcast
            </div>
          </div>
        ) : (
          /* Published Winners */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.map((res) => (
              <HUDFrame
                key={res.id}
                tag={`POSITION 0${res.position}`}
                glow={res.position === 1}
                className="p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        res.position === 1
                          ? 'bg-amber-400/20 text-amber-400 border border-amber-400'
                          : res.position === 2
                          ? 'bg-slate-300/20 text-slate-200 border border-slate-300'
                          : 'bg-amber-700/20 text-amber-600 border border-amber-700'
                      }`}
                    >
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-olympus-cyan uppercase block">
                        {res.prizeTitle}
                      </span>
                      <span className="font-tech text-2xl font-extrabold text-white">
                        RANK #{res.position}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-tech text-xl font-bold text-white uppercase mb-2">
                    TEAM: {res.team?.name}
                  </h4>
                  <span className="text-xs font-mono text-slate-400 block mb-4">
                    CODE: {res.team?.teamCode}
                  </span>

                  {res.remarks && (
                    <div className="p-3 rounded bg-olympus-bg border border-olympus-border text-xs text-slate-300 italic mb-4">
                      "{res.remarks}"
                    </div>
                  )}

                  {res.team?.participants && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">
                        HONORED MEMBERS:
                      </span>
                      {res.team.participants.map((p, i) => (
                        <div key={i} className="text-xs text-slate-300 font-mono">
                          • {p.name} ({p.branch})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </HUDFrame>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
