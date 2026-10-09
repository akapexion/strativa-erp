import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  FileText,
  Trash2,
  Eye,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  InboxIcon,
  X,
  LayoutGrid,
  ClipboardList,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { gooeyToast } from "goey-toast";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .af-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .af-root { background: #f8fafc; min-height: 100vh; }

  /* ── Header ── */
  .af-page-header {
    background: #fff;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
    position: sticky; top: 0; z-index: 40;
    padding: 14px 24px;
    display: flex; align-items: center; justify-content: space-between;
  }

  .af-create-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 20px; font-size: 13px; font-weight: 800;
    color: #fff;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border: none; border-radius: 12px; cursor: pointer;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
    transition: opacity 0.15s, box-shadow 0.15s, transform 0.15s;
    text-decoration: none;
  }
  .af-create-btn:hover { opacity: 0.92; box-shadow: 0 6px 20px rgba(99,102,241,0.45); transform: translateY(-1px); }

  /* ── Tabs ── */
  .af-tabs {
    display: inline-flex;
    background: #f1f5f9;
    border-radius: 14px;
    padding: 4px;
    gap: 2px;
  }
  .af-tab {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 20px;
    border-radius: 11px;
    font-size: 13px; font-weight: 700;
    cursor: pointer; border: none;
    font-family: inherit;
    transition: background 0.18s, color 0.18s, box-shadow 0.18s;
    color: #64748b; background: transparent;
  }
  .af-tab.active {
    background: #fff;
    color: #6366f1;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05);
  }
  .af-tab:not(.active):hover { background: #e8ecf0; color: #334155; }

  /* ── Search & Filter Controls ── */
  .af-search-box {
    position: relative; flex: 1; max-width: 320px;
  }
  .af-search-input {
    width: 100%; padding: 9px 14px 9px 38px;
    font-size: 13px; font-weight: 600; color: #0f172a;
    border: 1.5px solid #e8ecf0; border-radius: 12px;
    background: #fff; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }
  .af-search-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  .af-search-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: #94a3b8; pointer-events: none;
  }

  .af-select-filter {
    padding: 9px 32px 9px 14px;
    font-size: 13px; font-weight: 700; color: #475569;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1.5px solid #e8ecf0; border-radius: 12px;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 12px center;
    appearance: none; outline: none; cursor: pointer;
  }

  /* ── Cards Grid ── */
  .af-cards-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;
  }
  .af-card {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    padding: 22px;
    display: flex; flex-direction: column; justify-content: space-between; gap: 16px;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  }
  .af-card:hover {
    border-color: #c7d2fe;
    box-shadow: 0 4px 24px rgba(99,102,241,0.1), 0 1px 4px rgba(0,0,0,0.04);
    transform: translateY(-2px);
  }

  .af-badge-role {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 8px;
    font-size: 11px; font-weight: 800; text-transform: uppercase;
    background: #eff6ff; border: 1.5px solid #bfdbfe; color: #2563eb;
  }

  .af-action-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 8px 14px; border-radius: 10px;
    font-size: 12px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    transition: all 0.15s; border: none;
  }
  .af-btn-view {
    background: #f5f3ff; color: #6366f1; border: 1.5px solid #e0e7ff;
  }
  .af-btn-view:hover {
    background: #ede9fe; border-color: #c7d2fe; transform: translateY(-1px);
  }
  .af-btn-delete {
    background: #fff1f2; color: #e11d48; border: 1.5px solid #fecdd3;
  }
  .af-btn-delete:hover {
    background: #ffe4e6; border-color: #fda4af; transform: translateY(-1px);
  }

  /* ── Table ── */
  .af-table-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }
  .af-table { width: 100%; border-collapse: collapse; }
  .af-th {
    text-align: left;
    font-size: 11px; font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.07em;
    padding: 12px 20px; background: #fafbfc;
    border-bottom: 1px solid #f1f5f9; white-space: nowrap;
  }
  .af-th:first-child { padding-left: 28px; }
  .af-th:last-child  { padding-right: 28px; }

  .af-tr { border-bottom: 1px solid #f8fafc; transition: background 0.12s; }
  .af-tr:last-child { border-bottom: none; }
  .af-tr:hover { background: #f8f7ff; }

  .af-td { padding: 15px 20px; vertical-align: middle; }
  .af-td:first-child { padding-left: 28px; }
  .af-td:last-child  { padding-right: 28px; }

  .af-form-no {
    font-family: 'Courier New', monospace;
    font-size: 11px; font-weight: 700; color: #64748b;
    background: #f1f5f9; border: 1px solid #e2e8f0;
    border-radius: 7px; padding: 3px 9px; letter-spacing: 0.04em;
  }

  /* ── Status Badges ── */
  .af-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 99px;
    font-size: 11px; font-weight: 800; white-space: nowrap;
  }
  .af-badge-approved { background: #ecfdf5; border: 1.5px solid #a7f3d0; color: #059669; }
  .af-badge-pending  { background: #fffbeb; border: 1.5px solid #fde68a; color: #d97706; }
  .af-badge-rejected { background: #fff1f2; border: 1.5px solid #fecdd3; color: #e11d48; }

  /* ── Modal Overlay ── */
  .af-modal-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .af-modal {
    background: #fff; border-radius: 24px; width: 100%; max-width: 580px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.15); overflow: hidden;
    max-height: 85vh; display: flex; flex-direction: column;
  }
  .af-modal-header {
    padding: 20px 24px; background: #fafbfc; border-bottom: 1px solid #f1f5f9;
    display: flex; align-items: center; justify-content: space-between;
  }
  .af-modal-body {
    padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px;
  }
  .af-modal-footer {
    padding: 16px 24px; background: #fafbfc; border-top: 1px solid #f1f5f9;
    display: flex; justify-content: flex-end;
  }

  /* ── State Wrappers ── */
  .af-state-wrap {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 80px 24px; gap: 12px; text-align: center;
  }
  .af-state-icon-wrap {
    width: 64px; height: 64px; border-radius: 20px;
    display: flex; align-items: center; justify-content: center; margin-bottom: 4px;
  }
`;

const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase();
  if (s === "approved")
    return <span className="af-badge af-badge-approved"><CheckCircle2 size={10} strokeWidth={2.5} /> Approved</span>;
  if (s === "rejected")
    return <span className="af-badge af-badge-rejected"><XCircle size={10} strokeWidth={2.5} /> Rejected</span>;
  return <span className="af-badge af-badge-pending"><Clock size={10} strokeWidth={2.5} /> {status || "Pending"}</span>;
};

const Forms = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("templates"); // 'templates' | 'submissions'
  const [customForms, setCustomForms] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State for Viewing Fields
  const [selectedFormModal, setSelectedFormModal] = useState(null);

  // Fetch Custom Form Templates
  const fetchCustomForms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/custom-forms/all-forms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setCustomForms(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching custom forms:", err);
    }
  };

  // Fetch All Submissions for Admin
  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/custom-forms/admin/all-submissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setSubmissions(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching admin submissions:", err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchCustomForms(), fetchSubmissions()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteForm = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the form template "${title}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:5000/custom-forms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      gooeyToast.success(res.data.message || "Custom form template deleted", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });
      setCustomForms((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Delete Custom Form Error:", err);
      gooeyToast.error(err.response?.data?.message || "Error deleting form template", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });
    }
  };

  // Filtered Templates
  const filteredTemplates = customForms.filter((form) =>
    form.form_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.form_target_role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered Submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      (sub.form_title && sub.form_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sub.employee_name && sub.employee_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sub.employee_code && sub.employee_code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sub.form_no && sub.form_no.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (sub.form_status && sub.form_status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <style>{styles}</style>
      <div className="af-root">
        {/* Sticky Top Header */}
        <div className="af-page-header">
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
              Forms &amp; Templates Management
            </h1>
            <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>
              Manage dynamic custom form templates and view all company form submissions
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="af-tabs">
              <button
                className={`af-tab${activeTab === "templates" ? " active" : ""}`}
                onClick={() => setActiveTab("templates")}
              >
                <LayoutGrid size={14} strokeWidth={2.5} />
                Form Templates ({customForms.length})
              </button>
              <button
                className={`af-tab${activeTab === "submissions" ? " active" : ""}`}
                onClick={() => setActiveTab("submissions")}
              >
                <ClipboardList size={14} strokeWidth={2.5} />
                All Submissions ({submissions.length})
              </button>
            </div>

            <Link to="/hr360/admin/add-form" className="af-create-btn">
              <Plus size={16} strokeWidth={2.5} />
              Create Custom Form
            </Link>
          </div>
        </div>

        {/* Main Content Body */}
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
          
          {/* Controls Bar: Search & Status Filters */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
            <div className="af-search-box">
              <Search size={15} className="af-search-icon" />
              <input
                type="text"
                placeholder={activeTab === "templates" ? "Search templates by title or target…" : "Search by title, employee name, or code…"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="af-search-input"
              />
            </div>

            {activeTab === "submissions" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="af-select-filter"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="af-state-wrap">
              <div className="af-state-icon-wrap" style={{ background: "#f5f3ff" }}>
                <Loader2 size={28} color="#6366f1" className="animate-spin" strokeWidth={2.5} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>Loading forms data…</p>
            </div>
          )}

          {/* ════════════════════════════════════
              TAB 1 — FORM TEMPLATES
          ════════════════════════════════════ */}
          {!loading && activeTab === "templates" && (
            <>
              {filteredTemplates.length === 0 ? (
                <div className="af-state-wrap">
                  <div className="af-state-icon-wrap" style={{ background: "#f8fafc" }}>
                    <InboxIcon size={28} color="#cbd5e1" strokeWidth={2.5} />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>No Form Templates Found</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                    {searchQuery ? "Try refining your search query." : "Click 'Create Custom Form' to build your first template."}
                  </p>
                </div>
              ) : (
                <div className="af-cards-grid">
                  {filteredTemplates.map((form) => (
                    <div key={form._id} className="af-card">
                      {/* Card Top Header */}
                      <div>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                          <div style={{ padding: 8, borderRadius: 12, background: "#f5f3ff", color: "#6366f1" }}>
                            <FileText size={18} strokeWidth={2.5} />
                          </div>
                          <span className="af-badge-role">
                            <Users size={11} strokeWidth={2.5} />
                            {form.form_target_role === "all" ? "All Departments" : form.form_target_role}
                          </span>
                        </div>

                        <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", lineHeight: 1.3, marginBottom: 6 }}>
                          {form.form_title}
                        </h3>

                        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <FileText size={13} /> {form.fields?.length || 0} fields
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Calendar size={13} /> {new Date(form.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Card Divider & Actions */}
                      <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                        <button
                          onClick={() => setSelectedFormModal(form)}
                          className="af-action-btn af-btn-view"
                        >
                          <Eye size={13} strokeWidth={2.5} /> Fields
                        </button>
                        <Link
                          to={`/hr360/admin/edit-form/${form._id}`}
                          className="af-action-btn af-btn-view"
                          style={{ textDecoration: "none" }}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteForm(form._id, form.form_title)}
                          className="af-action-btn af-btn-delete"
                        >
                          <Trash2 size={13} strokeWidth={2.5} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ════════════════════════════════════
              TAB 2 — ALL SUBMISSIONS
          ════════════════════════════════════ */}
          {!loading && activeTab === "submissions" && (
            <div className="af-table-card">
              {filteredSubmissions.length === 0 ? (
                <div className="af-state-wrap">
                  <div className="af-state-icon-wrap" style={{ background: "#f8fafc" }}>
                    <InboxIcon size={28} color="#cbd5e1" strokeWidth={2.5} />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>No Form Submissions</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>No submitted forms match the selected filters.</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="af-table">
                    <thead>
                      <tr>
                        <th className="af-th">Form No</th>
                        <th className="af-th">Form Name</th>
                        <th className="af-th">Submitted By</th>
                        <th className="af-th">Employee Code</th>
                        <th className="af-th">Status</th>
                        <th className="af-th">Submitted Date</th>
                        <th className="af-th" style={{ width: 40 }} />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.map((sub) => (
                        <tr key={sub._id} className="af-tr">
                          <td className="af-td">
                            <span className="af-form-no">{sub.form_no || "—"}</span>
                          </td>
                          <td className="af-td">
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                              {sub.form_title || "Untitled Form"}
                            </p>
                          </td>
                          <td className="af-td">
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>
                              {sub.employee_name || "—"}
                            </p>
                          </td>
                          <td className="af-td">
                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 12, fontWeight: 700, color: "#64748b" }}>
                              {sub.employee_code || "—"}
                            </span>
                          </td>
                          <td className="af-td">
                            <StatusBadge status={sub.form_status} />
                          </td>
                          <td className="af-td">
                            <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                              {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "—"}
                            </span>
                          </td>
                          <td className="af-td" style={{ paddingLeft: 4 }}>
                            <Link to={`/hr360/user/form-submission/${sub._id}`}>
                              <ArrowRight size={15} color="#cbd5e1" strokeWidth={2.5} style={{ cursor: "pointer" }} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>

        {/* ── MODAL: VIEW FIELDS PREVIEW ── */}
        {selectedFormModal && (
          <div className="af-modal-overlay" onClick={() => setSelectedFormModal(null)}>
            <div className="af-modal" onClick={(e) => e.stopPropagation()}>
              <div className="af-modal-header">
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
                    {selectedFormModal.form_title}
                  </h3>
                  <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>
                    Target Role: <strong style={{ color: "#6366f1" }}>{selectedFormModal.form_target_role}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFormModal(null)}
                  style={{ background: "#f1f5f9", border: "none", borderRadius: 10, padding: 6, cursor: "pointer", color: "#64748b" }}
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>

              <div className="af-modal-body">
                <p style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Form Specification ({selectedFormModal.fields?.length || 0} fields)
                </p>

                {selectedFormModal.fields?.map((f, idx) => (
                  <div key={idx} style={{ background: "#f8fafc", border: "1.5px solid #e8ecf0", borderRadius: 14, padding: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>
                        {idx + 1}. {f.field_label}
                        {f.field_required && <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#6366f1", background: "#eff6ff", border: "1px solid #bfdbfe", padding: "2px 8px", borderRadius: 6, textTransform: "uppercase" }}>
                        {f.field_type}
                      </span>
                    </div>

                    {f.field_type === "select" && f.field_options?.length > 0 && (
                      <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px dashed #e2e8f0" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 4 }}>Dropdown Options:</span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {f.field_options.map((opt, oIdx) => (
                            <span key={oIdx} style={{ fontSize: 11, fontWeight: 700, color: "#475569", background: "#fff", border: "1px solid #cbd5e1", padding: "2px 8px", borderRadius: 6 }}>
                              {opt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="af-modal-footer">
                <button
                  onClick={() => setSelectedFormModal(null)}
                  style={{ padding: "8px 18px", fontSize: 12, fontWeight: 700, color: "#475569", background: "#f1f5f9", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Forms;
