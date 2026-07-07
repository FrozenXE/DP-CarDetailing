import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { getServicePackageById, servicePackages } from '../data/servicePackages';

export default function ReservationsView({ setActiveTab, selectedPackageId, setSelectedPackageId, autoOpenWizard, setAutoOpenWizard }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [myVehicles, setMyVehicles] = useState([]);
  const [servicesCatalog, setServicesCatalog] = useState(servicePackages);
  const [myBookings, setMyBookings] = useState([]);

  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedService, setSelectedService] = useState(selectedPackageId || '');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('09:00 AM');
  const [notes, setNotes] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [cancelModal, setCancelModal] = useState({ open: false, bookingId: null });

  const timeSlots = ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'];
  const todayString = new Date().toISOString().split('T')[0];

  const resolveServiceSelection = (services, requestedPackageId) => {
    if (!services?.length) return '';

    if (!requestedPackageId) return services[0].id;

    const directMatch = services.find((service) => service.id === requestedPackageId);
    if (directMatch) return directMatch.id;

    const packageNameMap = {
      'paint-correction': ['multi-stage paint correction', 'paint correction'],
      'ceramic-shield': ['certified 9h ceramic shield', 'ceramic shield'],
      'executive-interior': ['executive interior suite', 'interior suite'],
      'maintenance-cleanse': ['signature studio cleanse', 'studio cleanse']
    };

    const possibleNames = packageNameMap[requestedPackageId] || [];
    const nameMatch = services.find((service) => {
      const serviceName = (service.name || '').toLowerCase();
      return possibleNames.some((name) => serviceName.includes(name));
    });

    if (nameMatch) return nameMatch.id;

    return services[0].id;
  };

  const selectedPackage = getServicePackageById(selectedService);

  useEffect(() => {
    if (selectedPackageId) {
      setSelectedService(selectedPackageId);
    }
  }, [selectedPackageId]);

  useEffect(() => {
    if (autoOpenWizard) {
      setShowWizard(true);
      setAutoOpenWizard(false);
    }
  }, [autoOpenWizard, setAutoOpenWizard]);

  useEffect(() => {
    async function loadBookingPipelineData() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setUser(user);

          // 1. Fetch user's registered vehicles
          const { data: vData } = await supabase
            .from('vehicles')
            .select('*')
            .eq('user_id', user.id);
          setMyVehicles(vData || []);
          if (vData && vData.length > 0) setSelectedVehicle(vData[0].id);

          // 2. Use the shared detailing services catalog so the reservation form matches the menu exactly
          setServicesCatalog(servicePackages);

          if (servicePackages.length > 0) {
            setSelectedService(resolveServiceSelection(servicePackages, selectedPackageId));
          }

          // 3. Fetch user's active bookings (joining service and vehicle data!)
          const { data: bData, error: bErr } = await supabase
            .from('bookings')
            .select(`
              id, appointment_date, arrival_time_slot, status, special_instructions,
              services ( name, base_price ),
              vehicles ( make, model, year )
            `)
            .eq('user_id', user.id)
            .order('appointment_date', { ascending: true });

          if (bErr) throw bErr;
          setMyBookings(bData || []);
        }
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadBookingPipelineData();
  }, []);

  const validateAppointmentDate = (dateString) => {
    if (!dateString) return 'Please select an appointment date.';

    const selectedDate = new Date(`${dateString}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return 'Appointment date cannot be in the past.';
    }

    return '';
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!selectedVehicle || !selectedService || !appointmentDate) {
      setErrorMsg('Please complete all execution parameters.');
      return;
    }

    const dateValidationError = validateAppointmentDate(appointmentDate);
    if (dateValidationError) {
      setErrorMsg(dateValidationError);
      return;
    }

    try {
      setErrorMsg('');
      setSuccessMsg('');

      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user.id,
            vehicle_id: selectedVehicle,
            service_id: selectedService,
            appointment_date: appointmentDate,
            arrival_time_slot: timeSlot,
            special_instructions: notes,
            status: 'pending'
          }
        ])
        .select(`
          id, appointment_date, arrival_time_slot, status, special_instructions,
          services ( name, base_price ),
          vehicles ( make, model, year )
        `);

      if (error) throw error;

      if (data) {
        setMyBookings([...myBookings, data[0]]);
        setSuccessMsg('Reservation pipeline initialized successfully!');
        setSelectedService('');
        setNotes('');
        setShowWizard(false);
        setSelectedPackageId(null);
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!bookingId) return;

    try {
      setErrorMsg('');
      setSuccessMsg('');

      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      setMyBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
      setSuccessMsg('Appointment cancelled successfully.');
      setCancelModal({ open: false, bookingId: null });
    } catch (err) {
      setErrorMsg(err.message);
      setCancelModal({ open: false, bookingId: null });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400 font-mono text-xs tracking-widest animate-pulse">
        🔄 Compiling Relational Booking Registries...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 border border-slate-900 rounded-3xl bg-slate-900/10 space-y-4 max-w-md mx-auto">
        <div className="text-3xl">🔒</div>
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Reservation Engine Locked</h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto px-4">
          Authentication tokens are required to secure appointment timelines and clear-coat allocations.
        </p>
        <button
          onClick={() => setActiveTab('auth')}
          className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wide cursor-pointer"
        >
          Access Portal
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12 text-slate-100 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-cyan-950 border border-cyan-900 text-cyan-400 uppercase tracking-widest">
            Timeline Allocation Pipeline
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">Studio Reservations</h1>
          <p className="text-xs text-slate-400">Schedule multi-stage treatments and certified ceramic shield layer alignments.</p>
        </div>

        {myVehicles.length > 0 && (
          <button
            onClick={() => setShowWizard(!showWizard)}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95 cursor-pointer self-start sm:self-center"
          >
            {showWizard ? '✕ Cancel Booking' : '📆 Request Appointment'}
          </button>
        )}
      </div>

      {errorMsg && <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-300 rounded-xl text-xs text-center font-medium">{errorMsg}</div>}
      {successMsg && <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs text-center font-medium">✨ {successMsg}</div>}

      {showWizard && (
        <form onSubmit={handleCreateBooking} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl max-w-2xl space-y-5 animate-fade-in shadow-2xl">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide font-mono text-cyan-400">Step Parameters</h3>
            <button
              type="button"
              onClick={() => setShowWizard(false)}
              className="text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              ← Back
            </button>
          </div>

          {selectedPackage && (
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4 space-y-1">
              <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Selected Studio Package</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-white">{selectedPackage.name}</p>
                  <p className="text-[11px] text-slate-400">{selectedPackage.tagline}</p>
                </div>
                <span className="text-sm font-black text-cyan-400">{selectedPackage.price}</span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Target Garage Vehicle *</label>
              <select 
                value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-cyan-500 text-white cursor-pointer"
              >
                {myVehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Treatment Package *</label>
              <select 
                value={selectedService} onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-cyan-500 text-white cursor-pointer"
              >
                {servicesCatalog.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.price})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Target Date *</label>
              <input 
                type="date"
                required
                min={todayString}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-cyan-500 text-white cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Estimated Arrival Window</label>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot} type="button" onClick={() => setTimeSlot(slot)}
                    className={`py-2 text-[10px] font-mono font-bold rounded-lg uppercase tracking-wide transition-all border cursor-pointer ${
                      timeSlot === slot 
                        ? 'bg-slate-950 text-cyan-400 border-cyan-500/40 shadow-inner' 
                        : 'bg-slate-950 text-slate-500 border-slate-900 hover:text-slate-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase">Special Instructions / Custom Notes</label>
            <textarea 
              placeholder="E.g., Paint condition features heavy compounding swirls on rear quarter panel..."
              value={notes} onChange={(e) => setNotes(e.target.value)} rows="2"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-cyan-500 text-white resize-none"
            ></textarea>
          </div>

          <button 
            type="submit"
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-widest cursor-pointer w-full"
          >
            Transmit Secure Booking Request
          </button>
        </form>
      )}

      {myVehicles.length === 0 && (
        <div className="text-center py-12 border border-dashed border-slate-900 rounded-3xl bg-slate-900/10 space-y-3 max-w-xl mx-auto">
          <div className="text-2xl">⚠️</div>
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">No Registered Fleet Vehicles Found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">Our database engine requires a target vehicle profile configuration to parse clear coat clearances before a booking slot can be mapped.</p>
          <button
            onClick={() => setActiveTab('garage')}
            className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
          >
            Go To My Garage to Register a Vehicle →
          </button>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-sm font-mono uppercase tracking-widest text-slate-400">Active Live Bookings Feed</h2>
        
        {myBookings.length === 0 ? (
          <div className="text-xs text-slate-600 font-mono italic py-4">No active pipeline configurations active. Click "Request Appointment" to spin up a queue.</div>
        ) : (
          <div className="space-y-3">
            {myBookings.map((b) => (
              <div key={b.id} className="bg-slate-900/40 border border-slate-900 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-850 transition-all">
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-850">
                      📅 {b.appointment_date}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-850">
                      ⏰ {b.arrival_time_slot}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white pt-1">{b.services?.name}</h4>
                  <p className="text-xs text-slate-400">
                    Assigned Vehicle: <span className="text-slate-200">{b.vehicles?.year} {b.vehicles?.make} {b.vehicles?.model}</span>
                  </p>
                  {b.special_instructions && (
                    <p className="text-[11px] text-slate-500 font-mono italic pt-1">Notes: "{b.special_instructions}"</p>
                  )}
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-mono text-slate-500 block">BASE COST</span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">${b.services?.base_price}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCancelModal({ open: true, bookingId: b.id })}
                    className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-red-900/50 text-red-400 bg-red-950/20 hover:bg-red-950/40 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                    b.status === 'pending' ? 'bg-amber-950/40 text-amber-400 border-amber-900/50' :
                    b.status === 'active' ? 'bg-blue-950/40 text-blue-400 border-blue-900/50' :
                    'bg-emerald-950/40 text-emerald-400 border-emerald-900/50'
                  }`}>
                    ● {b.status}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {cancelModal.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-cyan-950/30">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/20 bg-red-950/30 text-xl">⚠️</div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Cancel Appointment</h3>
                <p className="text-xs text-slate-400">This action will remove the booking from your schedule.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
              Are you sure you want to cancel this appointment? This cannot be undone.
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setCancelModal({ open: false, bookingId: null })}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-slate-600 hover:text-white cursor-pointer"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={() => handleCancelBooking(cancelModal.bookingId)}
                className="rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white transition hover:opacity-90 active:scale-[0.98] cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}