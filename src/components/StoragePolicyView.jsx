import React from "react";
import { useTranslation } from "react-i18next";

export default function StoragePolicyView() {
  const { t } = useTranslation();
  return (
    <article className="mx-auto max-w-3xl space-y-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 text-slate-300 shadow-2xl sm:p-10">
      <header>
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-400">
          {t("storage_badge")}
        </span>
        <h1 className="mt-2 text-3xl font-black text-white">
          {t("storage_title")}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          {t("storage_intro")}
        </p>
      </header>
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          {t("storage_items_title")}
        </h2>
        <div className="mt-3 space-y-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <h3 className="font-mono text-xs font-bold text-cyan-400">
              app_lang
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              {t("storage_language_desc")}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <h3 className="font-mono text-xs font-bold text-cyan-400">
              Supabase authentication storage
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              {t("storage_auth_desc")}
            </p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          {t("storage_optional_title")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {t("storage_optional_desc")}
        </p>
      </section>
    </article>
  );
}
