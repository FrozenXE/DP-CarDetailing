import React from 'react';
import { servicePackages } from '../data/servicePackages';

export default function ServicesView({ onConfigurePackage }) {
  const packages = servicePackages;

  return (
    <div className="space-y-12 pb-12 text-slate-100 animate-fade-in">
      
      <div className="space-y-2 max-w-2xl">
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-cyan-950 border border-cyan-900 text-cyan-400 uppercase tracking-widest">
          The Treatment Menu
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Premium Precision Studio Packages
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Select from our scientifically balanced paint, coating, and deep interior extraction services. Every assignment is carried out within a dust-monitored, climate-regulated studio environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {packages.map((pkg) => (
          <div 
            key={pkg.id} 
            className="group relative flex flex-col bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl hover:border-slate-700 transition-all duration-300"
          >
            <div className="h-56 relative w-full overflow-hidden">
              <img 
                src={pkg.image} 
                alt={pkg.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              
              <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-2">
                <span className="text-[9px] font-mono font-black uppercase tracking-widest bg-cyan-400 text-slate-950 px-2.5 py-1 rounded-md shadow-md">
                  {pkg.badge}
                </span>
              </div>

              <div className="absolute bottom-4 right-4 z-10 bg-slate-950/80 border border-slate-800/60 px-3 py-1 rounded-lg backdrop-blur-md text-[10px] font-mono text-slate-400 flex items-center space-x-1">
                <span>⏱️ {pkg.duration}</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-white group-hover:text-cyan-400 transition-colors">
                    {pkg.name}
                  </h2>
                  <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono tracking-tight">
                    {pkg.price}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium italic">{pkg.tagline}</p>
                
                <ul className="pt-4 space-y-2.5 border-t border-slate-900">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-xs text-slate-300 leading-normal">
                      <span className="text-cyan-500 mr-2 font-bold font-mono">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => onConfigurePackage(pkg.id)}
                  className="w-full text-center bg-slate-900 group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-500 text-slate-300 group-hover:text-slate-950 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer border border-slate-800 group-hover:border-transparent active:scale-[0.99]"
                >
                  Configure This Package
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/20 border border-slate-800/60 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 max-w-3xl mx-auto">
        <div className="text-3xl bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-inner shrink-0">🛡️</div>
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">The Apex Structural Care Guarantee</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            All multi-stage assignments are fully insured, digitally documented with paint-depth gauge verification readouts before any compounding equipment engages clear-coat surfaces.
          </p>
        </div>
      </div>

    </div>
  );
}