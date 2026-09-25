import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { HUDFrame } from '../common/HUDFrame';
import { api } from '../../services/api';
import { ScheduleItem } from '../../types';

export const ScheduleSection: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await api.getSchedule();
        setSchedule(data);
      } catch {
        setSchedule([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  return (
    <section className="py-20 bg-olympus-bg/90 relative" id="schedule">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="EVENT CHRONOLOGY"
          title="OLYMPUS"
          highlight="TIMELINE"
          subtitle="Official progression of rounds, reviews, and ceremonies."
          align="center"
        />

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-2 border-olympus-cyan border-t-transparent rounded-full animate-spin" />
          </div>
        ) : schedule.length === 0 ? (
          /* Empty state respecting rulebook requirement */
          <div className="max-w-md mx-auto text-center p-8 rounded-xl bg-olympus-card border border-olympus-border">
            <AlertCircle className="w-8 h-8 text-olympus-cyan mx-auto mb-3" />
            <h4 className="font-tech text-lg font-bold text-white uppercase">
              Schedule Announcement
            </h4>
            <p className="text-sm text-slate-400 mt-2">
              Schedule will be announced soon by the organizers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {schedule.map((item, idx) => (
              <HUDFrame
                key={item.id}
                tag={item.round || `ITEM 0${idx + 1}`}
                className="hover:border-olympus-cyan/50 transition-colors"
              >
                <div className="space-y-3">
                  <h4 className="font-tech text-xl font-bold text-white">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  <div className="pt-3 border-t border-olympus-border/60 flex flex-col gap-1.5 text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-olympus-cyan" />
                      <span>{item.date || 'TBA by Organizers'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-olympus-cyan" />
                      <span>{item.time || 'TBA by Organizers'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-olympus-cyan" />
                      <span>{item.venue || "Idea Lab, SVERI's College of Engineering"}</span>
                    </div>
                  </div>
                </div>
              </HUDFrame>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
