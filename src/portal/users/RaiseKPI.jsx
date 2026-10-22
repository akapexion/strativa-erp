import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  TrendingUp,
  BookOpen,
  Percent,
  Layers,
  Hash,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { gooeyToast } from "goey-toast";
import { z } from "zod";

const kpiSchema = z.object({
  kpi_batch: z.string().min(1, "Batch is required").max(50, "Must be under 50 characters"),
  kpi_batch_semester: z.string().min(1, "Semester is required").max(50, "Must be under 50 characters"),
  kpi_do_count: z
    .string()
    .min(1, "DO count is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, { message: "Must be a non-negative number" })
    .refine((val) => Number.isInteger(Number(val)), { message: "Must be a whole number" }),
  kpi_batch_attendence_percentage: z
    .string()
    .min(1, "Attendance percentage is required")
    .refine((val) => {
      const num = parseFloat(val.replace("%", "").trim());
      return !isNaN(num) && num >= 0 && num <= 100;
    }, "Must be between 0 and 100"),
});

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .rk-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .rk-root { background: #f8fafc; min-height: 100vh; }

  .rk-header {
    background: #fff;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
    position: sticky; top: 0; z-index: 40;
    padding: 14px 24px;
    display: flex; align-items: center; justify-content: space-between;
  }

  .rk-back-btn {
    width: 36px; height: 36px; border-radius: 10px;
    border: 1.5px solid #e8ecf0; background: #fff;
    display: flex; align-items: center; justify-content: center;
    color: #64748b; cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }
  .rk-back-btn:hover { border-color: #6366f1; background: #f5f3ff; color: #6366f1; }

  .rk-view-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; font-size: 13px; font-weight: 700;
    color: #6366f1; border: 1.5px solid #e0e7ff;
    border-radius: 12px; background: #f5f3ff;
    text-decoration: none; cursor: pointer;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  }
  .rk-view-btn:hover { border-color: #6366f1; background: #ede9fe; box-shadow: 0 2px 8px rgba(99,102,241,0.12); }

  .rk-discard-btn {
    padding: 8px 16px; font-size: 13px; font-weight: 700;
    color: #94a3b8; border: 1.5px solid #e8ecf0;
    border-radius: 12px; background: #fff; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: border-color 0.15s, color 0.15s;
  }
  .rk-discard-btn:hover { border-color: #cbd5e1; color: #64748b; }

  .rk-submit-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 22px; font-size: 13px; font-weight: 800; color: #fff;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border: none; border-radius: 12px; cursor: pointer;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: opacity 0.15s, box-shadow 0.15s, transform 0.15s;
  }
  .rk-submit-btn:hover { opacity: 0.92; box-shadow: 0 6px 20px rgba(99,102,241,0.45); transform: translateY(-1px); }

  .rk-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }
  .rk-card-header {
    background: #fafbfc; border-bottom: 1px solid #f1f5f9;
    padding: 16px 24px; display: flex; align-items: center; gap: 10px;
  }
  .rk-card-header-icon { padding: 8px; border-radius: 10px; display: flex; }
  .rk-card-body { padding: 28px; }
  .rk-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px 24px; }

  .rk-field { display: flex; flex-direction: column; gap: 6px; }
  .rk-label { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.07em; }

  .rk-input-wrap { position: relative; }
  .rk-input-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: #b0bec5; pointer-events: none; display: flex;
    transition: color 0.15s;
  }
  .rk-input-wrap:focus-within .rk-input-icon { color: #6366f1; }

  .rk-input {
    width: 100%; padding: 10px 14px 10px 40px;
    font-size: 13px; font-weight: 600; color: #0f172a;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1.5px solid #e8ecf0; border-radius: 12px;
    background: #fff; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }
  .rk-input::placeholder { color: #c0cad6; font-weight: 400; }
  .rk-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  .rk-input-error { border-color: #fca5a5 !important; background: #fff8f8 !important; }

  .rk-disabled-input {
    width: 100%; padding: 10px 14px;
    font-size: 13px; font-weight: 600; color: #94a3b8;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1.5px solid #f1f5f9; border-radius: 12px;
    background: #fafbfc; outline: none; cursor: not-allowed;
    box-sizing: border-box;
  }

  .rk-error-text { font-size: 11px; font-weight: 700; color: #ef4444; display: flex; align-items: center; gap: 4px; }

  /* Attendance bar */
  .rk-att-bar-wrap {
    margin-top: 6px; height: 5px; border-radius: 99px;
    background: #f1f5f9; overflow: hidden;
  }
  .rk-att-bar {
    height: 100%; border-radius: 99px;
    transition: width 0.4s ease;
  }

  /* Summary preview */
  .rk-preview {
    background: #fafbfc; border: 1.5px solid #f1f5f9;
    border-radius: 14px; padding: 18px 20px;
  }
  .rk-preview-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0; }
  .rk-preview-item { padding: 0 16px; }
  .rk-preview-item:first-child { padding-left: 0; }
  .rk-preview-item:not(:last-child) { border-right: 1px solid #f1f5f9; }
  .rk-preview-label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 5px; }
  .rk-preview-value { font-size: 18px; font-weight: 900; color: #0f172a; line-height: 1; }
`;

const KPIRaise = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const initialFormData = {
    employee_code: user?.user_code || "",
    employee_name: user?.user_fullname || "",
    kpi_batch: "",
    kpi_batch_semester: "",
    kpi_do_count: "",
    kpi_batch_attendence_percentage: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const result = kpiSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([k, msgs]) => [k, msgs[0]])));
      return;
    }
    setErrors({});
    try {
      const res = await axios.post("http://localhost:5000/user/raise-kpi", formData);
      gooeyToast.success(res.data.message || "KPI submitted successfully", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 } });
      setFormData(initialFormData);
      setErrors({});
    } catch (err) {
      gooeyToast.error(err.response?.data?.message || "Error submitting KPI", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 } });
    }
  };

  const attNum = parseFloat(formData.kpi_batch_attendence_percentage?.replace("%", "") || 0);
  const attValid = !isNaN(attNum) && attNum >= 0 && attNum <= 100;
  const attColor = attNum >= 85 ? "#10b981" : attNum >= 60 ? "#f59e0b" : "#ef4444";

  const hasPreview = formData.kpi_batch || formData.kpi_batch_semester || formData.kpi_do_count || formData.kpi_batch_attendence_percentage;

  return (
    <>
      <style>{styles}</style>
      <div className="rk-root">

        {/* Header */}
        <div className="rk-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="rk-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                Raise KPI
              </h1>
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>
                Key Performance Indicator submission
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link to="/hr360/user/kpis" className="rk-view-btn">
              <TrendingUp size={14} strokeWidth={2.5} />
              View Submissions
            </Link>
            <button className="rk-discard-btn" onClick={() => navigate(-1)}>Discard</button>
            <button className="rk-submit-btn" onClick={handleSubmit}>
              <Save size={15} strokeWidth={2.5} />
              Submit KPI
            </button>
          </div>
        </div>

        <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Employee Info */}
          <div className="rk-card">
            <div className="rk-card-header">
              <div className="rk-card-header-icon" style={{ background: "#f8fafc" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </div>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Employee Information</p>
            </div>
            <div className="rk-card-body">
              <div className="rk-grid-2">
                <div className="rk-field">
                  <label className="rk-label">Employee Code</label>
                  <input className="rk-disabled-input" value={formData.employee_code} disabled />
                </div>
                <div className="rk-field">
                  <label className="rk-label">Employee Name</label>
                  <input className="rk-disabled-input" value={formData.employee_name} disabled />
                </div>
              </div>
            </div>
          </div>

          {/* KPI Details */}
          <div className="rk-card">
            <div className="rk-card-header">
              <div className="rk-card-header-icon" style={{ background: "#faf5ff" }}>
                <BookOpen size={15} color="#7c3aed" strokeWidth={2.5} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>KPI Details</p>
            </div>
            <div className="rk-card-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="rk-grid-2">

                {/* Batch */}
                <div className="rk-field">
                  <label className="rk-label">Batch</label>
                  <div className="rk-input-wrap">
                    <span className="rk-input-icon"><Layers size={14} strokeWidth={2.5} /></span>
                    <input
                      name="kpi_batch"
                      value={formData.kpi_batch}
                      onChange={handleChange}
                      placeholder="e.g. Batch 2024-A"
                      className={`rk-input ${errors.kpi_batch ? "rk-input-error" : ""}`}
                    />
                  </div>
                  {errors.kpi_batch && <p className="rk-error-text">⚠ {errors.kpi_batch}</p>}
                </div>

                {/* Semester */}
                <div className="rk-field">
                  <label className="rk-label">Semester</label>
                  <div className="rk-input-wrap">
                    <span className="rk-input-icon"><BookOpen size={14} strokeWidth={2.5} /></span>
                    <input
                      name="kpi_batch_semester"
                      value={formData.kpi_batch_semester}
                      onChange={handleChange}
                      placeholder="e.g. Semester 1"
                      className={`rk-input ${errors.kpi_batch_semester ? "rk-input-error" : ""}`}
                    />
                  </div>
                  {errors.kpi_batch_semester && <p className="rk-error-text">⚠ {errors.kpi_batch_semester}</p>}
                </div>

                {/* DO Count */}
                <div className="rk-field">
                  <label className="rk-label">DO Count</label>
                  <div className="rk-input-wrap">
                    <span className="rk-input-icon"><Hash size={14} strokeWidth={2.5} /></span>
                    <input
                      type="number"
                      name="kpi_do_count"
                      value={formData.kpi_do_count}
                      onChange={handleChange}
                      placeholder="e.g. 12"
                      className={`rk-input ${errors.kpi_do_count ? "rk-input-error" : ""}`}
                    />
                  </div>
                  {errors.kpi_do_count && <p className="rk-error-text">⚠ {errors.kpi_do_count}</p>}
                </div>

                {/* Attendance */}
                <div className="rk-field">
                  <label className="rk-label">Attendance Percentage</label>
                  <div className="rk-input-wrap">
                    <span className="rk-input-icon"><Percent size={14} strokeWidth={2.5} /></span>
                    <input
                      name="kpi_batch_attendence_percentage"
                      value={formData.kpi_batch_attendence_percentage}
                      onChange={handleChange}
                      placeholder="e.g. 85"
                      className={`rk-input ${errors.kpi_batch_attendence_percentage ? "rk-input-error" : ""}`}
                    />
                  </div>
                  {errors.kpi_batch_attendence_percentage && <p className="rk-error-text">⚠ {errors.kpi_batch_attendence_percentage}</p>}
                  {/* Attendance bar */}
                  {attValid && formData.kpi_batch_attendence_percentage && (
                    <div>
                      <div className="rk-att-bar-wrap">
                        <div className="rk-att-bar" style={{ width: `${attNum}%`, background: attColor }} />
                      </div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: attColor, marginTop: 4 }}>
                        {attNum >= 85 ? "Good attendance" : attNum >= 60 ? "Average attendance" : "Low attendance"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview row */}
              {hasPreview && (
                <div className="rk-preview">
                  <p style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
                    Submission Preview
                  </p>
                  <div className="rk-preview-grid">
                    <div className="rk-preview-item">
                      <p className="rk-preview-label">Batch</p>
                      <p className="rk-preview-value" style={{ fontSize: 14, color: "#334155" }}>{formData.kpi_batch || "—"}</p>
                    </div>
                    <div className="rk-preview-item">
                      <p className="rk-preview-label">Semester</p>
                      <p className="rk-preview-value" style={{ fontSize: 14, color: "#334155" }}>{formData.kpi_batch_semester || "—"}</p>
                    </div>
                    <div className="rk-preview-item">
                      <p className="rk-preview-label">DO Count</p>
                      <p className="rk-preview-value" style={{ color: "#7c3aed" }}>{formData.kpi_do_count || "—"}</p>
                    </div>
                    <div className="rk-preview-item">
                      <p className="rk-preview-label">Attendance</p>
                      <p className="rk-preview-value" style={{ color: attValid && formData.kpi_batch_attendence_percentage ? attColor : "#0f172a" }}>
                        {formData.kpi_batch_attendence_percentage ? `${attNum}%` : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </>
  );
};

export default KPIRaise;