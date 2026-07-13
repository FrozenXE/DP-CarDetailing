import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import { useUserData } from '../hooks/useUserData';

export default function UserSettings({ setActiveTab }) {
  const { t } = useTranslation();
  const { user, fullName: initialFullName } = useUserData();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => { if (user) { setFullName(initialFullName || ''); setEmail(user.email || ''); } }, [user, initialFullName]);

  const handleSave = async (event) => {
    event.preventDefault(); setMessage({ type: '', text: '' });
    if (!fullName.trim()) { setMessage({ type: 'error', text: t('settings_name_required') }); return; }
    if (newPassword && newPassword !== confirmPassword) { setMessage({ type: 'error', text: t('settings_password_mismatch') }); return; }
    try {
      setLoading(true);
      const { error: profileError } = await supabase.from('profiles').upsert({ id: user.id, full_name: fullName.trim() }, { onConflict: 'id' });
      if (profileError) throw profileError;
      if (newPassword) { const { error } = await supabase.auth.updateUser({ password: newPassword }); if (error) throw error; }
      setMessage({ type: 'success', text: newPassword ? t('settings_saved_with_password') : t('settings_saved') });
      setNewPassword(''); setConfirmPassword('');
    } catch (error) { setMessage({ type: 'error', text: error.message || t('settings_save_error') }); } finally { setLoading(false); }
  };

  if (!user) return <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-300"><h2 className="text-xl font-black text-white">{t('settings_title')}</h2><p className="mt-3 text-sm text-slate-400">{t('settings_locked_desc')}</p><button type="button" onClick={() => setActiveTab('auth')} className="mt-5 cursor-pointer rounded-xl bg-linear-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-950">{t('settings_go_portal')}</button></div>;

  return <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8"><div className="flex flex-col items-start justify-between gap-4 sm:flex-row"><div className="space-y-2"><span className="rounded-full border border-cyan-500/20 bg-cyan-950/30 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">{t('settings_badge')}</span><h2 className="text-2xl font-black text-white">{t('settings_title')}</h2><p className="text-sm text-slate-400">{t('settings_desc')}</p></div><button type="button" onClick={() => setActiveTab('home')} className="cursor-pointer rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold uppercase tracking-wide text-slate-300">← {t('settings_back')}</button></div>
    {message.text && <div className={`rounded-2xl border p-4 text-sm ${message.type === 'success' ? 'border-cyan-500/30 bg-cyan-950/30 text-cyan-300' : 'border-red-500/30 bg-red-950/30 text-red-300'}`}>{message.text}</div>}
    <form onSubmit={handleSave} className="space-y-5"><label className="space-y-1"><span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">{t('settings_full_name')}</span><input type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder={t('settings_name_placeholder')} disabled={loading} className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white" /></label><label className="space-y-1"><span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">{t('settings_email')}</span><input type="email" value={email} readOnly className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-400" /><p className="text-[11px] text-slate-500">{t('settings_email_help')}</p></label><label className="space-y-1"><span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">{t('settings_new_password')}</span><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder={t('settings_password_placeholder')} disabled={loading} className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white" /></label><label className="space-y-1"><span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">{t('settings_confirm_password')}</span><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder={t('settings_confirm_placeholder')} disabled={loading} className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white" /></label><button type="submit" disabled={loading} className="w-full cursor-pointer rounded-xl bg-linear-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-sm font-black uppercase tracking-[0.2em] text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">{loading ? t('settings_saving') : t('settings_save')}</button></form>
  </div>;
}
