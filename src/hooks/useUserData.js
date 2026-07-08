import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export function useUserData() {
  const [user, setUser] = useState(null);
  const [vehicleCount, setVehicleCount] = useState(null);
  const [bookingCount, setBookingCount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription;

    const loadUserData = async (session) => {
      if (!session?.user) {
        setUser(null);
        setIsAdmin(false);
        setVehicleCount(null);
        setBookingCount(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setUser(session.user);

      const [profileResult, vehicleCountResult, bookingCountResult] = await Promise.all([
        supabase.from('profiles').select('is_admin').eq('id', session.user.id).single(),
        supabase.from('vehicles').select('id', { count: 'exact', head: true }).eq('user_id', session.user.id),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('user_id', session.user.id),
      ]);

      if (profileResult.error) {
        console.warn('useUserData profile error', profileResult.error);
      }

      setIsAdmin(profileResult.data?.is_admin || false);
      setVehicleCount(vehicleCountResult.error ? 0 : vehicleCountResult.count ?? 0);
      setBookingCount(bookingCountResult.error ? 0 : bookingCountResult.count ?? 0);
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => loadUserData(session));

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUserData(session);
    });

    subscription = data?.subscription;

    return () => subscription?.unsubscribe();
  }, []);

  return { user, vehicleCount, bookingCount, isAdmin, loading };
}
