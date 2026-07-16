import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUserData } from "../hooks/useUserData";
import logo from "../assets/logo.png";
import "../i18n";

export default function Navbar({ activeTab, setActiveTab, onSignOut, theme, onToggleTheme }) {
  const { user, fullName, isAdmin } = useUserData();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsMenuRef = useRef(null);
  const { t, i18n } = useTranslation();

  const handleSignOut = async () => {
    setShowSignOutConfirm(false);

    if (onSignOut) {
      await onSignOut();
    }

    setShowSuccessToast(true);
    window.setTimeout(() => setShowSuccessToast(false), 2500);
  };

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("app_lang", lang);
  };

  const navItems = [
    { id: "home", label: t("nav_home", "Studio Home") },
    { id: "services", label: t("nav_services", "Detailing Menu") },
    { id: "garage", label: t("nav_garage", "My Garage") },
    { id: "bookings", label: t("nav_bookings", "Reservations") },
  ];

  const isSettingsActive = activeTab === "settings" || activeTab === "admin";

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!settingsMenuRef.current?.contains(event.target)) setSettingsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSettingsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const navigate = (tab) => {
    setActiveTab(tab);
    setSettingsOpen(false);
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 shadow-lg shadow-slate-950/30 backdrop-blur-xl">
      <button
        type="button"
        className={`theme-toggle ${theme === "light" ? "theme-toggle--light" : "theme-toggle--dark"}`}
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        title={`Switch to ${theme === "dark" ? "day" : "night"} theme`}
      >
        <span className="theme-toggle__sun" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
            <circle cx="12" cy="12" r="3.5" />
            <path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56" />
          </svg>
        </span>
        <span className="theme-toggle__moon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.7 15.1A8.5 8.5 0 0 1 8.9 3.3 8.5 8.5 0 1 0 20.7 15.1Z" />
          </svg>
        </span>
        <span className="sr-only">Current theme: {theme}</span>
      </button>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between pl-24 pr-4 sm:pl-28 sm:pr-6 lg:pl-28 lg:pr-8">
        <div
          onClick={() => navigate("home")}
          className="text-md font-black tracking-wider text-white cursor-pointer flex items-center gap-3"
          style={{ cursor: "pointer" }}
        >
          <img
            src={logo}
            alt="Apex Studio logo"
            className="h-14 w-14 object-contain"
          />
          <span className="flex items-center gap-1">
            APEX <span className="text-cyan-400 font-medium">STUDIO</span>
          </span>
        </div>

        {/* Desktop Menu navigation */}
        <div className="hidden items-center rounded-2xl border border-slate-800/80 bg-slate-900/40 p-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.id)}
              className={`rounded-xl px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${
                activeTab === item.id
                  ? "border border-cyan-400/15 bg-cyan-950/40 text-cyan-300 shadow-inner"
                  : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100"
              }`}
              style={{ cursor: "pointer" }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop Language Selector + Authentication Context */}
          <div className="hidden md:flex items-center gap-4">
            {/* Global Language Toggle Component */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-850 text-[10px] font-mono font-bold relative z-50">
              <button
                type="button"
                onClick={() => toggleLanguage("en")}
                className={`px-2 py-0.5 rounded transition-all select-none uppercase ${
                  i18n.language?.startsWith("en")
                    ? "bg-slate-900 text-cyan-400 border border-slate-800/60 shadow-inner font-bold"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                style={{ cursor: "pointer" }}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => toggleLanguage("mk")}
                className={`px-2 py-0.5 rounded transition-all select-none uppercase ${
                  i18n.language?.startsWith("mk")
                    ? "bg-slate-900 text-cyan-400 border border-slate-800/60 shadow-inner font-bold"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                style={{ cursor: "pointer" }}
              >
                MK
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-3 animate-fade-in">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                    {t("secure_session", "Secure Session")}
                  </span>
                  <span className="text-xs text-slate-300 font-medium max-w-35 truncate">
                    {fullName || t("client", "Client")}
                  </span>
                </div>

                <div className="relative" ref={settingsMenuRef}>
                <button
                  type="button"
                  onClick={() => setSettingsOpen((open) => !open)}
                  aria-expanded={settingsOpen}
                  aria-haspopup="menu"
                  className={`bg-slate-900 border font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all shadow-md ${isSettingsActive || settingsOpen ? "border-cyan-400/40 bg-cyan-950/40 text-cyan-300" : "border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300"}`}
                  style={{ cursor: "pointer" }}
                >
                  ⚙ {t("settings", "Settings")}
                </button>

                {settingsOpen && (
                  <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-max min-w-64 rounded-2xl border border-slate-700/80 bg-slate-900 p-1.5 shadow-2xl shadow-black/40">
                    <p className="px-3 py-2 text-[9px] font-mono font-bold uppercase tracking-[0.18em] text-slate-500">{fullName || t("client", "Client")}</p>
                    <button type="button" role="menuitem" onClick={() => navigate("settings")} className="w-full whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white">User settings</button>
                    {isAdmin && <button type="button" role="menuitem" onClick={() => navigate("admin")} className="w-full whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white">{t("nav_admin", "Admin Panel")}</button>}
                  </div>
                )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowSignOutConfirm(true)}
                  className="bg-slate-900 hover:bg-red-950/40 border border-slate-850 hover:border-red-900/50 text-slate-400 hover:text-red-400 font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all shadow-md"
                  style={{ cursor: "pointer" }}
                >
                  {t("sign_out", "Sign Out")}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab("auth")}
                className="bg-linear-to-r from-cyan-950 to-slate-900 hover:from-cyan-900 hover:to-slate-850 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-lg shadow-cyan-950/20 flex items-center gap-1.5"
                style={{ cursor: "pointer" }}
              >
                🔑 {t("client_portal", "Client Portal")}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/95 p-2 text-slate-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Toggle navigation"
            style={{ cursor: "pointer" }}
          >
            <span className="text-lg">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {showSignOutConfirm && (
        <div className="fixed inset-0 z-9999] flex min-h-screen items-center justify-center bg-black/40 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-cyan-950/30 ring-1 ring-cyan-950/30">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-950/30 text-xl">
                🔒
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                  {t("confirm_sign_out", "Confirm Sign Out")}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {t(
                    "sign_out_warning",
                    "You’ll need to sign back in to access your portal again.",
                  )}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
              {t(
                "sign_out_confirm_prompt",
                "Are you sure you want to sign out of your account?",
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowSignOutConfirm(false)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-slate-600 hover:text-white"
                style={{ cursor: "pointer" }}
              >
                {t("cancel", "Cancel")}
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-xl bg-linear-to-r from-red-500 to-rose-600 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white transition hover:opacity-90 active:scale-[0.98]"
                style={{ cursor: "pointer" }}
              >
                {t("confirm_sign_out_btn", "Confirm Sign Out")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 z-70 rounded-2xl border border-emerald-500/30 bg-emerald-950/80 px-4 py-3 text-sm font-semibold text-emerald-300 shadow-lg shadow-emerald-950/30">
          {t("sign_out_success", "Signed out successfully.")}
        </div>
      )}

      {/* Mobile Menu Layout */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-900 bg-slate-950/95 px-4 py-4 space-y-4">
          {/* Mobile Language Toggle Row */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/40 rounded-2xl border border-slate-900 relative z-50">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
              {t("language", "Language")}
            </span>
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-850 text-[10px] font-mono font-bold">
              <button
                type="button"
                onClick={() => toggleLanguage("en")}
                className={`px-3 py-1 rounded transition-all uppercase ${
                  i18n.language?.startsWith("en")
                    ? "bg-slate-900 text-cyan-400 border border-slate-800 font-bold"
                    : "text-slate-500"
                }`}
                style={{ cursor: "pointer" }}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => toggleLanguage("mk")}
                className={`px-3 py-1 rounded transition-all uppercase ${
                  i18n.language?.startsWith("mk")
                    ? "bg-slate-900 text-cyan-400 border border-slate-800 font-bold"
                    : "text-slate-500"
                }`}
                style={{ cursor: "pointer" }}
              >
                MK
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={`w-full text-left rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-all ${
                  activeTab === item.id
                    ? "bg-slate-900 text-cyan-400 border border-slate-800"
                    : "text-slate-300 hover:bg-slate-900/80 hover:text-slate-100"
                }`}
                style={{ cursor: "pointer" }}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 mt-2 border-t border-slate-900">
              {user ? (
                <div className="space-y-3">
                  <div className="px-4 py-2 flex flex-col bg-slate-900/50 rounded-2xl border border-slate-900">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                      {t("secure_session", "Secure Session")}
                    </span>
                    <span className="text-sm text-slate-300 font-medium truncate">
                      {fullName || t("client", "Client")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => navigate("settings")}
                      className="w-full justify-center bg-slate-900 hover:bg-cyan-950/40 border border-slate-850 text-slate-300 font-mono text-xs font-bold uppercase tracking-wider py-3 rounded-2xl transition-all shadow-md flex items-center gap-1"
                      style={{ cursor: "pointer" }}
                    >
                      ⚙ {t("settings", "Settings")}
                    </button>

                    {isAdmin && (
                      <button type="button" onClick={() => navigate("admin")} className="w-full justify-center border border-slate-850 bg-slate-900 py-3 text-xs font-mono font-bold uppercase tracking-wider text-slate-300 shadow-md transition-all hover:bg-cyan-950/40">
                        {t("nav_admin", "Admin Panel")}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setShowSignOutConfirm(true);
                      }}
                      className="w-full justify-center bg-slate-900 hover:bg-red-950/40 border border-slate-850 text-slate-400 font-mono text-xs font-bold uppercase tracking-wider py-3 rounded-2xl transition-all shadow-md"
                      style={{ cursor: "pointer" }}
                    >
                      {t("sign_out", "Sign Out")}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("auth");
                    setMenuOpen(false);
                  }}
                  className="w-full justify-center bg-linear-to-r from-cyan-950 to-slate-900 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest py-3.5 rounded-2xl transition-all shadow-lg shadow-cyan-950/20 cursor-pointer flex items-center gap-1.5"
                  style={{ cursor: "pointer" }}
                >
                  🔑 {t("client_portal", "Client Portal")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
