import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUserData } from '../hooks/useUserData';

export default function UserSettings({ setActiveTab }) {
  const { user, fullName: initialFullName } = useUserData();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFullName(initialFullName || '');
      setEmail(user.email || '');
    }
  }, [user, initialFullName]);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!fullName.trim()) {
      setMessage({ type: 'error', text: 'Your full name is required.' });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    try {
      setLoading(true);

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ id: user.id, full_name: fullName.trim() }, { onConflict: 'id' });

      if (profileError) throw profileError;

      if (newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
        if (passwordError) throw passwordError;
      }

      setMessage({
        type: 'success',
        text: newPassword
          ? 'Profile updated and password changed successfully.'
          : 'Profile updated successfully.'
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Unable to save settings.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-300">
        <h2 className="text-xl font-black text-white">Account Settings</h2>
        <p className="mt-3 text-sm text-slate-400">Sign in to view and update your account details.</p>
        <button
          type="button"
          onClick={() => setActiveTab('auth')}
          className="mt-5 rounded-xl bg-linear-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-950"
        >
          Go to Portal
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <span className="rounded-full border border-cyan-500/20 bg-cyan-950/30 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-cyan-400">
            User Configuration
          </span>
          <h2 className="text-2xl font-black text-white">Account Settings</h2>
          <p className="text-sm text-slate-400">Update your profile information and secure your account password.</p>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold uppercase tracking-wide text-slate-300 transition hover:border-slate-600 hover:text-white"
        >
          ← Back
        </button>
      </div>

      {message.text && (
        <div className={`rounded-2xl border p-4 text-sm ${message.type === 'success' ? 'border-cyan-500/30 bg-cyan-950/30 text-cyan-300' : 'border-red-500/30 bg-red-950/30 text-red-300'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div className="space-y-1">
          <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
            placeholder="Enter your full name"
            disabled={loading}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Email Address</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-400"
          />
          <p className="text-[11px] text-slate-500">Your email address is managed by the portal and cannot be changed here.</p>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
            placeholder="Leave blank to keep your current password"
            disabled={loading}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
            placeholder="Re-enter new password"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-linear-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-sm font-black uppercase tracking-[0.2em] text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
