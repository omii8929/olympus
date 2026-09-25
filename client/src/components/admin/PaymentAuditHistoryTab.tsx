import React, { useState, useEffect } from 'react';
import { History, RefreshCw, User, Calendar, Tag, ArrowRight, ShieldCheck } from 'lucide-react';
import { HUDFrame } from '../common/HUDFrame';
import { api } from '../../services/api';
import { EventPaymentAudit } from '../../types';

export const PaymentAuditHistoryTab: React.FC = () => {
  const [history, setHistory] = useState<EventPaymentAudit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterEvent, setFilterEvent] = useState<string>('all');

  useEffect(() => {
    loadHistory();
  }, [filterEvent]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getPaymentAuditHistory(filterEvent);
      setHistory(data);
    } catch (err) {
      console.error('Failed to load audit history:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-olympus-border">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-olympus-cyan/10 border border-olympus-cyan/30 text-olympus-cyan font-mono text-xs uppercase mb-1">
            <History className="w-3.5 h-3.5" />
            <span>IMMUTABLE AUDIT TRAIL</span>
          </div>
          <h2 className="font-tech text-2xl font-bold text-white uppercase">
            PAYMENT CHANGE HISTORY
          </h2>
          <p className="text-xs text-slate-400">
            Chronological audit log of fee adjustments, QR updates, mobile numbers, and UPI ID changes.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="px-3 py-1.5 rounded bg-olympus-card border border-olympus-border text-xs font-mono text-white outline-none"
          >
            <option value="all">ALL ARENAS</option>
            <option value="FULL_STACK_AI">EVENT 1 (FULL STACK AI)</option>
            <option value="DRONE_EVENT">EVENT 2 (DRONE TECH)</option>
          </select>

          <button
            onClick={loadHistory}
            disabled={loading}
            className="cyber-button px-3.5 py-1.5 bg-olympus-card hover:bg-olympus-cardHover border border-olympus-border text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>REFRESH</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-olympus-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-olympus-card border border-olympus-border">
          <ShieldCheck className="w-8 h-8 text-olympus-cyan mx-auto mb-2 opacity-60" />
          <p className="text-sm font-mono text-slate-300">
            No payment modifications recorded yet. All settings reflect initial configuration.
          </p>
        </div>
      ) : (
        <HUDFrame tag={`AUDIT ENTRIES (${history.length})`} className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-olympus-bg/80 text-slate-400 border-b border-olympus-border uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Event Target</th>
                  <th className="py-3 px-4">Changed Field</th>
                  <th className="py-3 px-4">Previous Value</th>
                  <th className="py-3 px-4">New Value</th>
                  <th className="py-3 px-4">Admin Email</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-olympus-border/60">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-olympus-cardHover transition-colors">
                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-olympus-cyan/10 border border-olympus-cyan/30 text-olympus-cyan text-[10px]">
                        {item.event?.name || item.eventId}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-amber-300 font-semibold whitespace-nowrap">
                      {item.changedField}
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate" title={item.previousValue || ''}>
                      <span className="line-through opacity-80">{item.previousValue || '(none)'}</span>
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-bold max-w-xs truncate" title={item.newValue || ''}>
                      {item.newValue || '(empty)'}
                    </td>
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-olympus-cyan" />
                        {item.adminEmail}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleString(undefined, {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </HUDFrame>
      )}
    </div>
  );
};
