import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  QrCode,
  Smartphone,
  Info,
  Edit3,
  Check,
  X,
  Upload,
  Trash2,
  ShieldAlert,
  Sparkles,
  Clock,
  User,
  AlertCircle,
  Eye,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { HUDFrame } from '../common/HUDFrame';
import { api } from '../../services/api';
import { EventPaymentConfig } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface PaymentSettingsTabProps {
  onRefresh?: () => void;
}

export const PaymentSettingsTab: React.FC<PaymentSettingsTabProps> = ({ onRefresh }) => {
  const { user, isSuperAdmin } = useAuth();

  const [events, setEvents] = useState<EventPaymentConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingEvent, setEditingEvent] = useState<EventPaymentConfig | null>(null);

  // Edit Form State
  const [formFee, setFormFee] = useState<number>(100);
  const [formMobile, setFormMobile] = useState<string>('');
  const [formUpi, setFormUpi] = useState<string>('');
  const [formInstructions, setFormInstructions] = useState<string>('');
  const [formEnabled, setFormEnabled] = useState<boolean>(true);

  // QR Code State in Modal
  const [currentQrUrl, setCurrentQrUrl] = useState<string | null>(null);
  const [newQrBase64, setNewQrBase64] = useState<string | null>(null);
  const [newQrFilename, setNewQrFilename] = useState<string | null>(null);
  const [removeQrFlag, setRemoveQrFlag] = useState<boolean>(false);

  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminEventsPayment();
      setEvents(data);
    } catch (err: any) {
      console.error('Failed to load event payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (event: EventPaymentConfig) => {
    if (!isSuperAdmin) return;

    setEditingEvent(event);
    setFormFee(event.registrationFee);
    setFormMobile(event.paymentMobile);
    setFormUpi(event.upiId);
    setFormInstructions(event.paymentInstructions || '');
    setFormEnabled(event.paymentEnabled);
    setCurrentQrUrl(event.qrCodeUrl);
    setNewQrBase64(null);
    setNewQrFilename(null);
    setRemoveQrFlag(false);
    setFormError(null);
  };

  const handleCloseModal = () => {
    setEditingEvent(null);
    setNewQrBase64(null);
    setNewQrFilename(null);
    setRemoveQrFlag(false);
    setFormError(null);
  };

  // QR Upload Handler with 10MB limit and format validation
  const handleQrFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: JPG, JPEG, PNG, WEBP
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setFormError('Invalid file type. Only JPG, JPEG, PNG, and WEBP formats are accepted.');
      return;
    }

    // Validate size: 10 MB max
    const MAX_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      setFormError(`File size exceeds the 10 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const resultStr = reader.result as string;
      setNewQrBase64(resultStr);
      setNewQrFilename(file.name);
      setRemoveQrFlag(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveQrInModal = () => {
    setNewQrBase64(null);
    setNewQrFilename(null);
    setCurrentQrUrl(null);
    setRemoveQrFlag(true);
  };

  const handleSavePayment = async () => {
    if (!editingEvent) return;
    setFormError(null);

    // Validation
    if (formFee < 0) {
      setFormError('Registration fee cannot be negative.');
      return;
    }

    if (!formMobile.trim() || formMobile.trim().length < 8) {
      setFormError('Please enter a valid payment mobile number.');
      return;
    }

    if (!formUpi.trim() || !formUpi.includes('@')) {
      setFormError('Please enter a valid UPI ID (e.g. event@upi).');
      return;
    }

    setSaving(true);

    try {
      // 1. Upload new QR code if admin provided one
      if (newQrBase64) {
        await api.uploadEventQR(editingEvent.id, newQrBase64, newQrFilename || 'qr-upload');
      } else if (removeQrFlag) {
        // 2. Remove QR if admin clicked remove
        await api.removeEventQR(editingEvent.id);
      }

      // 3. Update event fields (Fee, Mobile, UPI, Instructions, Status)
      const res = await api.updateEventPayment(editingEvent.id, {
        registrationFee: Number(formFee),
        paymentMobile: formMobile.trim(),
        upiId: formUpi.trim(),
        paymentInstructions: formInstructions.trim(),
        paymentEnabled: formEnabled,
      });

      if (res.success) {
        setSuccessBanner(`Payment settings for "${editingEvent.name}" updated successfully!`);
        setTimeout(() => setSuccessBanner(null), 4000);
        handleCloseModal();
        await loadEvents();
        if (onRefresh) onRefresh();
      } else {
        setFormError(res.message || 'Failed to save payment settings.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error occurred while saving payment details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-olympus-border">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-olympus-cyan/10 border border-olympus-cyan/30 text-olympus-cyan font-mono text-xs uppercase mb-1">
            <CreditCard className="w-3.5 h-3.5" />
            <span>FINANCIAL COMMAND CENTER</span>
          </div>
          <h2 className="font-tech text-2xl font-bold text-white uppercase">
            EVENT PAYMENT SETTINGS
          </h2>
          <p className="text-xs text-slate-400">
            Independent fee, UPI ID, mobile number, QR scanner, and instructions for each arena.
          </p>
        </div>

        <button
          onClick={loadEvents}
          disabled={loading}
          className="cyber-button px-4 py-2 bg-olympus-card hover:bg-olympus-cardHover border border-olympus-border text-slate-300 hover:text-white text-xs font-mono flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>REFRESH SETTINGS</span>
        </button>
      </div>

      {/* Permission Notification */}
      {!isSuperAdmin && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-amber-200">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              You are logged in as <strong className="text-white">STAFF ADMIN</strong> (read & verify access). To edit fees, UPI, mobile numbers, QR codes, or toggle payment status, please log in with the Super Admin account: <strong className="text-olympus-cyan">admin@olympus.ece</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('olympus_token');
              window.location.href = '/login';
            }}
            className="cyber-button px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-500/40 text-[11px] whitespace-nowrap"
          >
            Switch to Super Admin
          </button>
        </div>
      )}

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/60 flex items-center gap-3 text-sm text-emerald-200 shadow-emerald-900/30 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-mono font-semibold">{successBanner}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-olympus-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-olympus-card border border-olympus-border">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <p className="text-sm font-mono text-slate-300">
            No events found in database. Please run database seed to initialize Event 1 and Event 2.
          </p>
        </div>
      ) : (
        /* Two Distinct Event Cards */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map((ev, index) => {
            const isEvent1 = ev.code === 'FULL_STACK_AI' || index === 0;
            const eventBadge = isEvent1 ? 'EVENT 01 // ARENA 01' : 'EVENT 02 // ARENA 02';
            const accentBorder = isEvent1
              ? 'hover:border-olympus-cyan/70 border-olympus-border'
              : 'hover:border-purple-400/70 border-olympus-border';

            return (
              <HUDFrame
                key={ev.id}
                tag={eventBadge}
                glow={isEvent1}
                className={`p-6 sm:p-7 flex flex-col justify-between transition-all ${accentBorder}`}
              >
                <div className="space-y-6">
                  {/* Event Title & Status */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-olympus-border">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-olympus-cyan uppercase block mb-1">
                        {ev.category || (isEvent1 ? 'Full Stack Development with AI' : 'Drone Technology')}
                      </span>
                      <h3 className="font-tech text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
                        {ev.name}
                      </h3>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold tracking-wider uppercase border shrink-0 ${
                        ev.paymentEnabled
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-emerald-500/20 shadow-sm'
                          : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                      }`}
                    >
                      {ev.paymentEnabled ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </div>

                  {/* Detail Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Registration Fee */}
                    <div className="p-3.5 rounded-xl bg-olympus-bg/80 border border-olympus-border/70">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Registration Fee
                      </span>
                      <span className="font-tech text-2xl font-extrabold text-olympus-cyan">
                        ₹{ev.registrationFee}
                      </span>
                      <span className="block text-[10px] font-mono text-slate-400">
                        Per participant
                      </span>
                    </div>

                    {/* Payment Mobile */}
                    <div className="p-3.5 rounded-xl bg-olympus-bg/80 border border-olympus-border/70">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Payment Mobile Number
                      </span>
                      <span className="font-mono text-lg font-bold text-white tracking-wider">
                        {ev.paymentMobile}
                      </span>
                      <span className="block text-[10px] font-mono text-slate-400">
                        UPI Mobile Channel
                      </span>
                    </div>
                  </div>

                  {/* UPI ID */}
                  <div className="p-3.5 rounded-xl bg-olympus-bg/80 border border-olympus-border/70 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        UPI ID
                      </span>
                      <span className="font-mono text-sm font-bold text-white break-all">
                        {ev.upiId}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-olympus-cyan/10 text-olympus-cyan shrink-0 ml-2">
                      EVENT-SPECIFIC
                    </span>
                  </div>

                  {/* QR Code & Instructions Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {/* QR Code Preview */}
                    <div className="sm:col-span-5 flex flex-col items-center p-3 rounded-xl bg-olympus-bg border border-olympus-border/80">
                      <span className="text-[10px] font-mono text-slate-400 uppercase mb-2">
                        CURRENT QR CODE
                      </span>
                      <div className="p-2 rounded-xl bg-white shadow-cyan-glow border border-olympus-cyan/40">
                        {ev.qrCodeUrl ? (
                          <img
                            src={ev.qrCodeUrl}
                            alt={`${ev.name} QR Code`}
                            className="w-32 h-32 object-contain rounded"
                          />
                        ) : (
                          <div className="w-32 h-32 flex items-center justify-center text-slate-500 font-mono text-[10px] text-center p-2">
                            No QR Uploaded
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 mt-1 truncate max-w-full">
                        {ev.qrCodeUrl ? ev.qrCodeUrl.split('/').pop() : 'Empty'}
                      </span>
                    </div>

                    {/* Instructions */}
                    <div className="sm:col-span-7 p-3.5 rounded-xl bg-olympus-bg/80 border border-olympus-border/70 space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5 text-olympus-cyan font-mono text-[10px] font-semibold">
                        <Info className="w-3 h-3" />
                        <span>PAYMENT INSTRUCTIONS</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed max-h-28 overflow-y-auto">
                        {ev.paymentInstructions || 'No custom payment instructions set.'}
                      </p>
                    </div>
                  </div>

                  {/* Audit Metadata: Last Updated & Updated By */}
                  <div className="pt-3 border-t border-olympus-border/60 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-olympus-cyan" />
                      Last Updated:{' '}
                      <strong className="text-slate-200">
                        {ev.updatedAt
                          ? new Date(ev.updatedAt).toLocaleString(undefined, {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Initial setup'}
                      </strong>
                    </span>

                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-olympus-cyan" />
                      By: <strong className="text-slate-200">{ev.lastUpdatedBy || 'system'}</strong>
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="pt-6 mt-6 border-t border-olympus-border">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(ev)}
                    disabled={!isSuperAdmin}
                    className={`w-full cyber-button py-3 text-xs font-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      isSuperAdmin
                        ? 'bg-olympus-blue hover:bg-olympus-blue-light text-white shadow-blue-glow'
                        : 'bg-olympus-card text-slate-500 border border-olympus-border cursor-not-allowed opacity-60'
                    }`}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>
                      {isSuperAdmin ? `EDIT PAYMENT DETAILS (${isEvent1 ? 'EVENT 1' : 'EVENT 2'})` : 'EDIT RESTRICTED (SUPER ADMIN ONLY)'}
                    </span>
                  </button>
                </div>
              </HUDFrame>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT MODAL FOR A SINGLE EVENT (EVENT 1 OR EVENT 2 ONLY)   */}
      {/* ========================================================= */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-olympus-card border-2 border-olympus-cyan/70 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 shadow-cyan-glow relative">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-olympus-border">
              <div>
                <span className="text-[10px] font-mono text-olympus-cyan uppercase tracking-widest block">
                  // INDEPENDENT EVENT PAYMENT CONFIGURATION
                </span>
                <h3 className="font-tech text-2xl font-bold text-white uppercase mt-0.5">
                  EDIT PAYMENT DETAILS
                </h3>
                <p className="text-xs font-mono text-slate-300">
                  Target Event: <strong className="text-olympus-cyan">{editingEvent.name}</strong> ({editingEvent.code})
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg bg-olympus-bg border border-olympus-border text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Error Banner */}
            {formError && (
              <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/60 flex items-center gap-3 text-red-200 text-xs font-mono">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Modal Form Body */}
            <div className="space-y-5 text-xs font-mono">
              {/* Row 1: Registration Fee & Payment Enabled */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold uppercase">
                    Registration Fee (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={formFee}
                      onChange={(e) => setFormFee(Number(e.target.value))}
                      placeholder="e.g. 100 or 500"
                      className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-sm outline-none font-tech font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Calculated per participant for this event only.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold uppercase">
                    Payment Enabled Status *
                  </label>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setFormEnabled(true)}
                      className={`flex-1 py-2 px-3 rounded-lg border font-mono text-xs font-bold transition-all ${
                        formEnabled
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-900/40 shadow-sm'
                          : 'bg-olympus-bg text-slate-400 border-olympus-border hover:text-white'
                      }`}
                    >
                      ACTIVE (ON)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormEnabled(false)}
                      className={`flex-1 py-2 px-3 rounded-lg border font-mono text-xs font-bold transition-all ${
                        !formEnabled
                          ? 'bg-rose-600 text-white border-rose-400 shadow-rose-900/40 shadow-sm'
                          : 'bg-olympus-bg text-slate-400 border-olympus-border hover:text-white'
                      }`}
                    >
                      DISABLED (OFF)
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Toggle online fee acceptance for this arena.
                  </span>
                </div>
              </div>

              {/* Row 2: Payment Mobile & UPI ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold uppercase">
                    Payment Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={formMobile}
                    onChange={(e) => setFormMobile(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-sm outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Displayed only to participants registering for {editingEvent.name}.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold uppercase">
                    UPI ID *
                  </label>
                  <input
                    type="text"
                    value={formUpi}
                    onChange={(e) => setFormUpi(e.target.value)}
                    placeholder="e.g. event1@upi"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-sm outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    VPA address for direct UPI intent / QR payments.
                  </span>
                </div>
              </div>

              {/* Row 3: Payment Instructions */}
              <div>
                <label className="block text-slate-300 mb-1 font-semibold uppercase">
                  Payment Instructions
                </label>
                <textarea
                  rows={3}
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  placeholder="Enter step-by-step payment instructions shown to participants..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-xs outline-none font-mono leading-relaxed"
                />
              </div>

              {/* Row 4: QR Code Section (Preview, Replace, Remove) */}
              <div className="p-4 rounded-xl bg-olympus-bg border border-olympus-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold uppercase flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-olympus-cyan" />
                    <span>EVENT QR CODE MANAGEMENT</span>
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Max 10 MB • JPG, JPEG, PNG, WEBP
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                  {/* Current / New QR Preview */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 uppercase mb-1.5">
                      {newQrBase64 ? 'NEW QR PREVIEW' : 'CURRENT QR CODE'}
                    </span>
                    <div className="p-2 rounded-xl bg-white border-2 border-olympus-cyan shadow-cyan-glow">
                      {newQrBase64 ? (
                        <img
                          src={newQrBase64}
                          alt="New QR Preview"
                          className="w-28 h-28 object-contain rounded"
                        />
                      ) : currentQrUrl ? (
                        <img
                          src={currentQrUrl}
                          alt="Current QR"
                          className="w-28 h-28 object-contain rounded"
                        />
                      ) : (
                        <div className="w-28 h-28 flex items-center justify-center text-slate-500 font-mono text-[10px] text-center p-1">
                          No QR Code
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions: Replace / Remove */}
                  <div className="flex-1 space-y-3 w-full sm:w-auto">
                    <div>
                      <label className="cyber-button w-full sm:w-auto px-4 py-2 bg-olympus-card hover:bg-olympus-cardHover border border-olympus-cyan/60 hover:border-olympus-cyan text-olympus-cyan hover:text-white font-mono text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>REPLACE QR CODE</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/jpg"
                          onChange={handleQrFileSelect}
                          className="hidden"
                        />
                      </label>
                      {newQrFilename && (
                        <span className="block text-[10px] text-emerald-400 mt-1 truncate">
                          Selected: {newQrFilename} (Preview ready)
                        </span>
                      )}
                    </div>

                    {(currentQrUrl || newQrBase64) && (
                      <button
                        type="button"
                        onClick={handleRemoveQrInModal}
                        className="cyber-button w-full sm:w-auto px-4 py-2 bg-transparent hover:bg-red-950/40 border border-red-500/40 text-red-400 hover:text-red-300 font-mono text-xs flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>REMOVE QR CODE</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-olympus-border">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={saving}
                className="cyber-button px-5 py-2.5 bg-olympus-card hover:bg-olympus-cardHover border border-olympus-border text-slate-300 hover:text-white text-xs font-mono uppercase"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={handleSavePayment}
                disabled={saving}
                className="cyber-button px-6 py-2.5 bg-gradient-to-r from-olympus-blue to-olympus-cyan hover:opacity-95 text-white font-tech text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-cyan-glow disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>SAVING CONFIGURATION...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>SAVE PAYMENT DETAILS</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
