import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';
import { EVENT_CONFIG } from '../../config/eventConfig';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
}

export const Countdown: React.FC = () => {
  const calculateTimeLeft = (): TimeLeft => {
    const target = new Date(EVENT_CONFIG.eventTargetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isLive: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (timeLeft.isLive) {
    return (
      <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-olympus-cyan/20 to-olympus-blue/20 border border-olympus-cyan shadow-cyan-glow">
        <Zap className="w-5 h-5 text-olympus-cyan animate-bounce" />
        <span className="font-tech text-xl sm:text-2xl font-extrabold text-white tracking-widest uppercase">
          {EVENT_CONFIG.isLiveText}
        </span>
      </div>
    );
  }

  const units = [
    { label: 'DAYS', value: String(timeLeft.days).padStart(2, '0') },
    { label: 'HOURS', value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'MINUTES', value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'SECONDS', value: String(timeLeft.seconds).padStart(2, '0') },
  ];

  return (
    <div className="inline-block p-1 rounded-2xl bg-gradient-to-b from-olympus-cyan/30 via-olympus-blue/20 to-transparent">
      <div className="bg-olympus-card/90 backdrop-blur-md px-5 sm:px-8 py-4 rounded-2xl border border-olympus-border">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Clock className="w-3.5 h-3.5 text-olympus-cyan animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-olympus-cyan uppercase">
            EVENT STARTS IN (2 OCT 2026 • 09:00 AM IST)
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {units.map((unit, index) => (
            <React.Fragment key={unit.label}>
              <div className="flex flex-col items-center min-w-[50px] sm:min-w-[65px]">
                <span className="text-2xl sm:text-4xl font-extrabold font-mono text-white tracking-wider tabular-nums">
                  {unit.value}
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 tracking-wider mt-1">
                  {unit.label}
                </span>
              </div>
              {index < units.length - 1 && (
                <span className="text-xl sm:text-2xl font-bold text-olympus-cyan/60 -mt-3">:</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
