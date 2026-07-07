import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id, appointment_date, arrival_time_slot, status, special_instructions,
        profiles (full_name, phone),
        vehicles (year, make, model),
        services (name)
      `)
      .order('appointment_date', { ascending: true });

    if (!error) setBookings(data);
    setLoading(false);
  };

  useEffect(() => { fetchAllBookings(); }, []);

  const updateStatus = async (id, status) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    fetchAllBookings(); // Refresh list
  };

  return (
    <div className="text-slate-100 space-y-6">
      <h2 className="text-2xl font-black">🛡️ Studio Admin Ledger</h2>
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">
              <th className="p-3">Client</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Service</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {bookings.map(b => (
              <tr key={b.id} className="text-xs">
                <td className="p-3">{b.profiles?.full_name}</td>
                <td className="p-3">{b.vehicles?.make} {b.vehicles?.model}</td>
                <td className="p-3">{b.services?.name}</td>
                <td className="p-3">
                  <select 
                    value={b.status} 
                    onChange={(e) => updateStatus(b.id, e.target.value)}
                    className="bg-slate-800 p-1 rounded border border-slate-700"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="curing">Curing</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}