import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Layers,
  CreditCard,
  Download,
  Search,
  Plus,
  Trash2,
  Trophy,
  Radio,
  Calendar,
  Shield,
  LogOut,
  ChevronDown,
  Eye,
  CheckCircle2,
  History,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { HUDFrame } from '../components/common/HUDFrame';
import { PaymentSettingsTab } from '../components/admin/PaymentSettingsTab';
import { PaymentAuditHistoryTab } from '../components/admin/PaymentAuditHistoryTab';
import { AdminManagementTab } from '../components/admin/AdminManagementTab';
import { AdminStats, TeamDetails, Announcement, ScheduleItem, ResultItem } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    'registrations' | 'payments' | 'auditHistory' | 'submissions' | 'announcements' | 'schedule' | 'results' | 'admins'
  >('registrations');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [registrations, setRegistrations] = useState<TeamDetails[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [results, setResults] = useState<ResultItem[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterEvent, setFilterEvent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTeam, setSelectedTeam] = useState<TeamDetails | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New Announcement form
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnPriority, setNewAnnPriority] = useState('NORMAL');
  const [newAnnCategory, setNewAnnCategory] = useState('GENERAL');

  // New Schedule form
  const [newSchedTitle, setNewSchedTitle] = useState('');
  const [newSchedDate, setNewSchedDate] = useState('');
  const [newSchedTime, setNewSchedTime] = useState('');
  const [newSchedVenue, setNewSchedVenue] = useState('');
  const [newSchedRound, setNewSchedRound] = useState('');

  // Results Form
  const [resultEvent, setResultEvent] = useState('FULL_STACK_AI');
  const [resultTeamId, setResultTeamId] = useState('');
  const [resultPosition, setResultPosition] = useState(1);
  const [resultPrize, setResultPrize] = useState('First Place / Winner');
  const [resultRemarks, setResultRemarks] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    loadAllData();
  }, [isAdmin]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsData, regsData, annData, schedData, resData, subData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminRegistrations(searchQuery, filterEvent),
        api.getAnnouncements(),
        api.getSchedule(),
        api.getResults(),
        api.getAllSubmissions(),
      ]);

      setStats(statsData);
      setRegistrations(regsData);
      setAnnouncements(annData);
      setSchedule(schedData);
      setResults(resData);
      setSubmissions(subData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchFilter = async () => {
    const data = await api.getAdminRegistrations(searchQuery, filterEvent);
    setRegistrations(data);
  };

  const handleUpdatePaymentStatus = async (regId: string, status: string) => {
    try {
      await api.updateRegistrationPaymentStatus(regId, status);
      await loadAllData();
    } catch (err) {
      console.error('Failed to update payment status:', err);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) return;

    await api.createAnnouncement({
      title: newAnnTitle,
      content: newAnnContent,
      priority: newAnnPriority,
      category: newAnnCategory,
    });

    setNewAnnTitle('');
    setNewAnnContent('');
    loadAllData();
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (confirm('Delete this announcement?')) {
      await api.deleteAnnouncement(id);
      loadAllData();
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchedTitle) return;

    await api.createScheduleItem({
      title: newSchedTitle,
      date: newSchedDate || 'Event Day',
      time: newSchedTime || 'TBA',
      venue: newSchedVenue || "Idea Lab, SVERI's College of Engineering",
      round: newSchedRound,
      order: schedule.length + 1,
    });

    setNewSchedTitle('');
    setNewSchedDate('');
    setNewSchedTime('');
    setNewSchedVenue('');
    setNewSchedRound('');
    loadAllData();
  };

  const handleDeleteSchedule = async (id: string) => {
    if (confirm('Delete this schedule entry?')) {
      await api.deleteScheduleItem(id);
      loadAllData();
    }
  };

  const handlePublishResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultTeamId) return;

    await api.saveResult({
      eventType: resultEvent as any,
      teamId: resultTeamId,
      position: Number(resultPosition),
      prizeTitle: resultPrize,
      remarks: resultRemarks,
      published: true,
    });

    setResultRemarks('');
    loadAllData();
  };

  const handleDeleteResult = async (id: string) => {
    if (confirm('Delete this published result?')) {
      await api.deleteResult(id);
      loadAllData();
    }
  };

  const handleDeleteRegistration = async (team: TeamDetails) => {
    const regCode = team.registration?.regCode || team.teamCode;
    const teamName = team.name;
    const targetId = team.registration?.id || team.id;

    if (
      !confirm(
        `Are you sure you want to permanently remove registration ${regCode} for team "${teamName}"?\n\nThis will completely delete the registration, team members, payment proof, and all associated submissions. This action CANNOT be undone.`
      )
    ) {
      return;
    }

    setDeletingId(targetId);
    try {
      const res = await api.deleteRegistration(targetId);
      if (res.success) {
        if (selectedTeam?.id === team.id) {
          setSelectedTeam(null);
        }
        await loadAllData();
      } else {
        alert(res.message || 'Failed to remove registration.');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to remove registration.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="pt-8 pb-20 bg-olympus-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-olympus-border mb-8">
          <div className="flex items-center gap-4">
            <div className="relative group shrink-0">
              <div className="w-14 h-14 rounded-xl p-0.5 bg-gradient-to-tr from-olympus-cyan via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center overflow-hidden p-1">
                  <img
                    src="/aces-logo.png"
                    alt="ACES Department Logo"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(0,240,255,0.5)]"
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/50 text-[11px] font-mono text-purple-300 mb-1">
                <Shield className="w-3.5 h-3.5" />
                ACES • ADMINISTRATOR COMMAND PLATFORM
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-tech text-white uppercase tracking-tight">
                OLYMPUS 2026 MANAGEMENT
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-slate-400">
                  Logged in as: {user?.email} ({user?.name})
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    isSuperAdmin
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }`}
                >
                  {isSuperAdmin ? 'SUPER ADMIN' : 'STAFF (VERIFIER ONLY)'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded bg-olympus-card border border-olympus-border hover:border-olympus-cyan text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
              title="Open Public User Platform in New Tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-olympus-cyan" />
              <span>Public Site</span>
            </a>

            <button
              onClick={() => api.exportRegistrationsCSV()}
              className="cyber-button px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-tech font-bold uppercase text-xs tracking-wider flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>EXPORT CSV</span>
            </button>

            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="p-2 rounded bg-olympus-card border border-olympus-border text-slate-300 hover:text-red-400 transition-colors"
              title="Logout Admin Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <HUDFrame tag="METRIC 01" className="p-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">TOTAL TEAMS</span>
            <span className="font-tech text-3xl font-extrabold text-white">
              {stats?.totalTeams || 0}
            </span>
          </HUDFrame>

          <HUDFrame tag="METRIC 02" className="p-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">PARTICIPANTS</span>
            <span className="font-tech text-3xl font-extrabold text-olympus-cyan">
              {stats?.totalParticipants || 0}
            </span>
          </HUDFrame>

          <HUDFrame tag="METRIC 03" className="p-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">FULL STACK TEAMS</span>
            <span className="font-tech text-3xl font-extrabold text-white">
              {stats?.fullStackTeams || 0}
            </span>
          </HUDFrame>

          <HUDFrame tag="METRIC 04" className="p-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">DRONE TEAMS</span>
            <span className="font-tech text-3xl font-extrabold text-white">
              {stats?.droneTotalTeams || 0}
            </span>
          </HUDFrame>

          <HUDFrame tag="METRIC 05" className="p-4 col-span-2 md:col-span-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">TOTAL REVENUE</span>
            <span className="font-tech text-3xl font-extrabold text-green-400">
              ₹{stats?.revenue || 0}
            </span>
          </HUDFrame>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-olympus-border mb-8 overflow-x-auto pb-2">
          {[
            { id: 'registrations', label: 'Registrations', icon: <Users className="w-4 h-4" /> },
            { id: 'payments', label: 'Payment Settings', icon: <CreditCard className="w-4 h-4 text-olympus-cyan" /> },
            { id: 'auditHistory', label: 'Change History', icon: <History className="w-4 h-4" /> },
            { id: 'submissions', label: 'Submissions', icon: <Layers className="w-4 h-4" /> },
            { id: 'announcements', label: 'Announcements', icon: <Radio className="w-4 h-4" /> },
            { id: 'schedule', label: 'Schedule Editor', icon: <Calendar className="w-4 h-4" /> },
            { id: 'results', label: 'Results / Winners', icon: <Trophy className="w-4 h-4" /> },
            ...(isSuperAdmin
              ? [{ id: 'admins', label: 'Staff & Admins', icon: <Shield className="w-4 h-4 text-purple-400" /> }]
              : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-t-lg font-mono text-xs flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-olympus-card border-t-2 border-l border-r border-olympus-cyan text-olympus-cyan font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="uppercase">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: REGISTRATIONS */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-olympus-card border border-olympus-border">
              <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchFilter()}
                  placeholder="Search by team, participant, or OLY-ID..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder-slate-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={filterEvent}
                  onChange={(e) => setFilterEvent(e.target.value)}
                  className="px-3 py-1.5 rounded bg-olympus-bg border border-olympus-border text-xs font-mono text-white outline-none"
                >
                  <option value="">All Arenas</option>
                  <option value="FULL_STACK_AI">Full Stack AI</option>
                  <option value="DRONE_VIDEO">Drone Video</option>
                  <option value="DRONE_POSTER">Drone Poster</option>
                </select>

                <button
                  onClick={handleSearchFilter}
                  className="cyber-button px-4 py-1.5 bg-olympus-blue text-white text-xs font-tech uppercase"
                >
                  FILTER
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-olympus-border overflow-hidden bg-olympus-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-olympus-bg border-b border-olympus-border text-slate-400 uppercase">
                    <tr>
                      <th className="p-3.5">Registration ID</th>
                      <th className="p-3.5">Team Name</th>
                      <th className="p-3.5">Event</th>
                      <th className="p-3.5">Leader Details</th>
                      <th className="p-3.5">Fee Paid</th>
                      <th className="p-3.5">UTR / Txn ID</th>
                      <th className="p-3.5">Payment Proof</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-olympus-border/60 text-slate-200">
                    {registrations.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-500">
                          No registrations found matching the criteria.
                        </td>
                      </tr>
                    ) : (
                      registrations.map((t) => {
                        const leader = t.participants.find((p) => p.isLeader) || t.participants[0];
                        const feePaid = t.registration?.registrationFeeAtPayment ?? t.registration?.amount ?? 100;
                        const utr = t.registration?.utrNumber;
                        const screenshot = t.registration?.paymentScreenshotUrl;
                        const paymentStatus = t.registration?.paymentStatus || 'PENDING';

                        return (
                          <tr key={t.id} className="hover:bg-olympus-bg/50">
                            <td className="p-3.5 font-bold text-olympus-cyan">
                              {t.registration?.regCode || 'N/A'}
                            </td>
                            <td className="p-3.5 font-semibold text-white">
                              {t.name}
                              <span className="block text-[10px] text-slate-400 font-normal">
                                Code: {t.teamCode}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded bg-olympus-blue/10 border border-olympus-blue/30 text-[10px] text-olympus-cyan">
                                {t.eventType}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="font-bold text-white">{leader?.name}</span>
                              <span className="block text-[10px] text-slate-400">
                                {leader?.email} • {leader?.phone}
                              </span>
                              <span className="block text-[10px] text-slate-400">
                                {leader?.branch}, {leader?.college}
                              </span>
                            </td>
                            <td className="p-3.5 text-green-400 font-bold font-mono">
                              ₹{feePaid}
                            </td>
                            <td className="p-3.5 font-mono">
                              {utr ? (
                                <span className="px-2 py-1 rounded bg-black/40 border border-slate-700 text-slate-200 text-[11px] select-all">
                                  {utr}
                                </span>
                              ) : (
                                <span className="text-slate-500 italic">None</span>
                              )}
                            </td>
                            <td className="p-3.5">
                              {screenshot ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedScreenshot(screenshot)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-olympus-cyan/10 border border-olympus-cyan/40 text-olympus-cyan hover:bg-olympus-cyan hover:text-black font-semibold text-[11px] transition-all"
                                >
                                  <ImageIcon className="w-3.5 h-3.5" />
                                  <span>View Proof</span>
                                </button>
                              ) : (
                                <span className="text-slate-500 italic text-[11px]">No proof</span>
                              )}
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    paymentStatus === 'COMPLETED'
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                      : paymentStatus === 'REJECTED'
                                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                  }`}
                                >
                                  {paymentStatus}
                                </span>
                                {t.registration?.id && (
                                  <select
                                    value={paymentStatus}
                                    onChange={(e) =>
                                      handleUpdatePaymentStatus(t.registration!.id, e.target.value)
                                    }
                                    className="bg-black/50 border border-slate-700 rounded text-[10px] text-slate-300 px-1 py-0.5 outline-none hover:border-olympus-cyan cursor-pointer"
                                  >
                                    <option value="PENDING">PENDING</option>
                                    <option value="COMPLETED">VERIFIED</option>
                                    <option value="REJECTED">REJECT</option>
                                  </select>
                                )}
                              </div>
                            </td>
                            <td className="p-3.5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedTeam(t)}
                                  className="px-2.5 py-1 rounded bg-olympus-bg border border-olympus-border hover:border-olympus-cyan text-[11px] text-slate-300 hover:text-white transition-colors"
                                  title="View Registration Details"
                                >
                                  Details
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRegistration(t)}
                                  disabled={deletingId === (t.registration?.id || t.id)}
                                  className="p-1 rounded bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors disabled:opacity-50"
                                  title="Permanently Remove Registration"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SUBMISSIONS */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            <h3 className="font-tech text-xl font-bold text-white uppercase">
              Project Submissions Received ({submissions.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {submissions.length === 0 ? (
                <p className="text-slate-500 font-mono text-xs col-span-2 text-center py-12">
                  No submissions recorded yet.
                </p>
              ) : (
                submissions.map((s) => (
                  <HUDFrame key={s.id} tag={s.team?.teamCode || 'SUBMISSION'} className="p-6">
                    <h4 className="font-tech text-xl font-bold text-white mb-1">
                      {s.projectTitle}
                    </h4>
                    <span className="text-xs font-mono text-olympus-cyan block mb-3">
                      Team: {s.team?.name} ({s.team?.eventType})
                    </span>

                    <div className="space-y-2 text-xs font-mono text-slate-300 mb-4">
                      {s.repoUrl && (
                        <div>
                          <span className="text-slate-500">REPO:</span>{' '}
                          <a href={s.repoUrl} target="_blank" rel="noreferrer" className="text-olympus-cyan underline">
                            {s.repoUrl}
                          </a>
                        </div>
                      )}
                      {s.liveDemoUrl && (
                        <div>
                          <span className="text-slate-500">LIVE DEMO:</span>{' '}
                          <a href={s.liveDemoUrl} target="_blank" rel="noreferrer" className="text-olympus-cyan underline">
                            {s.liveDemoUrl}
                          </a>
                        </div>
                      )}
                      {s.videoUrl && (
                        <div>
                          <span className="text-slate-500">MEDIA/VIDEO:</span>{' '}
                          <a href={s.videoUrl} target="_blank" rel="noreferrer" className="text-olympus-cyan underline">
                            {s.videoUrl}
                          </a>
                        </div>
                      )}
                      {s.notes && (
                        <p className="pt-2 text-slate-400 italic">
                          "{s.notes}"
                        </p>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-slate-500 block">
                      Submitted: {new Date(s.submittedAt).toLocaleString()}
                    </span>
                  </HUDFrame>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Create Announcement Form */}
            <div className="lg:col-span-5">
              <HUDFrame tag="NEW BULLETIN" className="p-6">
                <h3 className="font-tech text-xl font-bold text-white uppercase mb-4">
                  Broadcast Announcement
                </h3>
                <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-slate-400 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={newAnnTitle}
                      onChange={(e) => setNewAnnTitle(e.target.value)}
                      placeholder="e.g. Round 1 Kickoff"
                      className="w-full px-3 py-2 rounded bg-olympus-bg border border-olympus-border text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Content / Message *</label>
                    <textarea
                      rows={3}
                      required
                      value={newAnnContent}
                      onChange={(e) => setNewAnnContent(e.target.value)}
                      placeholder="Detailed alert message..."
                      className="w-full px-3 py-2 rounded bg-olympus-bg border border-olympus-border text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Priority</label>
                      <select
                        value={newAnnPriority}
                        onChange={(e) => setNewAnnPriority(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-olympus-bg border border-olympus-border text-white outline-none"
                      >
                        <option value="NORMAL">Normal</option>
                        <option value="HIGH">High (Alert)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Category</label>
                      <select
                        value={newAnnCategory}
                        onChange={(e) => setNewAnnCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-olympus-bg border border-olympus-border text-white outline-none"
                      >
                        <option value="GENERAL">General</option>
                        <option value="FULL_STACK">Full Stack</option>
                        <option value="DRONE">Drone</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full cyber-button py-2.5 bg-olympus-blue hover:bg-olympus-blue-light text-white font-tech uppercase font-bold text-xs"
                  >
                    PUBLISH ANNOUNCEMENT
                  </button>
                </form>
              </HUDFrame>
            </div>

            {/* List */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-tech text-xl font-bold text-white uppercase">
                Active Bulletins ({announcements.length})
              </h3>
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-xl bg-olympus-card border border-olympus-border flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-tech text-base font-bold text-white">
                        {a.title}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-olympus-bg border border-olympus-border text-[9px] font-mono text-olympus-cyan">
                        {a.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{a.content}</p>
                    <span className="text-[10px] font-mono text-slate-500 mt-2 block">
                      Published: {new Date(a.publishedAt).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteAnnouncement(a.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <HUDFrame tag="NEW SCHEDULE ITEM" className="p-6">
                <h3 className="font-tech text-xl font-bold text-white uppercase mb-4">
                  Add Timeline Event
                </h3>
                <form onSubmit={handleCreateSchedule} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-slate-400 mb-1">Event Title *</label>
                    <input
                      type="text"
                      required
                      value={newSchedTitle}
                      onChange={(e) => setNewSchedTitle(e.target.value)}
                      placeholder="e.g. Round 1 Review"
                      className="w-full px-3 py-2 rounded bg-olympus-bg border border-olympus-border text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Date</label>
                      <input
                        type="text"
                        value={newSchedDate}
                        onChange={(e) => setNewSchedDate(e.target.value)}
                        placeholder="e.g. Day 1 / Event Day"
                        className="w-full px-3 py-2 rounded bg-olympus-bg border border-olympus-border text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Time</label>
                      <input
                        type="text"
                        value={newSchedTime}
                        onChange={(e) => setNewSchedTime(e.target.value)}
                        placeholder="e.g. 10:00 AM"
                        className="w-full px-3 py-2 rounded bg-olympus-bg border border-olympus-border text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Venue</label>
                      <input
                        type="text"
                        value={newSchedVenue}
                        onChange={(e) => setNewSchedVenue(e.target.value)}
                        placeholder="Idea Lab, SVERI's College of Engineering"
                        className="w-full px-3 py-2 rounded bg-olympus-bg border border-olympus-border text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Round / Tag</label>
                      <input
                        type="text"
                        value={newSchedRound}
                        onChange={(e) => setNewSchedRound(e.target.value)}
                        placeholder="ROUND 01"
                        className="w-full px-3 py-2 rounded bg-olympus-bg border border-olympus-border text-white outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full cyber-button py-2.5 bg-olympus-blue hover:bg-olympus-blue-light text-white font-tech uppercase font-bold text-xs"
                  >
                    ADD TO TIMELINE
                  </button>
                </form>
              </HUDFrame>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-tech text-xl font-bold text-white uppercase">
                Current Timeline ({schedule.length})
              </h3>
              {schedule.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-olympus-card border border-olympus-border flex items-start justify-between gap-4"
                >
                  <div>
                    <span className="text-[10px] font-mono text-olympus-cyan block">
                      {item.round || 'SCHEDULE ITEM'}
                    </span>
                    <h4 className="font-tech text-lg font-bold text-white">
                      {item.title}
                    </h4>
                    <span className="text-xs font-mono text-slate-400">
                      {item.date} • {item.time} • {item.venue}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteSchedule(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: RESULTS */}
        {activeTab === 'results' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <HUDFrame tag="WINNER PUBLISHER" className="p-6">
                <h3 className="font-tech text-xl font-bold text-white uppercase mb-4">
                  Publish Official Winner
                </h3>
                <form onSubmit={handlePublishResult} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-slate-400 mb-1">Arena Track *</label>
                    <select
                      value={resultEvent}
                      onChange={(e) => setResultEvent(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-olympus-bg border border-olympus-border text-white outline-none"
                    >
                      <option value="FULL_STACK_AI">Full Stack AI</option>
                      <option value="DRONE_VIDEO">Drone Video Making</option>
                      <option value="DRONE_POSTER">Drone Poster Making</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Select Winning Team *</label>
                    <select
                      value={resultTeamId}
                      onChange={(e) => setResultTeamId(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded bg-olympus-bg border border-olympus-border text-white outline-none"
                    >
                      <option value="">-- Choose Registered Team --</option>
                      {registrations.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.teamCode}) — {t.eventType}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Position *</label>
                      <select
                        value={resultPosition}
                        onChange={(e) => setResultPosition(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded bg-olympus-bg border border-olympus-border text-white outline-none"
                      >
                        <option value={1}>1st Place (Winner)</option>
                        <option value={2}>2nd Place (Runner-up)</option>
                        <option value={3}>3rd Place (2nd Runner-up)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Title / Honor *</label>
                      <input
                        type="text"
                        value={resultPrize}
                        onChange={(e) => setResultPrize(e.target.value)}
                        placeholder="Winner"
                        className="w-full px-3 py-2 rounded bg-olympus-bg border border-olympus-border text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Jury Remarks / Commendation</label>
                    <textarea
                      rows={2}
                      value={resultRemarks}
                      onChange={(e) => setResultRemarks(e.target.value)}
                      placeholder="Exceptional AI integration and defense..."
                      className="w-full px-3 py-2 rounded bg-olympus-bg border border-olympus-border text-white outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full cyber-button py-2.5 bg-olympus-blue hover:bg-olympus-blue-light text-white font-tech uppercase font-bold text-xs"
                  >
                    PUBLISH TO RESULTS PAGE
                  </button>
                </form>
              </HUDFrame>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-tech text-xl font-bold text-white uppercase">
                Published Results ({results.length})
              </h3>
              {results.length === 0 ? (
                <p className="text-slate-500 font-mono text-xs text-center py-8">
                  No results published yet. Results page is currently in pre-event state.
                </p>
              ) : (
                results.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl bg-olympus-card border border-olympus-border flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-olympus-cyan font-bold">
                          #{r.position} — {r.prizeTitle}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-olympus-bg text-slate-300">
                          {r.eventType}
                        </span>
                      </div>
                      <h4 className="font-tech text-lg font-bold text-white">
                        Team: {r.team?.name}
                      </h4>
                      {r.remarks && <p className="text-xs text-slate-400 mt-1 italic">"{r.remarks}"</p>}
                    </div>

                    <button
                      onClick={() => handleDeleteResult(r.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 6: PAYMENT SETTINGS */}
        {activeTab === 'payments' && (
          <PaymentSettingsTab onRefresh={loadAllData} />
        )}

        {/* TAB 7: PAYMENT AUDIT HISTORY */}
        {activeTab === 'auditHistory' && (
          <PaymentAuditHistoryTab />
        )}

        {/* TAB 8: STAFF & ADMIN MANAGEMENT */}
        {activeTab === 'admins' && isSuperAdmin && (
          <AdminManagementTab />
        )}

        {/* Screenshot Preview Modal */}
        {selectedScreenshot && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-olympus-card border border-olympus-cyan rounded-2xl max-w-2xl w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-olympus-border pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-olympus-cyan" />
                  <h3 className="font-tech text-lg font-bold text-white uppercase">
                    Payment Verification Screenshot
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedScreenshot(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded bg-olympus-bg"
                >
                  ✕
                </button>
              </div>

              <div className="flex justify-center bg-black/60 rounded-xl p-3 border border-olympus-border/50 max-h-[70vh] overflow-auto">
                <img
                  src={selectedScreenshot}
                  alt="Payment Verification Screenshot"
                  className="max-h-[65vh] object-contain rounded-lg shadow-2xl"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href={selectedScreenshot}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-olympus-cyan hover:underline flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Image in New Tab</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedScreenshot(null)}
                  className="cyber-button px-5 py-2 bg-olympus-blue text-white text-xs font-tech font-bold uppercase"
                >
                  CLOSE PREVIEW
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for viewing detailed team information */}
        {selectedTeam && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-olympus-card border border-olympus-cyan rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-olympus-cyan uppercase">
                    REGISTRATION: {selectedTeam.registration?.regCode}
                  </span>
                  <h3 className="font-tech text-2xl font-bold text-white">
                    {selectedTeam.name}
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Track: {selectedTeam.eventType}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Payment Snapshot Information */}
              <div className="p-3.5 rounded-xl bg-olympus-bg/80 border border-olympus-border space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-tech font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-olympus-cyan" />
                    Payment Snapshot At Registration
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      selectedTeam.registration?.paymentStatus === 'COMPLETED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : selectedTeam.registration?.paymentStatus === 'REJECTED'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}
                  >
                    {selectedTeam.registration?.paymentStatus || 'PENDING'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Fee Captured:</span>
                    <span className="text-green-400 font-bold">
                      ₹{selectedTeam.registration?.registrationFeeAtPayment ?? selectedTeam.registration?.amount ?? 100}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">UTR / Transaction ID:</span>
                    <span className="text-white font-bold select-all">
                      {selectedTeam.registration?.utrNumber || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">UPI Used:</span>
                    <span className="text-slate-300">
                      {selectedTeam.registration?.upiIdAtPayment || 'Default'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Mobile Used:</span>
                    <span className="text-slate-300">
                      {selectedTeam.registration?.paymentMobileAtPayment || 'Default'}
                    </span>
                  </div>
                </div>

                {selectedTeam.registration?.paymentScreenshotUrl && (
                  <div className="pt-2 border-t border-olympus-border flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">Payment Screenshot:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedScreenshot(selectedTeam.registration!.paymentScreenshotUrl!);
                      }}
                      className="px-2.5 py-1 rounded bg-olympus-cyan/10 border border-olympus-cyan/40 text-olympus-cyan text-xs font-mono hover:bg-olympus-cyan hover:text-black font-semibold"
                    >
                      View Screenshot
                    </button>
                  </div>
                )}

                {selectedTeam.registration?.id && (
                  <div className="pt-2 border-t border-olympus-border flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">Update Status:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          await handleUpdatePaymentStatus(selectedTeam.registration!.id, 'COMPLETED');
                          setSelectedTeam(null);
                        }}
                        className="px-2 py-0.5 rounded bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-600 hover:text-white text-[10px] font-mono"
                      >
                        Verify (Completed)
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await handleUpdatePaymentStatus(selectedTeam.registration!.id, 'REJECTED');
                          setSelectedTeam(null);
                        }}
                        className="px-2 py-0.5 rounded bg-red-600/30 border border-red-500/50 text-red-300 hover:bg-red-600 hover:text-white text-[10px] font-mono"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2 border-t border-olympus-border">
                <span className="text-xs font-mono text-slate-400 block uppercase">
                  Participants List ({selectedTeam.participants.length}):
                </span>
                {selectedTeam.participants.map((p, i) => (
                  <div key={i} className="p-2.5 rounded bg-olympus-bg border border-olympus-border text-xs">
                    <div className="font-bold text-white">
                      {p.name} {p.isLeader && <span className="text-olympus-cyan">(LEADER)</span>}
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      {p.email} • {p.phone}
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      {p.branch} — {p.college}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-olympus-border">
                <button
                  type="button"
                  onClick={() => handleDeleteRegistration(selectedTeam)}
                  disabled={deletingId === (selectedTeam.registration?.id || selectedTeam.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-mono font-semibold transition-colors disabled:opacity-50"
                  title="Permanently Delete Registration"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Registration</span>
                </button>

                <button
                  onClick={() => setSelectedTeam(null)}
                  className="cyber-button px-5 py-2 bg-olympus-blue text-white text-xs font-tech font-bold uppercase"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
