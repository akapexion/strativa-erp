import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft, Save, User, Briefcase,
  Phone, Mail, Fingerprint, Milestone,
  GraduationCap, Landmark, Banknote, CalendarDays,
  Sparkles, Plus, Trash2, Loader2, ChevronDown, ChevronUp,
  AlertCircle,
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

  /* Back button */
  .back-btn {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 13px; font-weight: 700; color: #64748b;
    background: #fff; border: 1.5px solid #e8ecf0;
    border-radius: 10px; padding: 8px 14px;
    cursor: pointer; transition: all 0.15s;
    text-decoration: none;
  }
  .back-btn:hover { background: #f8fafc; color: #4f46e5; border-color: #c7d2fe; }

  /* Save button */
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

  /* Discard button */
  .discard-btn {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 14px; font-weight: 700; color: #64748b;
    background: none; border: 1.5px solid #e8ecf0;
    border-radius: 12px; padding: 12px 22px;
    cursor: pointer; transition: all 0.15s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .discard-btn:hover { background: #f8fafc; border-color: #cbd5e1; color: #475569; }

  /* Section card */
  .section-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }

  /* Section header */
  .section-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 24px;
    border-bottom: 1px solid #e8ecf0;
  }
  .section-header-left { display: flex; align-items: center; gap: 10px; }
  .section-header h2 {
    font-size: 11px; font-weight: 800;
    color: #000; text-transform: uppercase; letter-spacing: 0.12em; margin: 0;
  }

  /* Form grid */
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    padding: 24px;
  }

  /* Field wrapper */
  .field-wrap { display: flex; flex-direction: column; }

  /* Field label */
  .field-label {
    display: flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 800;
    color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;
    margin-bottom: 6px;
  }

  /* Form input */
  .form-input {
    font-family: 'Plus Jakarta Sans', sans-serif;
    width: 100%; padding: 10px 14px;
    border-radius: 10px;
    border: 1.5px solid #e8ecf0;
    outline: none; font-size: 13px; font-weight: 500; color: #1e293b;
    background: #fafbfc;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    box-sizing: border-box;
  }
  .form-input::placeholder { color: #c0cad6; }
  .form-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
    background: #fff;
  }
  .form-input.error {
    border-color: #f43f5e;
    background: #fff1f2;
  }
  .form-input.error:focus {
    box-shadow: 0 0 0 3px rgba(244,63,94,0.1);
  }
  .form-input.emerald:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
  }

  /* Error message */
  .field-error {
    font-size: 11px; font-weight: 600; color: #f43f5e;
    margin-top: 5px; display: flex; align-items: center; gap: 4px;
  }

  /* Status select */
  .status-select {
    font-family: 'Plus Jakarta Sans', sans-serif;
    width: 100%; padding: 10px 14px;
    border-radius: 10px; border: 1.5px solid #e8ecf0;
    outline: none; font-size: 13px; font-weight: 600; color: #1e293b;
    background: #fafbfc; cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box; appearance: none;
  }
  .status-select:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
    background: #fff;
  }

  /* Allotment card */
  .allot-card {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px;
    background: #fafbfc; border: 1.5px solid #f1f5f9;
    border-radius: 12px;
    transition: border-color 0.12s, box-shadow 0.12s;
  }
  .allot-card:hover { border-color: #c7d2fe; box-shadow: 0 2px 8px rgba(99,102,241,0.07); }

  /* Remove allotment button */
  .remove-allot-btn {
    padding: 6px; border-radius: 8px; border: none;
    background: #f8fafc; color: #94a3b8; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.12s, color 0.12s;
  }
  .remove-allot-btn:hover { background: #fff1f2; color: #f43f5e; }

  /* Allot leave button */
  .allot-btn {
    width: 100%; padding: 10px 16px;
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    border: none; border-radius: 10px;
    color: #fff; font-weight: 700; font-size: 13px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    cursor: pointer; transition: filter 0.15s, transform 0.15s;
    box-shadow: 0 4px 12px rgba(99,102,241,0.22);
  }
  .allot-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
  .allot-btn:active { transform: translateY(0); }

  /* Toggle collapse button */
  .toggle-btn {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700;
    color: #a5b4fc; background: rgba(255,255,255,0.07);
    border: 1px solid rgba(165,180,252,0.25);
    border-radius: 8px; padding: 6px 12px;
    cursor: pointer; transition: all 0.15s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .toggle-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }

  /* Spinner */
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .spin { animation: spin 1s linear infinite; }

  /* Loading screen */
  .loading-screen {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #f8fafc;
  }
  .loading-box {
    display: flex; flex-direction: column; align-items: center; gap: 14px;
  }
  .loading-ring {
    width: 44px; height: 44px;
    border: 3px solid #e0e7ff;
    border-top-color: #4f46e5;
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
  }
`;

// ─── Status badge colours ─────────────────────────────────────────────────────
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
        const typesRes = await axios.get("http://localhost:5000/admin/all-leave-types");
        let leaveTypesList = [];
        if (typesRes.data?.success) {
          leaveTypesList = typesRes.data.leave_types || [];
          setConfiguredLeaveTypes(leaveTypesList);
        }
        const empRes = await axios.get(`http://localhost:5000/admin/employee/${id}`);
        if (empRes.data.success) {
          const emp = empRes.data.employee;
          setFormData({
            ...emp,
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
      setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v[0]])));
      return;
    }
    setErrors({});
    setIsUpdating(true);
    try {
      const customObj = {};
      customAllotments.forEach(a => { customObj[a.key] = a.quantity; });
      const payload = {
        ...formData,
        alloted_leaves: {
          causual_leaves: formData.alloted_leaves?.causual_leaves || 0,
          medical_leaves: Number(formData.medical_leaves || 0),
          special_leaves: Number(formData.special_leaves || 0),
          annual_leaves:  formData.alloted_leaves?.annual_leaves || 0,
          ...customObj,
        },
      };
      const { data } = await axios.put(`http://localhost:5000/admin/update-employee/${id}`, payload);
      if (data.success) {
        gooeyToast.success("Employee Updated Successfully", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 } });
        navigate('/hr360/admin/employees');
      }
    } catch (err) {
      console.error(err);
      gooeyToast.error("Update failed. Please try again.", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 } });
    } finally {
      setIsUpdating(false);
    }
  };

  const fmt = (d) => d ? d.split('T')[0] : "";

  // ── Loading screen ─────────────────────────────────────────────────────────
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
            <div style={{ textAlign: "right" }}>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", margin: 0 }}>
                Update Profile
              </h1>
              <p style={{
                margin: "4px 0 0",
                fontSize: 11, fontWeight: 800,
                fontFamily: "monospace",
                letterSpacing: "0.1em",
                color: "#6366f1",
              }}>
                {formData.employee_code}
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateSubmit} className="space-y-5">

            {/* ── Personal Information ── */}
            <div className="section-card">
              <div className="section-header">
                <div className="section-header-left">
                  <div style={{ padding: 6, borderRadius: 8 }}>
                    <User size={16} style={{ color: "#60a5fa" }} />
                  </div>
                  <h2>Personal Information</h2>
                </div>
              </div>
              <div className="form-grid">
                {[
                  { label: "First Name",      name: "employee_fname",          icon: <User size={12}/> },
                  { label: "Last Name",       name: "employee_lname",          icon: <User size={12}/> },
                  { label: "Email Address",   name: "employee_email",          type: "email", icon: <Mail size={12}/> },
                  { label: "Phone Number",    name: "employee_phonenumber",    icon: <Phone size={12}/> },
                  { label: "CNIC Number",     name: "employee_cnicnumber",     icon: <Fingerprint size={12}/> },
                  { label: "Marital Status",  name: "employee_maritalstatus",  icon: <Milestone size={12}/> },
                  { label: "Date of Birth",   name: "employee_dob",            type: "date", icon: <CalendarDays size={12}/> },
                ].map(({ label, name, type = "text", icon }) => (
                  <div className="field-wrap" key={name}>
                    <label className="field-label">{icon}{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={type === "date" ? fmt(formData[name]) : (formData[name] || "")}
                      onChange={handleChange}
                      className={`form-input${errors[name] ? " error" : ""}`}
                    />
                    {errors[name] && (
                      <span className="field-error"><AlertCircle size={10}/>{errors[name]}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Employment Details ── */}
            <div className="section-card">
              <div className="section-header">
                <div className="section-header-left">
                  <div style={{ padding: 6, borderRadius: 8 }}>
                    <Briefcase size={16} style={{ color: "#34d399" }} />
                  </div>
                  <h2>Employment Details</h2>
                </div>
                {/* Live status pill */}
                <span style={{
                  fontSize: 10, fontWeight: 800, textTransform: "uppercase",
                  letterSpacing: "0.08em", padding: "3px 10px",
                  background: statusColor.bg, color: statusColor.color,
                  borderRadius: 99, border: `1px solid ${statusColor.color}22`,
                }}>
                  {formData.employment_status}
                </span>
              </div>
              <div className="form-grid">
                {[
                  { label: "Department",      name: "employee_department",       icon: <Landmark size={12}/> },
                  { label: "Designation",     name: "employee_designation",      icon: <Briefcase size={12}/> },
                  { label: "Qualification",   name: "employee_qualification",    icon: <GraduationCap size={12}/> },
                  { label: "Salary Package",  name: "employee_salary",           icon: <Banknote size={12}/> },
                  { label: "Previous Org",    name: "employee_lastorganization", icon: <Milestone size={12}/> },
                  { label: "Joining Date",    name: "employee_joiningdate",      type: "date", icon: <CalendarDays size={12}/> },
                ].map(({ label, name, type = "text", icon }) => (
                  <div className="field-wrap" key={name}>
                    <label className="field-label">{icon}{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={type === "date" ? fmt(formData[name]) : (formData[name] || "")}
                      onChange={handleChange}
                      className={`form-input emerald${errors[name] ? " error" : ""}`}
                    />
                    {errors[name] && (
                      <span className="field-error"><AlertCircle size={10}/>{errors[name]}</span>
                    )}
                  </div>
                ))}

                {/* Medical Leaves */}
                <div className="field-wrap">
                  <label className="field-label"><CalendarDays size={12}/>Medical Leaves</label>
                  <input type="number" name="medical_leaves"
                    value={formData.medical_leaves || "0"} onChange={handleChange}
                    className={`form-input emerald${errors.medical_leaves ? " error" : ""}`}
                  />
                  {errors.medical_leaves && <span className="field-error"><AlertCircle size={10}/>{errors.medical_leaves}</span>}
                </div>

                {/* Special Leaves */}
                <div className="field-wrap">
                  <label className="field-label"><CalendarDays size={12}/>Special Leaves</label>
                  <input type="number" name="special_leaves"
                    value={formData.special_leaves || "0"} onChange={handleChange}
                    className={`form-input emerald${errors.special_leaves ? " error" : ""}`}
                  />
                  {errors.special_leaves && <span className="field-error"><AlertCircle size={10}/>{errors.special_leaves}</span>}
                </div>

                {/* Employment Status */}
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

                {/* Allotment cards */}
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

                {/* Collapsible builder */}
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