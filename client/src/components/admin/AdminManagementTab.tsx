import React, { useState, useEffect } from 'react';
import {
  Shield,
  UserPlus,
  RefreshCw,
  Trash2,
  Power,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Check,
  Edit3,
  Eye,
  EyeOff,
  X,
  Lock,
  Mail,
} from 'lucide-react';
import { HUDFrame } from '../common/HUDFrame';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminManagementTab: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // New Admin Form
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'SUPER_ADMIN'>('ADMIN');

  // Edit Credentials Modal State
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState<'ADMIN' | 'SUPER_ADMIN'>('ADMIN');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const { user: currentUser, isSuperAdmin } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!newEmail || !newName || !newPassword) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (newPassword.length < 6) {
      setFormError('Temporary password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createAdminUser({
        email: newEmail.trim().toLowerCase(),
        name: newName.trim(),
        password: newPassword,
        role: newRole,
      });

      if (res.success) {
        setFormSuccess(`Administrator ${newEmail} created and synchronized with role ${newRole}!`);
        setNewEmail('');
        setNewName('');
        setNewPassword('');
        setNewRole('ADMIN');
        await loadUsers();
      } else {
        setFormError(res.message || 'Failed to create administrator.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Network error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (userItem: any) => {
    if (userItem.id === currentUser?.id) {
      alert('You cannot deactivate your own admin session.');
      return;
    }

    const action = userItem.isActive ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} ${userItem.email}?`)) {
      return;
    }

    setActionLoadingId(userItem.id);
    try {
      const res = await api.toggleAdminStatus(userItem.id);
      if (res.success) {
        await loadUsers();
      } else {
        alert(res.message || 'Failed to change admin status.');
      }
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleChangeRole = async (userItem: any) => {
    if (userItem.id === currentUser?.id) {
      alert('You cannot modify your own role.');
      return;
    }

    const targetRole = userItem.role === 'SUPER_ADMIN' ? 'ADMIN' : 'SUPER_ADMIN';
    if (!confirm(`Change permission role for ${userItem.email} to ${targetRole}?`)) {
      return;
    }

    setActionLoadingId(userItem.id);
    try {
      const res = await api.updateAdminRole(userItem.id, targetRole);
      if (res.success) {
        await loadUsers();
      } else {
        alert(res.message || 'Failed to update role.');
      }
    } catch (err: any) {
      alert(err.message || 'Role change failed.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteAdmin = async (userItem: any) => {
    if (userItem.id === currentUser?.id) {
      alert('You cannot delete your own admin account.');
      return;
    }

    if (userItem.email.toLowerCase() === 'omupotalkar25@coep.sveri.ac.in') {
      alert('The primary Super Admin account cannot be deleted.');
      return;
    }

    if (!confirm(`Permanently remove administrator account for ${userItem.email}? This action cannot be undone.`)) {
      return;
    }

    setActionLoadingId(userItem.id);
    try {
      const res = await api.deleteAdminUser(userItem.id);
      if (res.success) {
        await loadUsers();
      } else {
        alert(res.message || 'Failed to delete administrator.');
      }
    } catch (err: any) {
      alert(err.message || 'Deletion error.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenEditModal = (u: any) => {
    setEditingUser(u);
    setEditEmail(u.email);
    setEditName(u.name);
    setEditPassword('');
    setEditRole(u.role);
    setShowEditPassword(false);
    setEditError(null);
    setEditSuccess(null);
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let generated = '';
    for (let i = 0; i < 10; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setEditPassword(generated);
    setShowEditPassword(true);
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditError(null);
    setEditSuccess(null);

    if (!editEmail.trim() || !editName.trim()) {
      setEditError('Email address and full name are required.');
      return;
    }

    if (editPassword && editPassword.trim().length < 6) {
      setEditError('New password must be at least 6 characters long.');
      return;
    }

    setEditSubmitting(true);
    try {
      const res = await api.updateAdminCredentials(editingUser.id, {
        email: editEmail.trim().toLowerCase(),
        name: editName.trim(),
        role: editRole,
        ...(editPassword.trim() ? { password: editPassword.trim() } : {}),
      });

      if (res.success) {
        setEditSuccess(`Credentials for ${editName} (${editEmail}) updated successfully!`);
        setTimeout(() => {
          setEditingUser(null);
        }, 1200);
        await loadUsers();
      } else {
        setEditError(res.message || 'Failed to update administrator credentials.');
      }
    } catch (err: any) {
      setEditError(err.message || 'Action failed.');
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-olympus-border">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs uppercase mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>FIREBASE AUTH & POSTGRESQL GOVERNANCE</span>
          </div>
          <h2 className="font-tech text-2xl font-bold text-white uppercase">
            ADMINISTRATOR ROSTER
          </h2>
          <p className="text-xs text-slate-400">
            Role-based authorization (SUPER_ADMIN vs ADMIN). Only Super Admins can add, deactivate, or modify roles.
          </p>
        </div>

        <button
          onClick={loadUsers}
          disabled={loading}
          className="cyber-button px-3.5 py-1.5 bg-olympus-card hover:bg-olympus-cardHover border border-olympus-border text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>REFRESH ROSTER</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Create Admin Form */}
        <div className="lg:col-span-5">
          <HUDFrame tag="PROVISION NEW ADMIN" glow={true} className="p-6">
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <h3 className="font-tech text-lg font-bold text-white uppercase">
                Add Staff / Admin
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Creates the account in Firebase Authentication and PostgreSQL with designated role permissions.
              </p>

              {formError && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/50 text-red-200 text-xs font-mono">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs font-mono">
                  {formSuccess}
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Prof. A. B. Joshi"
                  className="w-full px-3 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Admin Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="staff@olympus.ece"
                  className="w-full px-3 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Temporary Initial Password *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Role & Permissions *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-olympus-bg border border-olympus-border focus:border-olympus-cyan text-white text-xs font-mono outline-none"
                >
                  <option value="ADMIN">ADMIN (View registrations, screenshots, verify payments)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full control: edit payment settings, manage staff)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full cyber-button py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-tech uppercase font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-purple-glow disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{submitting ? 'PROVISIONING...' : 'CREATE ADMINISTRATOR'}</span>
              </button>
            </form>
          </HUDFrame>
        </div>

        {/* Right Column: Existing Admins Table */}
        <div className="lg:col-span-7">
          <HUDFrame tag={`REGISTERED ADMINISTRATORS (${users.length})`} className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-olympus-bg/80 text-slate-400 border-b border-olympus-border uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-3">Administrator</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-olympus-border/60">
                  {users.map((u) => {
                    const isSelf = u.id === currentUser?.id;
                    const isPrimarySuper = u.email.toLowerCase() === 'omupotalkar25@coep.sveri.ac.in';
                    const isBusy = actionLoadingId === u.id;

                    return (
                      <tr key={u.id} className="hover:bg-olympus-cardHover">
                        <td className="py-3 px-3">
                          <div className="font-bold text-white whitespace-nowrap flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isSelf && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 select-all">{u.email}</div>
                          {u.firebaseUid && (
                            <div className="text-[9px] text-slate-500 font-mono truncate max-w-[180px]">
                              UID: {u.firebaseUid}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === 'SUPER_ADMIN'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.isActive !== false
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                                : 'bg-red-500/15 text-red-300 border border-red-500/40'
                            }`}
                          >
                            {u.isActive !== false ? 'ACTIVE' : 'DEACTIVATED'}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          {isSuperAdmin && (
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit Credentials (Email & Password) */}
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleOpenEditModal(u)}
                                className="p-1.5 rounded bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white transition-colors"
                                title="Edit Email & Password Credentials"
                              >
                                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                              </button>

                              {/* Toggle Role */}
                              {!isSelf && (
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => handleChangeRole(u)}
                                  className="p-1.5 rounded bg-olympus-card border border-olympus-border hover:border-purple-400 text-slate-300 hover:text-white"
                                  title={`Change role to ${u.role === 'SUPER_ADMIN' ? 'ADMIN' : 'SUPER_ADMIN'}`}
                                >
                                  <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
                                </button>
                              )}

                              {/* Toggle Active / Deactivate */}
                              {!isSelf && !isPrimarySuper && (
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => handleToggleStatus(u)}
                                  className={`p-1.5 rounded bg-olympus-card border border-olympus-border ${
                                    u.isActive !== false
                                      ? 'hover:border-amber-400 text-amber-400'
                                      : 'hover:border-emerald-400 text-emerald-400'
                                  }`}
                                  title={u.isActive !== false ? 'Deactivate Account' : 'Activate Account'}
                                >
                                  <Power className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Delete Admin */}
                              {!isSelf && !isPrimarySuper && (
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => handleDeleteAdmin(u)}
                                  className="p-1.5 rounded bg-olympus-card border border-olympus-border hover:border-red-500 text-slate-400 hover:text-red-400"
                                  title="Delete Admin"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </HUDFrame>
        </div>
      </div>

      {/* Super Admin Modal: Edit Staff Email & Password Credentials */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-cyan-500/60 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Cyber Corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 rounded-br-lg" />

            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-tech text-lg font-bold text-white uppercase tracking-wide">
                    MANAGE CREDENTIALS
                  </h3>
                  <span className="text-[11px] font-mono text-cyan-400 block">
                    {editingUser.name} • {editingUser.role}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/50 text-red-200 text-xs font-mono">
                {editError}
              </div>
            )}

            {editSuccess && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs font-mono">
                {editSuccess}
              </div>
            )}

            <form onSubmit={handleSaveCredentials} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  Staff Login Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-400 text-white text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Full Name / Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-400 text-white text-xs font-mono outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    New Password
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Generate Secure
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Leave blank to keep existing password"
                    className="w-full pl-3 pr-10 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-400 text-white text-xs font-mono outline-none placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  Enter 6+ characters to set a new password, or leave blank to keep unchanged.
                </span>
              </div>

              {editingUser.id !== currentUser?.id && (
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Permission Role
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-400 text-white text-xs font-mono outline-none cursor-pointer"
                  >
                    <option value="ADMIN">ADMIN (Staff Verifier Only)</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Full Privileges)</option>
                  </select>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="cyber-button px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-tech font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {editSubmitting ? 'SAVING...' : 'SAVE CREDENTIALS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
