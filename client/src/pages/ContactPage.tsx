import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  Shield,
  Code2,
  Plane,
  UserRound,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { HUDFrame } from '../components/common/HUDFrame';
import { coordinators, Coordinator } from '../data/coordinators';
import { EVENT_CONFIG } from '../config/eventConfig';

export const ContactPage: React.FC = () => {
  // SEO Page Title & Meta description
  useEffect(() => {
    document.title = 'Contact | OLYMPUS 2026';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Contact the OLYMPUS ECE Department event coordinators for registration, Full Stack Development with AI and Engineer’s Got Talent — Drone Technology.'
      );
    }
    return () => {
      document.title = 'OLYMPUS 2026 | ECE DEPARTMENT | BUILD. CREATE. CONQUER.';
    };
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    eventCategory: 'General Event Query',
    message: '',
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const wholeEventCoordinator = coordinators.find((c) => c.type === 'general')!;
  const eventCoordinators = coordinators.filter((c) => c.type !== 'general');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setFormError('Please enter your full name (minimum 2 characters).');
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setFormError('Please provide a message with at least 10 characters.');
      return;
    }

    setFormStatus('loading');

    // Simulate reliable dispatch
    setTimeout(() => {
      setFormStatus('success');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        eventCategory: 'General Event Query',
        message: '',
      });
    }, 900);
  };

  return (
    <div className="pt-28 pb-20 bg-olympus-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <SectionHeader
          badge="COORDINATION DESK"
          title="CONTACT THE"
          highlight="OLYMPUS TEAM"
          subtitle="Have questions about registration, events, rules or participation? Contact the appropriate coordinator below."
          align="center"
        />

        {/* ============================================================== */}
        {/* 1. WHOLE EVENT COORDINATOR (Prominent Highlighted Card) */}
        {/* ============================================================== */}
        <div className="mb-14">
          <HUDFrame
            tag="CHIEF CONVENER"
            glow={true}
            className="p-8 sm:p-10 border-olympus-cyan/60 bg-gradient-to-b from-olympus-card via-[#0A122A] to-olympus-bg relative overflow-hidden group hover:border-olympus-cyan transition-all duration-300"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-olympus-cyan/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-olympus-cyan/10 border border-olympus-cyan/40 text-xs font-mono text-olympus-cyan uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{wholeEventCoordinator.role}</span>
                </div>

                <h3 className="font-tech text-3xl sm:text-4xl font-extrabold text-white tracking-wide uppercase">
                  {wholeEventCoordinator.name}
                </h3>

                <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                  {wholeEventCoordinator.description}
                </p>

                {/* Direct Contact Links */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2 font-mono text-xs text-slate-300">
                  <a
                    href={`mailto:${wholeEventCoordinator.email}`}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-olympus-bg/80 border border-olympus-border hover:border-olympus-cyan hover:text-white transition-colors group/link"
                  >
                    <Mail className="w-4 h-4 text-olympus-cyan group-hover/link:animate-pulse" />
                    <span className="truncate">{wholeEventCoordinator.email}</span>
                  </a>

                  <a
                    href={`tel:${wholeEventCoordinator.phone}`}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-olympus-bg/80 border border-olympus-border hover:border-olympus-cyan hover:text-white transition-colors group/link"
                  >
                    <Phone className="w-4 h-4 text-olympus-cyan group-hover/link:animate-bounce" />
                    <span>+91 {wholeEventCoordinator.phone}</span>
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-56 shrink-0">
                <a
                  href={`tel:${wholeEventCoordinator.phone}`}
                  className="cyber-button px-6 py-3.5 bg-olympus-blue hover:bg-olympus-blue-light text-white font-tech text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-blue-glow transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>CALL COORDINATOR</span>
                </a>

                <a
                  href={`mailto:${wholeEventCoordinator.email}`}
                  className="cyber-button px-6 py-3.5 bg-olympus-card hover:bg-olympus-cardHover border border-olympus-cyan/50 hover:border-olympus-cyan text-slate-200 hover:text-white font-tech text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <Mail className="w-4 h-4 text-olympus-cyan" />
                  <span>EMAIL COORDINATOR</span>
                </a>
              </div>
            </div>
          </HUDFrame>
        </div>

        {/* ============================================================== */}
        {/* 2 & 3. EVENT SPECIFIC COORDINATORS */}
        {/* ============================================================== */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <span className="text-[11px] font-mono tracking-widest text-olympus-cyan uppercase block mb-1">
              // DOMAIN SPECIALISTS
            </span>
            <h3 className="font-tech text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
              EVENT TRACK COORDINATORS
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {eventCoordinators.map((coordinator) => (
              <HUDFrame
                key={coordinator.type}
                tag={coordinator.tag}
                className="p-7 flex flex-col justify-between hover:border-olympus-cyan/70 hover:shadow-cyan-glow transition-all duration-300 group"
              >
                <div>
                  {/* Header Badge */}
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="px-2.5 py-1 rounded bg-olympus-blue/20 border border-olympus-blue/40 text-xs font-mono text-olympus-cyan uppercase">
                      {coordinator.role}
                    </span>
                    <div className="p-2 rounded-lg bg-olympus-bg border border-olympus-border group-hover:border-olympus-cyan/50 transition-colors">
                      {coordinator.type === 'full-stack' ? (
                        <Code2 className="w-5 h-5 text-olympus-cyan" />
                      ) : (
                        <Plane className="w-5 h-5 text-olympus-cyan" />
                      )}
                    </div>
                  </div>

                  {coordinator.theme && (
                    <span className="text-[10px] font-mono text-olympus-cyan uppercase tracking-widest block mb-1">
                      THEME: {coordinator.theme}
                    </span>
                  )}

                  <h4 className="font-tech text-2xl font-bold text-white uppercase mb-1">
                    {coordinator.eventTitle}
                  </h4>

                  <div className="mt-3 mb-4">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      LEAD COORDINATOR:
                    </span>
                    <span className="font-tech text-xl font-bold text-slate-100 uppercase">
                      {coordinator.name}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-light mb-6">
                    {coordinator.description}
                  </p>

                  {/* Direct Contact Info */}
                  <div className="space-y-2 py-4 border-t border-olympus-border/60 text-xs font-mono">
                    <a
                      href={`mailto:${coordinator.email}`}
                      className="flex items-center gap-2.5 text-slate-300 hover:text-olympus-cyan transition-colors truncate"
                    >
                      <Mail className="w-4 h-4 text-olympus-cyan shrink-0" />
                      <span className="truncate">{coordinator.email}</span>
                    </a>

                    <a
                      href={`tel:${coordinator.phone}`}
                      className="flex items-center gap-2.5 text-slate-300 hover:text-olympus-cyan transition-colors"
                    >
                      <Phone className="w-4 h-4 text-olympus-cyan shrink-0" />
                      <span>+91 {coordinator.phone}</span>
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6">
                  <a
                    href={`tel:${coordinator.phone}`}
                    className="cyber-button py-3 bg-olympus-blue hover:bg-olympus-blue-light text-white text-xs font-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-blue-glow transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>CALL</span>
                  </a>

                  <a
                    href={`mailto:${coordinator.email}`}
                    className="cyber-button py-3 bg-olympus-card hover:bg-olympus-cardHover border border-olympus-border hover:border-olympus-cyan text-slate-200 hover:text-white text-xs font-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-olympus-cyan" />
                    <span>EMAIL</span>
                  </a>
                </div>
              </HUDFrame>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 5. CONTACT FORM */}
        {/* ============================================================== */}
        <div className="mb-20" id="contact-form">
          <HUDFrame tag="MESSAGE TRANSMISSION" glow={false} className="p-8 sm:p-10 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-[10px] font-mono tracking-widest text-olympus-cyan uppercase block mb-1">
                // DIRECT COMMUNICATION
              </span>
              <h3 className="font-tech text-3xl font-extrabold text-white uppercase tracking-wide">
                SEND US A MESSAGE
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 font-light">
                Fill in the form below and the respective coordinator will get back to you promptly.
              </p>
            </div>

            {formStatus === 'success' && (
              <div className="mb-6 p-4 rounded-xl bg-green-950/40 border border-green-500/50 flex items-center gap-3 text-green-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                <div>
                  <span className="font-bold block">Transmission Successful!</span>
                  <span>Thank you! Your message has been received. An event coordinator will reach out shortly.</span>
                </div>
              </div>
            )}

            {formError && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/50 flex items-center gap-3 text-red-200 text-sm">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1.5 uppercase">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Aditi Kulkarni"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-xs outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1.5 uppercase">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="aditi@college.edu"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-xs outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1.5 uppercase">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-xs outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1.5 uppercase">
                    Select Event Track *
                  </label>
                  <select
                    name="eventCategory"
                    value={formData.eventCategory}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-xs outline-none transition-colors"
                  >
                    <option value="General Event Query">General Event Query</option>
                    <option value="Full Stack Development with AI">Full Stack Development with AI</option>
                    <option value="Engineer's Got Talent — Video Making">Engineer's Got Talent — Video Making</option>
                    <option value="Engineer's Got Talent — Poster Making">Engineer's Got Talent — Poster Making</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 uppercase">
                  Message / Inquiry *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your query regarding rules, team size, venue, or evaluation rounds..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-xs outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'loading'}
                className="w-full cyber-button py-3.5 bg-gradient-to-r from-olympus-blue to-olympus-blue-light hover:from-olympus-blue-light hover:to-olympus-cyan text-white font-tech text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-blue-glow transition-all disabled:opacity-50"
              >
                {formStatus === 'loading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>TRANSMITTING MESSAGE...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SEND MESSAGE</span>
                  </>
                )}
              </button>
            </form>
          </HUDFrame>
        </div>

        {/* ============================================================== */}
        {/* 6. QUICK CONTACT */}
        {/* ============================================================== */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <span className="text-[11px] font-mono tracking-widest text-olympus-cyan uppercase block mb-1">
              // INSTANT CHANNELS
            </span>
            <h3 className="font-tech text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
              QUICK CONTACT
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <HUDFrame tag="PHONE SUPPORT" className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-olympus-blue/20 border border-olympus-cyan/40 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-olympus-cyan" />
              </div>
              <h4 className="font-tech text-xl font-bold text-white uppercase mb-2">
                CALL
              </h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Talk directly with our event coordinators during operating hours.
              </p>
              <div className="space-y-1 font-mono text-xs text-olympus-cyan font-bold">
                <div>+91 {wholeEventCoordinator.phone} (General)</div>
                <div>+91 {eventCoordinators[0].phone} (Full Stack)</div>
                <div>+91 {eventCoordinators[1].phone} (Drone Tech)</div>
              </div>
            </HUDFrame>

            <HUDFrame tag="ELECTRONIC MAIL" className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-olympus-blue/20 border border-olympus-cyan/40 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-olympus-cyan" />
              </div>
              <h4 className="font-tech text-xl font-bold text-white uppercase mb-2">
                EMAIL
              </h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Send your event-related questions and receive formal written clarification.
              </p>
              <div className="space-y-1 font-mono text-xs text-slate-300">
                <div className="truncate text-olympus-cyan">{wholeEventCoordinator.email}</div>
                <div className="truncate text-slate-400">{eventCoordinators[0].email}</div>
                <div className="truncate text-slate-400">{eventCoordinators[1].email}</div>
              </div>
            </HUDFrame>

            <HUDFrame tag="LOCATION & VENUE" className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-olympus-blue/20 border border-olympus-cyan/40 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-olympus-cyan" />
              </div>
              <h4 className="font-tech text-xl font-bold text-white uppercase mb-2">
                EVENT INFORMATION
              </h4>
              <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                ECE Department — OLYMPUS
              </p>
              <div className="text-xs font-mono text-olympus-cyan font-semibold">
                {EVENT_CONFIG.venue}
              </div>
              <span className="text-[10px] font-mono text-slate-500 block mt-2">
                {EVENT_CONFIG.institution}
              </span>
            </HUDFrame>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 7. FAQ SHORTCUT */}
        {/* ============================================================== */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-olympus-card via-[#091128] to-olympus-card border border-olympus-border text-center">
          <div className="w-12 h-12 rounded-full bg-olympus-cyan/10 border border-olympus-cyan/30 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-6 h-6 text-olympus-cyan" />
          </div>

          <h3 className="font-tech text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wide">
            STILL HAVE QUESTIONS?
          </h3>

          <p className="text-slate-300 text-sm mt-2 max-w-lg mx-auto font-light leading-relaxed">
            Check the rules and frequently asked questions before contacting the coordinators.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Link
              to="/rules"
              className="w-full sm:w-auto cyber-button px-6 py-2.5 bg-olympus-card hover:bg-olympus-cardHover border border-olympus-border hover:border-olympus-cyan text-slate-200 hover:text-white font-tech text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <BookOpen className="w-4 h-4 text-olympus-cyan" />
              <span>VIEW RULES</span>
            </Link>

            <Link
              to="/faq"
              className="w-full sm:w-auto cyber-button px-6 py-2.5 bg-olympus-blue hover:bg-olympus-blue-light text-white font-tech text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-blue-glow transition-all"
            >
              <HelpCircle className="w-4 h-4" />
              <span>VIEW FAQ</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
