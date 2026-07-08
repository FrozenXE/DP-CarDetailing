import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';
import Navbar from './components/Navbar';
import StudioHome from './components/StudioHome';
import ServicesView from './components/ServicesView';
import GarageView from './components/GarageView';
import ReservationsView from './components/ReservationsView';
import AuthView from './components/AuthView';
import AdminDashboard from './components/AdminDashboard';
import UserSettings from './components/UserSettings';
import ContactView from './components/ContactView';
import Footer from './components/Footer';
import { useUserData } from './hooks/useUserData';

const pathToTab = (pathname) => {
  const clean = pathname.replace(/\/+$|^\/+/, '');
  switch (clean) {
    case 'services':
      return 'services';
    case 'garage':
      return 'garage';
    case 'bookings':
      return 'bookings';
    case 'auth':
      return 'auth';
    case 'settings':
      return 'settings';
    case 'admin':
      return 'admin';
    case 'contact':
      return 'contact';
    case '':
      return 'home';
    default:
      return 'home';
  }
};

const tabToPath = {
  home: '/',
  services: '/services',
  garage: '/garage',
  bookings: '/bookings',
  auth: '/auth',
  settings: '/settings',
  admin: '/admin',
  contact: '/contact',
};

export default function App() {
  const [activeTab, setActiveTab] = useState(() => pathToTab(window.location.pathname));
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [autoOpenWizard, setAutoOpenWizard] = useState(false);
  const { user, vehicleCount, bookingCount, isAdmin } = useUserData();

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(pathToTab(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTab = (tab, replace = false) => {
    const path = tabToPath[tab] || '/';
    if (window.location.pathname !== path) {
      const method = replace ? window.history.replaceState : window.history.pushState;
      method.call(window.history, {}, '', path);
    }
    setActiveTab(tab);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigateTab('home');
  };

  const handleConfigurePackage = (packageId) => {
    setSelectedPackageId(packageId);
    setAutoOpenWizard(true);
    navigateTab('bookings');
  };

  const handleOpenBookingWizard = () => {
    setSelectedPackageId(null);
    setAutoOpenWizard(true);
    navigateTab('bookings');
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-200">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={navigateTab} 
        user={user} 
        isAdmin={isAdmin} 
        onSignOut={handleSignOut} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition" key={activeTab}>
        {activeTab === 'home' && (
          <StudioHome
            setActiveTab={navigateTab}
            onBookNow={handleOpenBookingWizard}
            vehicleCount={vehicleCount}
            bookingCount={bookingCount}
          />
        )}
        
        {activeTab === 'services' && (
          <ServicesView onConfigurePackage={handleConfigurePackage} />
        )}
        
        {activeTab === 'garage' && (
          <GarageView user={user} setActiveTab={navigateTab} onScheduleSession={handleOpenBookingWizard} />
        )}
        
        {activeTab === 'bookings' && (
          <ReservationsView 
            user={user}
            setActiveTab={navigateTab} 
            selectedPackageId={selectedPackageId} 
            setSelectedPackageId={setSelectedPackageId} 
            autoOpenWizard={autoOpenWizard}
            setAutoOpenWizard={setAutoOpenWizard}
          />
        )}
        
        {activeTab === 'auth' && <AuthView setActiveTab={navigateTab} />}

        {activeTab === 'settings' && <UserSettings user={user} setActiveTab={navigateTab} />}

        {activeTab === 'contact' && <ContactView setActiveTab={navigateTab} />}

        {activeTab === 'admin' && isAdmin && <AdminDashboard />}
      </main>

      <Footer setActiveTab={navigateTab} />
    </div>
  );
}