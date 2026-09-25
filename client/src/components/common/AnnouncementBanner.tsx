import React, { useState, useEffect } from 'react';
import { Radio, AlertCircle, ChevronRight, X } from 'lucide-react';
import { api } from '../../services/api';
import { Announcement } from '../../types';

export const AnnouncementBanner: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const data = await api.getAnnouncements();
      if (data && data.length > 0) {
        setAnnouncements(data);
      }
    };
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  if (!isVisible || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <div className="bg-gradient-to-r from-olympus-bg via-olympus-blue-dark/40 to-olympus-bg border-b border-olympus-cyan/20 py-2 px-4 relative z-40 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-olympus-cyan/10 border border-olympus-cyan/40 text-olympus-cyan font-mono font-semibold text-[11px] shrink-0 tracking-wider">
            <Radio className="w-3 h-3 animate-pulse text-olympus-cyan" />
            LIVE
          </span>

          <div className="flex items-center gap-2 truncate">
            {current.priority === 'HIGH' && (
              <AlertCircle className="w-3.5 h-3.5 text-olympus-cyan shrink-0" />
            )}
            <span className="font-semibold text-white shrink-0 font-mono">[{current.title}]:</span>
            <span className="text-slate-300 truncate">{current.content}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {announcements.length > 1 && (
            <span className="text-[11px] font-mono text-slate-400">
              {currentIndex + 1}/{announcements.length}
            </span>
          )}
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Close live banner"
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
