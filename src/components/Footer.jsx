import React from "react";
import { useTranslation } from "react-i18next";

export default function Footer({ setActiveTab }) {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-slate-900 bg-slate-950/90 text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:px-8">
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white">Apex Studio</h2>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            {t("footer_desc")}
          </p>
          <button
            type="button"
            onClick={() => setActiveTab("contact")}
            className="mt-3 inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 sm:w-auto"
          >
            {t("footer_contact")}
          </button>
          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("privacy")}
              className="cursor-pointer text-slate-500 hover:text-cyan-400"
            >
              {t("footer_privacy")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("storage")}
              className="cursor-pointer text-slate-500 hover:text-cyan-400"
            >
              {t("footer_storage")}
            </button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {t("contact_email")}
            </p>
            <p className="mt-2 text-sm text-slate-200">apexstudio@gmail.com</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {t("footer_hours")}
            </p>
            <p className="mt-2 text-sm text-slate-200">
              {t("footer_hours_value")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
