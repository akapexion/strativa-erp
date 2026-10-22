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
  CalendarRange,
  User,
  Hash,
  MessageSquare,
  ZoomIn,
  FileImage,
} from "lucide-react";
import axios from "axios";
import { gooeyToast } from "goey-toast";
import { API_BASE_URL, getUploadUrl } from "../../config/api.js";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .lr-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .lr-root { background: #f8fafc; min-height: 100vh; }

  /* ── Sticky header ── */
  .lr-header {
    background: #fff;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
    position: sticky; top: 0; z-index: 40;
  }

  /* ── Refresh button ── */
  .lr-refresh-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px;
    font-size: 13px; font-weight: 700;
    color: #64748b;
    border: 1.5px solid #e8ecf0;
    border-radius: 12px;
    background: #fff;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s, box-shadow 0.15s;
    font-family: inherit;
  }
  .lr-refresh-btn:hover {
    border-color: #6366f1;
    background: #f5f3ff;
    color: #6366f1;
    box-shadow: 0 2px 8px rgba(99,102,241,0.12);
  }

  /* ── Stat cards ── */
  .lr-stat-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    padding: 20px 24px;
    display: flex; align-items: center; gap: 16px;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .lr-stat-card:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    transform: translateY(-2px);
  }
  .lr-stat-icon { padding: 12px; border-radius: 14px; flex-shrink: 0; display: flex; }

  /* ── Section card ── */
  .lr-section-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }

  /* ── Section header ── */
  .lr-section-header {
    background: #fafbfc;
    border-bottom: 1px solid #f1f5f9;
    padding: 20px 28px;
    display: flex; align-items: center; justify-content: space-between;
  }

  /* ── Select ── */
  .lr-select {
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
  .lr-select:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }

  /* ── Table ── */
  .lr-table { width: 100%; border-collapse: collapse; }
  .lr-th {
    text-align: left;
    font-size: 11px; font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.07em;
    padding: 12px 20px;
    background: #fafbfc;
    border-bottom: 1px solid #f1f5f9;
    white-space: nowrap;
  }
  .lr-th:first-child { padding-left: 28px; }
  .lr-th:last-child  { padding-right: 28px; }

  .lr-tr {
    transition: background 0.12s;
    cursor: pointer;
    border-bottom: 1px solid #f8fafc;
  }
  .lr-tr:last-child { border-bottom: none; }
  .lr-tr:hover { background: #f8f7ff; }
  .lr-tr:hover .lr-chevron { color: #6366f1; transform: translateX(3px); }

  .lr-td { padding: 15px 20px; vertical-align: middle; }
  .lr-td:first-child { padding-left: 28px; }
  .lr-td:last-child  { padding-right: 28px; }

  /* ── Avatar ── */
  .lr-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #eef2ff, #e0e7ff);
    color: #6366f1;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 13px; flex-shrink: 0;
    box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px #e0e7ff;
  }

  /* ── Chevron ── */
  .lr-chevron {
    color: #cbd5e1;
    transition: color 0.15s, transform 0.2s;
  }

  /* ── Status badge ── */
  .lr-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 99px;
    font-size: 11px; font-weight: 800; white-space: nowrap;
  }
  .lr-badge-approved { background: #ecfdf5; border: 1.5px solid #a7f3d0; color: #059669; }
  .lr-badge-pending  { background: #fffbeb; border: 1.5px solid #fde68a; color: #d97706; }
  .lr-badge-rejected { background: #fff1f2; border: 1.5px solid #fecdd3; color: #e11d48; }

  /* ── Leave type chip ── */
  .lr-type-chip {
    display: inline-flex; align-items: center;
    padding: 4px 10px; border-radius: 8px;
    font-size: 12px; font-weight: 700;
    background: #f1f5f9; color: #475569;
    border: 1px solid #e2e8f0;
    text-transform: capitalize; letter-spacing: 0.01em;
    white-space: nowrap;
  }

  /* ── Days badge ── */
  .lr-days-chip {
    display: inline-flex; align-items: center; gap: 3px;
    padding: 4px 10px; border-radius: 8px;
    font-size: 12px; font-weight: 800;
    background: #eff6ff; color: #3b82f6;
    border: 1px solid #bfdbfe;
  }

  /* ── Date display ── */
  .lr-date {
    font-size: 13px; font-weight: 600; color: #334155;
  }
  .lr-date-year {
    font-size: 11px; font-weight: 500; color: #94a3b8; margin-top: 1px;
  }

  /* ── State wrappers ── */
  .lr-state-wrap {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 80px 24px; gap: 12px;
  }
  .lr-state-icon-wrap {
    width: 64px; height: 64px;
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }

  /* ── Footer ── */
  .lr-footer {
    padding: 14px 28px;
    border-top: 1px solid #f1f5f9;
    background: #fafbfc;
    font-size: 12px; color: #94a3b8; font-weight: 500;
  }

  /* ── Scrollbar ── */
  .lr-table-scroll::-webkit-scrollbar { height: 4px; }
  .lr-table-scroll::-webkit-scrollbar-track { background: transparent; }
  .lr-table-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }

  /* ══════════════════════════════════════════
     MODAL
  ══════════════════════════════════════════ */
  .lr-modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(15,23,42,0.45);
    backdrop-filter: blur(4px);
    z-index: 50;
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: lr-fade-in 0.18s ease;
  }
  @keyframes lr-fade-in { from { opacity: 0; } to { opacity: 1; } }

  .lr-modal {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 24px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08);
    width: 100%; max-width: 480px;
    overflow: hidden;
    animation: lr-slide-up 0.22s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes lr-slide-up {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }

  /* Modal header */
  .lr-modal-header {
    background: #fafbfc;
    border-bottom: 1px solid #f1f5f9;
    padding: 20px 24px;
    display: flex; align-items: center; justify-content: space-between;
  }

  /* Modal close btn */
  .lr-modal-close {
    padding: 7px; border-radius: 10px;
    color: #94a3b8; cursor: pointer;
    transition: background 0.12s, color 0.12s;
    background: transparent; border: none;
    display: flex; align-items: center; justify-content: center;
    font-family: inherit;
  }
  .lr-modal-close:hover { background: #f1f5f9; color: #334155; }

  /* Detail row */
  .lr-detail-row {
    display: flex; flex-direction: column; gap: 3px;
    padding: 10px 0;
    border-bottom: 1px solid #f8fafc;
  }
  .lr-detail-row:last-child { border-bottom: none; }
  .lr-detail-label {
    font-size: 10px; font-weight: 800; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.07em;
  }
  .lr-detail-value {
    font-size: 13px; font-weight: 600; color: #0f172a;
    text-transform: capitalize;
  }

  /* Detail grid 2-col */
  .lr-detail-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px;
  }

  /* Remark textarea */
  .lr-remark-textarea {
    width: 100%; padding: 12px 14px;
    border: 1.5px solid #e8ecf0;
    border-radius: 12px;
    font-size: 13px; font-weight: 500;
    color: #1e293b;
    font-family: 'Plus Jakarta Sans', sans-serif;
    resize: none; outline: none; height: 88px;
    transition: border-color 0.15s, box-shadow 0.15s;
    background: #fafbfc;
  }
  .lr-remark-textarea::placeholder { color: #c0cad6; font-weight: 400; }
  .lr-remark-textarea:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
    background: #fff;
  }

  /* Modal action buttons */
  .lr-btn-reject {
    display: flex; align-items: center; gap: 6px;
    padding: 10px 20px; border-radius: 12px;
    font-size: 13px; font-weight: 700;
    background: #fff1f2; color: #e11d48;
    border: 1.5px solid #fecdd3;
    cursor: pointer; font-family: inherit;
    transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
  }
  .lr-btn-reject:hover:not(:disabled) {
    background: #ffe4e6;
    box-shadow: 0 3px 10px rgba(225,29,72,0.18);
    transform: translateY(-1px);
  }
  .lr-btn-reject:disabled { opacity: 0.55; cursor: not-allowed; }

  .lr-btn-approve {
    display: flex; align-items: center; gap: 6px;
    padding: 10px 22px; border-radius: 12px;
    font-size: 13px; font-weight: 700;
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff; border: none;
    box-shadow: 0 4px 14px rgba(16,185,129,0.3);
    cursor: pointer; font-family: inherit;
    transition: filter 0.15s, box-shadow 0.15s, transform 0.15s;
  }
  .lr-btn-approve:hover:not(:disabled) {
    filter: brightness(1.08);
    box-shadow: 0 6px 18px rgba(16,185,129,0.38);
    transform: translateY(-1px);
  }
  .lr-btn-approve:disabled { opacity: 0.55; cursor: not-allowed; }

  .lr-btn-cancel {
    font-size: 13px; font-weight: 700; color: #94a3b8;
    padding: 10px 14px; border-radius: 10px;
    cursor: pointer; border: none; background: transparent;
    font-family: inherit;
    transition: background 0.12s, color 0.12s;
  }
  .lr-btn-cancel:hover { background: #f8fafc; color: #64748b; }

  /* Prescription image */
  .lr-prescription-img-wrap {
    position: relative; overflow: hidden;
    border-radius: 12px;
    border: 1.5px solid #e8ecf0;
    cursor: zoom-in;
    transition: border-color 0.15s;
  }
  .lr-prescription-img-wrap:hover { border-color: #6366f1; }
  .lr-prescription-img-wrap img {
    width: 100%; height: 120px; object-fit: cover;
    display: block;
    transition: transform 0.3s;
  }
  .lr-prescription-img-wrap:hover img { transform: scale(1.05); }
  .lr-prescription-overlay {
    position: absolute; inset: 0;
    background: rgba(15,23,42,0);
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .lr-prescription-img-wrap:hover .lr-prescription-overlay { background: rgba(15,23,42,0.35); }
  .lr-prescription-overlay span {
    opacity: 0; font-size: 12px; font-weight: 700; color: #fff;
    background: rgba(15,23,42,0.7); padding: 5px 12px; border-radius: 8px;
    display: flex; align-items: center; gap: 5px;
    transition: opacity 0.2s;
  }
  .lr-prescription-img-wrap:hover .lr-prescription-overlay span { opacity: 1; }

  /* Scrollbar for modal body */
  .lr-modal-body::-webkit-scrollbar { width: 4px; }
  .lr-modal-body::-webkit-scrollbar-track { background: transparent; }
  .lr-modal-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (d, opts = { day: "2-digit", month: "short" }) =>
  d ? new Date(d).toLocaleDateString("en-PK", opts) : "—";

const fmtDateFull = (d) =>
  d ? new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "long", year: "numeric" }) : "—";

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase();
  if (s === "approved")
    return <span className="lr-badge lr-badge-approved"><CheckCircle2 size={10} strokeWidth={2.5} /> Approved</span>;
  if (s === "rejected")
    return <span className="lr-badge lr-badge-rejected"><XCircle size={10} strokeWidth={2.5} /> Rejected</span>;
  return <span className="lr-badge lr-badge-pending"><Clock size={10} strokeWidth={2.5} /> {status || "Pending"}</span>;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, iconBg, iconColor }) => (
  <div className="lr-stat-card">
    <div className="lr-stat-icon" style={{ background: iconBg }}>
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

// ─── Detail Row ───────────────────────────────────────────────────────────────
const DetailRow = ({ label, children }) => (
  <div className="lr-detail-row">
    <p className="lr-detail-label">{label}</p>
    <div className="lr-detail-value">{children}</div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const LeaveRequests = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [requests, setRequests]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [selected, setSelected]       = useState(null);
  const [actionRemark, setActionRemark] = useState("");
  const [actioning, setActioning]     = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchRequests = async () => {
    setLoading(true); setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/manager/all-leave-requests`);
      setRequests(res.data.requests || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load leave requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (leave_status) => {
    setActioning(true);
    try {
      await axios.put(`${API_BASE_URL}/manager/leave-request/action`, {
        employee_code: selected.employee_code,
        request_id: selected._id,
        leave_status,
        actioned_by: user.user_fullname,
        action_remark: actionRemark,
      });
      gooeyToast.success(`Leave ${leave_status} successfully.`, {
        fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 },
      });
      setSelected(null); setActionRemark(""); fetchRequests();
    } catch (err) {
      gooeyToast.error(err.response?.data?.message || "Action failed.", {
        fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 },
      });
    } finally {
      setActioning(false);
    }
  };

  const totalCount    = requests.length;
  const pendingCount  = requests.filter(r => r.leave_status?.toLowerCase() === "pending").length;
  const approvedCount = requests.filter(r => r.leave_status?.toLowerCase() === "approved").length;
  const rejectedCount = requests.filter(r => r.leave_status?.toLowerCase() === "rejected").length;

  const filtered = requests.filter(r =>
    filterStatus === "all" || r.leave_status?.toLowerCase() === filterStatus
  );

  const isPending = selected?.leave_status?.toLowerCase() === "pending";

  return (
    <>
      <style>{styles}</style>
      <div className="lr-root">

        {/* ── Sticky Header ── */}
        <div className="lr-header px-6 py-3.5 flex items-center justify-between">
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
              Leave Requests
            </h1>
            <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>
              Review and manage employee leave requests
            </p>
          </div>
          <button className="lr-refresh-btn" onClick={fetchRequests}>
            <RefreshCw size={14} strokeWidth={2.5} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ── Main ── */}
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 24 }}>

          {/* ── Stats ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            <StatCard label="Total Requests" value={totalCount}
              icon={<CalendarDays size={18} strokeWidth={2.5} />} iconBg="#eff6ff" iconColor="#3b82f6" />
            <StatCard label="Pending Review" value={pendingCount}
              icon={<Clock size={18} strokeWidth={2.5} />} iconBg="#fffbeb" iconColor="#d97706" />
            <StatCard label="Approved" value={approvedCount}
              icon={<CheckCircle2 size={18} strokeWidth={2.5} />} iconBg="#f0fdf4" iconColor="#16a34a" />
            <StatCard label="Rejected" value={rejectedCount}
              icon={<XCircle size={18} strokeWidth={2.5} />} iconBg="#fff1f2" iconColor="#e11d48" />
          </div>

          {/* ── Table Section ── */}
          <div className="lr-section-card">

            {/* Section header */}
            <div className="lr-section-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ padding: 8, borderRadius: 10, background: "#eff6ff", display: "flex" }}>
                  <CalendarDays size={16} color="#3b82f6" strokeWidth={2.5} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>All Requests</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 1 }}>
                    {filtered.length} of {totalCount} shown
                  </p>
                </div>
              </div>
              <select className="lr-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Loading */}
            {loading && (
              <div className="lr-state-wrap">
                <div className="lr-state-icon-wrap" style={{ background: "#f5f3ff" }}>
                  <Loader2 size={28} color="#6366f1" className="animate-spin" strokeWidth={2.5} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>Loading requests…</p>
                <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Fetching the latest submissions</p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="lr-state-wrap">
                <div className="lr-state-icon-wrap" style={{ background: "#fff1f2" }}>
                  <BadgeAlert size={28} color="#e11d48" strokeWidth={2.5} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>Something went wrong</p>
                <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{error}</p>
                <button onClick={fetchRequests} style={{
                  marginTop: 8, fontSize: 13, fontWeight: 700, color: "#6366f1",
                  padding: "9px 20px", borderRadius: 12,
                  border: "1.5px solid #e0e7ff", background: "#f5f3ff",
                  cursor: "pointer", fontFamily: "inherit",
                }}>Try again</button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && filtered.length === 0 && (
              <div className="lr-state-wrap">
                <div className="lr-state-icon-wrap" style={{ background: "#f8fafc" }}>
                  <InboxIcon size={28} color="#cbd5e1" strokeWidth={2.5} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>No requests found</p>
                <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Try adjusting the filter</p>
              </div>
            )}

            {/* Table */}
            {!loading && !error && filtered.length > 0 && (
              <div className="lr-table-scroll" style={{ overflowX: "auto" }}>
                <table className="lr-table">
                  <thead>
                    <tr>
                      <th className="lr-th">Employee</th>
                      <th className="lr-th">Leave Type</th>
                      <th className="lr-th">From</th>
                      <th className="lr-th">To</th>
                      <th className="lr-th">Days</th>
                      <th className="lr-th">Status</th>
                      <th className="lr-th" style={{ width: 40 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, i) => (
                      <tr
                        key={r._id || i}
                        className="lr-tr"
                        onClick={() => { setSelected(r); setActionRemark(""); }}
                      >
                        {/* Employee */}
                        <td className="lr-td">
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div className="lr-avatar">
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

                        {/* Leave Type */}
                        <td className="lr-td">
                          <span className="lr-type-chip">
                            {r.leave_type?.replace(/_/g, " ") || "—"}
                          </span>
                        </td>

                        {/* From */}
                        <td className="lr-td">
                          <p className="lr-date">{fmtDate(r.leave_from)}</p>
                          <p className="lr-date-year">{r.leave_from ? new Date(r.leave_from).getFullYear() : ""}</p>
                        </td>

                        {/* To */}
                        <td className="lr-td">
                          <p className="lr-date">{fmtDate(r.leave_to)}</p>
                          <p className="lr-date-year">{r.leave_to ? new Date(r.leave_to).getFullYear() : ""}</p>
                        </td>

                        {/* Days */}
                        <td className="lr-td">
                          <span className="lr-days-chip">
                            <CalendarRange size={11} strokeWidth={2.5} />
                            {r.leave_days}d
                          </span>
                        </td>

                        {/* Status */}
                        <td className="lr-td">
                          <StatusBadge status={r.leave_status} />
                        </td>

                        {/* Arrow */}
                        <td className="lr-td" style={{ paddingLeft: 8 }}>
                          <ChevronRight size={15} className="lr-chevron" strokeWidth={2.5} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            {!loading && !error && filtered.length > 0 && (
              <div className="lr-footer">
                Showing{" "}
                <span style={{ fontWeight: 800, color: "#334155" }}>{filtered.length}</span>
                {" "}of{" "}
                <span style={{ fontWeight: 800, color: "#334155" }}>{totalCount}</span>
                {" "}requests
                {filterStatus !== "all" && (
                  <span style={{ color: "#6366f1", fontWeight: 700, marginLeft: 6 }}>· filtered</span>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ══════════════════════════════════════════
          ACTION MODAL
      ══════════════════════════════════════════ */}
      {selected && (
        <div className="lr-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="lr-modal" onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="lr-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ padding: 8, borderRadius: 10, background: "#eff6ff", display: "flex" }}>
                  <CalendarDays size={16} color="#3b82f6" strokeWidth={2.5} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>Leave Request</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 1 }}>
                    Review details and take action
                  </p>
                </div>
              </div>
              <button className="lr-modal-close" onClick={() => setSelected(null)}>
                <X size={17} strokeWidth={2.5} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="lr-modal-body" style={{ padding: "0 24px", maxHeight: "65vh", overflowY: "auto" }}>

              {/* Status banner for non-pending */}
              {!isPending && (
                <div style={{
                  margin: "20px 0 4px",
                  padding: "12px 16px",
                  borderRadius: 12,
                  display: "flex", alignItems: "center", gap: 10,
                  background: selected.leave_status?.toLowerCase() === "approved" ? "#ecfdf5" : "#fff1f2",
                  border: `1.5px solid ${selected.leave_status?.toLowerCase() === "approved" ? "#a7f3d0" : "#fecdd3"}`,
                }}>
                  {selected.leave_status?.toLowerCase() === "approved"
                    ? <CheckCircle2 size={16} color="#059669" strokeWidth={2.5} />
                    : <XCircle size={16} color="#e11d48" strokeWidth={2.5} />}
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 800, color: selected.leave_status?.toLowerCase() === "approved" ? "#059669" : "#e11d48" }}>
                      {selected.leave_status?.toLowerCase() === "approved" ? "Approved" : "Rejected"}
                    </p>
                    {selected.action_remark && (
                      <p style={{ fontSize: 12, color: "#64748b", fontWeight: 500, marginTop: 2 }}>
                        "{selected.action_remark}"
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Details */}
              <div style={{ padding: "16px 0" }}>
                {/* Employee row */}
                <div className="lr-detail-row" style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <div className="lr-avatar" style={{ width: 44, height: 44, fontSize: 16 }}>
                    {selected.employee_name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{selected.employee_name || "—"}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, fontFamily: "monospace" }}>{selected.employee_code || "—"}</p>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <StatusBadge status={selected.leave_status} />
                  </div>
                </div>

                {/* Leave type + days */}
                <div className="lr-detail-grid">
                  <DetailRow label="Leave Type">
                    <span className="lr-type-chip" style={{ fontSize: 12 }}>
                      {selected.leave_type?.replace(/_/g, " ") || "—"}
                    </span>
                  </DetailRow>
                  <DetailRow label="Duration">
                    <span className="lr-days-chip" style={{ fontSize: 12 }}>
                      <CalendarRange size={11} strokeWidth={2.5} />
                      {selected.leave_days} day{selected.leave_days !== 1 ? "s" : ""}
                    </span>
                  </DetailRow>
                </div>

                {/* Dates */}
                <div className="lr-detail-grid">
                  <DetailRow label="From">{fmtDateFull(selected.leave_from)}</DetailRow>
                  <DetailRow label="To">{fmtDateFull(selected.leave_to)}</DetailRow>
                </div>

                {/* Reason */}
                <DetailRow label="Reason">
                  <span style={{ color: "#475569" }}>{selected.leave_reason || "—"}</span>
                </DetailRow>

                {/* Prescription */}
                {selected.prescription_image && (
                  <div className="lr-detail-row">
                    <p className="lr-detail-label" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <FileImage size={11} /> Medical Prescription
                    </p>
                    <div className="lr-prescription-img-wrap" style={{ marginTop: 6 }}
                      onClick={() => window.open(getUploadUrl(selected.prescription_image), "_blank")}
                    >
                      <img src={getUploadUrl(selected.prescription_image)} alt="Prescription" />
                      <div className="lr-prescription-overlay">
                        <span><ZoomIn size={12} strokeWidth={2.5} /> View full</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Remark textarea (pending only) */}
                {isPending && (
                  <div style={{ paddingTop: 8, paddingBottom: 4 }}>
                    <p className="lr-detail-label" style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                      <MessageSquare size={11} /> Remark (optional)
                    </p>
                    <textarea
                      className="lr-remark-textarea"
                      value={actionRemark}
                      onChange={e => setActionRemark(e.target.value)}
                      placeholder="Add a remark for the employee…"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            {isPending && (
              <div style={{
                padding: "16px 24px",
                borderTop: "1px solid #f1f5f9",
                background: "#fafbfc",
                display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8,
              }}>
                <button className="lr-btn-cancel" onClick={() => setSelected(null)}>
                  Cancel
                </button>
                <button
                  className="lr-btn-reject"
                  onClick={() => handleAction("rejected")}
                  disabled={actioning}
                >
                  {actioning
                    ? <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />
                    : <XCircle size={14} strokeWidth={2.5} />}
                  Reject
                </button>
                <button
                  className="lr-btn-approve"
                  onClick={() => handleAction("approved")}
                  disabled={actioning}
                >
                  {actioning
                    ? <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />
                    : <CheckCircle2 size={14} strokeWidth={2.5} />}
                  Approve
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default LeaveRequests;