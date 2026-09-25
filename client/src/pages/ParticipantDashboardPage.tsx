import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Users,
  Calendar,
  Send,
  Radio,
  FileText,
  AlertTriangle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { HUDFrame } from '../components/common/HUDFrame';
import { ParticipantPass } from '../components/pass/ParticipantPass';
import { api } from '../services/api';
import { Announcement, ScheduleItem } from '../types';

export const ParticipantDashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [lookupCode, setLookupCode] = useState<string>(initialCode);
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Submissions state
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [liveDemoUrl, setLiveDemoUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [submissionNotes, setSubmissionNotes] = useState<string>('');
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Announcements & Schedule
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    const fetchGeneralInfo = async () => {
      const [annData, schedData] = await Promise.all([
        api.getAnnouncements(),
        api.getSchedule(),
      ]);
      setAnnouncements(annData);
      setSchedule(schedData);
    };
    fetchGeneralInfo();
  }, []);

  const handleLookup = async (codeToSearch?: string) => {
    const code = (codeToSearch || lookupCode).trim();
    if (!code) return;

    setLoading(true);
    setErrorMsg(null);
    setSubmissionSuccess(false);

    try {
      const res = await api.getRegistrationByCode(code);
      if (res.success && res.data) {
        setTeamData(res.data);
        setSearchParams({ code });

        // Pre-fill submission if existing
        if (res.data.submission) {
          setProjectTitle(res.data.submission.projectTitle || '');
          setRepoUrl(res.data.submission.repoUrl || '');
          setLiveDemoUrl(res.data.submission.liveDemoUrl || '');
          setVideoUrl(res.data.submission.videoUrl || '');
          setSubmissionNotes(res.data.submission.notes || '');
        }
      } else {
        setErrorMsg(res.message || 'No team registration found for this code.');
        setTeamData(null);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error looking up registration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      handleLookup(initialCode);
    }
  }, []);

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamData) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await api.submitProject({
        teamCode: teamData.teamCode,
        regCode: teamData.registrationId,
        projectTitle,
        repoUrl,
        liveDemoUrl,
        videoUrl,
        notes: submissionNotes,
      });

      if (res.success) {
        setSubmissionSuccess(true);
        // Refresh team data
        handleLookup(teamData.registrationId);
      } else {
        setErrorMsg(res.message || 'Failed to record submission.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-olympus-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="COMMAND CENTER"
          title="PARTICIPANT"
          highlight="DASHBOARD"
          subtitle="Access your participant pass, manage submissions, and review real-time event alerts."
          align="center"
        />

        {/* Pass Lookup Form */}
        <div className="max-w-xl mx-auto mb-12">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup();
            }}
            className="flex items-center gap-2 p-2 rounded-xl bg-olympus-card border border-olympus-border shadow-card-glow"
          >
            <input
              type="text"
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value.toUpperCase())}
              placeholder="Enter Registration ID (e.g. OLY-2026-XXXX) or Team Code"
              className="flex-1 px-3 py-2 bg-transparent text-sm text-white placeholder-slate-500 font-mono outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="cyber-button px-6 py-2.5 bg-olympus-blue hover:bg-olympus-blue-light text-white text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-2 shadow-blue-glow shrink-0 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>LOOKUP</span>
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <p className="text-xs text-red-400 font-mono text-center mt-3">
              {errorMsg}
            </p>
          )}

          {!teamData && (
            <p className="text-xs text-slate-500 font-mono text-center mt-2">
              Tip: You can test with pre-seeded registration code <button type="button" onClick={() => { setLookupCode('OLY-2026-8801'); handleLookup('OLY-2026-8801'); }} className="text-olympus-cyan underline">OLY-2026-8801</button>
            </p>
          )}
        </div>

        {/* Dashboard Content if Team Loaded */}
        {teamData ? (
          <div className="space-y-12">
            {/* Top Status Banner */}
            <div className="p-6 rounded-2xl bg-olympus-card border border-olympus-cyan/40 shadow-cyan-glow flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  ACTIVE REGISTRATION
                </span>
                <h3 className="font-tech text-3xl font-extrabold text-white uppercase">
                  TEAM: {teamData.teamName}
                </h3>
                <span className="text-xs font-mono text-olympus-cyan">
                  CODE: {teamData.teamCode} • {teamData.eventType}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">
                    STATUS
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-green-500/10 border border-green-500/30 text-xs font-mono font-bold text-green-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {teamData.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Grid Layout: Pass + Submissions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Official Pass */}
              <div className="lg:col-span-6 space-y-6">
                <h4 className="text-white font-tech text-xl font-bold uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-5 h-5 text-olympus-cyan" />
                  Your Participant Digital Pass
                </h4>

                <ParticipantPass
                  registrationId={teamData.registrationId}
                  teamCode={teamData.teamCode}
                  teamName={teamData.teamName}
                  eventType={teamData.eventType}
                  participants={teamData.participants}
                  createdAt={teamData.registeredAt}
                />
              </div>

              {/* Right Column: Project Submission Portal */}
              <div className="lg:col-span-6 space-y-6">
                <h4 className="text-white font-tech text-xl font-bold uppercase tracking-wider flex items-center gap-2">
                  <Send className="w-5 h-5 text-olympus-cyan" />
                  Event Submission Portal
                </h4>

                <HUDFrame tag="SUBMISSION FORM" className="p-6">
                  {submissionSuccess && (
                    <div className="mb-4 p-3 rounded-lg bg-green-950/40 border border-green-500/40 text-green-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      <span>Submission successfully updated!</span>
                    </div>
                  )}

                  <form onSubmit={handleProjectSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">
                        Project / Submission Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="e.g. Autonomous AI Drone Inspection System"
                        className="w-full px-3.5 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-xs outline-none"
                      />
                    </div>

                    {teamData.eventType === 'FULL_STACK_AI' ? (
                      <>
                        <div>
                          <label className="block text-xs font-mono text-slate-300 mb-1">
                            GitHub / Code Repository URL
                          </label>
                          <input
                            type="url"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            placeholder="https://github.com/your-org/olympus-project"
                            className="w-full px-3.5 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-xs outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-300 mb-1">
                            Live Demo / Cloud Hosted URL
                          </label>
                          <input
                            type="url"
                            value={liveDemoUrl}
                            onChange={(e) => setLiveDemoUrl(e.target.value)}
                            placeholder="https://your-demo-app.vercel.app"
                            className="w-full px-3.5 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-xs outline-none"
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1">
                          Video / Poster Media Drive URL
                        </label>
                        <input
                          type="url"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="Google Drive, YouTube or Vimeo URL"
                          className="w-full px-3.5 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-xs outline-none"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">
                        Technical Notes / Abstract / Architecture Summary
                      </label>
                      <textarea
                        rows={4}
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                        placeholder="Brief summary of tech stack, AI models utilized, or Drone engineering concepts implemented..."
                        className="w-full px-3.5 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-xs outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full cyber-button py-2.5 bg-olympus-blue hover:bg-olympus-blue-light text-white text-xs font-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-blue-glow disabled:opacity-50"
                    >
                      {isSubmitting ? 'SAVING...' : 'SAVE / UPDATE SUBMISSION'}
                    </button>
                  </form>
                </HUDFrame>
              </div>
            </div>

            {/* Bottom Section: Live Announcements & Instructions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-olympus-border">
              {/* Announcements Feed */}
              <HUDFrame tag="LIVE BULLETINS" className="p-6">
                <h4 className="font-tech text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-olympus-cyan animate-pulse" />
                  Official Bulletins
                </h4>
                <div className="space-y-3">
                  {announcements.map((a) => (
                    <div
                      key={a.id}
                      className="p-3 rounded-lg bg-olympus-bg/80 border border-olympus-border/70 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white font-mono">[{a.title}]</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(a.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-300">{a.content}</p>
                    </div>
                  ))}
                </div>
              </HUDFrame>

              {/* General Venue & Event Rules */}
              <HUDFrame tag="IMPORTANT INSTRUCTIONS" className="p-6">
                <h4 className="font-tech text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-olympus-cyan" />
                  Participant Instructions
                </h4>
                <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                  <p>
                    1. <strong>Verification:</strong> Keep this participant pass downloaded or printed. It must be presented at the check-in desk on event day.
                  </p>
                  <p>
                    2. <strong>Hardware:</strong> All teams participating in Full Stack Development with AI must bring their own laptops and chargers.
                  </p>
                  <p>
                    3. <strong>Jury Defense:</strong> All team members must be present during the evaluation rounds to explain their contribution.
                  </p>
                  <p>
                    4. <strong>Theme Integrity:</strong> For Engineer’s Got Talent, content must strictly center around Drone Technology.
                  </p>
                </div>
              </HUDFrame>
            </div>
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-16 p-8 rounded-2xl bg-olympus-card/40 border border-olympus-border max-w-lg mx-auto">
            <Users className="w-12 h-12 text-olympus-cyan/50 mx-auto mb-4" />
            <h3 className="font-tech text-2xl font-bold text-white uppercase">
              No Pass Loaded Yet
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              Enter your Registration ID (e.g. OLY-2026-XXXX) or Team Code above to load your registration status, participant pass, and submission portal.
            </p>
            <div className="mt-6">
              <Link
                to="/register"
                className="cyber-button inline-flex items-center gap-2 px-6 py-2.5 bg-olympus-blue text-white text-xs font-tech font-bold uppercase"
              >
                <span>REGISTER NEW TEAM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
