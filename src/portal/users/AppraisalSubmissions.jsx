import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  TrendingUp,
  BadgeCheck,
  BadgeX,
  Calendar,
  RefreshCw,
  ChevronRight,
  Plus,
  Star,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, getUploadUrl } from "../../config/api.js";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .apr-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .apr-root { background: #f8fafc; min-height: 100vh; }

  .apr-header {
    background: #fff;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
    position: sticky; top: 0; z-index: 40;
  }

  .apr-back-btn {
    width: 36px; height: 36px;
    border-radius: 10px;
    border: 1.5px solid #e8ecf0;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    color: #64748b; cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }
  .apr-back-btn:hover { border-color: #6366f1; background: #f5f3ff; color: #6366f1; }

  .apr-refresh-btn {
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
  .apr-refresh-btn:hover {
    border-color: #6366f1; background: #f5f3ff; color: #6366f1;
    box-shadow: 0 2px 8px rgba(99,102,241,0.12);
  }

  .apr-new-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 20px;
    font-size: 13px; font-weight: 800;
    color: #fff;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border: none; border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
    transition: opacity 0.15s, box-shadow 0.15s, transform 0.15s;
    text-decoration: none;
  }
  .apr-new-btn:hover { opacity: 0.92; box-shadow: 0 6px 20px rgba(99,102,241,0.45); transform: translateY(-1px); }

  .apr-stat-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    padding: 20px 24px;
    display: flex; align-items: center; gap: 16px;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .apr-stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .apr-stat-icon { padding: 12px; border-radius: 14px; flex-shrink: 0; display: flex; }

  .apr-section-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }

  .apr-section-header {
    background: #fafbfc;
    border-bottom: 1px solid #f1f5f9;
    padding: 18px 28px;
    display: flex; align-items: center; gap: 10px;
  }

  .apr-table { width: 100%; border-collapse: collapse; }
  .apr-th {
    text-align: left;
    font-size: 11px; font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.07em;
    padding: 12px 20px;
    background: #fafbfc;
    border-bottom: 1px solid #f1f5f9;
    white-space: nowrap;
  }
  .apr-th:first-child { padding-left: 28px; }
  .apr-th:last-child { padding-right: 28px; }

  .apr-tr {
    border-bottom: 1px solid #f8fafc;
    transition: background 0.12s;
    cursor: pointer;
  }
  .apr-tr:last-child { border-bottom: none; }
  .apr-tr:hover { background: #f8f7ff; }
  .apr-tr:hover .apr-chevron { color: #6366f1; transform: translateX(3px); }

  .apr-td { padding: 14px 20px; vertical-align: middle; }
  .apr-td:first-child { padding-left: 28px; }
  .apr-td:last-child { padding-right: 28px; }

  .apr-avatar {
    width: 38px; height: 38px;
    border-radius: 10px;
    overflow: hidden;
    background: linear-gradient(135deg, #eff6ff, #dbeafe);
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 14px; color: #2563eb;
    flex-shrink: 0;
    box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px #dbeafe;
  }
  .apr-avatar img { width: 100%; height: 100%; object-fit: cover; }

  .apr-chevron { color: #cbd5e1; transition: color 0.15s, transform 0.2s; }

  .apr-badge-qualified {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 99px;
    font-size: 11px; font-weight: 800;
    background: #ecfdf5; border: 1.5px solid #a7f3d0; color: #059669;
  }
  .apr-badge-not {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 99px;
    font-size: 11px; font-weight: 800;
    background: #fff1f2; border: 1.5px solid #fecdd3; color: #e11d48;
  }

  .apr-date-chip {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12px; font-weight: 600; color: #475569;
  }

  .apr-footer {
    padding: 14px 28px;
    border-top: 1px solid #f1f5f9;
    background: #fafbfc;
    font-size: 12px; color: #94a3b8; font-weight: 500;
  }

  .apr-table-scroll::-webkit-scrollbar { height: 4px; }
  .apr-table-scroll::-webkit-scrollbar-track { background: transparent; }
  .apr-table-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
`;

const AppraisalSubmissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get(`${API_BASE_URL}/user/appraisals/${user.user_code}`);
      setSubmissions(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load appraisal submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const totalCount = submissions.length;
  const qualifiedCount = submissions.filter(s => s.appraisal_sep_qualification?.toLowerCase() === "yes").length;
  const notQualifiedCount = submissions.filter(s => s.appraisal_sep_qualification?.toLowerCase() === "no").length;

  return (
    <>
      <style>{styles}</style>
      <div className="apr-root">

        {/* Header */}
        <div className="apr-header px-6 py-3.5 flex items-center justify-between">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="apr-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                Appraisal Submissions
              </h1>
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>
                Annual performance appraisal records
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={fetchSubmissions} className="apr-refresh-btn">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} strokeWidth={2.5} />
              Refresh
            </button>
            <Link to="/hr360/user/raise-appraisal" className="apr-new-btn">
              <Plus size={15} strokeWidth={2.5} />
              New Appraisal
            </Link>
          </div>
        </div>

        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { label: "Total Submissions", value: totalCount, icon: <TrendingUp size={18} strokeWidth={2.5} />, iconBg: "#eff6ff", iconColor: "#3b82f6" },
              { label: "SEP Qualified", value: qualifiedCount, icon: <BadgeCheck size={18} strokeWidth={2.5} />, iconBg: "#ecfdf5", iconColor: "#059669" },
              { label: "Not Qualified", value: notQualifiedCount, icon: <BadgeX size={18} strokeWidth={2.5} />, iconBg: "#fff1f2", iconColor: "#e11d48" },
            ].map(({ label, value, icon, iconBg, iconColor }) => (
              <div key={label} className="apr-stat-card">
                <div className="apr-stat-icon" style={{ background: iconBg }}>
                  <span style={{ color: iconColor, display: "flex" }}>{icon}</span>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="apr-section-card">
            <div className="apr-section-header">
              <div style={{ padding: 8, borderRadius: 10, background: "#fffbeb", display: "flex" }}>
                <Star size={16} color="#d97706" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>All Appraisals</p>
                <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 1 }}>{totalCount} submissions</p>
              </div>
            </div>

            {!loading && !error && (
              <div className="apr-table-scroll" style={{ overflowX: "auto" }}>
                <table className="apr-table">
                  <thead>
                    <tr>
                      <th className="apr-th">Employee</th>
                      <th className="apr-th">Joining Date</th>
                      <th className="apr-th">Last Increment</th>
                      <th className="apr-th">Achievements</th>
                      <th className="apr-th">SEP Status</th>
                      <th className="apr-th" style={{ width: 40 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s, index) => (
                      <tr
                        key={s._id || index}
                        className="apr-tr"
                        onClick={() => navigate(`/hr360/user/form-submission/${s._id}`)}
                      >
                        <td className="apr-td">
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div className="apr-avatar">
                              <img
                                src={getUploadUrl(s.employee_image)}
                                alt=""
                                onError={(e) => { e.target.style.display = "none"; }}
                              />
                              {(s.employee_fname || s.employee_name || "?")[0].toUpperCase()}
                            </div>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>
                                {s.employee_fname && s.employee_lname ? `${s.employee_fname} ${s.employee_lname}` : s.employee_name || "—"}
                              </p>
                              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginTop: 2 }}>
                                {s.employee_designation || s.employee_department || ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="apr-td">
                          <span className="apr-date-chip">
                            <Calendar size={13} color="#94a3b8" />
                            {s.appraisal_joining_date}
                          </span>
                        </td>
                        <td className="apr-td">
                          <span className="apr-date-chip">
                            <TrendingUp size={13} color="#94a3b8" />
                            {s.appraisal_lastincrement_date}
                          </span>
                        </td>
                        <td className="apr-td" style={{ maxWidth: 220 }}>
                          <p style={{ fontSize: 13, color: "#475569", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {s.appraisal_achievements || "—"}
                          </p>
                        </td>
                        <td className="apr-td">
                          {s.appraisal_sep_qualification?.toLowerCase() === "yes" ? (
                            <span className="apr-badge-qualified">
                              <BadgeCheck size={10} strokeWidth={2.5} /> Qualified
                            </span>
                          ) : s.appraisal_sep_qualification?.toLowerCase() === "no" ? (
                            <span className="apr-badge-not">
                              <BadgeX size={10} strokeWidth={2.5} /> Not Qualified
                            </span>
                          ) : (
                            <span style={{ color: "#94a3b8", fontSize: 13 }}>—</span>
                          )}
                        </td>
                        <td className="apr-td" style={{ paddingLeft: 8 }}>
                          <ChevronRight size={15} className="apr-chevron" strokeWidth={2.5} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && !error && (
              <div className="apr-footer">
                Showing <span style={{ fontWeight: 800, color: "#334155" }}>{totalCount}</span> appraisal submissions
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AppraisalSubmissions;