import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  FileText,
  User,
  Hash,
  Tag,
  Search,
  RefreshCw,
  ChevronRight,
  Loader2,
  InboxIcon,
  BadgeAlert,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  DollarSign,
  BarChart2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const config = {
    approved: {
      icon: <CheckCircle2 size={11} />,
      label: "Approved",
      className: "bg-emerald-50 border border-emerald-200 text-emerald-700",
    },
    pending: {
      icon: <Clock size={11} />,
      label: "Pending",
      className: "bg-amber-50 border border-amber-200 text-amber-700",
    },
    rejected: {
      icon: <XCircle size={11} />,
      label: "Rejected",
      className: "bg-red-50 border border-red-200 text-red-600",
    },
  };

  const match = config[status?.toLowerCase()] || {
    icon: <Clock size={11} />,
    label: status || "Pending",
    className: "bg-slate-50 border border-slate-200 text-slate-600",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${match.className}`}>
      {match.icon}
      {match.label}
    </span>
  );
};

// ─── Form Type Badge ──────────────────────────────────────────────────────────
const FormTypeBadge = ({ title }) => {
  if (title === "Annual Appraisal")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-lg">
        <Star size={11} /> Appraisal
      </span>
    );
  if (title === "Direct Financial Incentive - DFI")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg">
        <DollarSign size={11} /> DFI
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold rounded-lg">
      <BarChart2 size={11} /> KPI
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const FormRequests = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/manager/form-requests");
      const data = res.data.AllFormSubmissions || res.data || [];
      setRequests(data);
      console.log(data)
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load form requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ─── Filter logic ─────────────────────────────────────────────────────────
  const filtered = requests.filter((r) => {
    const matchSearch =
      search === "" ||
      r.employee_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.employee_code?.toLowerCase().includes(search.toLowerCase()) ||
      r.form_title?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      filterStatus === "all" ||
      r.form_status?.toLowerCase() === filterStatus;

    const matchType =
      filterType === "all" ||
      (filterType === "appraisal" && r.form_title === "Annual Appraisal") ||
      (filterType === "dfi" && r.form_title === "Direct Financial Incentive - DFI") ||
      (filterType === "kpi" && r.form_title === "Key Performance Indicator - KPI");

    return matchSearch && matchStatus && matchType;
  });

  // ─── Stats ────────────────────────────────────────────────────────────────
  const pendingCount = requests.filter(
    (r) => r.form_status?.toLowerCase() === "pending"
  ).length;
  const approvedCount = requests.filter(
    (r) => r.form_status?.toLowerCase() === "approved"
  ).length;
  const rejectedCount = requests.filter(
    (r) => r.form_status?.toLowerCase() === "rejected"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Form Requests
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review and manage all employee form submissions.
            </p>
          </div>
          <button
            onClick={fetchRequests}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Requests", value: requests.length, icon: <ClipboardList size={18} />, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Pending Review", value: pendingCount, icon: <Clock size={18} />, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Approved", value: approvedCount, icon: <CheckCircle2 size={18} />, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map(({ label, value, icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 flex items-center gap-4">
              <div className={`p-3 ${bg} rounded-xl ${color}`}>
                {icon}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  {label}
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Table Section ── */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Section Header */}
          <div className="px-7 py-5 border-b border-gray-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-center gap-2 text-blue-600">
              <ClipboardList size={18} />
              <h2 className="font-bold text-slate-800">All Requests</h2>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Search name, code, form..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-52 transition-all"
                />
              </div>

              {/* Status Filter */}
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

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="appraisal">Appraisal</option>
                <option value="dfi">DFI</option>
                <option value="kpi">KPI</option>
              </select>
            </div>
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
              <button
                onClick={fetchRequests}
                className="px-5 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="p-4 bg-slate-100 rounded-full">
                <InboxIcon size={30} className="text-slate-400" />
              </div>
              <p className="font-bold text-slate-700">No requests found</p>
              <p className="text-sm text-slate-400">
                {search || filterStatus !== "all" || filterType !== "all"
                  ? "Try adjusting your filters."
                  : "No form submissions have been made yet."}
              </p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && filtered.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-slate-50/40">
                    <th className="text-left px-7 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Employee
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Form Title
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((r, index) => (
                    <tr
                      key={r._id || index}
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      {/* Employee */}

                      <td className="px-7 py-4">
                        <div className="flex items-center gap-3">
                          {r.form_no}
                        </div>
                      </td>

                      <td className="px-7 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                            {r.employee_name?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">
                              {r.employee_name || "—"}
                            </p>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                              {r.employee_code || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Form Title */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-700 text-sm">
                            {r.form_title || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-4">
                        <FormTypeBadge title={r.form_title} />
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <StatusBadge status={r.form_status} />
                      </td>

                      {/* Arrow */}
                      <td className="px-4 py-4">
                    <Link to={`/hr360/manager/form-requests/${r._id}`}>
                        
                        <ChevronRight
                          size={16}
                          className="text-slate-300 group-hover:text-slate-500 transition-colors ml-auto"
                        />
                        </Link>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && !error && filtered.length > 0 && (
            <div className="px-7 py-4 border-t border-gray-100 bg-slate-50/40">
              <p className="text-xs text-slate-400">
                Showing{" "}
                <span className="font-bold text-slate-600">{filtered.length}</span>
                {" "}of{" "}
                <span className="font-bold text-slate-600">{requests.length}</span>
                {" "}requests
              </p>
            </div>
          )}

        </section>
      </div>
    </div>
  );
};

export default FormRequests;