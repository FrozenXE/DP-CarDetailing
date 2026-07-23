import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabaseClient";
import { getServicePackageById } from "../data/servicePackages";

const statusStyles = {
  pending: "bg-amber-400",
  active: "bg-emerald-400",
  curing: "bg-sky-400",
  completed: "bg-violet-400",
  cancelled: "bg-red-400",
  default: "bg-slate-500",
};

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  const fetchAllBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        id, appointment_date, arrival_time_slot, status, special_instructions, service_id,
        profiles (full_name, phone),
        vehicles (year, make, model)
      `,
      )
      .order("appointment_date", { ascending: true });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setStatusUpdates((prev) => ({ ...prev, [id]: newStatus }));
  };

  const confirmStatusUpdate = async (id) => {
    const newStatus = statusUpdates[id];
    if (!newStatus) return;

    try {
      setUpdatingBookingId(id);
      setMessage({ type: "", text: "" });
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setStatusUpdates((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setMessage({ type: "success", text: "Booking status updated." });
      fetchAllBookings();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const activeBookings = bookings.filter((b) => b.status !== "completed");
  const completedBookings = bookings.filter((b) => b.status === "completed");

  const renderTable = (dataList) => (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 overflow-x-auto">
      <table className="min-w-640 w-full text-left">
        <thead>
          <tr className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">
            <th className="p-3">Client</th>
            <th className="p-3">Vehicle</th>
            <th className="p-3">Service</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {dataList.map((b) => {
            const selectedStatus = statusUpdates[b.id] ?? b.status;
            const showConfirm =
              statusUpdates[b.id] && statusUpdates[b.id] !== b.status;
            const badgeClass =
              statusStyles[selectedStatus] || statusStyles.default;
            const servicePackage = getServicePackageById(b.service_id);

            return (
              <tr key={b.id} className="text-xs align-middle">
                <td className="p-3">{b.profiles?.full_name}</td>
                <td className="p-3">
                  {b.vehicles?.make} {b.vehicles?.model}
                </td>
                <td className="p-3">
                  {servicePackage
                    ? t(servicePackage.name)
                    : t("booking_unknown_package")}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${badgeClass}`}
                    ></span>
                    <select
                      value={selectedStatus}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className="bg-slate-800 text-slate-200 p-2 rounded-lg border border-slate-700"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="curing">Curing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
                <td className="p-3">
                  {showConfirm ? (
                    <button
                      onClick={() => confirmStatusUpdate(b.id)}
                      disabled={updatingBookingId === b.id}
                      className="rounded-lg bg-cyan-500 px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-slate-950 transition hover:bg-cyan-400 cursor-pointer"
                    >
                      {updatingBookingId === b.id ? "Saving..." : "Confirm"}
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                      No change
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 text-slate-400 text-center font-mono">
        Loading ledger...
      </div>
    );
  }

  return (
    <div className="text-slate-100 space-y-8">
      <h2 className="text-2xl font-black">🛡️ Studio Admin Ledger</h2>

      {message.text && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            message.type === "success"
              ? "border-cyan-500/30 bg-cyan-950/30 text-cyan-300"
              : "border-red-500/30 bg-red-950/30 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider">
          Active Operations ({activeBookings.length})
        </h3>
        {activeBookings.length === 0 ? (
          <div className="bg-slate-900/20 border border-slate-850 rounded-xl p-6 text-center text-slate-500 text-xs">
            No current pending or active operations.
          </div>
        ) : (
          renderTable(activeBookings)
        )}
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setIsCompletedOpen(!isCompletedOpen)}
          className="w-full flex items-center justify-between bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl transition-all cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <span className="text-violet-400 text-lg">✅</span>
            <span className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Completed Jobs History ({completedBookings.length})
            </span>
          </div>
          <span className="text-slate-400 text-sm transform transition-transform duration-200">
            {isCompletedOpen ? "▲ Hide" : "▼ View"}
          </span>
        </button>

        {isCompletedOpen && (
          <div className="animate-fade-in space-y-2">
            {completedBookings.length === 0 ? (
              <div className="bg-slate-900/20 border border-slate-850 rounded-xl p-6 text-center text-slate-500 text-xs">
                No history of completed jobs recorded.
              </div>
            ) : (
              renderTable(completedBookings)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
