import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api.js';
import { showValidationToast } from '../../utils/formValidationToast.js';
import {
  ArrowLeft, Save, User, Briefcase,
  Phone, Mail, Fingerprint, Milestone,
  GraduationCap, Landmark, Banknote, CalendarDays,
  Sparkles, Plus, Trash2, Loader2, ChevronDown, ChevronUp,
  AlertCircle, Clock, DollarSign,
} from 'lucide-react';
import { gooeyToast } from 'goey-toast';
import { z } from 'zod';

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const updateEmployeeSchema = z.object({
  employee_fname:        z.string().min(1, "First name is required").max(50),
  employee_lname:        z.string().min(1, "Last name is required").max(50),
  employee_email:        z.string().min(1, "Email is required").email("Enter a valid email address"),
  employee_phonenumber:  z.string().min(1, "Phone number is required").regex(/^\+?[0-9\s\-]{7,15}$/, "Enter a valid phone number"),
  employee_cnicnumber:   z.coerce.string().min(1, "CNIC is required").regex(/^\d{13}$/, "CNIC must be 13 digits"),
  employee_maritalstatus:z.string().min(1, "Marital status is required"),
  employee_dob:          z.string().min(1, "Date of birth is required").refine(val => {
    const age = new Date().getFullYear() - new Date(val).getFullYear();
    return age >= 18;
  }, "Employee must be at least 18 years old"),
  employee_department:   z.string().min(1, "Department is required"),
  employee_designation:  z.string().min(1, "Designation is required"),
  employee_qualification:z.string().min(1, "Qualification is required").max(100),
  employee_salary:       z.string().min(1, "Salary is required").refine(val => !isNaN(Number(val)) && Number(val) > 0, "Salary must be a positive number"),
  salary_basis:          z.enum(["Monthly", "Hourly"]).optional(),
  shift_name:            z.string().optional(),
  shift_start_time:      z.string().optional(),
  shift_end_time:        z.string().optional(),
  expected_hours_per_day:z.coerce.string().optional(),
  employee_joiningdate:  z.string().min(1, "Joining date is required"),
  medical_leaves:        z.string().min(1, "Required").refine(val => !isNaN(Number(val)) && Number(val) >= 0, "Must be non-negative"),
  special_leaves:        z.string().min(1, "Required").refine(val => !isNaN(Number(val)) && Number(val) >= 0, "Must be non-negative"),
  employment_status:     z.enum(["Probation", "Permanent", "Terminated", "Ex"]),
});

