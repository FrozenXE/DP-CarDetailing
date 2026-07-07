import React, { useState } from 'react';

export default function StudioHome({ 
  setActiveTab, 
  onBookNow,
  vehicleCount = 0, 
  bookingCount = 0, 
  serviceCount = 4 
}) {
  const [openFaq, setOpenFaq] = useState(null);

  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="space-y-16 pb-12 pl-4 pr-4 animate-fade-in text-slate-100">
      
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 shadow-2xl min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1920&q=80" 
            alt="Luxury detailing studio" 
            className="w-full h-full object-cover object-center scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-2xl p-8 sm:p-12 lg:p-16 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>Now Booking Online Slots For This Week</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
            The Showroom Shine. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 bg-clip-text text-transparent font-extrabold">
              Preserved Permanently.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed drop-shadow-md">
            Experience ultra-premium automotive detailing. From multi-stage machine paint corrections to certified 9H nanotech ceramic coatings, we treat your vehicle to elite aesthetic and protective standards.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <button 
              onClick={() => (onBookNow ? onBookNow() : setActiveTab('bookings'))} 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm"
            >
              Book Studio Appointment
            </button>
            <button 
              onClick={() => setActiveTab('garage')} 
              className="bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-6 py-3.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm backdrop-blur-sm shadow-inner"
            >
              Access My Garage ({vehicleCount})
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Your Personal Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Your Registered Garage', value: vehicleCount > 0 ? `${vehicleCount} Saved Vehicles` : '0 Vehicles Linked', description: 'Add cars to build custom treatments', icon: '🚗', color: 'from-cyan-500/10 via-cyan-500/5 to-transparent', border: 'hover:border-cyan-500/30' },
            { label: 'Active Reservations', value: bookingCount > 0 ? `${bookingCount} Pending Orders` : 'No Active Bookings', description: 'Your scheduled studio sessions', icon: '📅', color: 'from-blue-500/10 via-blue-500/5 to-transparent', border: 'hover:border-blue-500/30' },
            { label: 'Available Packages', value: `${serviceCount} Studio Menus`, description: 'Premium treatment options open', icon: '✨', color: 'from-purple-500/10 via-purple-500/5 to-transparent', border: 'hover:border-purple-500/30' },
          ].map((stat, index) => (
            <div key={index} className={`bg-gradient-to-br ${stat.color} bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl flex items-center justify-between shadow-xl transition-all duration-300 ${stat.border} group hover:-translate-y-1`}>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                <h3 className="text-xl font-black text-white font-mono tracking-tight">{stat.value}</h3>
                <p className="text-xs text-slate-400">{stat.description}</p>
              </div>
              <div className="text-2xl bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl shadow-inner group-hover:scale-110 group-hover:bg-slate-900 transition-all duration-300">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/30 p-6 sm:p-8 rounded-3xl border border-slate-900/80">
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-cyan-950 border border-cyan-900 text-cyan-400 uppercase tracking-widest">
            Real Studio Results
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Paint Correction Results</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Drag the interactive center slider left and right to observe how our signature dual-action micro-compounding stage slices away swirl marks, spiderweb surface abrasions, and dull oxidative weathering to reveal deep optical clarity.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-y-2 sm:gap-x-6 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Defect Swirl Removal: 95%+</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Mirror Gloss Index: +42%</span>
          </div>
        </div>

        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 p-3 rounded-2xl shadow-2xl relative select-none w-full">
          <div className="relative h-72 sm:h-80 w-full rounded-xl overflow-hidden bg-slate-900">
            
            <div className="absolute inset-0 w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80" 
                alt="Flawless mirror gloss car paint finish after detailing"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 z-10 text-[9px] font-mono font-bold tracking-widest text-cyan-400 bg-slate-950/80 px-2 py-1 rounded border border-cyan-500/30 backdrop-blur-sm">
                AFTER CERAMIC SHIELD
              </span>
            </div>

            <div 
              className="absolute inset-0 h-full border-r-2 border-cyan-400 overflow-hidden shadow-[8px_0_20px_rgba(0,0,0,0.7)]"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="absolute inset-0 w-full h-full min-w-[300px] sm:min-w-[500px] lg:min-w-[600px]">
                <img 
                  src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80" 
                  alt="Scratched car paint work before correction"
                  className="w-full h-full object-cover filter saturate-[0.6] contrast-[1.15] brightness-[0.85] blur-[0.5px]"
                />
                <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none mix-blend-screen opacity-40"></div>
              </div>
              <span className="absolute top-3 left-3 z-10 text-[9px] font-mono font-bold tracking-widest text-red-400 bg-slate-950/80 px-2 py-1 rounded border border-red-500/30 whitespace-nowrap backdrop-blur-sm">
                BEFORE: HEAVY SWIRLS
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-4 px-1">
            <span className="text-[10px] font-mono text-slate-500 font-bold">BEFORE</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="flex-grow accent-cyan-400 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none"
            />
            <span className="text-[10px] font-mono text-cyan-400 font-bold">AFTER</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight">The Professional Studio Standard</h2>
          <p className="text-xs text-slate-400">Why premium automotive care requires scientific precision over automated car wash bays.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Three-Bucket Wash Method', desc: 'Separate cleaning solution grids and dedicated lower-body mitts isolate grit lines, eliminating wash-induced swirl markings completely.', img: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=400&q=80' },
            { title: 'Chemical Paint Prep', desc: 'Advanced active pH iron-dissolving chemical baths pull micro-particulate metallic fallout completely free from automotive clear coats.', img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80' },
            { title: 'Certified Ceramic Experts', desc: 'Authorized technicians apply liquid silica quartz layers uniformly to guarantee long-term surface cross-linking strength.', img: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=400&q=80' },
            { title: 'Climate Controlled Bays', desc: 'Regulated clean rooms monitor ambient humidity and dust counts to isolate coatings during sensitive initial crystallization hours.', img: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80' }
          ].map((item, idx) => (
            <div key={idx} className="overflow-hidden bg-slate-900/40 border border-slate-800 rounded-2xl shadow-lg hover:border-slate-700 transition-all flex flex-col group">
              <div className="h-40 w-full overflow-hidden relative">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              </div>
              <div className="p-5 flex-grow space-y-2 relative z-10 bg-slate-900/20">
                <h3 className="text-sm font-bold text-slate-100 tracking-wide">{item.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-4">
          <div>
            <h2 className="text-xl font-black text-white tracking-wide">Client Experiences</h2>
            <p className="text-xs text-slate-400 mt-0.5">Real feedback from verified luxury vehicle and exotic fleet owners.</p>
          </div>
          <div className="flex items-center space-x-1 bg-slate-900 px-3 py-1 rounded-md border border-slate-800/60 text-xs font-mono text-amber-400">
            <span>⭐️ 4.96/5.00 Studio Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { author: 'Marcus V. (Porsche GT3 RS)', text: 'The paint correction restored a level of clarity I did not think was possible. Reflections look like liquid mirror. Highly recommend their ceramic packages.', rating: '⭐⭐⭐⭐⭐' },
            { author: 'Elena R. (Tesla Model S Plaid)', text: 'Absolute perfection. The interior steam extraction completely pulled out all tracking dust. Booking appointments directly through the profile panel was seamless.', rating: '⭐⭐⭐⭐⭐' },
            { author: 'Dave K. (BMW M3 Coupe)', text: 'Flawless treatment. Zero micro-scratch webbing left behind. The climate-controlled clean-room curation bay shows their unmatched attention to details.', rating: '⭐⭐⭐⭐⭐' }
          ].map((rev, idx) => (
            <div key={idx} className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm">
              <div className="space-y-2">
                <div className="text-xs text-amber-400 font-mono tracking-tight">{rev.rating}</div>
                <p className="text-xs text-slate-300 italic leading-relaxed">&ldquo;{rev.text}&rdquo;</p>
              </div>
              <div className="text-[11px] font-bold text-slate-400 font-mono border-t border-slate-800/50 pt-2 flex items-center justify-between">
                <span>{rev.author}</span>
                <span className="text-cyan-500 text-[9px] bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-900/30">Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-black text-white tracking-wide">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Clear breakdowns of professional chemical detailing and car care boundaries.</p>
        </div>

        <div className="space-y-3">
          {[
            { q: "What is the difference between a standard wax and a Ceramic Coating?", a: "Traditional automotive wax sits as a temporary layer on top of your paint clear coat and degrades under heat washing cycles within weeks. Ceramic coatings utilize modern liquid nanotech silica (SiO2) compounds that chemically bond deep into your clear-coat pore structures, forming an ultra-hard sacrificial high-gloss glass barrier lasting years." },
            { q: "Does Paint Correction eliminate deep scratches down to the metal?", a: "Paint correction works safely by leveling micro-fractions of your vehicle's top clear coat layer to remove blemishes. If a scratch completely penetrates through the clear coat down past the color primer coat, it cannot be safely polished out and requires professional automotive touch-up paint filling." },
            { q: "How long must my vehicle remain inside the curing bay post ceramic treatment?", a: "We require vehicles to remain inside our sealed indoor climate-stabilized studio environment for a minimum of twelve hours post-application. This ensures initial protective cross-linking occurs perfectly before exposing the fresh coating to ambient road conditions." }
          ].map((faq, idx) => (
            <div key={idx} className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left px-5 py-4 flex justify-between items-center bg-slate-900/80 hover:bg-slate-900 transition-all cursor-pointer text-xs font-bold text-slate-200 focus:outline-none"
              >
                <span>{faq.q}</span>
                <span className="text-cyan-400 font-mono text-sm">{openFaq === idx ? '−' : '+'}</span>
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openFaq === idx ? 'max-h-40 border-t border-slate-800/60 opacity-100 py-4' : 'max-h-0 opacity-0'
                } px-5 text-xs text-slate-400 leading-relaxed bg-slate-950/40`}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-2xl text-center space-y-6 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <h3 className="text-xl font-black text-white tracking-wide">Ready to Transform Your Vehicle?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Register your vehicle inside your account garage workspace profile and lock down an open detailing suite bay timing slot instantly.
          </p>
        </div>
        <div className="pt-2 relative z-10">
          <button 
            onClick={() => (onBookNow ? onBookNow() : setActiveTab('bookings'))}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold px-8 py-3 rounded-xl shadow-xl shadow-cyan-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs tracking-wider uppercase cursor-pointer"
          >
            Configure Appointment Now
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-slate-800/60 pt-6 max-w-sm mx-auto text-[11px] font-mono text-slate-500">
          <div>
            <p className="font-bold text-slate-400">Studio Hours</p>
            <p className="mt-0.5">Mon - Sat: 8AM - 6PM</p>
          </div>
          <div>
            <p className="font-bold text-slate-400">Studio Location</p>
            <p className="mt-0.5">Premium Curation Suite Bay A</p>
          </div>
        </div>
      </div>

    </div>
  );
}