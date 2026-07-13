import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicyView() {
  const { t } = useTranslation();
  const sections = ['data', 'use', 'sharing', 'rights', 'contact'];
  return <article className="mx-auto max-w-3xl space-y-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 text-slate-300 shadow-2xl sm:p-10"><header><span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-400">{t('privacy_badge')}</span><h1 className="mt-2 text-3xl font-black text-white">{t('privacy_title')}</h1><p className="mt-3 text-sm leading-relaxed text-slate-400">{t('privacy_intro')}</p></header>{sections.map((section) => <section key={section}><h2 className="text-sm font-bold uppercase tracking-wider text-white">{t(`privacy_${section}_title`)}</h2><p className="mt-2 text-sm leading-relaxed text-slate-400">{t(`privacy_${section}_desc`)}</p></section>)}</article>;
}
