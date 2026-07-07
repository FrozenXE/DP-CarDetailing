import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import StudioHome from './components/StudioHome';
import ServicesView from './components/ServicesView';
import GarageView from './components/GarageView';
import ReservationsView from './components/ReservationsView';
import AuthView from './components/AuthView';
import AdminDashboard from './components/AdminDashboard';
import UserSettings from './components/UserSettings';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Database-driven admin state
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [autoOpenWizard, setAutoOpenWizard] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async (session) => {
      if (!session) {
        setUser(null);
        setIsAdmin(false);
        return;
      }
      
      setUser(session.user);

      // Fetch the admin flag from the profiles table
      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();
      
      setIsAdmin(data?.is_admin || false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => checkAuthStatus(session));
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAuthStatus(session);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => { 
    await supabase.auth.signOut(); 
    setActiveTab('home'); 
  };

  const handleConfigurePackage = (packageId) => {
    setSelectedPackageId(packageId);
    setAutoOpenWizard(true);
    setActiveTab('bookings');
  };

  const handleOpenBookingWizard = () => {
    setSelectedPackageId(null);
    setAutoOpenWizard(true);
    setActiveTab('bookings');
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-200">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        isAdmin={isAdmin} 
        onSignOut={handleSignOut} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <StudioHome
            setActiveTab={setActiveTab}
            onBookNow={handleOpenBookingWizard}
          />
        )}
        
        {activeTab === 'services' && (
          <ServicesView onConfigurePackage={handleConfigurePackage} />
        )}
        
        {activeTab === 'garage' && (
          <GarageView setActiveTab={setActiveTab} onScheduleSession={handleOpenBookingWizard} />
        )}
        
        {activeTab === 'bookings' && (
          <ReservationsView 
            setActiveTab={setActiveTab} 
            selectedPackageId={selectedPackageId} 
            setSelectedPackageId={setSelectedPackageId} 
            autoOpenWizard={autoOpenWizard}
            setAutoOpenWizard={setAutoOpenWizard}
          />
        )}
        
        {activeTab === 'auth' && <AuthView setActiveTab={setActiveTab} />}

        {activeTab === 'settings' && <UserSettings user={user} setActiveTab={setActiveTab} />}

        {/* Only allow access to AdminDashboard if isAdmin is true */}
        {activeTab === 'admin' && isAdmin && <AdminDashboard />}
      </main>
    </div>
  );
}