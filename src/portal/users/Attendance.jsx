import React, { useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  UserCheck,
  UserX,
  Users,
  Search,
  Filter,
  Loader2,
  Edit,
  X,
  Check,
  Sparkles,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import axios from "axios";
import { gooeyToast } from "goey-toast";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .att-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .att-root { background: #f8fafc; min-height: 100vh; }

  /* ── Header ── */
  .att-page-header {
    background: #fff;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
    position: sticky; top: 0; z-index: 40;
    padding: 14px 24px;
    display: flex; align-items: center; justify-content: space-between;
  }

  /* ── Tabs ── */
  .att-tabs {
    display: inline-flex;
    background: #f1f5f9;
    border-radius: 14px;
    padding: 4px;
    gap: 2px;
  }
  .att-tab {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 20px;
    border-radius: 11px;
    font-size: 13px; font-weight: 700;
    cursor: pointer; border: none;
    font-family: inherit;
    transition: background 0.18s, color 0.18s, box-shadow 0.18s;
    color: #64748b; background: transparent;
  }
  .att-tab.active {
    background: #fff;
    color: #6366f1;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05);
  }
  .att-tab:not(.active):hover { background: #e8ecf0; color: #334155; }

  /* ── Check In/Out Hero Card ── */
  .att-hero-card {
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
    border-radius: 24px;
    padding: 28px 32px;
    color: #fff;
    box-shadow: 0 10px 30px rgba(49, 46, 129, 0.25);
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px;
  }
  .att-hero-card::before {
    content: '';
    position: absolute; right: -40px; top: -40px;
    width: 220px; height: 220px; border-radius: 50%;
    background: rgba(255,255,255,0.06); pointer-events: none;
  }

  .att-btn-checkin {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px 28px; border-radius: 14px;
    font-size: 14px; font-weight: 800;
    color: #0f172a; background: #38bdf8;
    border: none; cursor: pointer;
    box-shadow: 0 4px 14px rgba(56, 189, 248, 0.4);
    transition: transform 0.15s, filter 0.15s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .att-btn-checkin:hover:not(:disabled) {
    filter: brightness(1.08); transform: translateY(-1px);
  }

  .att-btn-checkout {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px 28px; border-radius: 14px;
    font-size: 14px; font-weight: 800;
    color: #fff; background: linear-gradient(135deg, #f43f5e, #e11d48);
    border: none; cursor: pointer;
    box-shadow: 0 4px 14px rgba(244, 63, 94, 0.4);
    transition: transform 0.15s, filter 0.15s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .att-btn-checkout:hover:not(:disabled) {
    filter: brightness(1.08); transform: translateY(-1px);
  }

  /* ── Stats Grid ── */
  .att-stats-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;
  }
  .att-stat-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 18px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    display: flex; flex-direction: column; gap: 8px;
  }
  .att-stat-icon-wrap {
    padding: 8px; border-radius: 10px; display: inline-flex; width: fit-content;
  }

  /* ── Status Badges ── */
  .att-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 99px;
    font-size: 11px; font-weight: 800; white-space: nowrap;
  }
  .att-badge-present { background: #ecfdf5; border: 1.5px solid #a7f3d0; color: #059669; }
  .att-badge-late    { background: #fffbeb; border: 1.5px solid #fde68a; color: #d97706; }
  .att-badge-absent  { background: #fff1f2; border: 1.5px solid #fecdd3; color: #e11d48; }
  .att-badge-leave   { background: #f5f3ff; border: 1.5px solid #ddd6fe; color: #7c3aed; }
  .att-badge-half    { background: #eff6ff; border: 1.5px solid #bfdbfe; color: #2563eb; }

  /* ── Table Card ── */
  .att-table-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }
  .att-table { width: 100%; border-collapse: collapse; }
  .att-th {
    text-align: left;
    font-size: 11px; font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.07em;
    padding: 12px 20px; background: #fafbfc;
    border-bottom: 1px solid #f1f5f9; white-space: nowrap;
  }
  .att-th:first-child { padding-left: 28px; }
  .att-th:last-child  { padding-right: 28px; }

  .att-tr { border-bottom: 1px solid #f8fafc; transition: background 0.12s; }
  .att-tr:last-child { border-bottom: none; }
  .att-tr:hover { background: #f8f7ff; }

  .att-td { padding: 15px 20px; vertical-align: middle; }
  .att-td:first-child { padding-left: 28px; }
  .att-td:last-child  { padding-right: 28px; }

  /* ── Modal Overlay ── */
  .att-modal-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .att-modal {
    background: #fff; border-radius: 24px; width: 100%; max-width: 480px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.15); overflow: hidden;
  }
  .att-modal-header {
    padding: 20px 24px; background: #fafbfc; border-bottom: 1px solid #f1f5f9;
    display: flex; align-items: center; justify-content: space-between;
  }
  .att-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .att-modal-footer {
    padding: 16px 24px; background: #fafbfc; border-top: 1px solid #f1f5f9;
    display: flex; justify-content: flex-end; gap: 10px;
  }

  .att-input {
    width: 100%; padding: 10px 14px;
    font-size: 13px; font-weight: 600; color: #0f172a;
    border: 1.5px solid #e8ecf0; border-radius: 12px;
    outline: none; transition: border-color 0.15s; box-sizing: border-box;
  }
  .att-input:focus { border-color: #6366f1; }

  /* ── State Wrappers ── */
  .att-state-wrap {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 80px 24px; gap: 12px; text-align: center;
  }
  .att-state-icon-wrap {
    width: 64px; height: 64px; border-radius: 20px;
    display: flex; align-items: center; justify-content: center; margin-bottom: 4px;
  }
`;

const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase();
  if (s === "present")
    return <span className="att-badge att-badge-present"><CheckCircle2 size={10} strokeWidth={2.5} /> Present</span>;
  if (s === "late")
    return <span className="att-badge att-badge-late"><AlertCircle size={10} strokeWidth={2.5} /> Late</span>;
  if (s === "on leave")
    return <span className="att-badge att-badge-leave"><Calendar size={10} strokeWidth={2.5} /> On Leave</span>;
  if (s === "half day")
    return <span className="att-badge att-badge-half"><Clock size={10} strokeWidth={2.5} /> Half Day</span>;
  return <span className="att-badge att-badge-absent"><XCircle size={10} strokeWidth={2.5} /> Absent</span>;
};

const Attendance = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isManagerOrAdmin = user.user_role === "manager" || user.user_role === "admin" || user.user_role === "ceo" || user.user_designation === "CEO";

  const [activeTab, setActiveTab] = useState("my-attendance");
  const [myAttendance, setMyAttendance] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [teamAttendance, setTeamAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filter state for team view
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Live time display
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Edit Modal State
  const [editRecordModal, setEditRecordModal] = useState(null);
  const [editStatus, setEditStatus] = useState("Present");
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");
  const [editRemarks, setEditRemarks] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchMyAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/attendance/my-attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setMyAttendance(res.data.data || []);
        setTodayRecord(res.data.todayRecord || null);
      }
    } catch (err) {
      console.error("Fetch My Attendance Error:", err);
    }
  };

  const fetchTeamAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/attendance/team-attendance?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setTeamAttendance(res.data.data || []);
      }
    } catch (err) {
      console.error("Fetch Team Attendance Error:", err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchMyAttendance(), isManagerOrAdmin ? fetchTeamAttendance() : Promise.resolve()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/attendance/check-in", {
        employee_name : user.user_fullname,
        employee_code : user.user_code
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      gooeyToast.success(res.data.message || "Checked in successfully", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });
      fetchMyAttendance();
    } catch (err) {
      console.error("Check in error:", err);
      gooeyToast.error(err.response?.data?.message || "Check in failed", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/attendance/check-out", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      gooeyToast.success(res.data.message || "Checked out successfully", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });
      fetchMyAttendance();
    } catch (err) {
      console.error("Check out error:", err);
      gooeyToast.error(err.response?.data?.message || "Check out failed", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveManualAttendance = async () => {
    if (!editRecordModal) return;
    try {
      const token = localStorage.getItem("token");
      const payload = {
        employee_code: editRecordModal.employee_code,
        employee_name: editRecordModal.employee_name,
        date: selectedDate,
        status: editStatus,
        check_in: editCheckIn,
        check_out: editCheckOut,
        remarks: editRemarks,
      };

      const res = await axios.post("http://localhost:5000/attendance/mark-manual", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      gooeyToast.success(res.data.message || "Attendance updated", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });
      setEditRecordModal(null);
      fetchTeamAttendance();
    } catch (err) {
      console.error("Save manual attendance error:", err);
      gooeyToast.error(err.response?.data?.message || "Failed to update attendance", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });
    }
  };

  // Stats Calculations
  const totalDaysLogged = myAttendance.length;
  const presentDaysCount = myAttendance.filter((r) => r.status === "Present").length;
  const lateDaysCount = myAttendance.filter((r) => r.status === "Late").length;
  const absentCount = myAttendance.filter((r) => r.status === "Absent").length;

  const filteredTeam = teamAttendance.filter((emp) =>
    emp.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employee_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employee_department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>
      <div className="att-root">
        {/* Sticky Page Header */}
        <div className="att-page-header">
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
              Attendance Portal
            </h1>
            <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>
              Track daily check-ins, work hours, and team attendance records
            </p>
          </div>

          {isManagerOrAdmin && (
            <div className="att-tabs">
              <button
                className={`att-tab${activeTab === "my-attendance" ? " active" : ""}`}
                onClick={() => setActiveTab("my-attendance")}
              >
                <Clock size={14} strokeWidth={2.5} />
                My Attendance
              </button>
              <button
                className={`att-tab${activeTab === "team-attendance" ? " active" : ""}`}
                onClick={() => setActiveTab("team-attendance")}
              >
                <Users size={14} strokeWidth={2.5} />
                Team Attendance
              </button>
            </div>
          )}
        </div>

        {/* Main Body */}
        <main style={{ maxWidth: 1040, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* ════════════════════════════════════
              TAB 1 — MY ATTENDANCE
          ════════════════════════════════════ */}
          {activeTab === "my-attendance" && (
            <>
              {/* Check-In / Check-Out Hero Card */}
              <div className="att-hero-card">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#a5b4fc", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    <Calendar size={14} />
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
                  </div>
                  <h2 style={{ fontSize: 32, fontWeight: 900, marginTop: 4, letterSpacing: "-0.02em" }}>
                    {currentTime}
                  </h2>
                  <p style={{ fontSize: 13, color: "#c7d2fe", fontWeight: 500, marginTop: 4 }}>
                    Logged in as <strong>{user.user_fullname}</strong> ({user.user_code})
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {todayRecord?.check_in && (
                    <div style={{ background: "rgba(255,255,255,0.1)", padding: "12px 20px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)" }}>
                      <p style={{ fontSize: 10, fontWeight: 800, color: "#a5b4fc", textTransform: "uppercase" }}>Check-In Time</p>
                      <p style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginTop: 2 }}>{todayRecord.check_in}</p>
                    </div>
                  )}

                  {todayRecord?.check_out && (
                    <div style={{ background: "rgba(255,255,255,0.1)", padding: "12px 20px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)" }}>
                      <p style={{ fontSize: 10, fontWeight: 800, color: "#a5b4fc", textTransform: "uppercase" }}>Check-Out Time</p>
                      <p style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginTop: 2 }}>{todayRecord.check_out}</p>
                    </div>
                  )}

                  {!todayRecord?.check_in ? (
                    <button
                      onClick={handleCheckIn}
                      disabled={actionLoading}
                      className="att-btn-checkin"
                    >
                      {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Clock size={16} strokeWidth={2.5} />}
                      Check In Today
                    </button>
                  ) : !todayRecord?.check_out ? (
                    <button
                      onClick={handleCheckOut}
                      disabled={actionLoading}
                      className="att-btn-checkout"
                    >
                      {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} strokeWidth={2.5} />}
                      Check Out Now
                    </button>
                  ) : (
                    <div style={{ background: "rgba(16, 185, 129, 0.2)", padding: "12px 20px", borderRadius: 16, border: "1.5px solid #10b981", display: "flex", alignItems: "center", gap: 8 }}>
                      <CheckCircle2 size={18} color="#34d399" strokeWidth={2.5} />
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#34d399" }}>Completed Today ({todayRecord.work_hours})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Monthly Stats Row */}
              <div className="att-stats-grid">
                <div className="att-stat-card">
                  <div className="att-stat-icon-wrap" style={{ background: "#eff6ff", color: "#3b82f6" }}>
                    <Calendar size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p style={{ fontSize: 22, fontWeight: 900, color: "#0f172a" }}>{totalDaysLogged}</p>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Total Days Logged</p>
                  </div>
                </div>

                <div className="att-stat-card">
                  <div className="att-stat-icon-wrap" style={{ background: "#ecfdf5", color: "#10b981" }}>
                    <UserCheck size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p style={{ fontSize: 22, fontWeight: 900, color: "#0f172a" }}>{presentDaysCount}</p>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>On-Time Present</p>
                  </div>
                </div>

                <div className="att-stat-card">
                  <div className="att-stat-icon-wrap" style={{ background: "#fffbeb", color: "#d97706" }}>
                    <AlertCircle size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p style={{ fontSize: 22, fontWeight: 900, color: "#0f172a" }}>{lateDaysCount}</p>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Late Check-Ins</p>
                  </div>
                </div>

                <div className="att-stat-card">
                  <div className="att-stat-icon-wrap" style={{ background: "#fff1f2", color: "#f43f5e" }}>
                    <UserX size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p style={{ fontSize: 22, fontWeight: 900, color: "#0f172a" }}>{absentCount}</p>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Absences</p>
                  </div>
                </div>
              </div>

              {/* Personal Attendance Logs Table */}
              <div className="att-table-card">
                <div style={{ padding: "18px 24px", background: "#fafbfc", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ padding: 8, borderRadius: 10, background: "#f5f3ff", color: "#6366f1" }}>
                      <Clock size={16} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Personal Attendance Log</p>
                      <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Historical check-ins and working hours</p>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="att-state-wrap">
                    <Loader2 size={24} color="#6366f1" className="animate-spin" />
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>Loading attendance history…</p>
                  </div>
                ) : myAttendance.length === 0 ? (
                  <div className="att-state-wrap">
                    <Clock size={28} color="#cbd5e1" />
                    <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>No Attendance History</p>
                    <p style={{ fontSize: 12, color: "#94a3b8" }}>Check in today to create your first attendance record.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="att-table">
                      <thead>
                        <tr>
                          <th className="att-th">Date</th>
                          <th className="att-th">Check In</th>
                          <th className="att-th">Check Out</th>
                          <th className="att-th">Work Duration</th>
                          <th className="att-th">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myAttendance.map((rec) => (
                          <tr key={rec._id} className="att-tr">
                            <td className="att-td">
                              <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>
                                {rec.date}
                              </span>
                            </td>
                            <td className="att-td">
                              <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>
                                {rec.check_in || "—"}
                              </span>
                            </td>
                            <td className="att-td">
                              <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>
                                {rec.check_out || "—"}
                              </span>
                            </td>
                            <td className="att-td">
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", background: "#f5f3ff", padding: "3px 10px", borderRadius: 8 }}>
                                {rec.work_hours || "0 hrs"}
                              </span>
                            </td>
                            <td className="att-td">
                              <StatusBadge status={rec.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ════════════════════════════════════
              TAB 2 — TEAM ATTENDANCE (MANAGER/ADMIN)
          ════════════════════════════════════ */}
          {activeTab === "team-attendance" && isManagerOrAdmin && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              
              {/* Controls bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, maxWidth: 450 }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input
                      type="text"
                      placeholder="Search team member name or code…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="att-input"
                      style={{ paddingLeft: 38 }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="att-input"
                    style={{ width: "auto" }}
                  />
                </div>
              </div>

              {/* Team Table Card */}
              <div className="att-table-card">
                {loading ? (
                  <div className="att-state-wrap">
                    <Loader2 size={24} color="#6366f1" className="animate-spin" />
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>Loading team attendance for {selectedDate}…</p>
                  </div>
                ) : filteredTeam.length === 0 ? (
                  <div className="att-state-wrap">
                    <Users size={28} color="#cbd5e1" />
                    <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>No Team Members Found</p>
                    <p style={{ fontSize: 12, color: "#94a3b8" }}>No attendance records match your filter.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="att-table">
                      <thead>
                        <tr>
                          <th className="att-th">Employee</th>
                          <th className="att-th">Code</th>
                          <th className="att-th">Department</th>
                          <th className="att-th">Check In</th>
                          <th className="att-th">Check Out</th>
                          <th className="att-th">Hours</th>
                          <th className="att-th">Status</th>
                          <th className="att-th" style={{ textAlign: "right" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTeam.map((emp) => (
                          <tr key={emp.employee_code} className="att-tr">
                            <td className="att-td">
                              <div>
                                <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{emp.employee_name}</p>
                                <p style={{ fontSize: 11, color: "#94a3b8" }}>{emp.employee_designation}</p>
                              </div>
                            </td>
                            <td className="att-td">
                              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 12, fontWeight: 700, color: "#475569", background: "#f1f5f9", padding: "2px 8px", borderRadius: 6 }}>
                                {emp.employee_code}
                              </span>
                            </td>
                            <td className="att-td">
                              <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>
                                {emp.employee_department}
                              </span>
                            </td>
                            <td className="att-td">
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>
                                {emp.check_in || "—"}
                              </span>
                            </td>
                            <td className="att-td">
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>
                                {emp.check_out || "—"}
                              </span>
                            </td>
                            <td className="att-td">
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#6366f1" }}>
                                {emp.work_hours}
                              </span>
                            </td>
                            <td className="att-td">
                              <StatusBadge status={emp.status} />
                            </td>
                            <td className="att-td" style={{ textAlign: "right" }}>
                              <button
                                onClick={() => {
                                  setEditRecordModal(emp);
                                  setEditStatus(emp.status || "Present");
                                  setEditCheckIn(emp.check_in || "09:00 AM");
                                  setEditCheckOut(emp.check_out || "05:00 PM");
                                  setEditRemarks(emp.remarks || "");
                                }}
                                style={{ padding: "6px 12px", fontSize: 12, fontWeight: 700, color: "#6366f1", background: "#f5f3ff", border: "1.5px solid #e0e7ff", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

        </main>

        {/* ── MODAL: MANUAL ATTENDANCE ADJUSTMENT ── */}
        {editRecordModal && (
          <div className="att-modal-overlay" onClick={() => setEditRecordModal(null)}>
            <div className="att-modal" onClick={(e) => e.stopPropagation()}>
              <div className="att-modal-header">
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Adjust Attendance</h3>
                  <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{editRecordModal.employee_name} ({editRecordModal.employee_code})</p>
                </div>
                <button onClick={() => setEditRecordModal(null)} style={{ border: "none", background: "#f1f5f9", borderRadius: 8, padding: 6, cursor: "pointer" }}>
                  <X size={16} color="#64748b" />
                </button>
              </div>

              <div className="att-modal-body">
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Attendance Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="att-input"
                  >
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Half Day">Half Day</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Check In Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 09:00 AM"
                      value={editCheckIn}
                      onChange={(e) => setEditCheckIn(e.target.value)}
                      className="att-input"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Check Out Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 05:00 PM"
                      value={editCheckOut}
                      onChange={(e) => setEditCheckOut(e.target.value)}
                      className="att-input"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Remarks / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Manual correction by HR"
                    value={editRemarks}
                    onChange={(e) => setEditRemarks(e.target.value)}
                    className="att-input"
                  />
                </div>
              </div>

              <div className="att-modal-footer">
                <button
                  onClick={() => setEditRecordModal(null)}
                  style={{ padding: "8px 16px", fontSize: 12, fontWeight: 700, color: "#64748b", background: "#f1f5f9", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveManualAttendance}
                  style={{ padding: "8px 20px", fontSize: 12, fontWeight: 800, color: "#fff", background: "linear-gradient(135deg, #6366f1, #4f46e5)", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit" }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Attendance;
