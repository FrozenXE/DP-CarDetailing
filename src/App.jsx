import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";
import Navbar from "./components/Navbar";
import StudioHome from "./components/StudioHome";
import ServicesView from "./components/ServicesView";
import GarageView from "./components/GarageView";
import ReservationsView from "./components/ReservationsView";
import AuthView from "./components/AuthView";
import AdminDashboard from "./components/AdminDashboard";
import UserSettings from "./components/UserSettings";
import ContactView from "./components/ContactView";
import PrivacyPolicyView from "./components/PrivacyPolicyView";
import StoragePolicyView from "./components/StoragePolicyView";
import Footer from "./components/Footer";
import PageIntro from "./components/PageIntro";
import { useUserData } from "./hooks/useUserData";

const pathToTab = (pathname) => {
  const clean = pathname.replace(/\/+$|^\/+/, "");
  switch (clean) {
    case "services":
      return "services";
    case "garage":
      return "garage";
    case "bookings":
      return "bookings";
    case "auth":
      return "auth";
    case "settings":
      return "settings";
    case "admin":
      return "admin";
    case "contact":
      return "contact";
    case "privacy":
      return "privacy";
    case "storage":
      return "storage";
    case "":
      return "home";
    default:
      return "home";
  }
};

const tabToPath = {
  home: "/",
  services: "/services",
  garage: "/garage",
  bookings: "/bookings",
  auth: "/auth",
  settings: "/settings",
  admin: "/admin",
  contact: "/contact",
  privacy: "/privacy",
  storage: "/storage",
};

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [hideApp, setHideApp] = useState(true);
  const [activeTab, setActiveTab] = useState(() =>
    pathToTab(window.location.pathname),
  );
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [autoOpenWizard, setAutoOpenWizard] = useState(false);
  const { user, vehicleCount, bookingCount, isAdmin } = useUserData();

  useEffect(() => {
    const revealApp = window.setTimeout(() => setHideApp(false), 1300);
    return () => window.clearTimeout(revealApp);
  }, []);

  useEffect(() => {
    const handleBrowserNavigation = () => {
      setActiveTab(pathToTab(window.location.pathname));
    };

    window.addEventListener("popstate", handleBrowserNavigation);

    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);
    const openRecovery = () => {
      const recoveryUrl = `${tabToPath.auth}${window.location.search}${window.location.hash}`;
      window.history.replaceState({}, "", recoveryUrl);
      setActiveTab("auth");
    };

    if (
      hash.includes("type=recovery") ||
      searchParams.get("mode") === "update-password"
    ) {
      openRecovery();
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        openRecovery();
      }
    });

    return () => {
      window.removeEventListener("popstate", handleBrowserNavigation);
      subscription.unsubscribe();
    };
  }, []);

  const navigateTab = (tab, replace = false) => {
    const path = tabToPath[tab] || "/";
    if (window.location.pathname !== path) {
      const method = replace
        ? window.history.replaceState
        : window.history.pushState;
      method.call(window.history, {}, "", path);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setActiveTab(tab);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigateTab("home");
  };

  const handleConfigurePackage = (packageId) => {
    setSelectedPackageId(packageId);
    setAutoOpenWizard(true);
    navigateTab("bookings");
  };

  const handleOpenBookingWizard = () => {
    setSelectedPackageId(null);
    setAutoOpenWizard(true);
    navigateTab("bookings");
  };

  return (
    <div
      className={`min-h-screen bg-slate-950 font-sans antialiased text-slate-200${hideApp ? " app-shell--loading" : ""}`}
    >
      {showIntro && <PageIntro onComplete={() => { setShowIntro(false); setHideApp(false); }} />}
      <Navbar
        activeTab={activeTab}
        setActiveTab={navigateTab}
        onSignOut={handleSignOut}
      />

      <main
        className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-2 py-8 page-transition"
        key={activeTab}
      >
        {activeTab === "home" && (
          <StudioHome
            setActiveTab={navigateTab}
            onBookNow={handleOpenBookingWizard}
            vehicleCount={vehicleCount}
            bookingCount={bookingCount}
          />
        )}

        {activeTab === "services" && (
          <ServicesView onConfigurePackage={handleConfigurePackage} />
        )}

        {activeTab === "garage" && (
          <GarageView
            user={user}
            setActiveTab={navigateTab}
            onScheduleSession={handleOpenBookingWizard}
          />
        )}

        {activeTab === "bookings" && (
          <ReservationsView
            user={user}
            setActiveTab={navigateTab}
            selectedPackageId={selectedPackageId}
            setSelectedPackageId={setSelectedPackageId}
            autoOpenWizard={autoOpenWizard}
            setAutoOpenWizard={setAutoOpenWizard}
          />
        )}

        {activeTab === "auth" && <AuthView setActiveTab={navigateTab} />}

        {activeTab === "settings" && (
          <UserSettings setActiveTab={navigateTab} />
        )}

        {activeTab === "contact" && <ContactView setActiveTab={navigateTab} />}

        {activeTab === "privacy" && <PrivacyPolicyView />}

        {activeTab === "storage" && <StoragePolicyView />}

        {activeTab === "admin" && isAdmin && <AdminDashboard />}
      </main>

      <Footer setActiveTab={navigateTab} />
    </div>
  );
}
