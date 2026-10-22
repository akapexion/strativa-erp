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
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// ─── Styles (mirroring AddEmployee design language) ───────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .fr-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .fr-root { background: #f8fafc; min-height: 100vh; }

  /* ── Page header ── */
  .fr-header {
    background: #fff;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
    position: sticky; top: 0; z-index: 40;
  }

  /* ── Refresh button ── */
  .fr-refresh-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px;
    font-size: 13px; font-weight: 700;
    color: #64748b;
    border: 1.5px solid #e8ecf0;
    border-radius: 12px;
    background: #fff;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s, box-shadow 0.15s;
  }
  .fr-refresh-btn:hover {
    border-color: #6366f1;
    background: #f5f3ff;
    color: #6366f1;
    box-shadow: 0 2px 8px rgba(99,102,241,0.12);
  }

  /* ── Stat card ── */
  .fr-stat-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    padding: 20px 24px;
    display: flex; align-items: center; gap: 16px;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .fr-stat-card:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    transform: translateY(-2px);
  }
  .fr-stat-icon {
    padding: 12px; border-radius: 14px; flex-shrink: 0;
  }

  /* ── Main section card ── */
  .fr-section-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }

  /* ── Section header ── */
  .fr-section-header {
    background: #fafbfc;
    border-bottom: 1px solid #f1f5f9;
    padding: 20px 28px;
  }

  /* ── Search input ── */
  .fr-search-wrap { position: relative; }
  .fr-search-wrap .fr-search-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: #b0bec5; pointer-events: none; transition: color 0.15s;
  }
  .fr-search-wrap:focus-within .fr-search-icon { color: #6366f1; }
  .fr-search-input {
    padding: 9px 16px 9px 38px;
    border-radius: 12px;
    border: 1.5px solid #e8ecf0;
    font-size: 13px; font-weight: 500;
    color: #1e293b;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #fff;
    outline: none;
    width: 220px;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .fr-search-input::placeholder { color: #c0cad6; font-weight: 400; }
  .fr-search-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }

  /* ── Select filter ── */
  .fr-select {
    padding: 9px 36px 9px 14px;
    border-radius: 12px;
    border: 1.5px solid #e8ecf0;
    font-size: 13px; font-weight: 600;
    color: #475569;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 12px center;
    appearance: none;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .fr-select:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }

  /* ── Table ── */
  .fr-table { width: 100%; border-collapse: collapse; }
  .fr-th {
    text-align: left;
    font-size: 11px; font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.07em;
    padding: 12px 20px;
    background: #fafbfc;
    border-bottom: 1px solid #f1f5f9;
    white-space: nowrap;
  }
  .fr-th:first-child { padding-left: 28px; }
  .fr-th:last-child { padding-right: 28px; }

  .fr-tr {
    transition: background 0.12s;
    cursor: pointer;
    border-bottom: 1px solid #f8fafc;
  }
  .fr-tr:last-child { border-bottom: none; }
  .fr-tr:hover { background: #f8f7ff; }
  .fr-tr:hover .fr-chevron { color: #6366f1; transform: translateX(3px); }

  .fr-td { padding: 16px 20px; vertical-align: middle; }
  .fr-td:first-child { padding-left: 28px; }
  .fr-td:last-child { padding-right: 28px; }

  /* ── Avatar ── */
  .fr-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #eef2ff, #e0e7ff);
    color: #6366f1;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 13px; flex-shrink: 0;
    box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px #e0e7ff;
  }

  /* ── Chevron ── */
  .fr-chevron {
    color: #cbd5e1;
    transition: color 0.15s, transform 0.2s;
    margin-left: auto;
  }

  /* ── Status badge ── */
  .fr-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 99px;
    font-size: 11px; font-weight: 800;
    white-space: nowrap;
  }
  .fr-badge-approved { background: #ecfdf5; border: 1.5px solid #a7f3d0; color: #059669; }
  .fr-badge-pending  { background: #fffbeb; border: 1.5px solid #fde68a; color: #d97706; }
  .fr-badge-rejected { background: #fff1f2; border: 1.5px solid #fecdd3; color: #e11d48; }
  .fr-badge-default  { background: #f8fafc; border: 1.5px solid #e2e8f0; color: #64748b; }

  /* ── Type pill ── */
  .fr-type-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 8px;
    font-size: 11px; font-weight: 800;
    white-space: nowrap;
  }
  .fr-type-appraisal { background: #eff6ff; border: 1.5px solid #bfdbfe; color: #2563eb; }
  .fr-type-dfi       { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; }
  .fr-type-kpi       { background: #faf5ff; border: 1.5px solid #e9d5ff; color: #7c3aed; }

  /* ── Form number chip ── */
  .fr-form-no {
    font-family: 'Courier New', monospace;
    font-size: 11px; font-weight: 700;
    color: #64748b;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    padding: 3px 9px;
    letter-spacing: 0.04em;
  }

  /* ── Empty / error / loading states ── */
  .fr-state-wrap {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 80px 24px; gap: 12px;
  }
  .fr-state-icon-wrap {
    width: 64px; height: 64px;
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }

  /* ── Footer ── */
  .fr-footer {
    padding: 14px 28px;
    border-top: 1px solid #f1f5f9;
    background: #fafbfc;
    font-size: 12px; color: #94a3b8; font-weight: 500;
  }

  /* ── Filter pill (active state) ── */
  .fr-filter-active-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #6366f1; flex-shrink: 0;
  }

  /* Scrollbar */
  .fr-table-scroll::-webkit-scrollbar { height: 4px; }
  .fr-table-scroll::-webkit-scrollbar-track { background: transparent; }
  .fr-table-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
`;

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase();
  if (s === "approved")
    return (
      <span className="fr-badge fr-badge-approved">
        <CheckCircle2 size={10} strokeWidth={2.5} /> Approved
      </span>
    );
  if (s === "rejected")
    return (
      <span className="fr-badge fr-badge-rejected">
        <XCircle size={10} strokeWidth={2.5} /> Rejected
      </span>
    );
  return (
    <span className="fr-badge fr-badge-pending">
      <Clock size={10} strokeWidth={2.5} /> {status || "Pending"}
    </span>
  );
};

// ─── Form Type Badge ──────────────────────────────────────────────────────────
const FormTypeBadge = ({ title }) => {
  if (title === "Annual Appraisal")
    return (
      <span className="fr-type-pill fr-type-appraisal">
        <Star size={10} strokeWidth={2.5} /> Appraisal
      </span>
    );
  if (title === "Direct Financial Incentive - DFI")
    return (
      <span className="fr-type-pill fr-type-dfi">
        <DollarSign size={10} strokeWidth={2.5} /> DFI
      </span>
    );
  return (
    <span className="fr-type-pill fr-type-kpi">
      <BarChart2 size={10} strokeWidth={2.5} /> KPI
    </span>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, iconBg, iconColor }) => (
  <div className="fr-stat-card">
    <div className="fr-stat-icon" style={{ background: iconBg }}>
      <span style={{ color: iconColor, display: "flex" }}>{icon}</span>
    </div>
    <div>
      <p style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>{value}</p>
    </div>
  </div>
);

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
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load form requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const filtered = requests.filter((r) => {
    const matchSearch =
      search === "" ||
      r.employee_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.employee_code?.toLowerCase().includes(search.toLowerCase()) ||
      r.form_title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" || r.form_status?.toLowerCase() === filterStatus;
    const matchType =
      filterType === "all" ||
      (filterType === "appraisal" && r.form_title === "Annual Appraisal") ||
      (filterType === "dfi" && r.form_title === "Direct Financial Incentive - DFI") ||
      (filterType === "kpi" && r.form_title === "Key Performance Indicator - KPI");
    return matchSearch && matchStatus && matchType;
  });

  const pendingCount  = requests.filter(r => r.form_status?.toLowerCase() === "pending").length;
  const approvedCount = requests.filter(r => r.form_status?.toLowerCase() === "approved").length;
  const rejectedCount = requests.filter(r => r.form_status?.toLowerCase() === "rejected").length;

  const hasActiveFilters = search !== "" || filterStatus !== "all" || filterType !== "all";

  return (
    <>
      <style>{styles}</style>
      <div className="fr-root">

        {/* ── Sticky Header ── */}
        <div className="fr-header px-6 py-3.5 flex items-center justify-between">
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
              Form Requests
            </h1>
            <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>
              Review and manage all employee form submissions
            </p>
          </div>
          <button
            onClick={fetchRequests}
            className="fr-refresh-btn"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} strokeWidth={2.5} />
            Refresh
          </button>
        </div>

        {/* ── Main Content ── */}
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 24 }}>

          {/* ── Stats Row ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            <StatCard
              label="Total Requests"
              value={requests.length}
              icon={<ClipboardList size={18} strokeWidth={2.5} />}
              iconBg="#eff6ff" iconColor="#3b82f6"
            />
            <StatCard
              label="Pending Review"
              value={pendingCount}
              icon={<Clock size={18} strokeWidth={2.5} />}
              iconBg="#fffbeb" iconColor="#d97706"
            />
            <StatCard
              label="Approved"
              value={approvedCount}
              icon={<CheckCircle2 size={18} strokeWidth={2.5} />}
              iconBg="#f0fdf4" iconColor="#16a34a"
            />
            <StatCard
              label="Rejected"
              value={rejectedCount}
              icon={<XCircle size={18} strokeWidth={2.5} />}
              iconBg="#fff1f2" iconColor="#e11d48"
            />
          </div>

          {/* ── Table Section ── */}
          <div className="fr-section-card">

            {/* Section Header */}
            <div className="fr-section-header">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>

                {/* Left: title */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ padding: 8, borderRadius: 10, background: "#eff6ff", display: "flex" }}>
                    <ClipboardList size={16} color="#3b82f6" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>All Submissions</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 1 }}>
                      {filtered.length} of {requests.length} shown
                    </p>
                  </div>
                  {hasActiveFilters && (
                    <div className="fr-filter-active-dot" style={{ marginLeft: 4 }} />
                  )}
                </div>

                {/* Right: filters */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>

                  {/* Search */}
                  <div className="fr-search-wrap">
                    <Search size={14} className="fr-search-icon" strokeWidth={2.5} />
                    <input
                      type="text"
                      placeholder="Search name, code, form…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="fr-search-input"
                    />
                  </div>

                  {/* Divider */}
                  <div style={{ width: 1, height: 28, background: "#e8ecf0" }} />

                  {/* Status filter */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="fr-select"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  {/* Type filter */}
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="fr-select"
                  >
                    <option value="all">All Types</option>
                    <option value="appraisal">Appraisal</option>
                    <option value="dfi">DFI</option>
                    <option value="kpi">KPI</option>
                  </select>

                  {/* Clear filters */}
                  {hasActiveFilters && (
                    <button
                      onClick={() => { setSearch(""); setFilterStatus("all"); setFilterType("all"); }}
                      style={{
                        fontSize: 12, fontWeight: 700, color: "#6366f1",
                        padding: "9px 14px", borderRadius: 12,
                        border: "1.5px solid #e0e7ff", background: "#f5f3ff",
                        cursor: "pointer", fontFamily: "inherit",
                        transition: "background 0.12s",
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── Loading ── */}
            {loading && (
              <div className="fr-state-wrap">
                <div className="fr-state-icon-wrap" style={{ background: "#f5f3ff" }}>
                  <Loader2 size={28} color="#6366f1" className="animate-spin" strokeWidth={2.5} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>Loading requests…</p>
                <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Fetching the latest submissions</p>
              </div>
            )}

            {/* ── Error ── */}
            {!loading && error && (
              <div className="fr-state-wrap">
                <div className="fr-state-icon-wrap" style={{ background: "#fff1f2" }}>
                  <BadgeAlert size={28} color="#e11d48" strokeWidth={2.5} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>Something went wrong</p>
                <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{error}</p>
                <button
                  onClick={fetchRequests}
                  style={{
                    marginTop: 8, fontSize: 13, fontWeight: 700, color: "#6366f1",
                    padding: "9px 20px", borderRadius: 12,
                    border: "1.5px solid #e0e7ff", background: "#f5f3ff",
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Try again
                </button>
              </div>
            )}

            {/* ── Empty ── */}
            {!loading && !error && filtered.length === 0 && (
              <div className="fr-state-wrap">
                <div className="fr-state-icon-wrap" style={{ background: "#f8fafc" }}>
                  <InboxIcon size={28} color="#cbd5e1" strokeWidth={2.5} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>No requests found</p>
                <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Try adjusting your filters or search terms</p>
                {hasActiveFilters && (
                  <button
                    onClick={() => { setSearch(""); setFilterStatus("all"); setFilterType("all"); }}
                    style={{
                      marginTop: 8, fontSize: 12, fontWeight: 700, color: "#6366f1",
                      padding: "8px 18px", borderRadius: 12,
                      border: "1.5px solid #e0e7ff", background: "#f5f3ff",
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {/* ── Table ── */}
            {!loading && !error && filtered.length > 0 && (
              <div className="fr-table-scroll" style={{ overflowX: "auto" }}>
                <table className="fr-table">
                  <thead>
                    <tr>
                      <th className="fr-th">Form No</th>
                      <th className="fr-th">Employee</th>
                      <th className="fr-th">Form Title</th>
                      <th className="fr-th">Type</th>
                      <th className="fr-th">Status</th>
                      <th className="fr-th" style={{ width: 40 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, index) => (
                      <tr
                        key={r._id || index}
                        className="fr-tr"
                        onClick={() => navigate(`/hr360/manager/form-requests/${r._id}`)}
                      >
                        {/* Form No */}
                        <td className="fr-td">
                          <span className="fr-form-no">{r.form_no || "—"}</span>
                        </td>

                        {/* Employee */}
                        <td className="fr-td">
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div className="fr-avatar">
                              {r.employee_name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>
                                {r.employee_name || "—"}
                              </p>
                              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, fontFamily: "monospace", marginTop: 2 }}>
                                {r.employee_code || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Form Title */}
                        <td className="fr-td">
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <FileText size={14} color="#b0bec5" strokeWidth={2} style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                              {r.form_title || "—"}
                            </span>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="fr-td">
                          <FormTypeBadge title={r.form_title} />
                        </td>

                        {/* Status */}
                        <td className="fr-td">
                          <StatusBadge status={r.form_status} />
                        </td>

                        {/* Arrow */}
                        <td className="fr-td" style={{ paddingLeft: 8 }}>
                          <ChevronRight size={15} className="fr-chevron" strokeWidth={2.5} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Footer ── */}
            {!loading && !error && filtered.length > 0 && (
              <div className="fr-footer">
                Showing{" "}
                <span style={{ fontWeight: 800, color: "#334155" }}>{filtered.length}</span>
                {" "}of{" "}
                <span style={{ fontWeight: 800, color: "#334155" }}>{requests.length}</span>
                {" "}requests
                {hasActiveFilters && (
                  <span style={{ color: "#6366f1", fontWeight: 700, marginLeft: 6 }}>· filtered</span>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
};

export default FormRequests;