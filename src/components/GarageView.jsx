import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function GarageView({ user, setActiveTab, onScheduleSession }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [classification, setClassification] = useState('Sedan');
  const [paintColor, setPaintColor] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    async function getVehicles() {
      try {
        setLoading(true);

        if (!user) {
          setVehicles([]);
          return;
        }

        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setVehicles(data || []);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }

    getVehicles();
  }, [user]);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!make || !model) return;

    try {
      setErrorMsg('');
      const { data, error } = await supabase
        .from('vehicles')
        .insert([
          {
            user_id: user.id, 
            year: year || 'N/A',
            make,
            model,
            classification,
            paint_color: paintColor || 'Unspecified'
          }
        ])
        .select();

      if (error) throw error;

      if (data) {
        setVehicles([data[0], ...vehicles]);
      }

      setYear('');
      setMake('');
      setModel('');
      setClassification('Sedan');
      setPaintColor('');
      setShowAddForm(false);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleDeleteVehicle = async (id) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400 font-mono text-xs tracking-widest animate-pulse">
        🔄 Accessing Studio Fleet Records...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 border border-slate-900 rounded-3xl bg-slate-900/10 space-y-4 max-w-md mx-auto">
        <div className="text-3xl">🔒</div>
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Garage Access Restricted</h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto px-4">
          You must be fully authenticated to view clear-coat specifications and vehicle ownership data.
        </p>
        <button
          onClick={() => setActiveTab('auth')}
          className="bg-linear-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wide cursor-pointer"
        >
          Go to Sign In Gateway
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12 text-slate-100 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-cyan-950 border border-cyan-900 text-cyan-400 uppercase tracking-widest">
            Client Fleet Workspace
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">Your Digital Garage</h1>
          <p className="text-xs text-slate-400">Authenticated user: <span className="text-cyan-400 font-mono">{user.email}</span></p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-linear-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95 cursor-pointer self-start sm:self-center"
        >
          {showAddForm ? '✕ Close Form' : '➕ Add New Car'}
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-300 rounded-xl text-xs text-center font-medium shadow-lg">
          ❌ Error: {errorMsg}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAddVehicle} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl max-w-2xl space-y-4 animate-fade-in shadow-2xl">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Vehicle Specifications</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Year</label>
              <input 
                type="text" placeholder="2026" value={year} onChange={(e) => setYear(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Make *</label>
              <input 
                type="text" placeholder="Porsche" required value={make} onChange={(e) => setMake(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
              />
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Model *</label>
              <input 
                type="text" placeholder="GT3 RS" required value={model} onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Body Classification</label>
              <select 
                value={classification} onChange={(e) => setClassification(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white cursor-pointer"
              >
                <option value="Sedan">Sedan (Standard Size)</option>
                <option value="SUV">SUV / Truck (Oversized)</option>
                <option value="Exotic/Sport">Exotic / Supercar Low-Clearance</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Paint Finish / Color</label>
              <input 
                type="text" placeholder="Crayon Grey" value={paintColor} onChange={(e) => setPaintColor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/20 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wide cursor-pointer w-full sm:w-auto"
          >
            Save Vehicle to Cloud Profile
          </button>
        </form>
      )}

      {vehicles.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-900 rounded-3xl bg-slate-900/10 space-y-3">
          <div className="text-3xl">📭</div>
          <h3 className="text-sm font-bold text-slate-300">Your Garage Workspace is Empty</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">Add a car above to start logging rows to your database profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vehicles.map((car) => (
            <div key={car.id} className="bg-linear-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl relative overflow-hidden group flex flex-col justify-between space-y-6">
              
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 mr-2">
                    {car.year}
                  </span>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-900 text-cyan-400 uppercase tracking-tight">
                    {car.classification}
                  </span>
                  <h3 className="text-xl font-black text-white pt-2">{car.make} {car.model}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                    Paint Specs: <span className="text-slate-200 font-medium">{car.paint_color}</span>
                  </p>
                </div>

                <div className="text-3xl p-3 bg-slate-950/60 rounded-xl border border-slate-800 shadow-inner">
                  {car.classification === 'SUV' ? '🚙' : '🏎️'}
                </div>
              </div>

              <div className="border-t border-slate-900/80 pt-4 flex items-center justify-between relative z-10">
                <button 
                  onClick={() => {
                    if (onScheduleSession) {
                      onScheduleSession();
                    } else {
                      setActiveTab('bookings');
                    }
                  }}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Schedule Studio Session →
                </button>
                <button 
                  onClick={() => handleDeleteVehicle(car.id)}
                  className="text-[10px] font-mono text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Unlink Vehicle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}