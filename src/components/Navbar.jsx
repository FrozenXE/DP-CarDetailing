import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUserData } from '../hooks/useUserData';
import logo from '../assets/logo.png';

export default function Navbar({ activeTab, setActiveTab, onSignOut }) {
  const { user, fullName, isAdmin } = useUserData();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const handleSignOut = async () => {
    setShowSignOutConfirm(false);

    if (onSignOut) {
      await onSignOut();
    }

    setShowSuccessToast(true);
    window.setTimeout(() => setShowSuccessToast(false), 2500);
  };

  const navItems = [
    { id: 'home', label: 'Studio Home' },
    { id: 'services', label: 'Detailing Menu' },
    { id: 'garage', label: 'My Garage' },
    { id: 'bookings', label: 'Reservations' },
    { id: 'contact', label: 'Contact' },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Panel' }] : []),
  ];

  return (
    <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <div 
          onClick={() => setActiveTab('home')} 
          className="text-md font-black tracking-wider text-white cursor-pointer flex items-center gap-3"
        >
          <img src={logo} alt="Apex Studio logo" className="h-14 w-14 object-contain" />
          <span className="flex items-center gap-1">
            APEX <span className="text-cyan-400 font-medium">STUDIO</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-[11px] font-mono font-bold tracking-wider uppercase">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`transition-colors py-1 px-3 rounded-lg cursor-pointer ${
                activeTab === item.id 
                  ? 'text-cyan-400 bg-slate-900 border border-slate-850 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 animate-fade-in">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Secure Session</span>
                  <span className="text-xs text-slate-300 font-medium max-w-35 truncate">{displayName || 'Client'}</span>
                </div>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className="bg-slate-900 hover:bg-cyan-950/40 border border-slate-850 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  ⚙ Settings
                </button>

                <button
                  onClick={() => setShowSignOutConfirm(true)}
                  className="bg-slate-900 hover:bg-red-950/40 border border-slate-850 hover:border-red-900/50 text-slate-400 hover:text-red-400 font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('auth')}
                className="bg-linear-to-r from-cyan-950 to-slate-900 hover:from-cyan-900 hover:to-slate-850 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-lg shadow-cyan-950/20 cursor-pointer flex items-center gap-1.5"
              >
                🔑 Client Portal
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/95 p-2 text-slate-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Toggle navigation"
          >
            <span className="text-lg">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

      </div>

      {showSignOutConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center px-4 py-6 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-cyan-950/30 ring-1 ring-cyan-950/30">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-950/30 text-xl">
                🔒
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Confirm Sign Out</h3>
                <p className="mt-1 text-sm text-slate-400">You’ll need to sign back in to access your portal again.</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
              Are you sure you want to sign out of your account?
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowSignOutConfirm(false)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-slate-600 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-xl bg-linear-to-r from-red-500 to-rose-600 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white transition hover:opacity-90 active:scale-[0.98] cursor-pointer"
              >
                Confirm Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 z-70 rounded-2xl border border-emerald-500/30 bg-emerald-950/80 px-4 py-3 text-sm font-semibold text-emerald-300 shadow-lg shadow-emerald-950/30">
          Signed out successfully.
        </div>
      )}

      {menuOpen && (
        <div className="md:hidden border-t border-slate-900 bg-slate-950/95 px-4 py-4">
          <div className="space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMenuOpen(false);
                }}
                className={`w-full text-left rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-all ${
                  activeTab === item.id 
                    ? 'bg-slate-900 text-cyan-400 border border-slate-800' 
                    : 'text-slate-300 hover:bg-slate-900/80 hover:text-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="pt-4 mt-2 border-t border-slate-900">
              {user ? (
                <div className="space-y-3">
                  <div className="px-4 py-2 flex flex-col bg-slate-900/50 rounded-2xl border border-slate-900">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Secure Session</span>
                    <span className="text-sm text-slate-300 font-medium truncate">{displayName || 'Client'}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setMenuOpen(false);
                      }}
                      className="w-full justify-center bg-slate-900 hover:bg-cyan-950/40 border border-slate-850 text-slate-300 font-mono text-xs font-bold uppercase tracking-wider py-3 rounded-2xl transition-all cursor-pointer shadow-md flex items-center gap-1"
                    >
                      ⚙ Settings
                    </button>

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setShowSignOutConfirm(true);
                      }}
                      className="w-full justify-center bg-slate-900 hover:bg-red-950/40 border border-slate-850 text-slate-400 font-mono text-xs font-bold uppercase tracking-wider py-3 rounded-2xl transition-all cursor-pointer shadow-md"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActiveTab('auth');
                    setMenuOpen(false);
                  }}
                  className="w-full justify-center bg-linear-to-r from-cyan-950 to-slate-900 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest py-3.5 rounded-2xl transition-all shadow-lg shadow-cyan-950/20 cursor-pointer flex items-center gap-1.5"
                >
                  🔑 Client Portal
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}