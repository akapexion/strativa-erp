import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  TrendingUp,
  BadgeDollarSign,
  Repeat,
  RefreshCw,
  ChevronRight,
  Plus,
  DollarSign,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .dfi-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .dfi-root { background: #f8fafc; min-height: 100vh; }

  .dfi-header {
    background: #fff;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
    position: sticky; top: 0; z-index: 40;
  }

  .dfi-back-btn {
    width: 36px; height: 36px;
    border-radius: 10px;
    border: 1.5px solid #e8ecf0;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    color: #64748b; cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }
  .dfi-back-btn:hover { border-color: #6366f1; background: #f5f3ff; color: #6366f1; }

  .dfi-refresh-btn {
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
  .dfi-refresh-btn:hover {
    border-color: #6366f1; background: #f5f3ff; color: #6366f1;
    box-shadow: 0 2px 8px rgba(99,102,241,0.12);
  }

  .dfi-new-btn {
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
  .dfi-new-btn:hover { opacity: 0.92; box-shadow: 0 6px 20px rgba(99,102,241,0.45); transform: translateY(-1px); }

  .dfi-stat-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    padding: 20px 24px;
    display: flex; align-items: center; gap: 16px;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .dfi-stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .dfi-stat-icon { padding: 12px; border-radius: 14px; flex-shrink: 0; display: flex; }

  .dfi-section-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }

  .dfi-section-header {
    background: #fafbfc;
    border-bottom: 1px solid #f1f5f9;
    padding: 18px 28px;
    display: flex; align-items: center; gap: 10px;
  }

  .dfi-table { width: 100%; border-collapse: collapse; }
  .dfi-th {
    text-align: left;
    font-size: 11px; font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.07em;
    padding: 12px 20px;
    background: #fafbfc;
    border-bottom: 1px solid #f1f5f9;
    white-space: nowrap;
  }
  .dfi-th:first-child { padding-left: 28px; }
  .dfi-th:last-child { padding-right: 28px; }

  .dfi-tr {
    border-bottom: 1px solid #f8fafc;
    transition: background 0.12s;
    cursor: pointer;
  }
  .dfi-tr:last-child { border-bottom: none; }
  .dfi-tr:hover { background: #f8f7ff; }
  .dfi-tr:hover .dfi-chevron { color: #6366f1; transform: translateX(3px); }

  .dfi-td { padding: 15px 20px; vertical-align: middle; }
  .dfi-td:first-child { padding-left: 28px; }
  .dfi-td:last-child { padding-right: 28px; }

  .dfi-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
    color: #059669;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 13px; flex-shrink: 0;
    box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px #d1fae5;
  }

  .dfi-chevron { color: #cbd5e1; transition: color 0.15s, transform 0.2s; }

  .dfi-alt-badge {
    display: inline-flex; align-items: center;
    padding: 4px 11px; border-radius: 8px;
    font-size: 11px; font-weight: 800;
    background: #faf5ff; border: 1.5px solid #e9d5ff; color: #7c3aed;
  }

  .dfi-amount-value {
    font-size: 13px; font-weight: 800; color: #059669;
  }

  .dfi-code-chip {
    font-size: 11px; font-weight: 700;
    color: #64748b;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    padding: 3px 9px;
    font-family: 'Courier New', monospace;
    letter-spacing: 0.04em;
  }

  .dfi-footer {
    padding: 14px 28px;
    border-top: 1px solid #f1f5f9;
    background: #fafbfc;
    font-size: 12px; color: #94a3b8; font-weight: 500;
  }

  .dfi-table-scroll::-webkit-scrollbar { height: 4px; }
  .dfi-table-scroll::-webkit-scrollbar-track { background: transparent; }
  .dfi-table-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
`;

const DFISubmissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get(`http://localhost:5000/user/dfis/${user.user_code}`);
      setSubmissions(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load DFI submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const totalCount = submissions.length;
  const totalAmount = submissions.reduce((sum, s) => sum + (Number(s.dfi_amount) || 0), 0);
  const totalAlternates = submissions.reduce((sum, s) => sum + (Number(s.dfi_alternate_count) || 0), 0);

  return (
    <>
      <style>{styles}</style>
      <div className="dfi-root">

        {/* Header */}
        <div className="dfi-header px-6 py-3.5 flex items-center justify-between">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="dfi-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                DFI Submissions
              </h1>
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>
                Direct Financial Incentive records
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={fetchSubmissions} className="dfi-refresh-btn">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} strokeWidth={2.5} />
              Refresh
            </button>
            <Link to="/hr360/user/raise-dfi" className="dfi-new-btn">
              <Plus size={15} strokeWidth={2.5} />
              New DFI
            </Link>
          </div>
        </div>

        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { label: "Total Submissions", value: totalCount, icon: <TrendingUp size={18} strokeWidth={2.5} />, iconBg: "#eff6ff", iconColor: "#3b82f6" },
              { label: "Total Amount", value: `PKR ${totalAmount.toLocaleString()}`, icon: <DollarSign size={18} strokeWidth={2.5} />, iconBg: "#f0fdf4", iconColor: "#16a34a" },
              { label: "Total Alternates", value: totalAlternates, icon: <Repeat size={18} strokeWidth={2.5} />, iconBg: "#faf5ff", iconColor: "#7c3aed" },
            ].map(({ label, value, icon, iconBg, iconColor }) => (
              <div key={label} className="dfi-stat-card">
                <div className="dfi-stat-icon" style={{ background: iconBg }}>
                  <span style={{ color: iconColor, display: "flex" }}>{icon}</span>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="dfi-section-card">
            <div className="dfi-section-header">
              <div style={{ padding: 8, borderRadius: 10, background: "#f0fdf4", display: "flex" }}>
                <BadgeDollarSign size={16} color="#16a34a" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>All DFI Records</p>
                <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 1 }}>{totalCount} submissions</p>
              </div>
            </div>

            {!loading && !error && (
              <div className="dfi-table-scroll" style={{ overflowX: "auto" }}>
                <table className="dfi-table">
                  <thead>
                    <tr>
                      <th className="dfi-th">Employee</th>
                      <th className="dfi-th">Employee Code</th>
                      <th className="dfi-th">Alternate Count</th>
                      <th className="dfi-th" style={{ textAlign: "right" }}>Amount</th>
                      <th className="dfi-th" style={{ width: 40 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s, index) => (
                      <tr
                        key={s._id || index}
                        className="dfi-tr"
                        onClick={() => navigate(`/hr360/user/form-submission/${s._id}`)}
                      >
                        <td className="dfi-td">
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div className="dfi-avatar">{s.employee_name?.[0]?.toUpperCase() || "?"}</div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{s.employee_name}</span>
                          </div>
                        </td>
                        <td className="dfi-td">
                          <span className="dfi-code-chip">{s.employee_code}</span>
                        </td>
                        <td className="dfi-td">
                          <span className="dfi-alt-badge">{s.dfi_alternate_count}</span>
                        </td>
                        <td className="dfi-td" style={{ textAlign: "right" }}>
                          <span className="dfi-amount-value">PKR {Number(s.dfi_amount).toLocaleString()}</span>
                        </td>
                        <td className="dfi-td" style={{ paddingLeft: 8 }}>
                          <ChevronRight size={15} className="dfi-chevron" strokeWidth={2.5} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && !error && (
              <div className="dfi-footer">
                Showing <span style={{ fontWeight: 800, color: "#334155" }}>{totalCount}</span> DFI submissions
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default DFISubmissions;