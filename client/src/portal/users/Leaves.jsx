import React, { useEffect, useState } from "react";
import {
  LayoutGrid,
  ClipboardList,
  CheckCircle2,
  FileText,
  CalendarDays,
  Loader2,
  X,
  Send,
  InboxIcon,
} from "lucide-react";
import axios from "axios";
import { gooeyToast } from "goey-toast";

const Leaves = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [activeTab,   setActiveTab]   = useState("listing");
  const [leaveTypes,  setLeaveTypes]  = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [submitting,  setSubmitting]  = useState(false);

  const [form, setForm] = useState({
    leave_type:   "",
    leave_from:   "",
    leave_to:     "",
    leave_reason: "",
  });

  // ── Status styles ──
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "approved": return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "rejected": return "bg-red-100 text-red-600 border border-red-200";
      default:         return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
  };

  // ── Fetch leave types ──
  const fetchLeaveTypes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/all-leavetypes");
      setLeaveTypes(res.data.leaveTypesAvailable || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Fetch my leave requests ──
  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/user/my-leave-requests/${user.user_code}`
      );
      setSubmissions(res.data.requests || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
    fetchSubmissions();
  }, []);

  // ── Calculate days ──
  const calcDays = () => {
    if (!form.leave_from || !form.leave_to) return 0;
    const from = new Date(form.leave_from);
    const to   = new Date(form.leave_to);
    if (to < from) return 0;
    return Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
  };

  // ── Submit leave ──
  const handleSubmit = async () => {
    if (!form.leave_type || !form.leave_from || !form.leave_to || !form.leave_reason.trim()) {
      gooeyToast.error("Please fill in all fields.", {
        fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 },
      });
      return;
    }
    if (calcDays() <= 0) {
      gooeyToast.error("End date cannot be before start date.", {
        fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 },
      });
      return;
    }

    setSubmitting(true);
    try {
      await axios.post("http://localhost:5000/user/apply-leave", {
        employee_code: user.user_code,
        employee_name: user.user_fullname,
        leave_type:    form.leave_type,
        leave_from:    form.leave_from,
        leave_to:      form.leave_to,
        leave_days:    calcDays(),
        leave_reason:  form.leave_reason,
      });

      gooeyToast.success("Leave application submitted successfully.", {
        fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 },
      });

      setForm({ leave_type: "", leave_from: "", leave_to: "", leave_reason: "" });
      fetchSubmissions();
      setActiveTab("listing");

    } catch (err) {
      gooeyToast.error(err.response?.data?.message || "Failed to submit.", {
        fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 },
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Flatten & deduplicate leave types ──
  const flatLeaveTypes = leaveTypes
    .filter((item) => item.alloted_leaves)
    .flatMap((item) =>
      Object.keys(item.alloted_leaves)
        .filter((key) => item.alloted_leaves[key] > 0)
        .map((key) => ({
          key,
          label:    key.replace(/_/g, " "),
          quantity: item.alloted_leaves[key],
        }))
    )
    .filter((v, i, arr) => arr.findIndex((x) => x.key === v.key) === i);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leaves</h1>
          <p className="text-sm text-slate-500 mt-1">
            View your leave requests or apply for a new leave.
          </p>
        </div>

        {/* TABS */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-300 w-fit">
          <button
            onClick={() => setActiveTab("listing")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "listing"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <LayoutGrid size={16} />
            My Requests
          </button>
          <button
            onClick={() => setActiveTab("apply")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "apply"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <ClipboardList size={16} />
            Apply Leave
          </button>
        </div>

        {/* ── MY REQUESTS TAB ── */}
        {activeTab === "listing" && (
          <section className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-300 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600">
                <LayoutGrid size={18} />
                <h2 className="font-bold text-slate-800">My Leave Requests</h2>
              </div>
              <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs rounded-lg">
                {submissions.length} total
              </span>
            </div>

            {submissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="p-4 bg-slate-100 rounded-full">
                  <InboxIcon size={30} className="text-slate-400" />
                </div>
                <p className="font-bold text-slate-700">No leave requests as of now</p>
                <p className="text-sm text-slate-400">Apply for a leave to get started.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300 bg-slate-50">
                        <th className="text-left px-8 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Leave Type</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">From</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">To</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Days</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Reason</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {submissions.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg text-blue-600 shrink-0">
                                <CalendarDays size={15} />
                              </div>
                              <span className="font-bold text-slate-800 capitalize">
                                {item.leave_type?.replace(/_/g, " ") || "—"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            {item.leave_from
                              ? new Date(item.leave_from).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" })
                              : "—"}
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            {item.leave_to
                              ? new Date(item.leave_to).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" })
                              : "—"}
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-bold text-slate-800">{item.leave_days}</span>
                            <span className="text-slate-400 text-xs ml-1">days</span>
                          </td>
                          <td className="px-4 py-4 text-slate-500 max-w-xs truncate">
                            {item.leave_reason || "—"}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 text-xs font-bold rounded-lg ${getStatusStyles(item.leave_status)}`}>
                              {item.leave_status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-8 py-4 border-t border-gray-300 bg-slate-50">
                  <p className="text-xs text-slate-400">
                    Showing <span className="font-bold text-slate-700">{submissions.length}</span> requests
                  </p>
                </div>
              </>
            )}
          </section>
        )}

        {/* ── APPLY LEAVE TAB ── */}
        {activeTab === "apply" && (
          <div className="space-y-5">

            <div className="flex items-center gap-2 text-blue-600">
              <ClipboardList size={18} />
              <h2 className="font-bold text-slate-800">Apply for Leave</h2>
            </div>

            {/* Leave type info cards */}
            {flatLeaveTypes.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {flatLeaveTypes.map((item) => (
                  <div
                    key={item.key}
                    className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4"
                  >
                    <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                      <CalendarDays size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm capitalize">{item.label}</h3>
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs rounded-lg">
                        <CheckCircle2 size={10} />
                        {item.quantity} days / year
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Application form */}
            <section className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-300 bg-slate-50 flex items-center gap-2 text-blue-600">
                <FileText size={18} />
                <h2 className="font-bold text-slate-800">Leave Application Form</h2>
              </div>

              <div className="p-8 space-y-6">

                {/* Leave type dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Leave Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.leave_type}
                    onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="">— Select leave type —</option>
                    {flatLeaveTypes.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label} ({t.quantity} days/year)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dates */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      From <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.leave_from}
                      onChange={(e) => setForm({ ...form, leave_from: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      To <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.leave_to}
                      onChange={(e) => setForm({ ...form, leave_to: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Days preview */}
                {calcDays() > 0 && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
                    <CalendarDays size={15} className="text-blue-500 shrink-0" />
                    <p className="text-sm font-bold text-blue-700">
                      {calcDays()} day(s) selected
                    </p>
                  </div>
                )}

                {/* Reason */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Reason <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={form.leave_reason}
                    onChange={(e) => setForm({ ...form, leave_reason: e.target.value })}
                    placeholder="Briefly describe your reason for leave..."
                    className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl p-4 h-32 focus:outline-none text-sm text-slate-700 resize-none transition-all"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setForm({ leave_type: "", leave_from: "", leave_to: "", leave_reason: "" })}
                    className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-slate-500 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all"
                  >
                    <X size={15} />
                    Clear
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-60"
                  >
                    {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>

              </div>
            </section>
          </div>
        )}

      </div>
    </div>
  );
};

export default Leaves;