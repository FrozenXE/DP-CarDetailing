import React, { useState } from "react";
import beforeImg from "/before.jpg";
import afterImg from "/after.jpg";
import koliImg from "/koli.png"; 
import opaImg from "/opa.jpg"; 
import deepCleanImg from "/deepClean.png"; 
import klimaImg from "/klima.png"; 
import tinImg from "/tin.png"; 
import { useTranslation } from "react-i18next";
import TeamSection from "./TeamSection";

export default function StudioHome({
  setActiveTab,
  onBookNow,
  vehicleCount = null,
  bookingCount = null,
  serviceCount = 4,
}) {
  const [openFaq, setOpenFaq] = useState(null);
  const { t } = useTranslation();
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleBookNow = () => {
    if (vehicleCount === 0) {
      setActiveTab("garage");
      return;
    }

    if (onBookNow) {
      onBookNow();
    } else {
      setActiveTab("bookings");
    }
  };

  return (
    <div className="space-y-16 pb-12 pl-4 pr-4 animate-fade-in text-slate-100">
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 shadow-2xl min-h-125 flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={koliImg}
            alt="Luxury detailing studio"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/90 to-slate-900/40"></div>
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-2xl p-8 sm:p-12 lg:p-16 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>
              {t(
                "booking_slots_alert",
                "Now Booking Online Slots For This Week",
              )}
            </span>
          </div>

          <h1 className="text-4xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
            {t("hero_title_1", "The Pinnacle of Automotive Curation.")} <br />
            <span className="bg-linear-to-r from-cyan-400 via-teal-400 to-blue-500 bg-clip-text text-transparent font-extrabold">
              {t("hero_title_2", "Perfection, Preserved Permanently.")}
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed drop-shadow-md">
            {t(
              "hero_desc",
              "Experience elite-tier automotive detailing tailored for luxury, exotic, and classic vehicles. From meticulous multi-stage machine paint correction to certified 9H+ nanotech ceramic coatings, we execute every treatment with scientific precision to achieve unmatched optical clarity and permanent surface protection.",
            )}
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={handleBookNow}
              className="bg-linear-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm"
            >
              {t("btn_book_studio", "Book Studio Appointment")}
            </button>
            <button
              onClick={() => setActiveTab("garage")}
              className="bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-6 py-3.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm backdrop-blur-sm shadow-inner"
            >
              {vehicleCount === null
                ? t("btn_garage_signin", "Access My Garage")
                : t("btn_garage_count", "Access My Garage ({{count}})", {
                    count: vehicleCount,
                  })}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
          {t("section_dashboard", "Your Personal Dashboard")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              label: t("lbl_dash_garage", "Your Registered Garage"),
              value:
                vehicleCount === null
                  ? t("val_dash_garage_signin", "Sign in to link vehicles")
                  : vehicleCount > 0
                    ? t("val_dash_garage_count", "{{count}} Saved Vehicles", {
                        count: vehicleCount,
                      })
                    : t("val_dash_garage_empty", "0 Vehicles Linked"),
              description: t(
                "desc_dash_garage",
                "Add cars to build custom treatments",
              ),
              icon: "🚗",
              color: "from-cyan-500/10 via-cyan-500/5 to-transparent",
              border: "hover:border-cyan-500/30",
            },
            {
              label: t("lbl_dash_bookings", "Active Reservations"),
              value:
                bookingCount === null
                  ? t(
                      "val_dash_bookings_signin",
                      "Sign in to view reservations",
                    )
                  : bookingCount > 0
                    ? t("val_dash_bookings_count", "{{count}} Pending Orders", {
                        count: bookingCount,
                      })
                    : t("val_dash_bookings_empty", "No Active Bookings"),
              description: t(
                "desc_dash_bookings",
                "Your scheduled studio sessions",
              ),
              icon: "📅",
              color: "from-blue-500/10 via-blue-500/5 to-transparent",
              border: "hover:border-blue-500/30",
            },
            {
              label: t("lbl_dash_packages", "Available Packages"),
              value: t("val_dash_packages_count", "{{count}} Studio Menus", {
                count: serviceCount,
              }),
              description: t(
                "desc_dash_packages",
                "Premium treatment options open",
              ),
              icon: "✨",
              color: "from-purple-500/10 via-purple-500/5 to-transparent",
              border: "hover:border-purple-500/30",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-linear-to-br ${stat.color} bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl transition-all duration-300 ${stat.border} group hover:-translate-y-1`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </span>
                <h3 className="text-xl font-black text-white font-mono tracking-tight">
                  {stat.value}
                </h3>
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
            {t("badge_results", "Real Studio Results")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t("slider_heading", "Paint Correction Results")}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t(
              "slider_desc",
              "Drag the interactive center slider left and right to observe how our signature dual-action micro-compounding stage slices away swirl marks, spiderweb surface abrasions, and dull oxidative weathering to reveal deep optical clarity.",
            )}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-y-2 sm:gap-x-6 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>{" "}
              {t("metric_swirls", "Defect Swirl Removal: 95%+")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>{" "}
              {t("metric_gloss", "Mirror Gloss Index: +42%")}
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 p-3 rounded-2xl shadow-2xl relative select-none w-full">
          <div className="relative h-72 sm:h-80 w-full rounded-xl overflow-hidden bg-slate-900">
            <div className="absolute inset-0 w-full h-full">
              <img
                src={afterImg}
                alt="Flawless mirror gloss car paint finish after detailing"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 z-10 text-[9px] font-mono font-bold tracking-widest text-cyan-400 bg-slate-950/80 px-2 py-1 rounded border border-cyan-500/30 backdrop-blur-sm">
                {t("label_after", "AFTER CERAMIC SHIELD")}
              </span>
            </div>

            <div
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={beforeImg}
                alt="Scratched car paint work before correction"
                className="w-full h-full object-cover filter saturate-[0.6] contrast-[1.15] brightness-[0.85] blur-[0.5px]"
              />
              <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none mix-blend-screen opacity-40"></div>
              <span className="absolute top-3 left-3 z-10 text-[9px] font-mono font-bold tracking-widest text-red-400 bg-slate-950/80 px-2 py-1 rounded border border-red-500/30 whitespace-nowrap backdrop-blur-sm">
                {t("label_before", "BEFORE: HEAVY SWIRLS")}
              </span>
            </div>

            <div
              className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.7)] pointer-events-none z-20"
              style={{ left: `${sliderPosition}%` }}
            />
          </div>

          <div className="mt-4 flex items-center space-x-4 px-1">
            <span className="text-[10px] font-mono text-slate-500 font-bold">
              {t("slider_min_label", "BEFORE")}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="grow accent-cyan-400 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none"
            />
            <span className="text-[10px] font-mono text-cyan-400 font-bold">
              {t("slider_max_label", "AFTER")}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight">
            {t("standards_heading", "The Professional Studio Standard")}
          </h2>
          <p className="text-xs text-slate-400">
            {t(
              "standards_subheading",
              "Why premium automotive care requires scientific precision over automated car wash bays.",
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              key: "polish",
              img: opaImg,
            },
            {
              key: "interior",
              img: deepCleanImg,
            },
            {
              key: "hvac",
              img: klimaImg,
            },
            {
              key: "styling", 
              img: tinImg, 
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="overflow-hidden bg-slate-900/40 border border-slate-800 rounded-2xl shadow-lg hover:border-slate-700 transition-all flex flex-col group"
            >
              <div className="h-40 w-full overflow-hidden relative">
                <img
                  src={item.img}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              </div>
              <div className="p-5 grow space-y-2 relative z-10 bg-slate-900/20">
                <h3 className="text-sm font-bold text-slate-100 tracking-wide">
                  {t(`std_title_${item.key}`)}
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t(`std_desc_${item.key}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-4">
          <div>
            <h2 className="text-xl font-black text-white tracking-wide">
              {t("reviews_heading", "Client Experiences")}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t(
                "reviews_subheading",
                "Real feedback from verified luxury vehicle and exotic fleet owners.",
              )}
            </p>
          </div>
          <div className="flex items-center space-x-1 bg-slate-900 px-3 py-1 rounded-md border border-slate-800/60 text-xs font-mono text-amber-400">
            <span>⭐️ {t("studio_rating", "4.96/5.00 Studio Rating")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              author: t("rev_author_1", "Marcus V. (Porsche GT3 RS)"),
              text: t(
                "rev_text_1",
                "The paint correction restored a level of clarity I did not think was possible. Reflections look like liquid mirror. Highly recommend their ceramic packages.",
              ),
              rating: "⭐⭐⭐⭐•",
            },
            {
              author: t("rev_author_2", "Elena R. (Tesla Model S Plaid)"),
              text: t(
                "rev_text_2",
                "Absolute perfection. The interior steam extraction completely pulled out all tracking dust. Booking appointments directly through the profile panel was seamless.",
              ),
              rating: "⭐⭐⭐⭐•",
            },
            {
              author: t("rev_author_3", "Dave K. (BMW M3 Coupe)"),
              text: t(
                "rev_text_3",
                "Flawless treatment. Zero micro-scratch webbing left behind. The climate-controlled clean-room curation bay shows their unmatched attention to details.",
              ),
              rating: "⭐⭐⭐⭐•",
            },
          ].map((rev, idx) => (
            <div
              key={idx}
              className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-2">
                <div className="text-xs text-amber-400 font-mono tracking-tight">
                  ⭐⭐⭐⭐⭐
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>
              <div className="text-[11px] font-bold text-slate-400 font-mono border-t border-slate-800/50 pt-2 flex items-center justify-between">
                <span>{rev.author}</span>
                <span className="text-cyan-500 text-[9px] bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-900/30">
                  {t("verified_tag", "Verified")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-black text-white tracking-wide">
            {t("faq_heading", "Frequently Asked Questions")}
          </h2>
          <p className="text-xs text-slate-400">
            {t(
              "faq_subheading",
              "Clear breakdowns of professional chemical detailing and car care boundaries.",
            )}
          </p>
        </div>

        <div className="space-y-3">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left px-5 py-4 flex justify-between items-center bg-slate-900/80 hover:bg-slate-900 transition-all cursor-pointer text-xs font-bold text-slate-200 focus:outline-none"
              >
                <span>{t(`faq_q_${idx}`)}</span>
                <span className="text-cyan-400 font-mono text-sm">
                  {openFaq === idx ? "−" : "+"}
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openFaq === idx
                    ? "max-h-40 border-t border-slate-800/60 opacity-100 py-4"
                    : "max-h-0 opacity-0"
                } px-5 text-xs text-slate-400 leading-relaxed bg-slate-950/40`}
              >
                {t(`faq_a_${idx}`)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <TeamSection />

      <div className="bg-linear-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-2xl text-center space-y-6 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <h3 className="text-xl font-black text-white tracking-wide">
            {t("cta_title", "Ready to Transform Your Vehicle?")}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            {t(
              "cta_desc",
              "Register your vehicle inside your account garage workspace profile and lock down an open detailing suite bay timing slot instantly.",
            )}
          </p>
        </div>
        <div className="pt-2 relative z-10">
          <button
            onClick={handleBookNow}
            className="bg-linear-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold px-8 py-3 rounded-xl shadow-xl shadow-cyan-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs tracking-wider uppercase cursor-pointer"
          >
            {t("btn_cta_action", "Configure Appointment Now")}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-slate-800/60 pt-6 max-w-sm mx-auto text-[11px] font-mono text-slate-500">
          <div>
            <p className="font-bold text-slate-400">
              {t("footer_hours_lbl", "Studio Hours")}
            </p>
            <p className="mt-0.5">
              {t("footer_hours_val", "Mon - Sat: 8AM - 6PM")}
            </p>
          </div>
          <div>
            <p className="font-bold text-slate-400">
              {t("footer_loc_lbl", "Studio Location")}
            </p>
            <p className="mt-0.5">
              {t("footer_loc_val", "Premium Curation Suite Bay A")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}