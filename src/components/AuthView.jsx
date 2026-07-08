import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthView({ setActiveTab }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (isSignUp) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData?.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authData.user.id, 
                full_name: fullName,
                phone: phone,
              }
            ]);

          if (profileError) throw profileError;

          setMessage({ 
            type: 'success', 
            text: 'Registration successful! Check your email for a confirmation link or log in.' 
          });
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        setMessage({ type: 'success', text: 'Authentication successful! Accessing vault...' });
        
        setTimeout(() => {
          setActiveTab('home');
        }, 1500);
      }

      setEmail('');
      setPassword('');
      setFullName('');
      setPhone('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:py-12 text-slate-100 animate-fade-in">
      
      <div className="text-center space-y-2 mb-8">
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-cyan-950 border border-cyan-900 text-cyan-400 uppercase tracking-widest">
          Secure Core Gateway
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight">Client Portal</h1>
        <p className="text-xs text-slate-400">Access historical correction data, active clear-coat specs, and pending reservations.</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 border rounded-xl text-xs text-center font-medium animate-fade-in shadow-lg ${
          message.type === 'success' 
            ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300' 
            : 'bg-red-950/40 border-red-500/30 text-red-300'
        }`}>
          {message.type === 'success' ? '✨ ' : '❌ '} {message.text}
        </div>
      )}

      <div className="bg-linear-to-b from-slate-900 to-slate-950 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-900 mb-6 font-mono text-[10px] font-bold">
          <button
            type="button"
            disabled={loading}
            onClick={() => { setIsSignUp(false); setMessage({ type: '', text: '' }); }}
            className={`py-2 rounded-lg uppercase tracking-wide transition-all cursor-pointer ${
              !isSignUp 
                ? 'bg-slate-900 text-cyan-400 border border-slate-850 shadow-inner' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => { setIsSignUp(true); setMessage({ type: '', text: '' }); }}
            className={`py-2 rounded-lg uppercase tracking-wide transition-all cursor-pointer ${
              isSignUp 
                ? 'bg-slate-900 text-cyan-400 border border-slate-850 shadow-inner' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          
          {isSignUp && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Full Legal Name *</label>
                <input 
                  type="text" required placeholder="Alexander Mercer" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-400 text-white"
                  disabled={loading}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Mobile Contact Number *</label>
                <input 
                  type="tel" required placeholder="(555) 019-2834" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-400 text-white"
                  disabled={loading}
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Email Address *</label>
            <input 
              type="email" required placeholder="client@apexstudio.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-400 text-white"
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Secure Access Password *</label>
            </div>
            <input 
              type="password" required placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-400 text-white"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-cyan-400 to-blue-500 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-widest mt-6 cursor-pointer hover:shadow-lg hover:shadow-cyan-500/10 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing Gateway...' : isSignUp ? 'Initialize Studio Account' : 'Authenticate Gateway'}
          </button>
        </form>

        <div className="absolute -top-16 -left-16 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

    </div>
  );
}