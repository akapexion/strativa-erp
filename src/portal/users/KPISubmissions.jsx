import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Percent,
  Plus,
  BarChart2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .kpi-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .kpi-root { background: #f8fafc; min-height: 100vh; }

  .kpi-header {
    background: #fff;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
    position: sticky; top: 0; z-index: 40;
  }

  .kpi-back-btn {
    width: 36px; height: 36px;
    border-radius: 10px;
    border: 1.5px solid #e8ecf0;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    color: #64748b; cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }
  .kpi-back-btn:hover { border-color: #6366f1; background: #f5f3ff; color: #6366f1; }

  .kpi-refresh-btn {
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
  .kpi-refresh-btn:hover {
    border-color: #6366f1; background: #f5f3ff; color: #6366f1;
    box-shadow: 0 2px 8px rgba(99,102,241,0.12);
  }

  .kpi-new-btn {
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
  .kpi-new-btn:hover {
    opacity: 0.92;
    box-shadow: 0 6px 20px rgba(99,102,241,0.45);
    transform: translateY(-1px);
  }

  .kpi-stat-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    padding: 20px 24px;
    display: flex; align-items: center; gap: 16px;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .kpi-stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .kpi-stat-icon { padding: 12px; border-radius: 14px; flex-shrink: 0; display: flex; }

  .kpi-section-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }

  .kpi-section-header {
    background: #fafbfc;
    border-bottom: 1px solid #f1f5f9;
    padding: 18px 28px;
    display: flex; align-items: center; gap: 10px;
  }

  .kpi-table { width: 100%; border-collapse: collapse; }
  .kpi-th {
    text-align: left;
    font-size: 11px; font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.07em;
    padding: 12px 20px;
    background: #fafbfc;
    border-bottom: 1px solid #f1f5f9;
    white-space: nowrap;
  }
  .kpi-th:first-child { padding-left: 28px; }
  .kpi-th:last-child { padding-right: 28px; }

  .kpi-tr {
    border-bottom: 1px solid #f8fafc;
    transition: background 0.12s;
    cursor: pointer;
  }
  .kpi-tr:last-child { border-bottom: none; }
  .kpi-tr:hover { background: #f8f7ff; }
  .kpi-tr:hover .kpi-chevron { color: #6366f1; transform: translateX(3px); }

  .kpi-td { padding: 15px 20px; vertical-align: middle; }
  .kpi-td:first-child { padding-left: 28px; }
  .kpi-td:last-child { padding-right: 28px; }

  .kpi-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #eef2ff, #e0e7ff);
    color: #6366f1;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 13px; flex-shrink: 0;
    box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px #e0e7ff;
  }

  .kpi-chevron {
    color: #cbd5e1;
    transition: color 0.15s, transform 0.2s;
  }

  .kpi-do-badge {
    display: inline-flex; align-items: center;
    padding: 4px 11px; border-radius: 8px;
    font-size: 11px; font-weight: 800;
    background: #faf5ff; border: 1.5px solid #e9d5ff; color: #7c3aed;
  }

  .kpi-att-value {
    font-size: 13px; font-weight: 800; color: #059669;
  }

  .kpi-footer {
    padding: 14px 28px;
    border-top: 1px solid #f1f5f9;
    background: #fafbfc;
    font-size: 12px; color: #94a3b8; font-weight: 500;
  }

  .kpi-table-scroll::-webkit-scrollbar { height: 4px; }
  .kpi-table-scroll::-webkit-scrollbar-track { background: transparent; }
  .kpi-table-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
`;

const KPISubmissions = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get(`http://localhost:5000/user/kpis/${user.user_code}`);
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const totalCount = data.length;
  const totalDO = data.reduce((sum, k) => sum + (Number(k.kpi_do_count) || 0), 0);
  const avgAttendance = data.length > 0
    ? Math.round(data.reduce((sum, k) => sum + Number(k.kpi_batch_attendence_percentage?.replace("%", "") || 0), 0) / data.length)
    : 0;

  return (
    <>
      <style>{styles}</style>
      <div className="kpi-root">

        {/* Header */}
        <div className="kpi-header px-6 py-3.5 flex items-center justify-between">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="kpi-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                KPI Submissions
              </h1>
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>
                Track and manage your KPI records
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={fetchData} className="kpi-refresh-btn">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} strokeWidth={2.5} />
              Refresh
            </button>
            <Link to="/hr360/user/raise-kpi" className="kpi-new-btn">
              <Plus size={15} strokeWidth={2.5} />
              New KPI
            </Link>
          </div>
        </div>

        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { label: "Total KPI", value: totalCount, icon: <TrendingUp size={18} strokeWidth={2.5} />, iconBg: "#eff6ff", iconColor: "#3b82f6" },
              { label: "Total DO Count", value: totalDO, icon: <BookOpen size={18} strokeWidth={2.5} />, iconBg: "#faf5ff", iconColor: "#7c3aed" },
              { label: "Avg Attendance", value: `${avgAttendance}%`, icon: <Percent size={18} strokeWidth={2.5} />, iconBg: "#f0fdf4", iconColor: "#16a34a" },
            ].map(({ label, value, icon, iconBg, iconColor }) => (
              <div key={label} className="kpi-stat-card">
                <div className="kpi-stat-icon" style={{ background: iconBg }}>
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
          <div className="kpi-section-card">
            <div className="kpi-section-header">
              <div style={{ padding: 8, borderRadius: 10, background: "#faf5ff", display: "flex" }}>
                <BarChart2 size={16} color="#7c3aed" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>All KPI Records</p>
                <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 1 }}>{totalCount} submissions</p>
              </div>
            </div>

            {!loading && (
              <div className="kpi-table-scroll" style={{ overflowX: "auto" }}>
                <table className="kpi-table">
                  <thead>
                    <tr>
                      <th className="kpi-th">Employee</th>
                      <th className="kpi-th">Batch</th>
                      <th className="kpi-th">Semester</th>
                      <th className="kpi-th">DO Count</th>
                      <th className="kpi-th" style={{ textAlign: "right" }}>Attendance</th>
                      <th className="kpi-th" style={{ width: 40 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((k) => (
                      <tr
                        key={k._id}
                        className="kpi-tr"
                        onClick={() => navigate(`/hr360/user/form-submission/${k._id}`)}
                      >
                        <td className="kpi-td">
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div className="kpi-avatar">{k.employee_name?.[0]?.toUpperCase() || "?"}</div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{k.employee_name}</span>
                          </div>
                        </td>
                        <td className="kpi-td">
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{k.kpi_batch}</span>
                        </td>
                        <td className="kpi-td">
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{k.kpi_batch_semester}</span>
                        </td>
                        <td className="kpi-td">
                          <span className="kpi-do-badge">{k.kpi_do_count}</span>
                        </td>
                        <td className="kpi-td" style={{ textAlign: "right" }}>
                          <span className="kpi-att-value">{k.kpi_batch_attendence_percentage}%</span>
                        </td>
                        <td className="kpi-td" style={{ paddingLeft: 8 }}>
                          <ChevronRight size={15} className="kpi-chevron" strokeWidth={2.5} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && (
              <div className="kpi-footer">
                Showing <span style={{ fontWeight: 800, color: "#334155" }}>{totalCount}</span> KPI submissions
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default KPISubmissions;