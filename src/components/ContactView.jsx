import React, { useState } from 'react';

export default function ContactView({ setActiveTab }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent('Apex Studio Contact Request');
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:apexstudio@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="space-y-8 text-slate-100 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Contact Apex Studio</h1>
          <p className="text-sm text-slate-400">Send your appointment request or ask a question and we’ll follow up by email.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Email</p>
            <p className="mt-2 text-sm text-slate-200">apexstudio@gmail.com</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Support</p>
            <p className="mt-2 text-sm text-slate-200">Available Mon–Sat, 8AM–6PM</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-5 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-xs font-semibold text-slate-300">
            Your Name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500"
              placeholder="John Doe"
            />
          </label>
          <label className="space-y-2 text-xs font-semibold text-slate-300">
            Email Address
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500"
              placeholder="you@example.com"
            />
          </label>
        </div>

        <label className="space-y-2 text-xs font-semibold text-slate-300">
          Phone Number
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500"
            placeholder="(123) 456-7890"
          />
        </label>

        <label className="space-y-2 text-xs font-semibold text-slate-300">
          Message
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500 resize-none"
            placeholder="Tell us about your vehicle and the service you need..."
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-slate-500">Your message will open in your email app and send to apexstudio@gmail.com.</p>
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-slate-950 transition hover:bg-cyan-400"
          >
            Send Inquiry
          </button>
        </div>

        {submitted && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/60 p-4 text-sm text-emerald-200">
            A mail draft has been prepared. Complete the email in your default mail app to send your request.
          </div>
        )}
      </form>
    </div>
  );
}
