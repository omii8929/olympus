import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Download, CheckCircle, ShieldCheck, Cpu, User, AlertCircle } from 'lucide-react';
import { EVENT_CONFIG } from '../../config/eventConfig';

interface ParticipantPassProps {
  registrationId: string;
  teamCode: string;
  teamName: string;
  eventType: string;
  participants: Array<{
    name: string;
    email: string;
    branch: string;
    college: string;
    isLeader?: boolean;
  }>;
  createdAt?: string;
  showPrintControls?: boolean;
}

export const ParticipantPass: React.FC<ParticipantPassProps> = ({
  registrationId,
  teamCode,
  teamName,
  eventType,
  participants,
  createdAt,
  showPrintControls = true,
}) => {
  const passRef = useRef<HTMLDivElement>(null);

  const getEventTitle = (code: string) => {
    switch (code) {
      case 'FULL_STACK_AI':
        return 'FULL STACK DEVELOPMENT WITH AI';
      case 'DRONE_VIDEO':
        return "ENGINEER'S GOT TALENT — VIDEO MAKING";
      case 'DRONE_POSTER':
        return "ENGINEER'S GOT TALENT — POSTER MAKING";
      default:
        return code;
    }
  };

  const verificationUrl = `${window.location.origin}/pass/${registrationId}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Pass Container */}
      <div
        ref={passRef}
        className="w-full max-w-xl bg-gradient-to-b from-olympus-card via-[#0A1028] to-olympus-bg border-2 border-olympus-cyan/50 rounded-2xl p-6 sm:p-8 shadow-cyan-glow relative overflow-hidden text-white print:border-black print:text-black print:shadow-none"
      >
        {/* Top Metallic / Cyan Header Strip */}
        <div className="flex items-start justify-between border-b border-olympus-cyan/30 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-black/60 border border-olympus-cyan/60 p-0.5 overflow-hidden flex items-center justify-center shrink-0">
              <img
                src="/aces-logo.png"
                alt="ACES Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-tech text-3xl font-extrabold tracking-wider text-white">
                {EVENT_CONFIG.name} {EVENT_CONFIG.year}
              </span>
              <span className="block text-[10px] font-mono tracking-widest text-olympus-cyan uppercase font-bold">
                ACES • {EVENT_CONFIG.department}
              </span>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="inline-block px-2.5 py-0.5 rounded bg-olympus-blue/20 border border-olympus-cyan/40 text-[11px] text-olympus-cyan font-semibold uppercase">
              OFFICIAL PASS
            </span>
            <span className="block text-[9px] text-slate-400 mt-1">STATUS: VERIFIED</span>
          </div>
        </div>

        {/* Primary Identification Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-3 rounded-lg bg-olympus-bg/80 border border-olympus-border">
            <span className="text-[9px] font-mono text-slate-400 uppercase block">
              REGISTRATION ID
            </span>
            <span className="text-sm sm:text-base font-mono font-bold text-olympus-cyan tracking-wider">
              {registrationId}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-olympus-bg/80 border border-olympus-border">
            <span className="text-[9px] font-mono text-slate-400 uppercase block">
              TEAM CODE
            </span>
            <span className="text-sm sm:text-base font-mono font-bold text-white tracking-wider">
              {teamCode}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-olympus-bg/80 border border-olympus-border">
            <span className="text-[9px] font-mono text-slate-400 uppercase block">
              TOTAL MEMBERS
            </span>
            <span className="text-sm sm:text-base font-mono font-bold text-white tracking-wider">
              {participants.length} PARTICIPANTS
            </span>
          </div>
        </div>

        {/* Team & Event Details */}
        <div className="p-4 rounded-xl bg-olympus-bg/60 border border-olympus-border/70 mb-6">
          <div className="mb-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">TEAM NAME</span>
            <span className="font-tech text-2xl font-bold text-white uppercase tracking-wide">
              {teamName}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">COMPETITIVE ARENA</span>
            <span className="text-sm font-semibold text-olympus-cyan">
              {getEventTitle(eventType)}
            </span>
          </div>
        </div>

        {/* Member List & QR Code Side-by-Side */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center mb-6">
          {/* Members (2 Cols) */}
          <div className="sm:col-span-2 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
              TEAM ROSTER ({participants.length} MEMBERS)
            </span>
            {participants.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded bg-olympus-card border border-olympus-border/50 text-xs"
              >
                <div className="truncate pr-2">
                  <span className="font-bold text-slate-200">
                    {p.name}
                    {p.isLeader && (
                      <span className="ml-1 text-[9px] font-mono text-olympus-cyan font-bold">
                        (LEADER)
                      </span>
                    )}
                  </span>
                  <span className="block text-[10px] text-slate-400 truncate">
                    {p.branch} • {p.college}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* QR Code (1 Col) */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white text-black shadow-md">
            <QRCodeSVG
              value={verificationUrl}
              size={110}
              level="H"
              includeMargin={false}
            />
            <span className="text-[9px] font-mono font-bold text-black mt-2 text-center tracking-tighter">
              SCAN FOR VERIFICATION
            </span>
          </div>
        </div>

        {/* Pass Footer */}
        <div className="pt-4 border-t border-olympus-cyan/20 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
          <span>VENUE: IDEA LAB, SVERI'S COLLEGE OF ENGINEERING</span>
          <span>FEE: ₹{participants.length * 100} PAID / CONFIRMED</span>
          <span>ISSUED: {createdAt ? new Date(createdAt).toLocaleDateString() : 'VALID 2026'}</span>
        </div>
      </div>

      {/* Print / Save Controls */}
      {showPrintControls && (
        <div className="flex items-center gap-4 mt-6 print:hidden">
          <button
            onClick={handlePrint}
            className="cyber-button px-6 py-2.5 bg-olympus-blue hover:bg-olympus-blue-light text-white font-tech font-bold uppercase text-xs tracking-wider flex items-center gap-2 shadow-blue-glow"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT / SAVE AS PDF</span>
          </button>
        </div>
      )}
    </div>
  );
};
