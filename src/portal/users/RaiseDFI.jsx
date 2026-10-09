import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  TrendingUp,
  BadgeDollarSign,
  Repeat,
  Hash,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { gooeyToast } from "goey-toast";
import { z } from "zod";

const dfiSchema = z.object({
  dfi_alternate_count: z
    .string()
    .min(1, "Alternate count is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Must be a positive number" })
    .refine((val) => Number.isInteger(Number(val)), { message: "Must be a whole number" }),
  dfi_amount: z
    .string()
    .min(1, "DFI amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Must be a positive number" }),
});

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .rd-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .rd-root { background: #f8fafc; min-height: 100vh; }

  .rd-header {
    background: #fff;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
    position: sticky; top: 0; z-index: 40;
    padding: 14px 24px;
    display: flex; align-items: center; justify-content: space-between;
  }

  .rd-back-btn {
    width: 36px; height: 36px; border-radius: 10px;
    border: 1.5px solid #e8ecf0; background: #fff;
    display: flex; align-items: center; justify-content: center;
    color: #64748b; cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }
  .rd-back-btn:hover { border-color: #6366f1; background: #f5f3ff; color: #6366f1; }

  .rd-view-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; font-size: 13px; font-weight: 700;
    color: #6366f1; border: 1.5px solid #e0e7ff;
    border-radius: 12px; background: #f5f3ff;
    text-decoration: none; cursor: pointer;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  }
  .rd-view-btn:hover { border-color: #6366f1; background: #ede9fe; box-shadow: 0 2px 8px rgba(99,102,241,0.12); }

  .rd-discard-btn {
    padding: 8px 16px; font-size: 13px; font-weight: 700;
    color: #94a3b8; border: 1.5px solid #e8ecf0;
    border-radius: 12px; background: #fff; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: border-color 0.15s, color 0.15s;
  }
  .rd-discard-btn:hover { border-color: #cbd5e1; color: #64748b; }

  .rd-submit-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 22px; font-size: 13px; font-weight: 800; color: #fff;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border: none; border-radius: 12px; cursor: pointer;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: opacity 0.15s, box-shadow 0.15s, transform 0.15s;
  }
  .rd-submit-btn:hover { opacity: 0.92; box-shadow: 0 6px 20px rgba(99,102,241,0.45); transform: translateY(-1px); }

  .rd-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }
  .rd-card-header {
    background: #fafbfc; border-bottom: 1px solid #f1f5f9;
    padding: 16px 24px; display: flex; align-items: center; gap: 10px;
  }
  .rd-card-header-icon { padding: 8px; border-radius: 10px; display: flex; }
  .rd-card-body { padding: 28px; }
  .rd-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px 24px; }

  .rd-field { display: flex; flex-direction: column; gap: 6px; }
  .rd-label { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.07em; }
  .rd-input-wrap { position: relative; }
  .rd-input-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: #b0bec5; pointer-events: none; display: flex;
    transition: color 0.15s;
  }
  .rd-input-wrap:focus-within .rd-input-icon { color: #6366f1; }
  .rd-input {
    width: 100%; padding: 10px 14px 10px 40px;
    font-size: 13px; font-weight: 600; color: #0f172a;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1.5px solid #e8ecf0; border-radius: 12px;
    background: #fff; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }
  .rd-input::placeholder { color: #c0cad6; font-weight: 400; }
  .rd-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  .rd-input-error { border-color: #fca5a5 !important; background: #fff8f8 !important; }
  .rd-disabled-input {
    width: 100%; padding: 10px 14px;
    font-size: 13px; font-weight: 600; color: #94a3b8;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1.5px solid #f1f5f9; border-radius: 12px;
    background: #fafbfc; outline: none; cursor: not-allowed;
    box-sizing: border-box;
  }
  .rd-error-text { font-size: 11px; font-weight: 700; color: #ef4444; display: flex; align-items: center; gap: 4px; }

  /* Live preview panel */
  .rd-preview {
    background: #fafbfc; border: 1.5px solid #f1f5f9;
    border-radius: 14px; padding: 18px 20px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .rd-preview-row {
    display: flex; align-items: center; justify-content: space-between;
  }
  .rd-preview-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; }
  .rd-preview-value { font-size: 14px; font-weight: 900; color: #0f172a; }
  .rd-preview-divider { height: 1px; background: #f1f5f9; }
`;

const RaiseDFI = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const initialFormData = {
    employee_code: user?.user_code || "",
    employee_name: user?.user_fullname || "",
    dfi_alternate_count: "",
    dfi_amount: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const result = dfiSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([k, msgs]) => [k, msgs[0]])));
      return;
    }
    setErrors({});
    try {
      const res = await axios.post("http://localhost:5000/user/raise-dfi", formData);
      gooeyToast.success(res.data.message || "DFI submitted successfully", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 } });
      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      gooeyToast.error(error.response?.data?.message || "Error submitting DFI", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 } });
    }
  };

  const hasPreview = formData.dfi_alternate_count || formData.dfi_amount;

  return (
    <>
      <style>{styles}</style>
      <div className="rd-root">

        {/* Header */}
        <div className="rd-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="rd-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                Raise DFI
              </h1>
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>
                Direct Financial Incentive submission
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link to="/hr360/user/dfis" className="rd-view-btn">
              <TrendingUp size={14} strokeWidth={2.5} />
              View Submissions
            </Link>
            <button className="rd-discard-btn" onClick={() => navigate(-1)}>Discard</button>
            <button className="rd-submit-btn" onClick={handleSubmit}>
              <Save size={15} strokeWidth={2.5} />
              Submit DFI
            </button>
          </div>
        </div>

        <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Employee Info */}
          <div className="rd-card">
            <div className="rd-card-header">
              <div className="rd-card-header-icon" style={{ background: "#f8fafc" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </div>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Employee Information</p>
            </div>
            <div className="rd-card-body">
              <div className="rd-grid-2">
                <div className="rd-field">
                  <label className="rd-label">Employee Code</label>
                  <input className="rd-disabled-input" value={formData.employee_code} disabled />
                </div>
                <div className="rd-field">
                  <label className="rd-label">Employee Name</label>
                  <input className="rd-disabled-input" value={formData.employee_name} disabled />
                </div>
              </div>
            </div>
          </div>

          {/* DFI Details */}
          <div className="rd-card">
            <div className="rd-card-header">
              <div className="rd-card-header-icon" style={{ background: "#f0fdf4" }}>
                <BadgeDollarSign size={15} color="#16a34a" strokeWidth={2.5} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>DFI Details</p>
            </div>
            <div className="rd-card-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="rd-grid-2">

                {/* Alternate Count */}
                <div className="rd-field">
                  <label className="rd-label">Alternate Count</label>
                  <div className="rd-input-wrap">
                    <span className="rd-input-icon"><Repeat size={14} strokeWidth={2.5} /></span>
                    <input
                      type="number"
                      name="dfi_alternate_count"
                      value={formData.dfi_alternate_count}
                      onChange={handleChange}
                      placeholder="e.g. 3"
                      className={`rd-input ${errors.dfi_alternate_count ? "rd-input-error" : ""}`}
                    />
                  </div>
                  {errors.dfi_alternate_count && <p className="rd-error-text">⚠ {errors.dfi_alternate_count}</p>}
                </div>

                {/* Amount */}
                <div className="rd-field">
                  <label className="rd-label">DFI Amount (PKR)</label>
                  <div className="rd-input-wrap">
                    <span className="rd-input-icon"><BadgeDollarSign size={14} strokeWidth={2.5} /></span>
                    <input
                      type="number"
                      name="dfi_amount"
                      value={formData.dfi_amount}
                      onChange={handleChange}
                      placeholder="e.g. 5000"
                      className={`rd-input ${errors.dfi_amount ? "rd-input-error" : ""}`}
                    />
                  </div>
                  {errors.dfi_amount && <p className="rd-error-text">⚠ {errors.dfi_amount}</p>}
                </div>
              </div>

              {/* Live preview */}
              {hasPreview && (
                <div className="rd-preview">
                  <p style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>
                    Submission Preview
                  </p>
                  <div className="rd-preview-divider" />
                  <div className="rd-preview-row">
                    <span className="rd-preview-label">Alternate Count</span>
                    <span className="rd-preview-value" style={{ color: "#7c3aed" }}>
                      {formData.dfi_alternate_count || "—"}
                    </span>
                  </div>
                  <div className="rd-preview-row">
                    <span className="rd-preview-label">Incentive Amount</span>
                    <span className="rd-preview-value" style={{ color: "#059669" }}>
                      {formData.dfi_amount ? `PKR ${Number(formData.dfi_amount).toLocaleString()}` : "—"}
                    </span>
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

export default RaiseDFI;