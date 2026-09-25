import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { ParticipantPass } from '../components/pass/ParticipantPass';
import { api } from '../services/api';

export const PassViewPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPass = async () => {
      if (!code) return;
      try {
        const res = await api.getRegistrationByCode(code);
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(res.message || 'Pass not found or invalid.');
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching pass data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPass();
  }, [code]);

  return (
    <div className="pt-28 pb-20 bg-olympus-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-olympus-cyan"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO HOME</span>
          </Link>
          <span className="text-xs font-mono text-olympus-cyan flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            VERIFIED REGISTRATION PORTAL
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-olympus-cyan border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error || !data ? (
          <div className="text-center p-8 rounded-xl bg-olympus-card border border-red-500/30 max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="font-tech text-xl font-bold text-white uppercase">
              Registration Pass Not Found
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              The registration code [{code}] could not be found or has expired.
            </p>
            <Link
              to="/register"
              className="mt-6 inline-block cyber-button px-6 py-2 bg-olympus-blue text-white text-xs font-tech font-bold uppercase"
            >
              REGISTER NEW TEAM
            </Link>
          </div>
        ) : (
          <ParticipantPass
            registrationId={data.registrationId}
            teamCode={data.teamCode}
            teamName={data.teamName}
            eventType={data.eventType}
            participants={data.participants}
            createdAt={data.registeredAt}
          />
        )}
      </div>
    </div>
  );
};
