import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabaseClient";

export default function GarageView({
  user,
  setActiveTab,
  onScheduleSession,
  autoOpenAddForm,
  setAutoOpenAddForm,
}) {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [classification, setClassification] = useState("Sedan");
  const [paintColor, setPaintColor] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (autoOpenAddForm) {
      setShowAddForm(true);
      setAutoOpexnAddForm(false);
    }
  }, [autoOpenAddForm, setAutoOpenAddForm]);

  useEffect(() => {
    async function getVehicles() {
      try {
        setLoading(true);
        if (!user) {
          setVehicles([]);
          return;
        }
        const { data, error } = await supabase
          .from("vehicles")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setVehicles(data || []);
      } catch (error) {
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    }
    getVehicles();
  }, [user]);

  const handleAddVehicle = async (event) => {
    event.preventDefault();
    if (!user || !make || !model) return;
    try {
      setErrorMsg("");
      const { data, error } = await supabase
        .from("vehicles")
        .insert([
          {
            user_id: user.id,
            year: year || "N/A",
            make,
            model,
            classification,
            paint_color: paintColor || t("garage_unspecified"),
          },
        ])
        .select();
      if (error) throw error;
      setVehicles((current) => [data[0], ...current]);
      setYear("");
      setMake("");
      setModel("");
      setClassification("Sedan");
      setPaintColor("");
      setShowAddForm(false);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleDeleteVehicle = async (id) => {
    try {
      const { error } = await supabase.from("vehicles").delete().eq("id", id);
      if (error) throw error;
      setVehicles((current) => current.filter((vehicle) => vehicle.id !== id));
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  if (loading)
    return (
      <div className="py-20 text-center font-mono text-xs tracking-widest text-slate-400 animate-pulse">
        {t("garage_loading")}
      </div>
    );
  if (!user)
    return (
      <div className="mx-auto max-w-md space-y-4 rounded-3xl border border-slate-900 bg-slate-900/10 py-20 text-center">
        <div className="text-3xl">🔒</div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-200">
          {t("garage_locked_title")}
        </h3>
        <p className="mx-auto max-w-xs px-4 text-xs text-slate-400">
          {t("garage_locked_desc")}
        </p>
        <button
          onClick={() => setActiveTab("auth")}
          className="cursor-pointer rounded-xl bg-linear-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-950"
        >
          {t("garage_sign_in")}
        </button>
      </div>
    );

  return (
    <div className="space-y-12 pb-12 text-slate-100 animate-fade-in">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <span className="rounded border border-cyan-900 bg-cyan-950 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-400">
            {t("garage_badge")}
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white">
            {t("garage_title")}
          </h1>
          <p className="text-xs text-slate-400">
            {t("garage_authenticated_user")}:{" "}
            <span className="font-mono text-cyan-400">{user.email}</span>
          </p>
        </div>
        <button
          onClick={() => setShowAddForm((open) => !open)}
          className="self-start cursor-pointer rounded-xl bg-linear-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 sm:self-center"
        >
          {showAddForm ? t("garage_close_form") : t("garage_add_car")}
        </button>
      </div>
      {errorMsg && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-center text-xs font-medium text-red-300">
          {t("garage_error")}: {errorMsg}
        </div>
      )}
      {showAddForm && (
        <form
          onSubmit={handleAddVehicle}
          className="max-w-2xl space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl"
        >
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-200">
            {t("garage_vehicle_specs")}
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <label className="space-y-1">
              <span className="font-mono text-[10px] uppercase text-slate-400">
                {t("garage_year")}
              </span>
              <input
                type="text"
                inputMode="numeric"
                maxLength="4"
                placeholder="2026"
                value={year}
                onChange={(event) =>
                  setYear(event.target.value.replace(/\D/g, "").slice(0, 4))
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
              />
            </label>
            <label className="space-y-1">
              <span className="font-mono text-[10px] uppercase text-slate-400">
                {t("garage_make")} *
              </span>
              <input
                type="text"
                placeholder="Porsche"
                required
                inputMode="text"
                value={make}
                onChange={(event) => setMake(event.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
              />
            </label>
            <label className="col-span-2 space-y-1">
              <span className="font-mono text-[10px] uppercase text-slate-400">
                {t("garage_model")} *
              </span>
              <input
                type="text"
                placeholder="GT3 RS"
                required
                value={model}
                onChange={(event) => setModel(event.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
              />
            </label>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="font-mono text-[10px] uppercase text-slate-400">
                {t("garage_classification")}
              </span>
              <select
                value={classification}
                onChange={(event) => setClassification(event.target.value)}
                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
              >
                <option value="Sedan">{t("garage_class_sedan")}</option>
                <option value="SUV">{t("garage_class_suv")}</option>
                <option value="Exotic/Sport">{t("garage_class_exotic")}</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="font-mono text-[10px] uppercase text-slate-400">
                {t("garage_paint_color")}
              </span>
              <input
                type="text"
                placeholder={t("garage_color_placeholder")}
                value={paintColor}
                onChange={(event) => setPaintColor(event.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer rounded-xl border border-cyan-500/20 bg-slate-800 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-cyan-400 sm:w-auto"
          >
            {t("garage_save")}
          </button>
        </form>
      )}
      {vehicles.length === 0 ? (
        <div className="space-y-3 rounded-3xl border-2 border-dashed border-slate-900 bg-slate-900/10 py-16 text-center">
          <div className="text-3xl">📭</div>
          <h3 className="text-sm font-bold text-slate-300">
            {t("garage_empty_title")}
          </h3>
          <p className="mx-auto max-w-xs text-xs text-slate-500">
            {t("garage_empty_desc")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {vehicles.map((car) => (
            <div
              key={car.id}
              className="relative flex flex-col justify-between space-y-6 overflow-hidden rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-xl"
            >
              <div className="relative z-10 flex items-start justify-between">
                <div className="space-y-1">
                  <span className="mr-2 rounded border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-400">
                    {car.year}
                  </span>
                  <span className="rounded border border-cyan-900 bg-cyan-950 px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-cyan-400">
                    {t(
                      `garage_class_${car.classification}`,
                      car.classification,
                    )}
                  </span>
                  <h3 className="pt-2 text-xl font-black text-white">
                    {car.make} {car.model}
                  </h3>
                  <p className="pt-1 text-xs text-slate-400">
                    {t("garage_paint_specs")}:{" "}
                    <span className="font-medium text-slate-200">
                      {car.paint_color}
                    </span>
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-3xl">
                  {car.classification === "SUV" ? "🚙" : "🏎️"}
                </div>
              </div>
              <div className="relative z-10 flex items-center justify-between border-t border-slate-900/80 pt-4">
                <button
                  onClick={() =>
                    onScheduleSession
                      ? onScheduleSession()
                      : setActiveTab("bookings")
                  }
                  className="cursor-pointer text-xs font-bold text-cyan-400 hover:text-cyan-300"
                >
                  {t("garage_schedule")} →
                </button>
                <button
                  onClick={() => handleDeleteVehicle(car.id)}
                  className="cursor-pointer font-mono text-[10px] text-slate-500 hover:text-red-400"
                >
                  {t("garage_unlink")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
