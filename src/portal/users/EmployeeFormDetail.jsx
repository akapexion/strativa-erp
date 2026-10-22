import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileText,
  User,
  Hash,
  Tag,
  Loader2,
  BadgeAlert,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  DollarSign,
  BarChart2,
  Percent,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { gooeyToast } from "goey-toast";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .fd-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .fd-root { background: #f8fafc; min-height: 100vh; }

  .fd-header {
    background: #fff;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
    position: sticky; top: 0; z-index: 40;
  }

  .fd-back-btn {
    width: 36px; height: 36px;
    border-radius: 10px;
    border: 1.5px solid #e8ecf0;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    color: #64748b; cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }
  .fd-back-btn:hover { border-color: #6366f1; background: #f5f3ff; color: #6366f1; }

  /* Cards */
  .fd-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }
  .fd-card-header {
    background: #fafbfc;
    border-bottom: 1px solid #f1f5f9;
    padding: 16px 24px;
    display: flex; align-items: center; gap: 10px;
  }
  .fd-card-header-icon {
    padding: 8px; border-radius: 10px; display: flex;
  }
  .fd-card-body { padding: 24px; }

  /* Status banner */
  .fd-banner {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    padding: 18px 22px;
    display: flex; align-items: center; gap: 14px;
  }
  .fd-banner-dot {
    width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
  }

  /* Status badge */
  .fd-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 99px;
    font-size: 11px; font-weight: 800;
  }
  .fd-badge-approved { background: #ecfdf5; border: 1.5px solid #a7f3d0; color: #059669; }
  .fd-badge-pending  { background: #fffbeb; border: 1.5px solid #fde68a; color: #d97706; }
  .fd-badge-rejected { background: #fff1f2; border: 1.5px solid #fecdd3; color: #e11d48; }

  /* Field */
  .fd-field { display: flex; flex-direction: column; gap: 6px; }
  .fd-field-label {
    display: flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 800;
    color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em;
  }
  .fd-field-value {
    font-size: 13px; font-weight: 700; color: "#0f172a";
    padding-left: 2px; line-height: 1.5;
  }

  /* Remarks timeline */
  .fd-timeline { position: relative; }
  .fd-timeline-line {
    position: absolute; left: 11px; top: 8px; bottom: 8px;
    width: 1px; background: #f1f5f9;
  }
  .fd-timeline-item { display: flex; gap: 16px; position: relative; }
  .fd-timeline-dot {
    width: 24px; height: 24px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 2px;
    box-shadow: 0 0 0 3px #fff, 0 0 0 4px transparent;
  }
  .fd-timeline-dot-inner { width: 8px; height: 8px; border-radius: 50%; }

  /* Action buttons */
  .fd-approve-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 22px;
    font-size: 13px; font-weight: 800;
    color: #fff;
    background: linear-gradient(135deg, #10b981, #059669);
    border: none; border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(16,185,129,0.3);
    transition: opacity 0.15s, transform 0.15s;
  }
  .fd-approve-btn:hover { opacity: 0.9; transform: translateY(-1px); }

  .fd-reject-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 22px;
    font-size: 13px; font-weight: 800;
    color: #fff;
    background: linear-gradient(135deg, #f43f5e, #e11d48);
    border: none; border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(244,63,94,0.3);
    transition: opacity 0.15s, transform 0.15s;
  }
  .fd-reject-btn:hover { opacity: 0.9; transform: translateY(-1px); }

  .fd-textarea {
    width: 100%; height: 130px;
    border: 1.5px solid #e8ecf0;
    border-radius: 14px;
    padding: 14px 16px;
    font-size: 13px; font-weight: 500;
    color: #0f172a;
    font-family: 'Plus Jakarta Sans', sans-serif;
    resize: none; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }
  .fd-textarea::placeholder { color: #b0bec5; font-weight: 400; }
  .fd-textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

  /* States */
  .fd-state-wrap {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 100px 24px; gap: 12px;
  }
  .fd-state-icon-wrap {
    width: 64px; height: 64px; border-radius: 20px;
    display: flex; align-items: center; justify-content: center; margin-bottom: 4px;
  }

  /* Info notice */
  .fd-notice {
    display: flex; align-items: center; gap: 10px;
    padding: 13px 16px; border-radius: 12px;
    font-size: 13px; font-weight: 600;
  }
  .fd-notice-done { background: #f8fafc; border: 1.5px solid #e2e8f0; color: #64748b; }
  .fd-notice-rejected { background: #fff1f2; border: 1.5px solid #fecdd3; color: #e11d48; }
  .fd-notice-approved { background: #ecfdf5; border: 1.5px solid #a7f3d0; color: #059669; }
`;

const getStatusConfig = (status) => {
  switch (status?.toLowerCase()) {
    case "approved": return {
      icon: <CheckCircle2 size={11} strokeWidth={2.5} />,
      label: "Approved",
      badge: "fd-badge fd-badge-approved",
      dot: "#10b981",
      dotRing: "#d1fae5",
      bannerBorder: "#10b981",
      message: "This submission has been reviewed and approved.",
    };
    case "rejected": return {
      icon: <XCircle size={11} strokeWidth={2.5} />,
      label: "Rejected",
      badge: "fd-badge fd-badge-rejected",
      dot: "#f43f5e",
      dotRing: "#fecdd3",
      bannerBorder: "#f43f5e",
      message: "This submission has been rejected.",
    };
    default: return {
      icon: <Clock size={11} strokeWidth={2.5} />,
      label: "Pending",
      badge: "fd-badge fd-badge-pending",
      dot: "#f59e0b",
      dotRing: "#fde68a",
      bannerBorder: "#f59e0b",
      message: "Your submission is currently under review.",
    };
  }
};

const getFormTypeConfig = (title) => {
  if (title === "Annual Appraisal") return { icon: <Star size={15} strokeWidth={2.5} />, detailLabel: "Appraisal Details", iconBg: "#fffbeb", iconColor: "#d97706" };
  if (title === "Direct Financial Incentive - DFI") return { icon: <DollarSign size={15} strokeWidth={2.5} />, detailLabel: "DFI Details", iconBg: "#f0fdf4", iconColor: "#16a34a" };
  if (title === "Key Performance Indicator - KPI") return { icon: <BarChart2 size={15} strokeWidth={2.5} />, detailLabel: "KPI Details", iconBg: "#faf5ff", iconColor: "#7c3aed" };
  return { icon: <FileText size={15} strokeWidth={2.5} />, detailLabel: "Form Details & Responses", iconBg: "#eff6ff", iconColor: "#6366f1" };
};

const Field = ({ icon, label, value }) => (
  <div className="fd-field">
    <div className="fd-field-label">
      <span style={{ color: "#b0bec5" }}>{icon}</span>
      {label}
    </div>
    <div className="fd-field-value" style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
      {value || <span style={{ color: "#cbd5e1", fontWeight: 400, fontStyle: "italic" }}>Not provided</span>}
    </div>
  </div>
);

const EmployeeFormDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const [formDetail, setFormDetail] = useState(null);
  const [allManagers, setAllManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remarks, setRemarks] = useState("");

  const getFormType = (title) => {
    if (title === "Annual Appraisal") return "appraisal";
    if (title === "Direct Financial Incentive - DFI") return "dfi";
    if (title === "Key Performance Indicator - KPI") return "kpi";
    return "custom";
  };

  const fetchFormDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseURL = user.user_role === "user"
        ? "http://localhost:5000/user/form-submission"
        : "http://localhost:5000/manager/form-request";
      const [formRes, managersRes] = await Promise.all([
        axios.get(`${baseURL}/${id}`),
        axios.get("http://localhost:5000/user/all-managers"),
      ]);
      setFormDetail(formRes.data.formSubmission || formRes.data);
      setAllManagers(managersRes.data.allManagers || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load form details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchFormDetail(); }, [id]);

  const handleAction = async (status) => {
    try {
      const type = getFormType(formDetail.form_title);
      await axios.put(`http://localhost:5000/manager/action/${type}/${id}`, {
        manager_remarks: remarks, form_status: status, user,
      });
      gooeyToast.success(`Form ${status} successfully`, { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 } });
      setRemarks("");
      fetchFormDetail();
    } catch (err) {
      gooeyToast.error(err.response?.data?.message || "Something went wrong", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 } });
    }
  };

  const statusConfig = getStatusConfig(formDetail?.form_status);
  const formTypeConfig = getFormTypeConfig(formDetail?.form_title);

  const existingRemarks = formDetail?.manager_remarks || [];
  const currentManagerReview = existingRemarks.find(r => r.manager_id?.toString() === user.user_id?.toString());

  const managers = allManagers.map((manager) => {
    const remarked = existingRemarks.find(r => r.manager_id?.toString() === manager._id?.toString());
    return remarked || {
      manager_name: manager.user_fullname,
      manager_designation: manager.user_designation,
      manager_id: manager._id,
      remark: "", status: null,
    };
  }).sort((a, b) => {
    if (a.date && b.date) return new Date(a.date) - new Date(b.date);
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return 0;
  });

  return (
    <>
      <style>{styles}</style>
      <div className="fd-root">

        {/* Header */}
        <div className="fd-header px-6 py-3.5 flex items-center justify-between">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="fd-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                Form Detail
              </h1>
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>
                Submission review &amp; status
              </p>
            </div>
          </div>
          {formDetail?.form_status && (
            <span className={statusConfig.badge}>{statusConfig.icon}{statusConfig.label}</span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="fd-state-wrap">
            <div className="fd-state-icon-wrap" style={{ background: "#f5f3ff" }}>
              <Loader2 size={28} color="#6366f1" className="animate-spin" strokeWidth={2.5} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>Loading form details…</p>
            <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Please wait a moment</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="fd-state-wrap">
            <div className="fd-state-icon-wrap" style={{ background: "#fff1f2" }}>
              <BadgeAlert size={28} color="#e11d48" strokeWidth={2.5} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>Something went wrong</p>
            <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{error}</p>
            <button
              onClick={fetchFormDetail}
              style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: "#6366f1", padding: "9px 20px", borderRadius: 12, border: "1.5px solid #e0e7ff", background: "#f5f3ff", cursor: "pointer", fontFamily: "inherit" }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Main */}
        {!loading && !error && formDetail && (
          <main style={{ maxWidth: 780, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Status Banner */}
            <div className="fd-banner" style={{ borderLeft: `4px solid ${statusConfig.bannerBorder}` }}>
              <div className="fd-banner-dot" style={{ background: statusConfig.dot }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{statusConfig.label}</p>
                <p style={{ fontSize: 12, color: "#64748b", fontWeight: 500, marginTop: 2 }}>{statusConfig.message}</p>
              </div>
              <span className={statusConfig.badge}>{statusConfig.icon}{statusConfig.label}</span>
            </div>

            {/* Form Info */}
            <div className="fd-card">
              <div className="fd-card-header">
                <div className="fd-card-header-icon" style={{ background: "#eff6ff" }}>
                  <FileText size={15} color="#3b82f6" strokeWidth={2.5} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Form Information</p>
              </div>
              <div className="fd-card-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
                <Field icon={<FileText size={12} strokeWidth={2.5} />} label="Form Title" value={formDetail.form_title} />
                <Field
                  icon={<Tag size={12} strokeWidth={2.5} />}
                  label="Category"
                  value={
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", background: "#f1f5f9", border: "1px solid #e2e8f0", color: "#475569", fontSize: 11, fontWeight: 800, borderRadius: 7 }}>
                      Academics
                    </span>
                  }
                />
                <Field
                  icon={<ShieldCheck size={12} strokeWidth={2.5} />}
                  label="Submission Status"
                  value={<span className={statusConfig.badge}>{statusConfig.icon}{statusConfig.label}</span>}
                />
              </div>
            </div>

            {/* Employee Info */}
            <div className="fd-card">
              <div className="fd-card-header">
                <div className="fd-card-header-icon" style={{ background: "#f8fafc" }}>
                  <User size={15} color="#64748b" strokeWidth={2.5} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Employee Information</p>
              </div>
              <div className="fd-card-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
                <Field icon={<User size={12} strokeWidth={2.5} />} label="Full Name" value={formDetail.employee_name} />
                <Field icon={<Hash size={12} strokeWidth={2.5} />} label="Employee Code" value={
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 12, fontWeight: 700, color: "#475569", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 7, padding: "2px 8px" }}>
                    {formDetail.employee_code}
                  </span>
                } />
              </div>
            </div>

            {/* Form Specific Details */}
            <div className="fd-card">
              <div className="fd-card-header">
                <div className="fd-card-header-icon" style={{ background: formTypeConfig.iconBg }}>
                  <span style={{ color: formTypeConfig.iconColor, display: "flex" }}>{formTypeConfig.icon}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{formTypeConfig.detailLabel}</p>
              </div>
              <div className="fd-card-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
                {formDetail.answers ? (
                  Object.entries(
                    formDetail.answers instanceof Map
                      ? Object.fromEntries(formDetail.answers)
                      : typeof formDetail.answers === "object"
                      ? formDetail.answers
                      : {}
                  ).map(([key, val], idx) => (
                    <div key={idx} style={{ gridColumn: String(val).length > 60 ? "span 2" : "span 1" }}>
                      <Field icon={<FileText size={12} strokeWidth={2.5} />} label={key} value={String(val)} />
                    </div>
                  ))
                ) : formDetail.form_title === "Annual Appraisal" ? (
                  <>
                    <div style={{ gridColumn: "span 2" }}>
                      <Field icon={<Star size={12} strokeWidth={2.5} />} label="Achievements" value={formDetail.appraisal_achievements} />
                    </div>
                    <Field icon={<CheckCircle2 size={12} strokeWidth={2.5} />} label="SEP Qualification" value={
                      formDetail.appraisal_sep_qualification ? (
                        <span className={formDetail.appraisal_sep_qualification?.toLowerCase() === "yes" ? "fd-badge fd-badge-approved" : "fd-badge fd-badge-rejected"}>
                          {formDetail.appraisal_sep_qualification?.toLowerCase() === "yes" ? <CheckCircle2 size={10} strokeWidth={2.5} /> : <XCircle size={10} strokeWidth={2.5} />}
                          {formDetail.appraisal_sep_qualification}
                        </span>
                      ) : null
                    } />
                  </>
                ) : formDetail.form_title === "Direct Financial Incentive - DFI" ? (
                  <>
                    <Field icon={<Hash size={12} strokeWidth={2.5} />} label="Alternate Count" value={formDetail.dfi_alternate_count} />
                    <Field icon={<DollarSign size={12} strokeWidth={2.5} />} label="Incentive Amount" value={
                      formDetail.dfi_amount ? `PKR ${Number(formDetail.dfi_amount).toLocaleString()}` : null
                    } />
                  </>
                ) : (
                  <>
                    <Field icon={<BarChart2 size={12} strokeWidth={2.5} />} label="Batch" value={formDetail.kpi_batch} />
                    <Field icon={<Hash size={12} strokeWidth={2.5} />} label="Semester" value={formDetail.kpi_batch_semester} />
                    <Field icon={<Hash size={12} strokeWidth={2.5} />} label="DO Count" value={formDetail.kpi_do_count} />
                    <Field icon={<Percent size={12} strokeWidth={2.5} />} label="Attendance" value={
                      formDetail.kpi_batch_attendence_percentage ? `${formDetail.kpi_batch_attendence_percentage}%` : null
                    } />
                  </>
                )}
              </div>
            </div>

            {/* Remarks */}
            {(user.user_role === "manager" || user.user_role === "user") && (
              <div className="fd-card">
                <div className="fd-card-header">
                  <div className="fd-card-header-icon" style={{ background: "#fafbfc" }}>
                    <FileText size={15} color="#64748b" strokeWidth={2.5} />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Remarks</p>
                </div>
                <div className="fd-card-body">
                  {managers.length > 0 && (
                    <div className="fd-timeline" style={{ marginBottom: 20 }}>
                      <div className="fd-timeline-line" />
                      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {managers.map((m, i) => (
                          <div key={i} className="fd-timeline-item">
                            <div
                              className="fd-timeline-dot"
                              style={{
                                background: m.status === "approved" ? "#10b981" : m.status === "rejected" ? "#f43f5e" : "#e2e8f0",
                                boxShadow: `0 0 0 3px #fff, 0 0 0 4px ${m.status === "approved" ? "#d1fae5" : m.status === "rejected" ? "#fecdd3" : "#f1f5f9"}`,
                              }}
                            >
                              <div className="fd-timeline-dot-inner" style={{ background: m.status ? "#fff" : "#94a3b8" }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                                <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>
                                  {m.manager_name}
                                  <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginLeft: 6 }}>({m.manager_designation})</span>
                                </p>
                                {m.status ? (
                                  <span className={m.status === "approved" ? "fd-badge fd-badge-approved" : "fd-badge fd-badge-rejected"}>
                                    {m.status === "approved" ? <CheckCircle2 size={10} strokeWidth={2.5} /> : <XCircle size={10} strokeWidth={2.5} />}
                                    {m.status}
                                  </span>
                                ) : (
                                  <span className="fd-badge fd-badge-pending">
                                    <Clock size={10} strokeWidth={2.5} /> pending
                                  </span>
                                )}
                              </div>
                              {m.remark && (
                                <p style={{ marginTop: 8, fontSize: 13, color: "#475569", fontWeight: 500, lineHeight: 1.6, paddingLeft: 2 }}>{m.remark}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {managers.length > 0 && user.user_role === "manager" && !currentManagerReview && formDetail.form_status === "pending" && (
                    <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 20 }} />
                  )}

                  {user.user_role === "manager" && (
                    currentManagerReview ? (
                      <div className="fd-notice fd-notice-done">
                        <CheckCircle2 size={15} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                        You have already submitted your review for this form.
                      </div>
                    ) : formDetail.form_status === "rejected" ? (
                      <div className="fd-notice fd-notice-rejected">
                        <XCircle size={15} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                        This form has been rejected. No further actions are allowed.
                      </div>
                    ) : formDetail.form_status === "approved" ? (
                      <div className="fd-notice fd-notice-approved">
                        <CheckCircle2 size={15} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                        This form has been fully approved. No further actions are required.
                      </div>
                    ) : (
                      <>
                        <textarea
                          className="fd-textarea"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Add your remarks before approving or rejecting…"
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                          <button className="fd-approve-btn" onClick={() => handleAction("approved")}>
                            <CheckCircle2 size={14} strokeWidth={2.5} /> Approve
                          </button>
                          <button className="fd-reject-btn" onClick={() => handleAction("rejected")}>
                            <XCircle size={14} strokeWidth={2.5} /> Reject
                          </button>
                        </div>
                      </>
                    )
                  )}
                </div>
              </div>
            )}
          </main>
        )}
      </div>
    </>
  );
};

export default EmployeeFormDetail;