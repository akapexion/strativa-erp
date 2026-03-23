import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  BadgeAlert,
  InboxIcon,
  RefreshCw,
  ChevronRight,
  X,
} from "lucide-react";
import axios from "axios";
import { gooeyToast } from "goey-toast";

const LeaveRequests = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [requests,     setRequests]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [selected,     setSelected]     = useState(null);
  const [actionRemark, setActionRemark] = useState("");
  const [actioning,    setActioning]    = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // ── Status styles ──
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "approved": return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "rejected": return "bg-red-100 text-red-600 border border-red-200";
      default:         return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
  };

  // ── Fetch all leave requests ──
  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/manager/all-leave-requests");
      setRequests(res.data.requests || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load leave requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ── Approve / Reject ──
  const handleAction = async (leave_status) => {
    setActioning(true);
    try {
      await axios.put("http://localhost:5000/manager/leave-request/action", {
        employee_code: selected.employee_code,
        request_id:    selected._id,
        leave_status,
        actioned_by:   user.user_fullname,
        action_remark: actionRemark,
      });

      gooeyToast.success(`Leave ${leave_status} successfully.`, {
        fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 },
      });

      setSelected(null);
      setActionRemark("");
      fetchRequests();

    } catch (err) {
      gooeyToast.error(err.response?.data?.message || "Action failed.", {
        fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 },
      });
    } finally {
      setActioning(false);
    }
  };

  // ── Stats ──
  const totalCount    = requests.length;
  const pendingCount  = requests.filter((r) => r.leave_status?.toLowerCase() === "pending").length;
  const approvedCount = requests.filter((r) => r.leave_status?.toLowerCase() === "approved").length;

  // ── Filter ──
  const filtered = requests.filter((r) =>
    filterStatus === "all" || r.leave_status?.toLowerCase() === filterStatus
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leave Requests</h1>
            <p className="text-sm text-slate-500 mt-1">Review and manage employee leave requests.</p>
          </div>
          <button
            onClick={fetchRequests}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:bg-white hover:border-gray-200 border border-transparent rounded-xl transition-all"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total",    value: totalCount,    icon: <CalendarDays size={18} />, bg: "bg-blue-50",    color: "text-blue-600"    },
            { label: "Pending",  value: pendingCount,  icon: <Clock size={18} />,         bg: "bg-amber-50",   color: "text-amber-600"   },
            { label: "Approved", value: approvedCount, icon: <CheckCircle2 size={18} />,  bg: "bg-emerald-50", color: "text-emerald-600" },
          ].map(({ label, value, icon, bg, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 flex items-center gap-4">
              <div className={`p-3 ${bg} ${color} rounded-xl shrink-0`}>{icon}</div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Section header */}
          <div className="px-7 py-5 border-b border-gray-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-600">
              <CalendarDays size={18} />
              <h2 className="font-bold text-slate-800">All Requests</h2>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 size={30} className="text-blue-500 animate-spin" />
              <p className="text-slate-400 text-sm">Loading requests...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="p-4 bg-red-50 rounded-full">
                <BadgeAlert size={30} className="text-red-400" />
              </div>
              <p className="text-slate-700 font-bold">{error}</p>
              <button onClick={fetchRequests} className="px-5 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg">
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="p-4 bg-slate-100 rounded-full">
                <InboxIcon size={28} className="text-slate-400" />
              </div>
              <p className="font-bold text-slate-700">No requests found</p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && filtered.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-slate-50/40">
                      <th className="text-left px-7 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Employee</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Leave Type</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">From</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">To</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Days</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((r, i) => (
                      <tr
                        key={r._id || i}
                        onClick={() => { setSelected(r); setActionRemark(""); }}
                        className="hover:bg-slate-50 transition-colors group cursor-pointer"
                      >
                        {/* Employee */}
                        <td className="px-7 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                              {r.employee_name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{r.employee_name || "—"}</p>
                              <p className="text-xs text-slate-400 font-mono">{r.employee_code || "—"}</p>
                            </div>
                          </div>
                        </td>

                        {/* Leave Type */}
                        <td className="px-4 py-4">
                          <span className="font-semibold text-slate-700 capitalize">
                            {r.leave_type?.replace(/_/g, " ") || "—"}
                          </span>
                        </td>

                        {/* From */}
                        <td className="px-4 py-4 text-slate-600">
                          {r.leave_from
                            ? new Date(r.leave_from).toLocaleDateString("en-PK", { day: "2-digit", month: "short" })
                            : "—"}
                        </td>

                        {/* To */}
                        <td className="px-4 py-4 text-slate-600">
                          {r.leave_to
                            ? new Date(r.leave_to).toLocaleDateString("en-PK", { day: "2-digit", month: "short" })
                            : "—"}
                        </td>

                        {/* Days */}
                        <td className="px-4 py-4">
                          <span className="font-bold text-slate-800">{r.leave_days}</span>
                          <span className="text-slate-400 text-xs ml-1">days</span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-lg ${getStatusStyles(r.leave_status)}`}>
                            {r.leave_status || "Pending"}
                          </span>
                        </td>

                        {/* Arrow */}
                        <td className="px-4 py-4">
                          <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="px-7 py-4 border-t border-gray-100 bg-slate-50/40">
                <p className="text-xs text-slate-400">
                  Showing <span className="font-bold text-slate-600">{filtered.length}</span> of{" "}
                  <span className="font-bold text-slate-600">{totalCount}</span> requests
                </p>
              </div>
            </>
          )}

        </section>
      </div>

      {/* ── ACTION MODAL ── */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md overflow-hidden">

            {/* Modal Header */}
            <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600">
                <CalendarDays size={18} />
                <h2 className="font-bold text-slate-800">Leave Request</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-7 py-6 space-y-4">
              {[
                { label: "Employee",   value: selected.employee_name                          },
                { label: "Code",       value: selected.employee_code                          },
                { label: "Leave Type", value: selected.leave_type?.replace(/_/g, " ")        },
                { label: "From",       value: new Date(selected.leave_from).toLocaleDateString("en-PK", { day: "2-digit", month: "long", year: "numeric" }) },
                { label: "To",         value: new Date(selected.leave_to).toLocaleDateString("en-PK",   { day: "2-digit", month: "long", year: "numeric" }) },
                { label: "Days",       value: `${selected.leave_days} day(s)`                },
                { label: "Reason",     value: selected.leave_reason                          },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                  <p className="text-sm font-semibold text-slate-800 capitalize">{value || "—"}</p>
                </div>
              ))}

              {/* Remark input — only if pending */}
              {selected.leave_status === "pending" && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Remark (optional)
                  </label>
                  <textarea
                    value={actionRemark}
                    onChange={(e) => setActionRemark(e.target.value)}
                    placeholder="Add a remark for the employee..."
                    className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl p-4 h-24 focus:outline-none text-sm resize-none transition-all"
                  />
                </div>
              )}

              {/* Already actioned */}
              {selected.leave_status !== "pending" && (
                <div className="pt-1">
                  <span className={`px-3 py-1 text-xs font-bold rounded-lg ${getStatusStyles(selected.leave_status)}`}>
                    {selected.leave_status}
                  </span>
                  {selected.action_remark && (
                    <p className="text-sm text-slate-500 mt-2 italic">"{selected.action_remark}"</p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer — only if pending */}
            {selected.leave_status === "pending" && (
              <div className="px-7 py-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAction("rejected")}
                  disabled={actioning}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 transition-all disabled:opacity-60"
                >
                  <XCircle size={15} />
                  Reject
                </button>
                <button
                  onClick={() => handleAction("approved")}
                  disabled={actioning}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-60"
                >
                  {actioning ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                  Approve
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default LeaveRequests;