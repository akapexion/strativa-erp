import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  FileText,
  User,
  Hash,
  Loader2,
  BadgeAlert,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { gooeyToast } from "goey-toast";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .rcf-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .rcf-root { background: #f8fafc; min-height: 100vh; }

  /* ── Header ── */
  .rcf-header {
    background: #fff;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
    position: sticky; top: 0; z-index: 40;
    padding: 14px 24px;
    display: flex; align-items: center; justify-content: space-between;
  }

  .rcf-back-btn {
    width: 36px; height: 36px; border-radius: 10px;
    border: 1.5px solid #e8ecf0; background: #fff;
    display: flex; align-items: center; justify-content: center;
    color: #64748b; cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
    flex-shrink: 0;
  }
  .rcf-back-btn:hover { border-color: #6366f1; background: #f5f3ff; color: #6366f1; }

  .rcf-view-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; font-size: 13px; font-weight: 700;
    color: #6366f1; border: 1.5px solid #e0e7ff;
    border-radius: 12px; background: #f5f3ff; cursor: pointer;
    text-decoration: none;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  }
  .rcf-view-btn:hover { border-color: #6366f1; background: #ede9fe; box-shadow: 0 2px 8px rgba(99,102,241,0.12); }

  .rcf-discard-btn {
    padding: 8px 16px; font-size: 13px; font-weight: 700;
    color: #94a3b8; border: 1.5px solid #e8ecf0;
    border-radius: 12px; background: #fff; cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }
  .rcf-discard-btn:hover { border-color: #cbd5e1; color: #64748b; }

  .rcf-submit-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 22px; font-size: 13px; font-weight: 800;
    color: #fff;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border: none; border-radius: 12px; cursor: pointer;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
    transition: opacity 0.15s, box-shadow 0.15s, transform 0.15s;
  }
  .rcf-submit-btn:hover:not(:disabled) { opacity: 0.92; box-shadow: 0 6px 20px rgba(99,102,241,0.45); transform: translateY(-1px); }
  .rcf-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── Cards ── */
  .rcf-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }
  .rcf-card-header {
    background: #fafbfc;
    border-bottom: 1px solid #f1f5f9;
    padding: 16px 24px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .rcf-card-header-title {
    display: flex; align-items: center; gap: 10px;
  }
  .rcf-card-header-icon { padding: 8px; border-radius: 10px; display: flex; }
  .rcf-card-body { padding: 28px; }

  /* ── Inputs ── */
  .rcf-field { display: flex; flex-direction: column; gap: 6px; }
  .rcf-label {
    font-size: 11px; font-weight: 800;
    color: #64748b; text-transform: uppercase; letter-spacing: 0.07em;
    display: flex; align-items: center; gap: 4px;
  }
  .rcf-required-star { color: #ef4444; font-size: 13px; }

  .rcf-input {
    width: 100%; padding: 11px 16px;
    font-size: 13px; font-weight: 600; color: #0f172a;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1.5px solid #e8ecf0; border-radius: 12px;
    background: #fff; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }
  .rcf-input::placeholder { color: #c0cad6; font-weight: 400; }
  .rcf-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  .rcf-input-error { border-color: #fca5a5 !important; background: #fff8f8 !important; }
  .rcf-input-error:focus { border-color: #f87171 !important; box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important; }

  .rcf-textarea {
    width: 100%; padding: 12px 16px;
    font-size: 13px; font-weight: 500; color: #0f172a;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1.5px solid #e8ecf0; border-radius: 12px;
    background: #fff; outline: none; resize: none;
    line-height: 1.6; min-height: 110px;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }
  .rcf-textarea::placeholder { color: #c0cad6; font-weight: 400; }
  .rcf-textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

  .rcf-select {
    width: 100%; padding: 11px 36px 11px 16px;
    font-size: 13px; font-weight: 600; color: #0f172a;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1.5px solid #e8ecf0; border-radius: 12px;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 14px center;
    appearance: none; outline: none; cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }
  .rcf-select:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

  .rcf-disabled-input {
    width: 100%; padding: 11px 16px;
    font-size: 13px; font-weight: 600; color: #94a3b8;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1.5px solid #f1f5f9; border-radius: 12px;
    background: #fafbfc; outline: none; cursor: not-allowed;
    box-sizing: border-box;
  }

  .rcf-error-text {
    font-size: 11px; font-weight: 700; color: #ef4444;
    display: flex; align-items: center; gap: 4px; margin-top: 2px;
  }

  /* ── State Wrappers ── */
  .rcf-state-wrap {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 100px 24px; gap: 12px; text-align: center;
  }
  .rcf-state-icon-wrap {
    width: 64px; height: 64px; border-radius: 20px;
    display: flex; align-items: center; justify-content: center; margin-bottom: 4px;
  }
`;

const RaiseCustomForm = () => {
  const navigate = useNavigate();
  const { formId } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [formDef, setFormDef] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Fetch Form Schema by ID
  const fetchFormDefinition = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/custom-forms/${formId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success && res.data.data) {
        setFormDef(res.data.data);
        // Initialize answers state object with empty strings
        const initialAnswers = {};
        res.data.data.fields.forEach((f) => {
          initialAnswers[f.field_label] = "";
        });
        setAnswers(initialAnswers);
      } else {
        setFetchError("Custom form specification not found.");
      }
    } catch (err) {
      console.error("Fetch Custom Form Error:", err);
      setFetchError(err.response?.data?.message || "Failed to load form definition.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formId) {
      fetchFormDefinition();
    }
  }, [formId]);

  const handleInputChange = (fieldLabel, val) => {
    setAnswers((prev) => ({ ...prev, [fieldLabel]: val }));
    if (errors[fieldLabel]) {
      setErrors((prev) => ({ ...prev, [fieldLabel]: null }));
    }
  };

  const validateForm = () => {
    if (!formDef || !formDef.fields) return false;
    const newErrors = {};
    let isValid = true;

    formDef.fields.forEach((field) => {
      const val = answers[field.field_label] || "";

      // Required check
      if (field.field_required && !val.trim()) {
        newErrors[field.field_label] = `${field.field_label} is required`;
        isValid = false;
      }

      // Numeric check if type is number
      if (field.field_type === "number" && val.trim() !== "") {
        if (isNaN(val)) {
          newErrors[field.field_label] = `${field.field_label} must be a valid number`;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      gooeyToast.error("Please fill in all required form fields correctly", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        form_id: formDef._id,
        employee_code: user.user_code || "",
        employee_name: user.user_fullname || "",
        answers,
      };

      const res = await axios.post("http://localhost:5000/custom-forms/submit", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      gooeyToast.success(res.data.message || "Form submitted successfully", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });

      navigate("/hr360/user/employee-forms");
    } catch (err) {
      console.error("Submit Custom Form Error:", err);
      gooeyToast.error(err.response?.data?.message || "Error submitting form", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="rcf-root">
        {/* Sticky Header */}
        <div className="rcf-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="rcf-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                {formDef ? formDef.form_title : "Raise Custom Form"}
              </h1>
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>
                Fill out the required details below to submit this request
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link to="/hr360/user/employee-forms" className="rcf-view-btn">
              <TrendingUp size={14} strokeWidth={2.5} />
              My Submissions
            </Link>
            <button className="rcf-discard-btn" onClick={() => navigate(-1)}>
              Discard
            </button>
            <button
              className="rcf-submit-btn"
              onClick={handleSubmit}
              disabled={loading || submitting}
            >
              {submitting ? (
                <Loader2 size={15} className="animate-spin" strokeWidth={2.5} />
              ) : (
                <Save size={15} strokeWidth={2.5} />
              )}
              Submit Form
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="rcf-state-wrap">
            <div className="rcf-state-icon-wrap" style={{ background: "#f5f3ff" }}>
              <Loader2 size={28} color="#6366f1" className="animate-spin" strokeWidth={2.5} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>Loading form specification…</p>
            <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Please wait a moment</p>
          </div>
        )}

        {/* Error State */}
        {!loading && fetchError && (
          <div className="rcf-state-wrap">
            <div className="rcf-state-icon-wrap" style={{ background: "#fff1f2" }}>
              <BadgeAlert size={28} color="#e11d48" strokeWidth={2.5} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>Unable to load form</p>
            <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{fetchError}</p>
            <button
              onClick={fetchFormDefinition}
              style={{
                marginTop: 8, fontSize: 13, fontWeight: 700, color: "#6366f1",
                padding: "9px 20px", borderRadius: 12, border: "1.5px solid #e0e7ff",
                background: "#f5f3ff", cursor: "pointer", fontFamily: "inherit"
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Main Content */}
        {!loading && !fetchError && formDef && (
          <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
            
            {/* Employee Information Card (read-only) */}
            <div className="rcf-card">
              <div className="rcf-card-header">
                <div className="rcf-card-header-title">
                  <div className="rcf-card-header-icon" style={{ background: "#f8fafc" }}>
                    <User size={15} color="#64748b" strokeWidth={2.5} />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Employee Information</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#6366f1", background: "#f5f3ff", padding: "4px 10px", borderRadius: 8, textTransform: "capitalize" }}>
                  Target: {formDef.form_target_role}
                </span>
              </div>
              <div className="rcf-card-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div className="rcf-field">
                    <label className="rcf-label">
                      <Hash size={12} style={{ color: "#94a3b8" }} /> Employee Code
                    </label>
                    <input className="rcf-disabled-input" value={user.user_code || "—"} disabled />
                  </div>
                  <div className="rcf-field">
                    <label className="rcf-label">
                      <User size={12} style={{ color: "#94a3b8" }} /> Employee Name
                    </label>
                    <input className="rcf-disabled-input" value={user.user_fullname || "—"} disabled />
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Form Fields Card */}
            <div className="rcf-card">
              <div className="rcf-card-header">
                <div className="rcf-card-header-title">
                  <div className="rcf-card-header-icon" style={{ background: "#f0fdf4" }}>
                    <FileText size={15} color="#16a34a" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Form Questionnaire</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
                      {formDef.fields?.length || 0} required/optional questions
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="rcf-card-body" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {formDef.fields?.map((field, idx) => {
                  const hasError = !!errors[field.field_label];
                  return (
                    <div key={idx} className="rcf-field">
                      <label className="rcf-label">
                        {field.field_label}
                        {field.field_required && <span className="rcf-required-star">*</span>}
                      </label>

                      {/* Render according to field_type */}
                      {field.field_type === "textarea" ? (
                        <textarea
                          placeholder={`Enter ${field.field_label.toLowerCase()}…`}
                          value={answers[field.field_label] || ""}
                          onChange={(e) => handleInputChange(field.field_label, e.target.value)}
                          className={`rcf-textarea ${hasError ? "rcf-input-error" : ""}`}
                        />
                      ) : field.field_type === "select" ? (
                        <select
                          value={answers[field.field_label] || ""}
                          onChange={(e) => handleInputChange(field.field_label, e.target.value)}
                          className={`rcf-select ${hasError ? "rcf-input-error" : ""}`}
                        >
                          <option value="">Select option…</option>
                          {field.field_options?.map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : field.field_type === "number" ? (
                        <input
                          type="number"
                          placeholder={`Enter numeric value for ${field.field_label.toLowerCase()}…`}
                          value={answers[field.field_label] || ""}
                          onChange={(e) => handleInputChange(field.field_label, e.target.value)}
                          className={`rcf-input ${hasError ? "rcf-input-error" : ""}`}
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder={`Enter ${field.field_label.toLowerCase()}…`}
                          value={answers[field.field_label] || ""}
                          onChange={(e) => handleInputChange(field.field_label, e.target.value)}
                          className={`rcf-input ${hasError ? "rcf-input-error" : ""}`}
                        />
                      )}

                      {hasError && <p className="rcf-error-text">⚠ {errors[field.field_label]}</p>}
                    </div>
                  );
                })}
              </div>
            </div>

          </main>
        )}
      </div>
    </>
  );
};

export default RaiseCustomForm;
