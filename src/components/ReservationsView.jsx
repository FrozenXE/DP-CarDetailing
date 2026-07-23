import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabaseClient";
import {
  getServicePackageById,
  servicePackages,
} from "../data/servicePackages";

const timeSlots = ["09:00", "11:30", "14:00", "16:30"];
const reservedStatuses = ["pending", "active", "curing"];

const statusStyles = {
  pending: "border-amber-900/50 bg-amber-950/40 text-amber-400",
  active: "border-blue-900/50 bg-blue-950/40 text-blue-400",
  curing: "border-sky-900/50 bg-sky-950/40 text-sky-400",
  completed: "border-emerald-900/50 bg-emerald-950/40 text-emerald-400",
  cancelled: "border-red-900/50 bg-red-950/40 text-red-400",
};

export default function ReservationsView({
  user,
  setActiveTab,
  selectedPackageId,
  setSelectedPackageId,
  autoOpenWizard,
  setAutoOpenWizard,
  onAddVehicle,
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [myVehicles, setMyVehicles] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedService, setSelectedService] = useState(
    selectedPackageId || servicePackages[0]?.id || "",
  );
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(timeSlots[0]);
  const [notes, setNotes] = useState("");
  const [showWizard, setShowWizard] = useState(false);
  const [cancelModal, setCancelModal] = useState({
    open: false,
    bookingId: null,
  });
  const todayString = new Date().toISOString().split("T")[0];
  const selectedPackage = getServicePackageById(selectedService);

  useEffect(() => {
    if (selectedPackageId && getServicePackageById(selectedPackageId))
      setSelectedService(selectedPackageId);
  }, [selectedPackageId]);

  useEffect(() => {
    if (autoOpenWizard) {
      setShowWizard(true);
      setAutoOpenWizard(false);
    }
  }, [autoOpenWizard, setAutoOpenWizard]);

  useEffect(() => {
    async function loadBookings() {
      if (!user) {
        setMyVehicles([]);
        setMyBookings([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [
          { data: vehicles, error: vehiclesError },
          { data: bookings, error: bookingsError },
        ] = await Promise.all([
          supabase.from("vehicles").select("*").eq("user_id", user.id),
          supabase
            .from("bookings")
            .select(
              "id, appointment_date, arrival_time_slot, status, special_instructions, service_id, vehicles ( make, model, year )",
            )
            .eq("user_id", user.id)
            .order("appointment_date", { ascending: true }),
        ]);
        if (vehiclesError) throw vehiclesError;
        if (bookingsError) throw bookingsError;
        setMyVehicles(vehicles || []);
        setSelectedVehicle((current) => current || vehicles?.[0]?.id || "");
        setMyBookings(bookings || []);
      } catch (error) {
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, [user]);

  const handleCreateBooking = async (event) => {
    event.preventDefault();
    if (!selectedVehicle || !selectedService || !appointmentDate) {
      setErrorMsg(t("booking_validation_required"));
      return;
    }
    if (appointmentDate < todayString) {
      setErrorMsg(t("booking_validation_date"));
      return;
    }
    try {
      setErrorMsg("");
      setSuccessMsg("");

      const { data: slotBookings, error: availabilityError } = await supabase
        .from("bookings")
        .select("id")
        .eq("appointment_date", appointmentDate)
        .eq("arrival_time_slot", timeSlot)
        .in("status", reservedStatuses)
        .limit(1);

      if (availabilityError) throw availabilityError;
      if (slotBookings?.length) {
        setErrorMsg(t("booking_slot_unavailable"));
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            user_id: user.id,
            vehicle_id: selectedVehicle,
            service_id: selectedService,
            appointment_date: appointmentDate,
            arrival_time_slot: timeSlot,
            special_instructions: notes,
            status: "pending",
          },
        ])
        .select(
          "id, appointment_date, arrival_time_slot, status, special_instructions, service_id, vehicles ( make, model, year )",
        )
        .single();
      if (error) throw error;
      setMyBookings((current) => [...current, data]);
      setSuccessMsg(t("booking_success"));
      setNotes("");
      setShowWizard(false);
      setSelectedPackageId(null);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleCancelBooking = async () => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", cancelModal.bookingId);
      if (error) throw error;
      setMyBookings((current) =>
        current.map((booking) =>
          booking.id === cancelModal.bookingId
            ? { ...booking, status: "cancelled" }
            : booking,
        ),
      );
      setSuccessMsg(t("booking_cancelled"));
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setCancelModal({ open: false, bookingId: null });
    }
  };

  if (loading)
    return (
      <div className="py-20 text-center font-mono text-xs tracking-widest text-slate-400 animate-pulse">
        {t("booking_loading")}
      </div>
    );
  if (!user)
    return (
      <div className="mx-auto max-w-md space-y-4 rounded-3xl border border-slate-900 bg-slate-900/10 py-20 text-center">
        <div className="text-3xl">🔒</div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-200">
          {t("booking_locked_title")}
        </h3>
        <p className="mx-auto max-w-xs px-4 text-xs text-slate-400">
          {t("booking_locked_desc")}
        </p>
        <button
          onClick={() => setActiveTab("auth")}
          className="cursor-pointer rounded-xl bg-linear-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-950"
        >
          {t("booking_access_portal")}
        </button>
      </div>
    );

  return (
    <div className="space-y-12 pb-12 text-slate-100 animate-fade-in">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <span className="rounded border border-cyan-900 bg-cyan-950 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-400">
            {t("booking_badge")}
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white">
            {t("booking_title")}
          </h1>
          <p className="text-xs text-slate-400">{t("booking_desc")}</p>
        </div>
        {myVehicles.length > 0 && (
          <button
            onClick={() => setShowWizard((open) => !open)}
            className="self-start cursor-pointer rounded-xl bg-linear-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 sm:self-center"
          >
            {showWizard ? t("booking_cancel_form") : t("booking_request")}
          </button>
        )}
      </div>
      {errorMsg && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-center text-xs font-medium text-red-300">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/40 p-4 text-center text-xs font-medium text-cyan-300">
          {successMsg}
        </div>
      )}
      {showWizard && (
        <form
          onSubmit={handleCreateBooking}
          className="max-w-2xl space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wide text-cyan-400">
              {t("booking_form_title")}
            </h3>
            <button
              type="button"
              onClick={() => setShowWizard(false)}
              className="cursor-pointer text-xs font-bold text-slate-400 hover:text-cyan-400"
            >
              {t("booking_back")}
            </button>
          </div>
          {selectedPackage && (
            <div className="space-y-1 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
                {t("booking_selected_package")}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {t(selectedPackage.name)}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {t(selectedPackage.tagline)}
                  </p>
                </div>
                <span className="text-sm font-black text-cyan-400">
                  {selectedPackage.price}
                </span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="font-mono text-[10px] uppercase text-slate-400">
                {t("booking_vehicle")} *
              </span>
              <select
                value={selectedVehicle}
                onChange={(event) => {
                  if (event.target.value === "add-vehicle") {
                    onAddVehicle();
                    return;
                  }
                  setSelectedVehicle(event.target.value);
                }}
                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white"
              >
                <option value="" disabled>
                  {t("booking_select_vehicle")}
                </option>
                {myVehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </option>
                ))}
                <option value="add-vehicle">
                  + {t("booking_add_vehicle", "Add a vehicle")}
                </option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="font-mono text-[10px] uppercase text-slate-400">
                {t("booking_package")} *
              </span>
              <select
                value={selectedService}
                onChange={(event) => setSelectedService(event.target.value)}
                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white"
              >
                {servicePackages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {t(pkg.name)} ({pkg.price})
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="font-mono text-[10px] uppercase text-slate-400">
                {t("booking_date")} *
              </span>
              <input
                type="date"
                required
                min={todayString}
                value={appointmentDate}
                onChange={(event) => setAppointmentDate(event.target.value)}
                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white"
              />
            </label>
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase text-slate-400">
                {t("booking_time")}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`cursor-pointer rounded-lg border py-2 font-mono text-[10px] font-bold ${timeSlot === slot ? "border-cyan-500/40 bg-slate-950 text-cyan-400" : "border-slate-900 bg-slate-950 text-slate-500"}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <label className="space-y-1">
            <span className="font-mono text-[10px] uppercase text-slate-400">
              {t("booking_notes")}
            </span>
            <textarea
              placeholder={t("booking_notes_placeholder")}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows="2"
              className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white"
            />
          </label>
          <button
            type="submit"
            className="w-full cursor-pointer rounded-xl bg-linear-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-slate-950"
          >
            {t("booking_submit")}
          </button>
        </form>
      )}
      {myVehicles.length === 0 && (
        <div className="mx-auto max-w-xl space-y-3 rounded-3xl border border-dashed border-slate-800 bg-slate-900/10 py-12 text-center">
          <div className="text-2xl">⚠️</div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-300">
            {t("booking_no_vehicle_title")}
          </h3>
          <p className="mx-auto max-w-xs text-xs text-slate-500">
            {t("booking_no_vehicle_desc")}
          </p>
          <button
            onClick={() => setActiveTab("garage")}
            className="cursor-pointer text-xs font-bold text-cyan-400 hover:underline"
          >
            {t("booking_go_garage")}
          </button>
        </div>
      )}
      <div className="space-y-4">
        <h2 className="font-mono text-sm uppercase tracking-widest text-slate-400">
          {t("booking_list_title")}
        </h2>
        {myBookings.length === 0 ? (
          <p className="py-4 font-mono text-xs italic text-slate-600">
            {t("booking_empty")}
          </p>
        ) : (
          <div className="space-y-3">
            {myBookings.map((booking) => {
              const pkg = getServicePackageById(booking.service_id);
              const canCancel = !["completed", "cancelled"].includes(
                booking.status,
              );
              return (
                <div
                  key={booking.id}
                  className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-900 bg-slate-900/40 p-4 sm:flex-row sm:items-center"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                        {booking.appointment_date}
                      </span>
                      <span className="rounded border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-[10px] text-cyan-400">
                        {booking.arrival_time_slot}
                      </span>
                    </div>
                    <h4 className="pt-1 text-sm font-bold text-white">
                      {pkg ? t(pkg.name) : t("booking_unknown_package")}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {t("booking_assigned_vehicle")}:{" "}
                      <span className="text-slate-200">
                        {booking.vehicles?.year} {booking.vehicles?.make}{" "}
                        {booking.vehicles?.model}
                      </span>
                    </p>
                    {booking.special_instructions && (
                      <p className="pt-1 font-mono text-[11px] italic text-slate-500">
                        {t("booking_notes")}: “{booking.special_instructions}”
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 self-end sm:self-center">
                    {canCancel && (
                      <button
                        type="button"
                        onClick={() =>
                          setCancelModal({ open: true, bookingId: booking.id })
                        }
                        className="cursor-pointer rounded-full border border-red-900/50 bg-red-950/20 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-red-400"
                      >
                        {t("booking_cancel")}
                      </button>
                    )}
                    <span
                      className={`rounded-full border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest ${
                        statusStyles[booking.status] || statusStyles.pending
                      }`}
                    >
                      ● {t(`booking_status_${booking.status}`, booking.status)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {cancelModal.open && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
              {t("booking_cancel_title")}
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              {t("booking_cancel_desc")}
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setCancelModal({ open: false, bookingId: null })}
                className="cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs font-semibold uppercase text-slate-300"
              >
                {t("booking_keep")}
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                className="cursor-pointer rounded-xl bg-linear-to-r from-red-500 to-rose-600 px-4 py-2.5 text-xs font-black uppercase text-white"
              >
                {t("booking_confirm_cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
