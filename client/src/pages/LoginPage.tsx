import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, ArrowRight, CheckCircle2, KeyRound, Wifi } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HUDFrame } from '../components/common/HUDFrame';
import { EVENT_CONFIG } from '../config/eventConfig';
import { api } from '../services/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('omupotalkar25@coep.sveri.ac.in');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    api.checkHealth().then((res) => {
      setApiStatus(res && res.status === 'online' ? 'online' : 'offline');
    });
  }, []);

  const { login, resetPassword, isFirebaseActive } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await login(email.trim().toLowerCase(), password);
      if (res.success) {
        navigate('/admin');
      } else {
        setErrorMsg(res.error || 'Invalid administrator credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setErrorMsg('Please specify your registered administrator email.');
      return;
    }

    setResetLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await resetPassword(resetEmail.trim().toLowerCase());
      if (res.success) {
        setSuccessMsg(res.message);
        setShowForgotModal(false);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Password reset request failed.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-olympus-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <HUDFrame tag="RESTRICTED ADMIN PORTAL" glow={true} className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-black/60 border border-purple-500/50 p-1 flex items-center justify-center mx-auto mb-3 shadow-purple-glow overflow-hidden">
              <img
                src="/aces-logo.png"
                alt="ACES Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="font-tech text-3xl font-extrabold text-white uppercase tracking-wider">
              ADMIN COMMAND
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
              <span className="text-xs font-mono text-purple-300 uppercase font-semibold">
                ACES // {EVENT_CONFIG.department}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  apiStatus === 'online'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : apiStatus === 'offline'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-slate-500/20 text-slate-400 border-slate-500/40'
                }`}
              >
                {apiStatus === 'online' ? 'API Online' : apiStatus === 'offline' ? 'API Offline' : 'Checking API...'}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 rounded-lg bg-red-950/40 border border-red-500/40 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-300 mb-1">ADMINISTRATOR EMAIL *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="omupotalkar25@coep.sveri.ac.in"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-300">SECURITY PASSWORD *</label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] text-purple-400 hover:text-purple-300 underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full cyber-button py-3 bg-purple-600 hover:bg-purple-500 text-white font-tech text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-purple-glow disabled:opacity-50 mt-6"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>AUTHORIZE & SIGN IN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {apiStatus === 'offline' && (
            <div className="mt-5 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-mono space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-300">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Backend API Not Connected</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                If hosted on AWS Amplify, the Express backend API (in <code className="text-cyan-300">/server</code>) must also be hosted on a cloud platform (e.g. Render or Railway) with its URL added in AWS Amplify Environment Variables:
              </p>
              <div className="p-2 rounded bg-black/60 border border-slate-700 text-[11px] text-cyan-300 select-all font-mono">
                VITE_API_URL = https://your-backend.onrender.com/api
              </div>
            </div>
          )}

          {/* Password Reset Modal */}
          {showForgotModal && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-purple-500/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-purple-300 font-bold">
                <KeyRound className="w-4 h-4" />
                <span>FIREBASE PASSWORD RESET</span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Enter your admin email address to receive a secure password recovery link:
              </p>
              <form onSubmit={handlePasswordReset} className="space-y-2">
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-3 py-2 rounded bg-black/60 border border-slate-700 text-white text-xs font-mono outline-none focus:border-purple-400"
                />
                <div className="flex items-center gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 rounded text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-3.5 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold uppercase"
                  >
                    {resetLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Authorized Admin Notice */}
          <div className="mt-6 pt-4 border-t border-olympus-border/60 text-[11px] font-mono text-slate-400 space-y-1">
            <span className="block text-olympus-cyan font-semibold mb-1">
              [FIREBASE AUTHENTICATION PORTAL]
            </span>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-purple-300 font-bold">Primary Super Admin:</span>
              <span className="text-white select-all">omupotalkar25@coep.sveri.ac.in</span>
            </div>
            <div className="text-[10px] text-slate-500">
              All admin sessions are verified via Firebase ID Tokens & PostgreSQL role checks.
            </div>
          </div>

          <div className="mt-6 text-center border-t border-olympus-border/40 pt-3">
            <Link to="/" className="text-xs font-mono text-slate-400 hover:text-olympus-cyan transition-colors">
              ← Return to Public Website
            </Link>
          </div>
        </HUDFrame>
      </div>
    </div>
  );
};
