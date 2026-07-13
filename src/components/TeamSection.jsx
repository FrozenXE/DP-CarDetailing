import React from 'react';
import { useTranslation } from 'react-i18next';

const team = [
  { name: 'Jovan', role: 'team_owner_role', bio: 'team_owner_bio', initials: 'JM', accent: 'from-cyan-400 to-blue-500' },
  { name: 'Aleksandar', role: 'team_specialist_role', bio: 'team_specialist_bio', initials: 'AK', accent: 'from-blue-400 to-indigo-500' },
  { name: 'Kiril', role: 'team_specialist_role', bio: 'team_specialist_bio', initials: 'Ki', accent: 'from-teal-400 to-cyan-600' },
  { name: 'Bojan', role: 'team_specialist_role', bio: 'team_specialist_bio', initials: 'Bo', accent: 'from-violet-400 to-blue-500' },
];

export default function TeamSection() {
  const { t } = useTranslation();
  return <section className="space-y-6"><div className="mx-auto max-w-2xl space-y-2 text-center"><span className="rounded border border-cyan-900 bg-cyan-950 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-400">{t('team_badge')}</span><h2 className="text-2xl font-black tracking-tight text-white">{t('team_title')}</h2><p className="text-xs leading-relaxed text-slate-400">{t('team_desc')}</p></div><div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{team.map((member, index) => <article key={member.initials} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-center shadow-xl transition hover:-translate-y-1 hover:border-slate-700"><div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${member.accent} text-lg font-black text-slate-950 shadow-lg`}>{member.initials}</div><h3 className="mt-4 text-lg font-black text-white">{member.name}</h3><p className="mt-1 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">{t(member.role)}</p><p className="mt-3 text-xs leading-relaxed text-slate-400">{t(member.bio)}</p>{index === 0 && <span className="mt-4 inline-block rounded-full border border-cyan-500/20 bg-cyan-950/30 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-cyan-300">{t('team_owner_badge')}</span>}</article>)}</div></section>;
}
