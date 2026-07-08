import React from 'react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/90 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-6 md:grid-cols-[1.5fr_1fr]">
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white">Apex Studio</h2>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Premium auto detailing and finish restoration. Contact us for bookings, estimates, or support by email.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className="mt-3 w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Contact Us
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Email</p>
            <p className="mt-2 text-sm text-slate-200">apexstudio@gmail.com</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Hours</p>
            <p className="mt-2 text-sm text-slate-200">Mon–Sat, 8AM–6PM</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
