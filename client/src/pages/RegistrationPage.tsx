import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Users,
  CreditCard,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Plus,
  Shield,
  Sparkles,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  Smartphone,
  Phone,
  QrCode,
  AtSign,
  Info,
} from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { HUDFrame } from '../components/common/HUDFrame';
import { ParticipantPass } from '../components/pass/ParticipantPass';
import { api } from '../services/api';
import { EventTypeCode, Participant, RegistrationResponseData, EventPaymentConfig, TeamRegistrationPayload } from '../types';
import { EVENT_CONFIG } from '../config/eventConfig';

export const RegistrationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialEvent = (searchParams.get('event') as EventTypeCode) || 'FULL_STACK_AI';

  const [step, setStep] = useState<number>(1);
  const [selectedEvent, setSelectedEvent] = useState<EventTypeCode>(initialEvent);
  const [teamName, setTeamName] = useState<string>('');

  // Team Leader
  const [leader, setLeader] = useState<Participant>({
    name: '',
    email: '',
    phone: '',
    branch: '',
    college: '',
    isLeader: true,
  });

  // Additional members (1 required, up to 3 optional = 2-4 members total)
  const [members, setMembers] = useState<Participant[]>([
    { name: '', email: '', phone: '', branch: '', college: '', isLeader: false },
  ]);

  // Payment Details (Event-Specific)
  const [paymentConfig, setPaymentConfig] = useState<EventPaymentConfig | null>(null);
  const [loadingPayment, setLoadingPayment] = useState<boolean>(false);
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<string>('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [copiedMobile, setCopiedMobile] = useState<boolean>(false);
  // 3 Payment Mode Options: 'qr' | 'upi' | 'mobile'
  const [paymentOption, setPaymentOption] = useState<'qr' | 'upi' | 'mobile'>('qr');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedPass, setConfirmedPass] = useState<RegistrationResponseData | null>(null);

  useEffect(() => {
    const ev = searchParams.get('event') as EventTypeCode;
    if (ev && ['FULL_STACK_AI', 'DRONE_VIDEO', 'DRONE_POSTER'].includes(ev)) {
      setSelectedEvent(ev);
    }
  }, [searchParams]);

  // Fetch Event-specific payment configuration whenever selected event changes or when entering payment step
  useEffect(() => {
    fetchEventPaymentConfig(selectedEvent);
  }, [selectedEvent]);

  const fetchEventPaymentConfig = async (eventKey: EventTypeCode) => {
    setLoadingPayment(true);
    try {
      const data = await api.getEventPayment(eventKey);
      if (data) {
        setPaymentConfig(data);
      } else {
        // Fallback to local default configs
        const isArena1 = eventKey === 'FULL_STACK_AI';
        const fallback = isArena1 ? EVENT_CONFIG.arena01.payment : EVENT_CONFIG.arena02.payment;
        setPaymentConfig({
          id: isArena1 ? 'event-1' : 'event-2',
          code: isArena1 ? 'FULL_STACK_AI' : 'DRONE_EVENT',
          name: isArena1 ? EVENT_CONFIG.arena01.title : EVENT_CONFIG.arena02.title,
          category: isArena1 ? 'Full Stack Development with AI' : 'Drone Technology',
          registrationFee: fallback.registrationFee,
          paymentMobile: fallback.paymentMobile,
          upiId: fallback.upiId,
          qrCodeUrl: fallback.qrCodeUrl,
          paymentInstructions: fallback.paymentInstructions,
          paymentEnabled: fallback.paymentEnabled,
        });
      }
    } catch {
      // Local fallback
      const isArena1 = eventKey === 'FULL_STACK_AI';
      const fallback = isArena1 ? EVENT_CONFIG.arena01.payment : EVENT_CONFIG.arena02.payment;
      setPaymentConfig({
        id: isArena1 ? 'event-1' : 'event-2',
        code: isArena1 ? 'FULL_STACK_AI' : 'DRONE_EVENT',
        name: isArena1 ? EVENT_CONFIG.arena01.title : EVENT_CONFIG.arena02.title,
        category: isArena1 ? 'Full Stack Development with AI' : 'Drone Technology',
        registrationFee: fallback.registrationFee,
        paymentMobile: fallback.paymentMobile,
        upiId: fallback.upiId,
        qrCodeUrl: fallback.qrCodeUrl,
        paymentInstructions: fallback.paymentInstructions,
        paymentEnabled: fallback.paymentEnabled,
      });
    } finally {
      setLoadingPayment(false);
    }
  };

  // Member management
  const handleAddMember = () => {
    if (members.length < 3) {
      setMembers([
        ...members,
        { name: '', email: '', phone: '', branch: '', college: '', isLeader: false },
      ]);
    }
  };

  const handleRemoveMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const handleMemberChange = (index: number, field: keyof Participant, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  // Step 2 validation
  const validateTeamDetails = (): boolean => {
    setErrorMsg(null);

    if (!teamName.trim() || teamName.trim().length < 2) {
      setErrorMsg('Please enter a valid Team Name (minimum 2 characters).');
      return false;
    }

    if (!leader.name.trim() || !leader.email.trim() || !leader.phone.trim() || !leader.branch.trim() || !leader.college.trim()) {
      setErrorMsg('Please fill in all Team Leader information fields.');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leader.email)) {
      setErrorMsg('Please enter a valid email address for the Team Leader.');
      return false;
    }

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name.trim() || !m.email.trim() || !m.phone.trim() || !m.branch.trim() || !m.college.trim()) {
        setErrorMsg(`Please fill in all fields for Member ${i + 2}.`);
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email)) {
        setErrorMsg(`Please enter a valid email address for Member ${i + 2}.`);
        return false;
      }
    }

    return true;
  };

  // Screenshot File Upload Handling
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Invalid file format. Please upload JPG, PNG, or WEBP image.');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg(`Screenshot size exceeds 10 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const resultStr = reader.result as string;
      setPaymentScreenshot(resultStr);
      setScreenshotPreview(resultStr);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setPaymentScreenshot('');
    setScreenshotPreview(null);
  };

  const handleCopyUpi = () => {
    if (paymentConfig?.upiId) {
      navigator.clipboard.writeText(paymentConfig.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

  const handleCopyMobile = () => {
    if (paymentConfig?.paymentMobile) {
      navigator.clipboard.writeText(paymentConfig.paymentMobile);
      setCopiedMobile(true);
      setTimeout(() => setCopiedMobile(false), 2500);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      window.scrollTo({ top: 150, behavior: 'smooth' });
    } else if (step === 2) {
      if (validateTeamDetails()) {
        // Re-fetch payment info to ensure latest rate is loaded
        fetchEventPaymentConfig(selectedEvent);
        setStep(3);
        window.scrollTo({ top: 150, behavior: 'smooth' });
      }
    }
  };

  const handleSubmit = async () => {
    setErrorMsg(null);

    // Validate Payment Status
    if (paymentConfig && !paymentConfig.paymentEnabled) {
      setErrorMsg('Online payment is temporarily unavailable for this event. Please contact the organizers.');
      return;
    }

    // Validate UTR Number
    if (!utrNumber.trim() || utrNumber.trim().length < 4) {
      setErrorMsg('Please enter a valid 12-digit UTR or Transaction Reference ID.');
      return;
    }

    // Validate Screenshot
    if (!paymentScreenshot) {
      setErrorMsg('Payment verification screenshot is mandatory. Please upload your payment receipt.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: TeamRegistrationPayload = {
        eventType: selectedEvent,
        teamName: teamName.trim(),
        leader,
        members,
        utrNumber: utrNumber.trim(),
        paymentScreenshot,
      };

      const res = await api.registerTeam(payload);

      if (res.success && res.data) {
        setConfirmedPass(res.data);
        setStep(4);
        window.scrollTo({ top: 100, behavior: 'smooth' });
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00F0FF', '#0066FF', '#FFFFFF', '#67E8F9'],
        });
      } else {
        setErrorMsg(res.message || 'Registration failed. Please verify details.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error submitting registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalMembersCount = 1 + members.length;
  const currentFeePerParticipant = paymentConfig?.registrationFee ?? 100;
  const totalAmount = totalMembersCount * currentFeePerParticipant;

  const eventOptions = [
    {
      id: 'FULL_STACK_AI' as EventTypeCode,
      title: 'Full Stack Development with AI',
      category: 'ARENA 01',
      desc: 'Three-round software challenge: Frontend -> Backend/API -> Cloud Deployment & Jury Defense.',
    },
    {
      id: 'DRONE_VIDEO' as EventTypeCode,
      title: "Engineer's Got Talent — Video Making",
      category: 'ARENA 02',
      desc: 'Cinematography and technical video showcase based on Drone Technology principles.',
    },
    {
      id: 'DRONE_POSTER' as EventTypeCode,
      title: "Engineer's Got Talent — Poster Making",
      category: 'ARENA 02',
      desc: 'Innovative infographics and UAV conceptual schematics on Drone Technology.',
    },
  ];

  return (
    <div className="pt-28 pb-20 bg-olympus-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="PORTAL ACCESS"
          title="OLYMPUS 2026"
          highlight="REGISTRATION"
          subtitle="Complete team enrollment and generate your official participant digital pass."
          align="center"
        />

        {/* Wizard Step Indicator */}
        {step < 4 && (
          <div className="mb-10 flex items-center justify-between max-w-xl mx-auto px-4 relative">
            <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-olympus-border -translate-y-1/2 z-0" />

            {[
              { num: 1, label: 'Track' },
              { num: 2, label: 'Team' },
              { num: 3, label: 'Payment' },
            ].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-all ${
                    step === s.num
                      ? 'bg-olympus-blue text-white border-2 border-olympus-cyan shadow-cyan-glow'
                      : step > s.num
                      ? 'bg-olympus-card text-olympus-cyan border border-olympus-cyan'
                      : 'bg-olympus-card text-slate-500 border border-olympus-border'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span
                  className={`text-[11px] font-mono mt-1.5 uppercase ${
                    step >= s.num ? 'text-olympus-cyan font-semibold' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="mb-8 p-4 rounded-xl bg-red-950/40 border border-red-500/50 flex items-center gap-3 text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: CHOOSE EVENT */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="font-tech text-2xl font-bold text-white uppercase">
                Step 1: Choose Your Competitive Track
              </h3>
              <p className="text-sm text-slate-400">
                Select the competition domain you wish to register your team for.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {eventOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedEvent(opt.id)}
                  className={`cursor-pointer p-5 rounded-xl border transition-all ${
                    selectedEvent === opt.id
                      ? 'bg-olympus-blue/15 border-olympus-cyan shadow-cyan-glow'
                      : 'bg-olympus-card border-olympus-border hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono tracking-wider text-olympus-cyan font-semibold uppercase">
                        {opt.category}
                      </span>
                      <h4 className="font-tech text-xl font-bold text-white mt-1">
                        {opt.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 max-w-xl">
                        {opt.desc}
                      </p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                        selectedEvent === opt.id
                          ? 'border-olympus-cyan bg-olympus-cyan'
                          : 'border-slate-500'
                      }`}
                    >
                      {selectedEvent === opt.id && (
                        <div className="w-2 h-2 rounded-full bg-olympus-bg" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6 border-t border-olympus-border">
              <button
                type="button"
                onClick={handleNext}
                className="cyber-button px-8 py-3 bg-olympus-blue hover:bg-olympus-blue-light text-white font-tech text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-blue-glow"
              >
                <span>PROCEED TO TEAM DETAILS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: FILL TEAM DETAILS */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h3 className="font-tech text-2xl font-bold text-white uppercase">
                Step 2: Team Roster & Contact Details
              </h3>
              <p className="text-sm text-slate-400">
                Teams must consist of 2 to 4 members. Fill in details accurately for badge generation.
              </p>
            </div>

            {/* Team Name Input */}
            <div className="p-6 rounded-xl bg-olympus-card border border-olympus-border">
              <label className="block text-xs font-mono uppercase text-olympus-cyan mb-2 font-semibold">
                Team Name *
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. CyberKnights, SkyGliders, NeuralSquad"
                className="w-full px-4 py-3 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white font-mono text-sm outline-none transition-colors"
              />
            </div>

            {/* Team Leader Details */}
            <HUDFrame tag="TEAM LEADER (MEMBER 01)" glow={true} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={leader.name}
                    onChange={(e) => setLeader({ ...leader, name: e.target.value })}
                    placeholder="Candidate Name"
                    className="w-full px-3.5 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={leader.email}
                    onChange={(e) => setLeader({ ...leader, email: e.target.value })}
                    placeholder="official.email@college.edu"
                    className="w-full px-3.5 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    value={leader.phone}
                    onChange={(e) => setLeader({ ...leader, phone: e.target.value })}
                    placeholder="10-digit Phone"
                    className="w-full px-3.5 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Branch / Department *
                  </label>
                  <input
                    type="text"
                    value={leader.branch}
                    onChange={(e) => setLeader({ ...leader, branch: e.target.value })}
                    placeholder="e.g. ECE, CSE, IT, Mechanical"
                    className="w-full px-3.5 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-sm outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    College / Institution *
                  </label>
                  <input
                    type="text"
                    value={leader.college}
                    onChange={(e) => setLeader({ ...leader, college: e.target.value })}
                    placeholder="Full College / University Name"
                    className="w-full px-3.5 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-sm outline-none"
                  />
                </div>
              </div>
            </HUDFrame>

            {/* Additional Members */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-300 font-semibold">
                  Additional Team Members (Minimum 1, Maximum 3)
                </span>
                <span className="text-xs font-mono text-olympus-cyan">
                  {members.length + 1} of 4 Members
                </span>
              </div>

              {members.map((m, idx) => (
                <HUDFrame
                  key={idx}
                  tag={`MEMBER 0${idx + 2}`}
                  className="p-6 relative space-y-4"
                >
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(idx)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-400 transition-colors p-1"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={m.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        placeholder="Member Name"
                        className="w-full px-3.5 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={m.email}
                        onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                        placeholder="member@college.edu"
                        className="w-full px-3.5 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        value={m.phone}
                        onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                        placeholder="10-digit Phone"
                        className="w-full px-3.5 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Branch *
                      </label>
                      <input
                        type="text"
                        value={m.branch}
                        onChange={(e) => handleMemberChange(idx, 'branch', e.target.value)}
                        placeholder="e.g. ECE, CSE, etc."
                        className="w-full px-3.5 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-sm outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        College / Institution *
                      </label>
                      <input
                        type="text"
                        value={m.college}
                        onChange={(e) => handleMemberChange(idx, 'college', e.target.value)}
                        placeholder="College Name"
                        className="w-full px-3.5 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-sm outline-none"
                      />
                    </div>
                  </div>
                </HUDFrame>
              ))}

              {members.length < 3 && (
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="w-full py-3 rounded-xl border border-dashed border-olympus-cyan/40 hover:border-olympus-cyan bg-olympus-cyan/5 text-olympus-cyan font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD MEMBER ({members.length + 2} OF 4 MAXIMUM)</span>
                </button>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-olympus-border">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="cyber-button px-6 py-2.5 bg-olympus-card hover:bg-olympus-cardHover border border-olympus-border text-slate-300 hover:text-white text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="cyber-button px-8 py-3 bg-olympus-blue hover:bg-olympus-blue-light text-white font-tech text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-blue-glow"
              >
                <span>PROCEED TO PAYMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: EVENT-SPECIFIC PAYMENT & SCREENSHOT */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center mb-6">
              <span className="text-xs font-mono tracking-widest text-olympus-cyan uppercase block mb-1">
                // ARENA PAYMENT VERIFICATION
              </span>
              <h3 className="font-tech text-2xl sm:text-3xl font-bold text-white uppercase">
                Step 3: Complete Event Registration Payment
              </h3>
              <p className="text-sm text-slate-400 mt-1 max-w-lg mx-auto">
                Pay using the event-specific details below. Upload your payment screenshot and enter the transaction UTR number to complete registration.
              </p>
            </div>

            {/* Offline or Unavailable Notice */}
            {paymentConfig && !paymentConfig.paymentEnabled ? (
              <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-500/60 text-amber-200 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <h4 className="font-tech text-xl font-bold uppercase text-white">Payment Temporarily Disabled</h4>
                <p className="text-sm">
                  Online payment is temporarily unavailable for this event. Please contact the organizers.
                </p>
                <div className="text-xs font-mono text-amber-300">
                  Helpdesk: ece.olympus2026@sveri.ac.in
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Event Payment Details & Scan */}
                <div className="lg:col-span-6 space-y-6">
                  <HUDFrame tag="PAYMENT DETAILS" glow={true} className="p-6 space-y-5">
                    {/* Event Track Badge */}
                    <div className="flex items-center justify-between pb-3 border-b border-olympus-border">
                      <span className="text-[11px] font-mono text-slate-400 uppercase">
                        SELECTED TRACK
                      </span>
                      <span className="text-xs font-mono font-bold text-olympus-cyan uppercase px-2 py-0.5 rounded bg-olympus-cyan/10 border border-olympus-cyan/30">
                        {paymentConfig?.name || eventOptions.find((e) => e.id === selectedEvent)?.title}
                      </span>
                    </div>

                    {/* Registration Fee Breakdown */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-olympus-bg/80 border border-olympus-border">
                      <div>
                        <span className="text-xs font-mono text-slate-400 block uppercase">
                          Registration Fee
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          ₹{currentFeePerParticipant} × {totalMembersCount} participants ({leader.name} + {members.length} members)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-tech text-3xl font-extrabold text-olympus-cyan">
                          ₹{totalAmount}
                        </span>
                      </div>
                    </div>

                    {/* 3 Payment Options Selector */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider font-semibold">
                          SELECT PAYMENT METHOD
                        </span>
                        <span className="text-[10px] font-mono text-olympus-cyan">
                          {paymentOption === 'qr' && 'OPTION 1/3: QR SCANNER'}
                          {paymentOption === 'upi' && 'OPTION 2/3: UPI ID'}
                          {paymentOption === 'mobile' && 'OPTION 3/3: MOBILE NUMBER'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-slate-950/80 border border-olympus-border">
                        {/* 1. QR Scanner Option */}
                        <button
                          type="button"
                          onClick={() => setPaymentOption('qr')}
                          className={`py-2 px-2 rounded-lg text-xs font-mono font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                            paymentOption === 'qr'
                              ? 'bg-olympus-cyan/20 text-olympus-cyan border border-olympus-cyan shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                          }`}
                        >
                          <QrCode className="w-4 h-4 shrink-0" />
                          <span className="uppercase text-[11px] sm:text-xs">QR Scanner</span>
                        </button>

                        {/* 2. UPI ID Option */}
                        <button
                          type="button"
                          onClick={() => setPaymentOption('upi')}
                          className={`py-2 px-2 rounded-lg text-xs font-mono font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                            paymentOption === 'upi'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                          }`}
                        >
                          <AtSign className="w-4 h-4 shrink-0" />
                          <span className="uppercase text-[11px] sm:text-xs">UPI ID</span>
                        </button>

                        {/* 3. Mobile Number Option */}
                        <button
                          type="button"
                          onClick={() => setPaymentOption('mobile')}
                          className={`py-2 px-2 rounded-lg text-xs font-mono font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                            paymentOption === 'mobile'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                          }`}
                        >
                          <Smartphone className="w-4 h-4 shrink-0" />
                          <span className="uppercase text-[11px] sm:text-xs">Mobile No.</span>
                        </button>
                      </div>
                    </div>

                    {/* OPTION 1: QR SCANNER VIEW */}
                    {paymentOption === 'qr' && (
                      <div className="p-4 rounded-xl bg-olympus-bg/90 border border-olympus-cyan/40 space-y-4">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-olympus-cyan font-bold flex items-center gap-1.5">
                            <QrCode className="w-3.5 h-3.5" />
                            PAY VIA QR SCANNER
                          </span>
                          <span className="text-slate-400">
                            Amount: <strong className="text-white">₹{totalAmount}</strong>
                          </span>
                        </div>

                        <div className="text-center pt-1">
                          <div className="inline-block p-3 rounded-2xl bg-white/95 shadow-cyan-glow border-2 border-olympus-cyan/50">
                            {paymentConfig?.qrCodeUrl ? (
                              <img
                                src={paymentConfig.qrCodeUrl}
                                alt="Event Payment QR Code"
                                className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
                              />
                            ) : (
                              <div className="w-48 h-48 flex items-center justify-center text-slate-600 font-mono text-xs">
                                No QR Code Uploaded
                              </div>
                            )}
                          </div>
                          <span className="block text-[11px] font-mono text-slate-300 mt-2 font-medium">
                            Scan with Google Pay • PhonePe • Paytm • BHIM • Banking Apps
                          </span>
                        </div>
                      </div>
                    )}

                    {/* OPTION 2: UPI ID VIEW */}
                    {paymentOption === 'upi' && (
                      <div className="p-4 rounded-xl bg-olympus-bg/90 border border-purple-500/40 space-y-4">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-purple-300 font-bold flex items-center gap-1.5">
                            <AtSign className="w-3.5 h-3.5" />
                            PAY VIA UPI ID
                          </span>
                          <span className="text-slate-400">
                            Amount: <strong className="text-white">₹{totalAmount}</strong>
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono text-slate-400 block uppercase">
                              Official Event UPI ID
                            </span>
                            <span className="font-mono text-base font-bold text-white break-all tracking-wide">
                              {paymentConfig?.upiId || 'olympus.ece@upi'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className={`cyber-button px-3.5 py-2 text-xs font-mono font-semibold uppercase flex items-center justify-center gap-1.5 transition-all shrink-0 ${
                              copiedUpi
                                ? 'bg-green-600 text-white border-green-500'
                                : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50'
                            }`}
                          >
                            {copiedUpi ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>UPI ID Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy UPI ID</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                          <span className="text-purple-300 font-bold block mb-1">// Quick Steps:</span>
                          <p>1. Click <strong className="text-white">Copy UPI ID</strong> above.</p>
                          <p>2. Open your UPI app (GPay, PhonePe, Paytm, etc.).</p>
                          <p>3. Choose <strong className="text-white">Pay to UPI ID / VPA</strong> and paste.</p>
                          <p>4. Send exact registration fee: <strong className="text-white">₹{totalAmount}</strong>.</p>
                        </div>
                      </div>
                    )}

                    {/* OPTION 3: MOBILE NUMBER VIEW */}
                    {paymentOption === 'mobile' && (
                      <div className="p-4 rounded-xl bg-olympus-bg/90 border border-emerald-500/40 space-y-4">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5" />
                            PAY VIA MOBILE NUMBER
                          </span>
                          <span className="text-slate-400">
                            Amount: <strong className="text-white">₹{totalAmount}</strong>
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 block uppercase">
                              Official Payment Mobile Number
                            </span>
                            <span className="font-mono text-xl font-bold text-white tracking-widest">
                              {paymentConfig?.paymentMobile || '9876543210'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleCopyMobile}
                              className={`cyber-button px-3.5 py-2 text-xs font-mono font-semibold uppercase flex items-center justify-center gap-1.5 transition-all shrink-0 ${
                                copiedMobile
                                  ? 'bg-green-600 text-white border-green-500'
                                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                              }`}
                            >
                              {copiedMobile ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Number Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Number</span>
                                </>
                              )}
                            </button>

                            <a
                              href={`tel:${paymentConfig?.paymentMobile || '9876543210'}`}
                              className="px-3.5 py-2 rounded text-xs font-mono text-slate-300 hover:text-white bg-slate-800 border border-slate-700 hover:border-emerald-500 flex items-center gap-1.5 transition-all"
                              title="Dial phone number"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Dial</span>
                            </a>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                          <span className="text-emerald-300 font-bold block mb-1">// Quick Steps:</span>
                          <p>1. Click <strong className="text-white">Copy Number</strong> above.</p>
                          <p>2. Open PhonePe, Google Pay, or Paytm.</p>
                          <p>3. Select <strong className="text-white">To Mobile Number / Contact</strong> and paste.</p>
                          <p>4. Send exact registration fee: <strong className="text-white">₹{totalAmount}</strong>.</p>
                        </div>
                      </div>
                    )}

                    {/* Payment Instructions */}
                    <div className="p-3.5 rounded-xl bg-olympus-bg/90 border border-olympus-border/70 text-xs text-slate-300 leading-relaxed space-y-1">
                      <div className="flex items-center gap-1.5 text-olympus-cyan font-mono font-semibold text-[11px] mb-1">
                        <Info className="w-3.5 h-3.5" />
                        <span>PAYMENT INSTRUCTIONS</span>
                      </div>
                      <p>
                        {paymentConfig?.paymentInstructions ||
                          'Complete the payment using the QR code, UPI ID, or payment mobile number shown above. Then enter the UTR / Transaction ID and upload the payment confirmation screenshot.'}
                      </p>
                    </div>
                  </HUDFrame>
                </div>

                {/* Right Column: Transaction Details & Screenshot Upload */}
                <div className="lg:col-span-6 space-y-6">
                  <HUDFrame tag="TRANSACTION PROOF" glow={true} className="p-6 space-y-5">
                    <div>
                      <label className="block text-xs font-mono uppercase text-olympus-cyan mb-2 font-semibold">
                        UTR / Transaction ID *
                      </label>
                      <input
                        type="text"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="e.g. 260924123456 or UPI Reference No."
                        className="w-full px-4 py-3 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white font-mono text-sm outline-none uppercase tracking-wider"
                      />
                      <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                        Enter the 12-digit UTR reference or Transaction ID found on your payment receipt.
                      </span>
                    </div>

                    {/* Payment Screenshot Upload */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-olympus-cyan mb-2 font-semibold">
                        Upload Payment Screenshot *
                      </label>

                      {screenshotPreview ? (
                        <div className="p-4 rounded-xl bg-olympus-bg border border-olympus-cyan/50 space-y-3">
                          <div className="relative rounded-lg overflow-hidden border border-olympus-border max-h-60 bg-black flex items-center justify-center">
                            <img
                              src={screenshotPreview}
                              alt="Payment Screenshot Preview"
                              className="max-h-56 max-w-full object-contain"
                            />
                          </div>

                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-green-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              SCREENSHOT ATTACHED
                            </span>

                            <button
                              type="button"
                              onClick={handleRemoveScreenshot}
                              className="text-red-400 hover:text-red-300 underline font-mono text-xs"
                            >
                              Remove / Replace
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-olympus-border hover:border-olympus-cyan bg-olympus-card/50 hover:bg-olympus-card cursor-pointer transition-all">
                          <Upload className="w-8 h-8 text-olympus-cyan mb-2 animate-pulse" />
                          <span className="font-tech text-sm font-bold text-white uppercase">
                            Select Payment Receipt Image
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 mt-1">
                            Accepted: JPG, JPEG, PNG, WEBP (Max 10 MB)
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/jpg"
                            onChange={handleScreenshotChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Summary Card */}
                    <div className="p-4 rounded-xl bg-olympus-bg/80 border border-olympus-border space-y-2 text-xs font-mono text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Team:</span>
                        <span className="font-bold text-white uppercase">{teamName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Participants:</span>
                        <span className="text-white">{totalMembersCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Amount:</span>
                        <span className="text-olympus-cyan font-bold">₹{totalAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Verification Status:</span>
                        <span className="text-amber-400">PENDING AUDIT VERIFICATION</span>
                      </div>
                    </div>
                  </HUDFrame>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-olympus-border">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={isSubmitting}
                className="cyber-button px-6 py-2.5 bg-olympus-card hover:bg-olympus-cardHover border border-olympus-border text-slate-300 hover:text-white text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>EDIT TEAM DETAILS</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || (paymentConfig !== null && !paymentConfig.paymentEnabled)}
                className="cyber-button px-8 py-3.5 bg-gradient-to-r from-olympus-blue to-olympus-cyan hover:opacity-95 text-white font-tech text-base font-bold uppercase tracking-wider flex items-center gap-2 shadow-cyan-glow disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>VERIFYING & GENERATING PASS...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>CONFIRM & SUBMIT REGISTRATION</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION & PASS */}
        {step === 4 && confirmedPass && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-olympus-cyan/15 border border-olympus-cyan flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-olympus-cyan animate-bounce" />
              </div>

              <h2 className="font-tech text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
                REGISTRATION SUCCESSFUL!
              </h2>

              <p className="text-slate-300 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                Your team has been officially registered in the OLYMPUS system. Your payment is submitted with UTR{' '}
                <span className="font-mono text-olympus-cyan font-bold">{confirmedPass.utrNumber}</span> and queued for verification.
              </p>
            </div>

            {/* Generated Pass */}
            <ParticipantPass
              registrationId={confirmedPass.registrationId}
              teamCode={confirmedPass.teamCode}
              teamName={confirmedPass.teamName}
              eventType={confirmedPass.eventType}
              participants={confirmedPass.participants}
              createdAt={confirmedPass.createdAt}
            />

            {/* Action Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <Link
                to={`/dashboard?code=${confirmedPass.registrationId}`}
                className="cyber-button px-6 py-2.5 bg-olympus-card hover:bg-olympus-cardHover border border-olympus-border hover:border-olympus-cyan text-white text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <span>OPEN PARTICIPANT DASHBOARD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/"
                className="cyber-button px-6 py-2.5 bg-transparent border border-white/20 hover:border-white text-slate-300 hover:text-white text-xs font-tech font-bold uppercase tracking-wider"
              >
                RETURN HOME
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
