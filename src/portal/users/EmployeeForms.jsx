import React, { useEffect, useState } from "react";
import {
  FileText,
  ArrowRight,
  LayoutGrid,
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  DollarSign,
  BarChart2,
  InboxIcon,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .ef-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .ef-root { background: #f8fafc; min-height: 100vh; }

  /* ── Page header ── */
  .ef-page-header {
    background: #fff;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
    position: sticky; top: 0; z-index: 40;
    padding: 14px 24px;
    display: flex; align-items: center; justify-content: space-between;
  }

  /* ── Tab switcher ── */
  .ef-tabs {
    display: inline-flex;
    background: #f1f5f9;
    border-radius: 14px;
    padding: 4px;
    gap: 2px;
  }
  .ef-tab {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 20px;
    border-radius: 11px;
    font-size: 13px; font-weight: 700;
    cursor: pointer; border: none;
    font-family: inherit;
    transition: background 0.18s, color 0.18s, box-shadow 0.18s;
    color: #64748b; background: transparent;
  }
  .ef-tab.active {
    background: #fff;
    color: #6366f1;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05);
  }
  .ef-tab:not(.active):hover { background: #e8ecf0; color: #334155; }

  /* ── Section card ── */
  .ef-section-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }

  /* ── Section header ── */
  .ef-section-header {
    background: #fafbfc;
    border-bottom: 1px solid #f1f5f9;
    padding: 20px 28px;
    display: flex; align-items: center; justify-content: space-between;
  }

  /* ── Count pill ── */
  .ef-count-pill {
    display: inline-flex; align-items: center;
    padding: 4px 12px; border-radius: 99px;
    font-size: 11px; font-weight: 800;
    background: #eff6ff; border: 1.5px solid #bfdbfe; color: #3b82f6;
  }

  /* ── Table ── */
  .ef-table { width: 100%; border-collapse: collapse; }
  .ef-th {
    text-align: left;
    font-size: 11px; font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.07em;
    padding: 12px 20px;
    background: #fafbfc;
    border-bottom: 1px solid #f1f5f9;
    white-space: nowrap;
  }
  .ef-th:first-child { padding-left: 28px; }
  .ef-th:last-child  { padding-right: 28px; }

  .ef-tr {
    border-bottom: 1px solid #f8fafc;
    transition: background 0.12s;
  }
  .ef-tr:last-child { border-bottom: none; }
  .ef-tr:hover { background: #f8f7ff; }
  .ef-tr:hover .ef-arrow { color: #6366f1; transform: translateX(4px); }

  .ef-td { padding: 15px 20px; vertical-align: middle; }
  .ef-td:first-child { padding-left: 28px; }
  .ef-td:last-child  { padding-right: 28px; }

  /* ── Form number chip ── */
  .ef-form-no {
    font-family: 'Courier New', monospace;
    font-size: 11px; font-weight: 700;
    color: #64748b;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    padding: 3px 9px;
    letter-spacing: 0.04em;
  }

  /* ── Form icon box ── */
  .ef-form-icon {
    padding: 8px; border-radius: 10px;
    background: #eff6ff; color: #6366f1;
    display: flex; flex-shrink: 0;
    transition: background 0.15s, color 0.15s;
  }
  .ef-tr:hover .ef-form-icon { background: #6366f1; color: #fff; }

  /* ── Status badges ── */
  .ef-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 99px;
    font-size: 11px; font-weight: 800; white-space: nowrap;
  }
  .ef-badge-approved { background: #ecfdf5; border: 1.5px solid #a7f3d0; color: #059669; }
  .ef-badge-pending  { background: #fffbeb; border: 1.5px solid #fde68a; color: #d97706; }
  .ef-badge-rejected { background: #fff1f2; border: 1.5px solid #fecdd3; color: #e11d48; }

  /* ── Arrow ── */
  .ef-arrow {
    color: #cbd5e1;
    transition: color 0.15s, transform 0.2s;
    margin-left: auto; display: block;
  }

  /* ── State wrappers ── */
  .ef-state-wrap {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 80px 24px; gap: 12px;
  }
  .ef-state-icon-wrap {
    width: 64px; height: 64px; border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }

  /* ── Footer ── */
  .ef-footer {
    padding: 14px 28px;
    border-top: 1px solid #f1f5f9;
    background: #fafbfc;
    font-size: 12px; color: #94a3b8; font-weight: 500;
  }

  /* ── Scrollbar ── */
  .ef-table-scroll::-webkit-scrollbar { height: 4px; }
  .ef-table-scroll::-webkit-scrollbar-track { background: transparent; }
  .ef-table-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }

  /* ══════════════════════════════════════════
     EASY FORMS CARDS
  ══════════════════════════════════════════ */
  .ef-form-card {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    padding: 20px;
    display: flex; flex-direction: column; gap: 16px;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  }
  .ef-form-card:hover {
    border-color: #c7d2fe;
    box-shadow: 0 4px 24px rgba(99,102,241,0.1), 0 1px 4px rgba(0,0,0,0.04);
    transform: translateY(-2px);
  }

  /* Card top row */
  .ef-card-icon-wrap {
    padding: 9px; border-radius: 12px;
    display: flex; flex-shrink: 0;
    transition: background 0.2s;
  }

  /* Category badge */
  .ef-category-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 8px; border-radius: 7px;
    font-size: 10px; font-weight: 800;
  }

  /* Card action buttons */
  .ef-card-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 5px;
    padding: 6px 14px; border-radius: 9px;
    font-size: 12px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    text-decoration: none; white-space: nowrap;
    transition: background 0.15s, box-shadow 0.15s, transform 0.12s;
  }
  .ef-card-btn-raise {
    background: linear-gradient(135deg, #6366f1, #818cf8);
    color: #fff;
    box-shadow: 0 2px 8px rgba(99,102,241,0.22);
    border: none;
  }
  .ef-card-btn-raise:hover {
    filter: brightness(1.08);
    box-shadow: 0 4px 12px rgba(99,102,241,0.32);
    transform: translateY(-1px);
  }
  .ef-card-btn-submissions {
    background: #f5f3ff;
    color: #6366f1;
    border: 1.5px solid #e0e7ff;
  }
  .ef-card-btn-submissions:hover {
    background: #ede9fe;
    border-color: #c7d2fe;
    transform: translateY(-1px);
  }

  /* Divider */
  .ef-card-divider {
    height: 1px; background: #f1f5f9; margin: 0 -4px;
  }

  /* Form type accent colors */
  .ef-accent-appraisal { background: #eff6ff; color: #3b82f6; }
  .ef-accent-dfi       { background: #f0fdf4; color: #16a34a; }
  .ef-accent-kpi       { background: #faf5ff; color: #7c3aed; }
  .ef-cat-appraisal    { background: #eff6ff; border: 1.5px solid #bfdbfe; color: #2563eb; }
  .ef-cat-dfi          { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; }
  .ef-cat-kpi          { background: #faf5ff; border: 1.5px solid #e9d5ff; color: #7c3aed; }

  /* Type pill in table */
  .ef-type-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 8px;
    font-size: 11px; font-weight: 800; white-space: nowrap;
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getFormMeta = (title) => {
  if (title === "Annual Appraisal")
    return { icon: <Star size={16} strokeWidth={2.5} />, accentClass: "ef-accent-appraisal", catClass: "ef-cat-appraisal", catLabel: "Appraisal", typeClass: "ef-accent-appraisal" };
  if (title === "Direct Financial Incentive - DFI")
    return { icon: <DollarSign size={16} strokeWidth={2.5} />, accentClass: "ef-accent-dfi", catClass: "ef-cat-dfi", catLabel: "DFI", typeClass: "ef-accent-dfi" };
  if (title === "Key Performance Indicator - KPI")
    return { icon: <BarChart2 size={16} strokeWidth={2.5} />, accentClass: "ef-accent-kpi", catClass: "ef-cat-kpi", catLabel: "KPI", typeClass: "ef-accent-kpi" };
  return { icon: <FileText size={16} strokeWidth={2.5} />, accentClass: "ef-accent-appraisal", catClass: "ef-cat-appraisal", catLabel: "Custom Form", typeClass: "ef-accent-appraisal" };
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase();
  if (s === "approved")
    return <span className="ef-badge ef-badge-approved"><CheckCircle2 size={10} strokeWidth={2.5} /> Approved</span>;
  if (s === "rejected")
    return <span className="ef-badge ef-badge-rejected"><XCircle size={10} strokeWidth={2.5} /> Rejected</span>;
  return <span className="ef-badge ef-badge-pending"><Clock size={10} strokeWidth={2.5} /> {status || "Pending"}</span>;
};

// ─── Easy Form Card ───────────────────────────────────────────────────────────
const EasyFormCard = ({ item }) => {
  const meta = getFormMeta(item.name);
  return (
    <div className="ef-form-card">
      {/* Top: icon + name + category */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div className={`ef-card-icon-wrap ${meta.accentClass}`}>
          {meta.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", lineHeight: 1.3 }}>
            {item.name}
          </p>
          <div style={{ marginTop: 8 }}>
            <span className={`ef-category-badge ${meta.catClass}`}>
              <CheckCircle2 size={10} strokeWidth={2.5} />
              {item.category}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="ef-card-divider" />

      {/* Actions */}
      <div style={{ display: "flex", gap: 7, justifyContent: "flex-end" }}>
        <Link to={item.toSubmissions} className="ef-card-btn ef-card-btn-submissions">
          Submissions
          <ArrowRight size={12} strokeWidth={2.5} />
        </Link>
        <Link to={item.toRaise} className="ef-card-btn ef-card-btn-raise">
          Raise
          <ArrowRight size={12} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const EmployeeForms = () => {
  const [activeTab, setActiveTab] = useState("listing");
  const [formsSubmissions, setformsSubmissions] = useState([]);
  const [customForms, setCustomForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const builtinSubmissions = [
    { name: "Annual Appraisal",                  category: "Academics", toRaise: "/hr360/user/raise-appraisal", toSubmissions: "/hr360/user/appraisals" },
    { name: "Direct Financial Incentive - DFI",  category: "Academics", toRaise: "/hr360/user/raise-dfi",       toSubmissions: "/hr360/user/dfis" },
    { name: "Key Performance Indicator - KPI",   category: "Academics", toRaise: "/hr360/user/raise-kpi",       toSubmissions: "/hr360/user/kpis" },
  ];

  const customFormCards = customForms.map((cf) => ({
    name: cf.form_title,
    category: cf.form_target_role === "all" ? "All Departments" : cf.form_target_role,
    toRaise: `/hr360/user/raise-custom-form/${cf._id}`,
    toSubmissions: "/hr360/user/employee-forms",
  }));

  const submissions = [...builtinSubmissions, ...customFormCards];

  const fetchFormSubmissions = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      const [submissionsRes, customFormsRes] = await Promise.all([
        axios.get(`http://localhost:5000/user/current-employee-formsubmissions/${user.user_code}`),
        axios.get("http://localhost:5000/custom-forms/all-forms", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setformsSubmissions(submissionsRes.data.currentEmployeeFormSubmissions || []);
      if (customFormsRes.data?.success) {
        setCustomForms(customFormsRes.data.data || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFormSubmissions(); }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="ef-root">

        {/* ── Sticky Page Header ── */}
        <div className="ef-page-header">
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
              Employee Forms
            </h1>
            <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>
              Browse available forms or track your submission status
            </p>
          </div>

          {/* Tab switcher in header */}
          <div className="ef-tabs">
            <button
              className={`ef-tab${activeTab === "listing" ? " active" : ""}`}
              onClick={() => setActiveTab("listing")}
            >
              <LayoutGrid size={14} strokeWidth={2.5} />
              My Submissions
            </button>
            <button
              className={`ef-tab${activeTab === "status" ? " active" : ""}`}
              onClick={() => setActiveTab("status")}
            >
              <Sparkles size={14} strokeWidth={2.5} />
              Easy Forms
            </button>
          </div>
        </div>

        {/* ── Main ── */}
        <main style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>

          {/* ════════════════════════════════════
              TAB 1 — MY SUBMISSIONS
          ════════════════════════════════════ */}
          {activeTab === "listing" && (
            <div className="ef-section-card">

              {/* Section header */}
              <div className="ef-section-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ padding: 8, borderRadius: 10, background: "#eff6ff", display: "flex" }}>
                    <LayoutGrid size={16} color="#6366f1" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>My Submissions</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 1 }}>
                      All forms you have submitted
                    </p>
                  </div>
                </div>
                <span className="ef-count-pill">{formsSubmissions.length} total</span>
              </div>

              {/* Loading */}
              {loading && (
                <div className="ef-state-wrap">
                  <div className="ef-state-icon-wrap" style={{ background: "#f5f3ff" }}>
                    <Loader2 size={28} color="#6366f1" className="animate-spin" strokeWidth={2.5} />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>Loading submissions…</p>
                </div>
              )}

              {/* Empty */}
              {!loading && formsSubmissions.length === 0 && (
                <div className="ef-state-wrap">
                  <div className="ef-state-icon-wrap" style={{ background: "#f8fafc" }}>
                    <InboxIcon size={28} color="#cbd5e1" strokeWidth={2.5} />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>No submissions yet</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                    Head to{" "}
                    <button
                      onClick={() => setActiveTab("status")}
                      style={{ color: "#6366f1", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}
                    >
                      Easy Forms
                    </button>
                    {" "}to raise your first form
                  </p>
                </div>
              )}

              {/* Table */}
              {!loading && formsSubmissions.length > 0 && (
                <>
                  <div className="ef-table-scroll" style={{ overflowX: "auto" }}>
                    <table className="ef-table">
                      <thead>
                        <tr>
                          <th className="ef-th">Form No</th>
                          <th className="ef-th">Form Name</th>
                          <th className="ef-th">Type</th>
                          <th className="ef-th">Submitted By</th>
                          <th className="ef-th">Status</th>
                          <th className="ef-th" style={{ width: 40 }} />
                        </tr>
                      </thead>
                      <tbody>
                        {formsSubmissions.map((form) => {
                          const meta = getFormMeta(form.form_title);
                          return (
                            <tr key={form._id} className="ef-tr">

                              {/* Form No */}
                              <td className="ef-td">
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <div className={`ef-form-icon ${meta.accentClass}`}>
                                    <FileText size={14} strokeWidth={2.5} />
                                  </div>
                                  <span className="ef-form-no">{form.form_no || "—"}</span>
                                </div>
                              </td>

                              {/* Form Name */}
                              <td className="ef-td">
                                <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                                  {form.form_title || "Untitled Form"}
                                </p>
                              </td>

                              {/* Type */}
                              <td className="ef-td">
                                <span className={`ef-type-pill ${meta.catClass}`}>
                                  {meta.icon && React.cloneElement(meta.icon, { size: 10 })}
                                  {meta.catLabel}
                                </span>
                              </td>

                              {/* Submitted By */}
                              <td className="ef-td">
                                <p style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>
                                  {form.employee_name || "—"}
                                </p>
                              </td>

                              {/* Status */}
                              <td className="ef-td">
                                <StatusBadge status={form.form_status} />
                              </td>

                              {/* Arrow */}
                              <td className="ef-td" style={{ paddingLeft: 8 }}>
                                <Link to={`/hr360/user/form-submission/${form._id}`}>
                                  <ArrowRight size={15} className="ef-arrow" strokeWidth={2.5} />
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer */}
                  <div className="ef-footer">
                    Showing{" "}
                    <span style={{ fontWeight: 800, color: "#334155" }}>{formsSubmissions.length}</span>
                    {" "}submission{formsSubmissions.length !== 1 ? "s" : ""}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ════════════════════════════════════
              TAB 2 — EASY FORMS
          ════════════════════════════════════ */}
          {activeTab === "status" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Section header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ padding: 8, borderRadius: 10, background: "#f5f3ff", display: "flex" }}>
                    <Sparkles size={16} color="#6366f1" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Easy Forms</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 1 }}>
                      Raise a new form or view past submissions
                    </p>
                  </div>
                </div>
                <span className="ef-count-pill">{submissions.length} forms</span>
              </div>

              {/* Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {submissions.map((item, index) => (
                  <EasyFormCard key={index} item={item} />
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
};

export default EmployeeForms;