// ─── Design-system styles ─────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .ue-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .ue-root { background: #f8fafc; min-height: 100vh; }

  .back-btn {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 13px; font-weight: 700; color: #64748b;
    background: #fff; border: 1.5px solid #e8ecf0;
    border-radius: 10px; padding: 8px 14px;
    cursor: pointer; transition: all 0.15s;
    text-decoration: none;
  }
  .back-btn:hover { background: #f8fafc; color: #4f46e5; border-color: #c7d2fe; }

  .save-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    box-shadow: 0 4px 14px rgba(99,102,241,0.3);
    border: none; border-radius: 12px;
    color: #fff; font-weight: 700; font-size: 14px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 12px 28px; cursor: pointer;
    transition: filter 0.15s, box-shadow 0.15s, transform 0.15s;
    white-space: nowrap;
  }
  .save-btn:hover:not(:disabled) {
    filter: brightness(1.08);
    box-shadow: 0 6px 20px rgba(99,102,241,0.4);
    transform: translateY(-1px);
  }
  .save-btn:active:not(:disabled) { transform: translateY(0); }
  .save-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .discard-btn {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 14px; font-weight: 700; color: #64748b;
    background: none; border: 1.5px solid #e8ecf0;
    border-radius: 12px; padding: 12px 22px;
    cursor: pointer; transition: all 0.15s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .discard-btn:hover { background: #f8fafc; border-color: #cbd5e1; color: #475569; }

  .section-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }

  .section-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 24px;
    border-bottom: 1px solid #e8ecf0;
  }
  .section-header-left { display: flex; align-items: center; gap: 10px; }
  .section-header h2 {
    font-size: 13.5px; font-weight: 800; color: #1e293b;
    letter-spacing: -0.01em; margin: 0;
  }

  .field-grid-3 {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px; padding: 22px 24px;
  }

  .field-wrap { display: flex; flex-direction: column; gap: 5px; }

  .field-label {
    font-size: 10.5px; font-weight: 800; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.08em;
    display: flex; align-items: center; gap: 5px;
  }

  .form-input {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px; font-weight: 600; color: #1e293b;
    background: #f8fafc; border: 1.5px solid #e8ecf0;
    border-radius: 10px; padding: 9px 13px;
    outline: none; transition: all 0.15s; width: 100%;
    box-sizing: border-box;
  }
  .form-input:focus {
    background: #fff; border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
  .form-input.error { border-color: #f87171; background: #fff8f8; }
  .field-error {
    font-size: 11px; font-weight: 700; color: #ef4444;
    display: flex; align-items: center; gap: 4px;
  }

  .status-select {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px; font-weight: 700;
    background: #f8fafc; border: 1.5px solid #e8ecf0;
    border-radius: 10px; padding: 9px 13px;
    outline: none; cursor: pointer; transition: all 0.15s;
    width: 100%; box-sizing: border-box; color: #1e293b;
  }
  .status-select:focus { border-color: #6366f1; background: #fff; }

  .allot-card {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px; border: 1.5px solid #e8eeff;
    border-radius: 12px; background: #f9f8ff;
    transition: all 0.15s;
  }
  .allot-card:hover { border-color: #c7d2fe; box-shadow: 0 2px 8px rgba(99,102,241,0.08); }
  .remove-allot-btn {
    background: none; border: none; cursor: pointer;
    color: #94a3b8; padding: 5px; border-radius: 7px;
    display: flex; align-items: center; transition: all 0.12s;
  }
  .remove-allot-btn:hover { background: #fee2e2; color: #ef4444; }

  .allot-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    font-size: 12px; font-weight: 700; color: #fff;
    background: #6366f1; border: none; border-radius: 9px;
    padding: 8px 14px; cursor: pointer; transition: all 0.15s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .allot-btn:hover { background: #4f46e5; }

  .toggle-btn {
    font-size: 12px; font-weight: 700; color: #6366f1;
    background: #eef2ff; border: 1.5px solid #c7d2fe;
    border-radius: 8px; padding: 6px 12px; cursor: pointer;
    display: inline-flex; align-items: center; gap: 5px;
    transition: all 0.15s; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .toggle-btn:hover { background: #e0e7ff; }

  .loading-screen {
    min-height: 80vh; display: flex; align-items: center; justify-content: center;
  }
  .loading-box {
    display: flex; flex-direction: column; align-items: center; gap: 14px;
    padding: 32px 40px; background: #fff; border-radius: 20px;
    border: 1px solid #f1f5f9; box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }
  .loading-ring {
    width: 36px; height: 36px; border: 3.5px solid #e2e8f0;
    border-top-color: #6366f1; border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin 0.75s linear infinite; }
`;

const STATUS_COLORS = {
  Permanent:  { bg: "#f0fdf4", color: "#15803d" },
  Probation:  { bg: "#fffbeb", color: "#b45309" },
  Terminated: { bg: "#fff1f2", color: "#be123c" },
  Ex:         { bg: "#f8fafc", color: "#64748b" },
};

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const [configuredLeaveTypes, setConfiguredLeaveTypes] = useState([]);
  const [customAllotments, setCustomAllotments] = useState([]);
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [selectedLeaveTypeId, setSelectedLeaveTypeId] = useState("");
  const [allotQuantity, setAllotQuantity] = useState("0");

  const formatLeaveKey = (title) => {
    let n = title.toLowerCase().trim();
    if (n.endsWith("leave"))        n = n.slice(0, -5).trim() + "_leaves";
    else if (n.endsWith("leaves"))  n = n.slice(0, -6).trim() + "_leaves";
    else                            n = n + "_leaves";
    return n.replace(/[\s\-]+/g, "_");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const typesRes = await axios.get(`${API_BASE_URL}/admin/all-leave-types`);
        let leaveTypesList = [];
        if (typesRes.data?.success) {
          leaveTypesList = typesRes.data.leave_types || [];
          setConfiguredLeaveTypes(leaveTypesList);
        }
        const empRes = await axios.get(`${API_BASE_URL}/admin/employee/${id}`);
        if (empRes.data.success) {
          const emp = empRes.data.employee;
          setFormData({
            ...emp,
            salary_basis: emp.salary_basis || "Monthly",
            shift_name: emp.assigned_shift?.shift_name || "Standard Morning",
            shift_start_time: emp.assigned_shift?.start_time || "09:00 AM",
            shift_end_time: emp.assigned_shift?.end_time || "05:00 PM",
            expected_hours_per_day: emp.assigned_shift?.expected_hours_per_day?.toString() || "8.0",
            bank_name: emp.bank_details?.bank_name || "",
            account_title: emp.bank_details?.account_title || "",
            account_number: emp.bank_details?.account_number || "",
            iban: emp.bank_details?.iban || "",
            medical_leaves: emp.alloted_leaves?.medical_leaves?.toString() || "0",
            special_leaves: emp.alloted_leaves?.special_leaves?.toString() || "0",
            employment_status: emp.employment_status || "Probation",
          });
          if (emp.alloted_leaves) {
            const standard = ["causual_leaves","medical_leaves","special_leaves","annual_leaves"];
            const allotments = Object.keys(emp.alloted_leaves)
              .filter(k => !standard.includes(k))
              .map(k => {
                const match = leaveTypesList.find(t => formatLeaveKey(t.leave_type_title) === k);
                return {
                  id: match?._id || k,
                  title: match?.leave_type_title || k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
                  key: k,
                  quantity: emp.alloted_leaves[k],
                };
              });
            setCustomAllotments(allotments);
          }
        }
      } catch (err) {
        console.error(err);
        gooeyToast.error("Failed to fetch employee data", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 } });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAllotment = () => {
    if (!selectedLeaveTypeId) {
      gooeyToast.error("Please select a leave type", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2000 } });
      return;
    }
    const qty = Number(allotQuantity);
    if (isNaN(qty) || qty < 0) {
      gooeyToast.error("Enter a valid number of days", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2000 } });
      return;
    }
    const leaveType = configuredLeaveTypes.find(t => t._id === selectedLeaveTypeId);
    if (!leaveType) return;
    const key = formatLeaveKey(leaveType.leave_type_title);
    if (customAllotments.find(a => a.key === key)) {
      gooeyToast.error(`"${leaveType.leave_type_title}" already allotted`, { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2000 } });
      return;
    }
    setCustomAllotments(prev => [...prev, { id: leaveType._id, title: leaveType.leave_type_title, key, quantity: qty }]);
    setSelectedLeaveTypeId(""); setAllotQuantity("0");
    gooeyToast.success(`Added ${leaveType.leave_type_title} (${qty} days)`, { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 1500 } });
  };

  const handleRemoveAllotment = (key) => {
    setCustomAllotments(prev => prev.filter(a => a.key !== key));
    gooeyToast.success("Allotment removed", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 1500 } });
  };

  const availableLeaveTypes = configuredLeaveTypes.filter(t => {
    const k = formatLeaveKey(t.leave_type_title);
    const standard = ["causual_leaves","medical_leaves","special_leaves","annual_leaves"];
    return !standard.includes(k) && !customAllotments.some(a => a.key === k);
  });

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const result = updateEmployeeSchema.safeParse(formData);
    if (!result.success) {
      const fe = result.error.flatten().fieldErrors;
      const errorMap = Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v[0]]));
      setErrors(errorMap);
      showValidationToast(Object.values(errorMap));
      return;
    }
    setErrors({});
    setIsUpdating(true);
    try {
      const customObj = {};
      customAllotments.forEach(a => { customObj[a.key] = a.quantity; });
      const payload = {
        ...formData,
        salary_basis: formData.salary_basis || "Monthly",
        assigned_shift: {
          shift_name: formData.shift_name || "Standard Morning",
          start_time: formData.shift_start_time || "09:00 AM",
          end_time: formData.shift_end_time || "05:00 PM",
          expected_hours_per_day: Number(formData.expected_hours_per_day) || 8.0,
        },
        bank_details: {
          bank_name: formData.bank_name || "",
          account_title: formData.account_title || "",
          account_number: formData.account_number || "",
          iban: formData.iban || "",
        },
        alloted_leaves: {
          causual_leaves: formData.alloted_leaves?.causual_leaves || 0,
          medical_leaves: Number(formData.medical_leaves || 0),
          special_leaves: Number(formData.special_leaves || 0),
          annual_leaves:  formData.alloted_leaves?.annual_leaves || 0,
          ...customObj,
        },
      };
      const { data } = await axios.put(`${API_BASE_URL}/admin/update-employee/${id}`, payload);
      if (data.success) {
        gooeyToast.success("Employee Updated Successfully", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 } });
        navigate(-1);
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Update failed. Please try again.";
      showValidationToast([errMsg]);
    } finally {
      setIsUpdating(false);
    }
  };

  const fmt = (d) => d ? d.split('T')[0] : "";

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="loading-screen">
        <div className="loading-box">
          <div className="loading-ring" />
          <p style={{ fontSize: 13, fontWeight: 700, color: "#64748b", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Synchronizing Employee Data…
          </p>
        </div>
      </div>
    </>
  );

  const statusColor = STATUS_COLORS[formData.employment_status] || STATUS_COLORS.Probation;

  return (
    <>
      <style>{styles}</style>
      <div className="ue-root p-5 md:p-8">
        <div style={{ maxWidth: 960, margin: "0 auto" }} className="space-y-5">

          {/* ── Page Header ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={15} /> Back to Directory
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                fontSize: 11, fontWeight: 800, padding: "4px 12px",
                borderRadius: 99, background: statusColor.bg, color: statusColor.color,
                letterSpacing: "0.04em", textTransform: "uppercase",
              }}>
                {formData.employment_status || "Probation"}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", fontFamily: "monospace" }}>
                {formData.employee_code}
              </span>
            </div>
          </div>

          <form onSubmit={handleUpdateSubmit} className="space-y-5">

            {/* ── Personal Info ── */}
            <div className="section-card">
              <div className="section-header">
                <div className="section-header-left">
                  <div style={{ padding: 6, borderRadius: 8 }}>
                    <User size={16} style={{ color: "#3b82f6" }} />
                  </div>
                  <h2>Personal Information</h2>
                </div>
              </div>
              <div className="field-grid-3">
                <div className="field-wrap">
                  <label className="field-label">First Name</label>
                  <input type="text" name="employee_fname"
                    value={formData.employee_fname || ""} onChange={handleChange}
                    className={`form-input${errors.employee_fname ? " error" : ""}`}
                  />
                  {errors.employee_fname && <span className="field-error"><AlertCircle size={10}/>{errors.employee_fname}</span>}
                </div>
                <div className="field-wrap">
                  <label className="field-label">Last Name</label>
                  <input type="text" name="employee_lname"
                    value={formData.employee_lname || ""} onChange={handleChange}
                    className={`form-input${errors.employee_lname ? " error" : ""}`}
                  />
                  {errors.employee_lname && <span className="field-error"><AlertCircle size={10}/>{errors.employee_lname}</span>}
                </div>
                <div className="field-wrap">
                  <label className="field-label"><Mail size={12}/> Email Address</label>
                  <input type="email" name="employee_email"
                    value={formData.employee_email || ""} onChange={handleChange}
                    className={`form-input${errors.employee_email ? " error" : ""}`}
                  />
                  {errors.employee_email && <span className="field-error"><AlertCircle size={10}/>{errors.employee_email}</span>}
                </div>
                <div className="field-wrap">
                  <label className="field-label"><Phone size={12}/> Phone Number</label>
                  <input type="text" name="employee_phonenumber"
                    value={formData.employee_phonenumber || ""} onChange={handleChange}
                    className={`form-input${errors.employee_phonenumber ? " error" : ""}`}
                  />
                  {errors.employee_phonenumber && <span className="field-error"><AlertCircle size={10}/>{errors.employee_phonenumber}</span>}
                </div>
                <div className="field-wrap">
                  <label className="field-label"><Fingerprint size={12}/> CNIC (13 Digits)</label>
                  <input type="text" name="employee_cnicnumber"
                    value={formData.employee_cnicnumber || ""} onChange={handleChange}
                    className={`form-input${errors.employee_cnicnumber ? " error" : ""}`}
                  />
                  {errors.employee_cnicnumber && <span className="field-error"><AlertCircle size={10}/>{errors.employee_cnicnumber}</span>}
                </div>
                <div className="field-wrap">
                  <label className="field-label">Date of Birth</label>
                  <input type="date" name="employee_dob"
                    value={fmt(formData.employee_dob)} onChange={handleChange}
                    className={`form-input${errors.employee_dob ? " error" : ""}`}
                  />
                  {errors.employee_dob && <span className="field-error"><AlertCircle size={10}/>{errors.employee_dob}</span>}
                </div>
                <div className="field-wrap">
                  <label className="field-label">Marital Status</label>
                  <select name="employee_maritalstatus"
                    value={formData.employee_maritalstatus || "Single"} onChange={handleChange}
                    className="status-select"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── Professional & Employment ── */}
            <div className="section-card">
              <div className="section-header">
                <div className="section-header-left">
                  <div style={{ padding: 6, borderRadius: 8 }}>
                    <Briefcase size={16} style={{ color: "#7c3aed" }} />
                  </div>
                  <h2>Professional &amp; Employment Details</h2>
                </div>
              </div>
              <div className="field-grid-3">
                <div className="field-wrap">
                  <label className="field-label"><Milestone size={12}/> Department</label>
                  <input type="text" name="employee_department"
                    value={formData.employee_department || ""} onChange={handleChange}
                    className={`form-input${errors.employee_department ? " error" : ""}`}
                  />
                  {errors.employee_department && <span className="field-error"><AlertCircle size={10}/>{errors.employee_department}</span>}
                </div>
                <div className="field-wrap">
                  <label className="field-label"><Briefcase size={12}/> Designation</label>
                  <input type="text" name="employee_designation"
                    value={formData.employee_designation || ""} onChange={handleChange}
                    className={`form-input${errors.employee_designation ? " error" : ""}`}
                  />
                  {errors.employee_designation && <span className="field-error"><AlertCircle size={10}/>{errors.employee_designation}</span>}
                </div>
                <div className="field-wrap">
                  <label className="field-label"><GraduationCap size={12}/> Qualification</label>
                  <input type="text" name="employee_qualification"
                    value={formData.employee_qualification || ""} onChange={handleChange}
                    className={`form-input${errors.employee_qualification ? " error" : ""}`}
                  />
                  {errors.employee_qualification && <span className="field-error"><AlertCircle size={10}/>{errors.employee_qualification}</span>}
                </div>
                <div className="field-wrap">
                  <label className="field-label"><CalendarDays size={12}/> Joining Date</label>
                  <input type="date" name="employee_joiningdate"
                    value={fmt(formData.employee_joiningdate)} onChange={handleChange}
                    className={`form-input${errors.employee_joiningdate ? " error" : ""}`}
                  />
                  {errors.employee_joiningdate && <span className="field-error"><AlertCircle size={10}/>{errors.employee_joiningdate}</span>}
                </div>
                <div className="field-wrap">
                  <label className="field-label"><CalendarDays size={12}/>Medical Leaves</label>
                  <input type="number" name="medical_leaves"
                    value={formData.medical_leaves || "0"} onChange={handleChange}
                    className={`form-input${errors.medical_leaves ? " error" : ""}`}
                  />
                  {errors.medical_leaves && <span className="field-error"><AlertCircle size={10}/>{errors.medical_leaves}</span>}
                </div>
                <div className="field-wrap">
                  <label className="field-label"><CalendarDays size={12}/>Special Leaves</label>
                  <input type="number" name="special_leaves"
                    value={formData.special_leaves || "0"} onChange={handleChange}
                    className={`form-input${errors.special_leaves ? " error" : ""}`}
                  />
                  {errors.special_leaves && <span className="field-error"><AlertCircle size={10}/>{errors.special_leaves}</span>}
                </div>
                <div className="field-wrap">
                  <label className="field-label"><User size={12}/>Employment Status</label>
                  <select
                    name="employment_status"
                    value={formData.employment_status || "Probation"}
                    onChange={handleChange}
                    className="status-select"
                  >
                    <option value="Probation">Probation</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Terminated">Terminated</option>
                    <option value="Ex">Ex</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── Shift & Compensation ── */}
            <div className="section-card">
              <div className="section-header">
                <div className="section-header-left">
                  <div style={{ padding: 6, borderRadius: 8 }}>
                    <Clock size={16} style={{ color: "#f59e0b" }} />
                  </div>
                  <h2>Shift & Compensation Settings</h2>
                </div>
              </div>
              <div className="field-grid-3">
                <div className="field-wrap">
                  <label className="field-label">Salary Basis</label>
                  <select
                    name="salary_basis"
                    value={formData.salary_basis || "Monthly"}
                    onChange={handleChange}
                    className="status-select"
                  >
                    <option value="Monthly">Monthly Fixed Salary</option>
                    <option value="Hourly">Hourly Basis</option>
                  </select>
                </div>
                <div className="field-wrap">
                  <label className="field-label"><Banknote size={12}/> Salary Amount (PKR)</label>
                  <input type="number" name="employee_salary"
                    value={formData.employee_salary || "0"} onChange={handleChange}
                    className={`form-input${errors.employee_salary ? " error" : ""}`}
                    style={{ fontFamily: "monospace" }}
                  />
                  {errors.employee_salary && <span className="field-error"><AlertCircle size={10}/>{errors.employee_salary}</span>}
                </div>
                <div className="field-wrap">
                  <label className="field-label"><Clock size={12}/> Shift Name</label>
                  <input type="text" name="shift_name"
                    value={formData.shift_name || "Standard Morning"} onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="field-wrap">
                  <label className="field-label">Expected Daily Hours</label>
                  <input type="number" step="0.5" name="expected_hours_per_day"
                    value={formData.expected_hours_per_day || "8.0"} onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="field-wrap">
                  <label className="field-label">Shift Start Time</label>
                  <input type="text" name="shift_start_time"
                    value={formData.shift_start_time || "09:00 AM"} onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="field-wrap">
                  <label className="field-label">Shift End Time</label>
                  <input type="text" name="shift_end_time"
                    value={formData.shift_end_time || "05:00 PM"} onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* ── Bank & Disbursement Details ── */}
            <div className="section-card">
              <div className="section-header">
                <div className="section-header-left">
                  <div style={{ padding: 6, borderRadius: 8 }}>
                    <Landmark size={16} style={{ color: "#10b981" }} />
                  </div>
                  <h2>Bank &amp; Disbursement Details</h2>
                </div>
              </div>
              <div className="field-grid-3">
                <div className="field-wrap">
                  <label className="field-label">Bank Name</label>
                  <input type="text" name="bank_name"
                    value={formData.bank_name || ""} onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="field-wrap">
                  <label className="field-label">Account Title</label>
                  <input type="text" name="account_title"
                    value={formData.account_title || ""} onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="field-wrap">
                  <label className="field-label">Account Number</label>
                  <input type="text" name="account_number"
                    value={formData.account_number || ""} onChange={handleChange}
                    className="form-input"
                    style={{ fontFamily: "monospace" }}
                  />
                </div>
                <div className="field-wrap">
                  <label className="field-label">IBAN</label>
                  <input type="text" name="iban"
                    value={formData.iban || ""} onChange={handleChange}
                    className="form-input"
                    style={{ fontFamily: "monospace" }}
                  />
                </div>
              </div>
            </div>

            {/* ── Custom Leave Allotments ── */}
            <div className="section-card">
              <div className="section-header">
                <div className="section-header-left">
                  <div style={{ padding: 6, borderRadius: 8 }}>
                    <Sparkles size={16} style={{ color: "#a78bfa" }} />
                  </div>
                  <h2>Custom Leave Allotments</h2>
                </div>
                <button type="button" className="toggle-btn" onClick={() => setIsSectionOpen(!isSectionOpen)}>
                  {isSectionOpen
                    ? <><ChevronUp size={13}/> Collapse</>
                    : <><Plus size={13}/> Add Allotment</>}
                </button>
              </div>

              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, margin: 0 }}>
                  Manage custom leave categories allotted to this employee.
                </p>

                {customAllotments.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                    {customAllotments.map(a => (
                      <div className="allot-card" key={a.key}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: 0 }}>{a.title}</p>
                          <p style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", margin: "3px 0 0" }}>
                            {a.quantity} days allotted
                          </p>
                        </div>
                        <button type="button" className="remove-allot-btn" onClick={() => handleRemoveAllotment(a.key)} title="Remove">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    padding: "32px 0", textAlign: "center",
                    border: "1.5px dashed #e2e8f0", borderRadius: 12,
                    background: "#fafbfc",
                  }}>
                    <p style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, margin: 0 }}>
                      No custom leaves allotted yet
                    </p>
                    {!isSectionOpen && (
                      <button type="button"
                        onClick={() => setIsSectionOpen(true)}
                        style={{ marginTop: 6, fontSize: 12, fontWeight: 700, color: "#6366f1", background: "none", border: "none", cursor: "pointer" }}
                      >
                        + Set up a custom allotment
                      </button>
                    )}
                  </div>
                )}

                {isSectionOpen && (
                  <div style={{
                    padding: 18, background: "#fafbff",
                    border: "1.5px solid #e0e7ff", borderRadius: 14,
                    display: "flex", flexDirection: "column", gap: 14,
                  }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                      New Custom Allotment
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, alignItems: "end" }}>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
                          Leave Type
                        </label>
                        <select
                          value={selectedLeaveTypeId}
                          onChange={e => setSelectedLeaveTypeId(e.target.value)}
                          className="status-select"
                          style={{ fontSize: 13 }}
                        >
                          <option value="">Choose leave type…</option>
                          {availableLeaveTypes.map(t => (
                            <option key={t._id} value={t._id}>
                              {t.leave_type_title} ({t.leave_type_annual_quantity} days)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
                          Days
                        </label>
                        <input
                          type="number" min="0"
                          value={allotQuantity}
                          onChange={e => setAllotQuantity(e.target.value)}
                          className="form-input"
                          style={{ width: 90, fontFamily: "monospace" }}
                        />
                      </div>

                      <button type="button" className="allot-btn" style={{ width: "auto", padding: "10px 18px", alignSelf: "flex-end" }}
                        onClick={handleAddAllotment}>
                        <Plus size={14}/> Allot
                      </button>
                    </div>

                    {availableLeaveTypes.length === 0 && configuredLeaveTypes.length > 0 && (
                      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 9, padding: "10px 14px" }}>
                        <p style={{ fontSize: 12, color: "#b45309", fontWeight: 600, margin: 0 }}>
                          All configured leave types are already allotted.
                        </p>
                      </div>
                    )}
                    {configuredLeaveTypes.length === 0 && (
                      <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 9, padding: "10px 14px" }}>
                        <p style={{ fontSize: 12, color: "#be123c", fontWeight: 600, margin: 0 }}>
                          No leave types configured yet. Set them up in the Leave Types module.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Footer Actions ── */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "flex-end",
              gap: 12, paddingTop: 8, paddingBottom: 24, flexWrap: "wrap",
            }}>
              <button type="button" className="discard-btn" onClick={() => navigate(-1)}>
                Discard Changes
              </button>
              <button type="submit" className="save-btn" disabled={isUpdating}>
                {isUpdating
                  ? <><Loader2 size={16} className="spin"/> Updating…</>
                  : <><Save size={16}/> Save & Apply Updates</>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateEmployee;