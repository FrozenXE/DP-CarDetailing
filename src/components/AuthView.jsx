import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthView({ setActiveTab }) {
  // Added 'update-password' as a valid mode option
  const [mode, setMode] = useState('signin'); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Detect if the user arrived via a reset password redirect link
  useEffect(() => {
    const handleRecoverySession = async () => {
      // Check if the URL hash contains the access token or if mode is passed in query string
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      
      if (hash.includes('type=recovery') || searchParams.get('mode') === 'update-password') {
        // Supabase automatically signs the user in temporarily when clicking a valid reset link.
        // Let's verify if an active session exists.
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setMode('update-password');
          setMessage({ 
            type: 'success', 
            text: 'Security gateway verified. Please establish your new access password.' 
          });
        } else if (hash.includes('error_code=otp_expired')) {
          setMessage({
            type: 'error',
            text: 'Your password reset token has expired or was pre-scanned by your email provider. Please request a new link.'
          });
        }
      }
    };

    handleRecoverySession();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (mode === 'signup') {
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
      } else if (mode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        setMessage({ type: 'success', text: 'Authentication successful! Accessing vault...' });
        
        setTimeout(() => {
          setActiveTab('home');
        }, 1500);
      } else if (mode === 'reset') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}`, // Redirecting directly back to core origin
        });

        if (resetError) throw resetError;

        setMessage({ 
          type: 'success', 
          text: 'Password reset link sent! Check your email for instructions.' 
        });
        setEmail('');
      } else if (mode === 'update-password') {
        // Core execution to update password for the current recovery session user
        const { error: updateError } = await supabase.auth.updateUser({
          password: password
        });

        if (updateError) throw updateError;

        setMessage({ 
          type: 'success', 
          text: 'Password updated securely! Redirecting you to home panel...' 
        });
        
        setPassword('');
        setTimeout(() => {
          setActiveTab('home');
        }, 2000);
      }

      if (mode !== 'reset' && mode !== 'update-password') {
        setEmail('');
        setPassword('');
        setFullName('');
        setPhone('');
      }
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
        <h1 className="text-3xl font-black text-white tracking-tight">
          {mode === 'update-password' ? 'Reset Security Key' : 'Client Portal'}
        </h1>
        <p className="text-xs text-slate-400">
          {mode === 'update-password' ? 'Provide a new security password for vault authorization.' : 'Access historical correction data, active clear-coat specs, and pending reservations.'}
        </p>
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
        
        {/* Hide default navigation tabs if we are in forced update-password flow */}
        {mode !== 'update-password' && (
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-900 mb-6 font-mono text-[10px] font-bold">
            <button
              type="button"
              disabled={loading}
              onClick={() => { setMode('signin'); setMessage({ type: '', text: '' }); }}
              className={`py-2 rounded-lg uppercase tracking-wide transition-all cursor-pointer ${
                mode === 'signin' 
                  ? 'bg-slate-900 text-cyan-400 border border-slate-850 shadow-inner' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => { setMode('signup'); setMessage({ type: '', text: '' }); }}
              className={`py-2 rounded-lg uppercase tracking-wide transition-all cursor-pointer ${
                mode === 'signup' 
                  ? 'bg-slate-900 text-cyan-400 border border-slate-850 shadow-inner' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          
          {mode === 'signup' && (
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

          {mode !== 'update-password' && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Email Address *</label>
              <input 
                type="email" required placeholder="client@apexstudio.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-400 text-white"
                disabled={loading}
              />
            </div>
          )}

          {mode !== 'reset' && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  {mode === 'update-password' ? 'New Secure Password *' : 'Secure Access Password *'}
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input 
                type="password" required placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-400 text-white"
                disabled={loading}
              />
            </div>
          )}

          {mode === 'reset' && (
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 text-xs text-slate-300 text-center">
              Enter your email address and we'll send you a link to reset your password.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-cyan-400 to-blue-500 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-widest mt-6 cursor-pointer hover:shadow-lg hover:shadow-cyan-500/10 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing Gateway...' : mode === 'signup' ? 'Initialize Studio Account' : mode === 'reset' ? 'Send Reset Link' : mode === 'update-password' ? 'Update Master Password' : 'Authenticate Gateway'}
          </button>

          {(mode === 'reset' || mode === 'update-password') && (
            <button
              type="button"
              onClick={() => { setMode('signin'); setMessage({ type: '', text: '' }); }}
              className="w-full py-2 text-xs text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
            >
              Back to Sign In
            </button>
          )}
        </form>

        <div className="absolute -top-16 -left-16 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

    </div>
  );
}