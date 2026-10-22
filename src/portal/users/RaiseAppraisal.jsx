import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  TrendingUp,
  Calendar,
  Star,
  BadgeCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { gooeyToast } from "goey-toast";
import { z } from "zod";

const appraisalSchema = z.object({
  joining_date: z.string().min(1, "Joining date is required"),
  lastincrement_date: z
    .string()
    .min(1, "Last increment date is required")
    .refine((val) => new Date(val) <= new Date(), "Last increment date cannot be in the future"),
  achievements: z
    .string()
    .min(10, "Please describe your achievements (min 10 characters)")
    .max(1000, "Achievements must be under 1000 characters"),
  sep_qualification: z.string().min(1, "Please select SEP qualification"),
}).refine((data) => {
  if (!data.joining_date || !data.lastincrement_date) return true;
  return new Date(data.lastincrement_date) >= new Date(data.joining_date);
}, { message: "Last increment date cannot be before joining date", path: ["lastincrement_date"] });

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .ra-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .ra-root { background: #f8fafc; min-height: 100vh; }

  .ra-header {
    background: #fff;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
    position: sticky; top: 0; z-index: 40;
    padding: 14px 24px;
    display: flex; align-items: center; justify-content: space-between;
  }

  .ra-back-btn {
    width: 36px; height: 36px; border-radius: 10px;
    border: 1.5px solid #e8ecf0; background: #fff;
    display: flex; align-items: center; justify-content: center;
    color: #64748b; cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
    flex-shrink: 0;
  }
  .ra-back-btn:hover { border-color: #6366f1; background: #f5f3ff; color: #6366f1; }

  .ra-view-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; font-size: 13px; font-weight: 700;
    color: #6366f1; border: 1.5px solid #e0e7ff;
    border-radius: 12px; background: #f5f3ff; cursor: pointer;
    text-decoration: none;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  }
  .ra-view-btn:hover { border-color: #6366f1; background: #ede9fe; box-shadow: 0 2px 8px rgba(99,102,241,0.12); }

  .ra-discard-btn {
    padding: 8px 16px; font-size: 13px; font-weight: 700;
    color: #94a3b8; border: 1.5px solid #e8ecf0;
    border-radius: 12px; background: #fff; cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }
  .ra-discard-btn:hover { border-color: #cbd5e1; color: #64748b; }

  .ra-submit-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 22px; font-size: 13px; font-weight: 800;
    color: #fff;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border: none; border-radius: 12px; cursor: pointer;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
    transition: opacity 0.15s, box-shadow 0.15s, transform 0.15s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .ra-submit-btn:hover { opacity: 0.92; box-shadow: 0 6px 20px rgba(99,102,241,0.45); transform: translateY(-1px); }

  /* Section card */
  .ra-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }
  .ra-card-header {
    background: #fafbfc;
    border-bottom: 1px solid #f1f5f9;
    padding: 16px 24px;
    display: flex; align-items: center; gap: 10px;
  }
  .ra-card-header-icon { padding: 8px; border-radius: 10px; display: flex; }
  .ra-card-body { padding: 28px; }
  .ra-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px 24px; }
  .ra-col-span-2 { grid-column: span 2; }

  /* Form field */
  .ra-field { display: flex; flex-direction: column; gap: 6px; }
  .ra-label {
    font-size: 11px; font-weight: 800;
    color: #64748b; text-transform: uppercase; letter-spacing: 0.07em;
  }
  .ra-input-wrap { position: relative; }
  .ra-input-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: #b0bec5; pointer-events: none; transition: color 0.15s;
    display: flex;
  }
  .ra-textarea-icon {
    position: absolute; left: 13px; top: 14px;
    color: #b0bec5; pointer-events: none;
    display: flex;
  }
  .ra-input {
    width: 100%; padding: 10px 14px 10px 40px;
    font-size: 13px; font-weight: 600; color: #0f172a;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1.5px solid #e8ecf0; border-radius: 12px;
    background: #fff; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }
  .ra-input::placeholder { color: #c0cad6; font-weight: 400; }
  .ra-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  .ra-input:focus ~ .ra-input-icon, .ra-input-wrap:focus-within .ra-input-icon { color: #6366f1; }
  .ra-input-wrap:focus-within .ra-input-icon { color: #6366f1; }
  .ra-input-wrap:focus-within .ra-textarea-icon { color: #6366f1; }
  .ra-input-error { border-color: #fca5a5 !important; background: #fff8f8 !important; }
  .ra-input-error:focus { border-color: #f87171 !important; box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important; }

  .ra-textarea {
    width: 100%; padding: 10px 14px 10px 40px;
    font-size: 13px; font-weight: 500; color: #0f172a;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1.5px solid #e8ecf0; border-radius: 12px;
    background: #fff; outline: none; resize: none;
    line-height: 1.7; min-height: 130px;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }
  .ra-textarea::placeholder { color: #c0cad6; font-weight: 400; }
  .ra-textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

  .ra-select {
    width: 100%; padding: 10px 36px 10px 40px;
    font-size: 13px; font-weight: 600; color: #0f172a;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1.5px solid #e8ecf0; border-radius: 12px;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 14px center;
    appearance: none; outline: none; cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }
  .ra-select:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

  .ra-disabled-input {
    width: 100%; padding: 10px 14px;
    font-size: 13px; font-weight: 600; color: #94a3b8;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1.5px solid #f1f5f9; border-radius: 12px;
    background: #fafbfc; outline: none; cursor: not-allowed;
    box-sizing: border-box;
  }

  .ra-error-text {
    font-size: 11px; font-weight: 700; color: #ef4444;
    display: flex; align-items: center; gap: 4px;
  }

  /* Duration chip */
  .ra-duration-chip {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 16px; border-radius: 12px;
    background: #eff6ff; border: 1.5px solid #bfdbfe;
    font-size: 13px;
  }

  /* SEP qualification notice */
  .ra-sep-qualified { background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; gap: 8px; }
  .ra-sep-not { background: #fff1f2; border: 1.5px solid #fecdd3; border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; gap: 8px; }

  /* Helper text */
  .ra-helper { font-size: 12px; color: #94a3b8; font-weight: 500; line-height: 1.6; padding-top: 26px; }
`;

const RaiseAppraisal = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const initialFormData = {
    employee_code: user?.user_code || "",
    employee_name: user?.user_fullname || "",
    employee_image: user?.user_image || "",
    joining_date: "",
    lastincrement_date: "",
    achievements: "",
    sep_qualification: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const result = appraisalSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([k, msgs]) => [k, msgs[0]])));
      return;
    }
    setErrors({});
    try {
      const res = await axios.post("http://localhost:5000/user/raise-appraisal", formData);
      gooeyToast.success(res.data.message || "Appraisal submitted successfully", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 } });
      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      gooeyToast.error(error.response?.data?.message || "Error submitting appraisal", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 } });
    }
  };

  const getDuration = () => {
    if (!formData.lastincrement_date) return null;
    const from = new Date(formData.lastincrement_date);
    const now = new Date();
    const totalMonths = (now.getFullYear() - from.getFullYear()) * 12 + (now.getMonth() - from.getMonth());
    if (totalMonths < 0) return null;
    const yrs = Math.floor(totalMonths / 12);
    const mo = totalMonths % 12;
    const parts = [];
    if (yrs > 0) parts.push(`${yrs} ${yrs === 1 ? "year" : "years"}`);
    if (mo > 0) parts.push(`${mo} ${mo === 1 ? "month" : "months"}`);
    return parts.length ? parts.join(", ") : "Less than a month";
  };

  const duration = getDuration();
  const sepLower = formData.sep_qualification?.toLowerCase();

  return (
    <>
      <style>{styles}</style>
      <div className="ra-root">

        {/* Header */}
        <div className="ra-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="ra-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                Raise Appraisal
              </h1>
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>
                Submit your annual performance appraisal
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link to="/hr360/user/appraisals" className="ra-view-btn">
              <TrendingUp size={14} strokeWidth={2.5} />
              View Submissions
            </Link>
            <button className="ra-discard-btn" onClick={() => navigate(-1)}>Discard</button>
            <button className="ra-submit-btn" onClick={handleSubmit}>
              <Save size={15} strokeWidth={2.5} />
              Submit Appraisal
            </button>
          </div>
        </div>

        <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Employee Info (read-only) */}
          <div className="ra-card">
            <div className="ra-card-header">
              <div className="ra-card-header-icon" style={{ background: "#f8fafc" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </div>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Employee Information</p>
            </div>
            <div className="ra-card-body">
              <div className="ra-grid-2">
                <div className="ra-field">
                  <label className="ra-label">Employee Code</label>
                  <input className="ra-disabled-input" value={formData.employee_code} disabled />
                </div>
                <div className="ra-field">
                  <label className="ra-label">Employee Name</label>
                  <input className="ra-disabled-input" value={formData.employee_name} disabled />
                </div>
              </div>
            </div>
          </div>

          {/* Employment Timeline */}
          <div className="ra-card">
            <div className="ra-card-header">
              <div className="ra-card-header-icon" style={{ background: "#eff6ff" }}>
                <Calendar size={15} color="#3b82f6" strokeWidth={2.5} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Employment Timeline</p>
            </div>
            <div className="ra-card-body">
              <div className="ra-grid-2">

                {/* Joining Date */}
                <div className="ra-field">
                  <label className="ra-label">Joining Date</label>
                  <div className="ra-input-wrap">
                    <span className="ra-input-icon"><Calendar size={14} strokeWidth={2.5} /></span>
                    <input
                      type="date"
                      name="joining_date"
                      value={formData.joining_date}
                      onChange={handleChange}
                      className={`ra-input ${errors.joining_date ? "ra-input-error" : ""}`}
                    />
                  </div>
                  {errors.joining_date && <p className="ra-error-text">⚠ {errors.joining_date}</p>}
                </div>

                {/* Last Increment Date */}
                <div className="ra-field">
                  <label className="ra-label">Last Increment Date</label>
                  <div className="ra-input-wrap">
                    <span className="ra-input-icon"><TrendingUp size={14} strokeWidth={2.5} /></span>
                    <input
                      type="date"
                      name="lastincrement_date"
                      value={formData.lastincrement_date}
                      onChange={handleChange}
                      className={`ra-input ${errors.lastincrement_date ? "ra-input-error" : ""}`}
                    />
                  </div>
                  {errors.lastincrement_date && <p className="ra-error-text">⚠ {errors.lastincrement_date}</p>}
                </div>

                {/* Duration chip */}
                {duration && (
                  <div className="ra-col-span-2">
                    <div className="ra-duration-chip">
                      <TrendingUp size={14} color="#3b82f6" strokeWidth={2.5} />
                      <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>Duration since last increment:</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#2563eb" }}>{duration}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Performance & Qualifications */}
          <div className="ra-card">
            <div className="ra-card-header">
              <div className="ra-card-header-icon" style={{ background: "#fffbeb" }}>
                <Star size={15} color="#d97706" strokeWidth={2.5} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Performance &amp; Qualifications</p>
            </div>
            <div className="ra-card-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Achievements */}
              <div className="ra-field">
                <label className="ra-label">Achievements</label>
                <div className="ra-input-wrap">
                  <span className="ra-textarea-icon"><Star size={14} strokeWidth={2.5} /></span>
                  <textarea
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleChange}
                    placeholder="Describe key achievements, contributions, and milestones during this period…"
                    className={`ra-textarea ${errors.achievements ? "ra-input-error" : ""}`}
                  />
                </div>
                {errors.achievements && <p className="ra-error-text">⚠ {errors.achievements}</p>}
                <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
                  {formData.achievements.length}/1000 characters
                </p>
              </div>

              {/* SEP Qualification */}
              <div className="ra-grid-2" style={{ alignItems: "start" }}>
                <div className="ra-field">
                  <label className="ra-label">SEP Qualification</label>
                  <div className="ra-input-wrap">
                    <span className="ra-input-icon"><BadgeCheck size={14} strokeWidth={2.5} /></span>
                    <select
                      name="sep_qualification"
                      value={formData.sep_qualification}
                      onChange={handleChange}
                      className={`ra-select ${errors.sep_qualification ? "ra-input-error" : ""}`}
                    >
                      <option value="">Select qualification…</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  {errors.sep_qualification && <p className="ra-error-text">⚠ {errors.sep_qualification}</p>}

                  {sepLower === "yes" && (
                    <div className="ra-sep-qualified" style={{ marginTop: 8 }}>
                      <CheckCircle2 size={14} color="#059669" strokeWidth={2.5} />
                      <span style={{ fontSize: 12, fontWeight: 800, color: "#059669" }}>SEP Qualified</span>
                    </div>
                  )}
                  {sepLower === "no" && (
                    <div className="ra-sep-not" style={{ marginTop: 8 }}>
                      <XCircle size={14} color="#e11d48" strokeWidth={2.5} />
                      <span style={{ fontSize: 12, fontWeight: 800, color: "#e11d48" }}>Not Qualified</span>
                    </div>
                  )}
                </div>

                <p className="ra-helper">
                  Indicates whether the employee meets the Standard Eligibility Parameters required for a raise appraisal.
                </p>
              </div>

            </div>
          </div>

        </main>
      </div>
    </>
  );
};

export default RaiseAppraisal;