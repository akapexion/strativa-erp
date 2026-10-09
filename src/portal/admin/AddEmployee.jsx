import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  UserPlus,
  Briefcase,
  GraduationCap,
  Calendar,
  Building2,
  UserCog,
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { gooeyToast } from "goey-toast";
import { z } from "zod";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .page-root * { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* Subtle page bg */
  .page-root { background: #f8fafc; }

  /* Sticky header shadow */
  .page-header {
    background: #fff;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
  }

  /* Save button */
  .save-btn {
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    box-shadow: 0 4px 14px rgba(99,102,241,0.3);
    transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
  }
  .save-btn:hover {
    filter: brightness(1.08);
    box-shadow: 0 6px 20px rgba(99,102,241,0.4);
    transform: translateY(-1px);
  }
  .save-btn:active { transform: translateY(0); }

  /* Section card */
  .section-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }

  /* Section header accent bar */
  .section-header {
    border-bottom: 1px solid #f8fafc;
    background: #fafbfc;
  }
  .section-header-icon {
    padding: 8px;
    border-radius: 10px;
  }

  /* Input base */
  .field-input {
    width: 100%;
    padding: 10px 16px;
    border-radius: 12px;
    border: 1.5px solid #e8ecf0;
    outline: none;
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    background: #fff;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .field-input::placeholder { color: #c0cad6; font-weight: 400; }
  .field-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
    background: #fff;
  }
  .field-input.has-error {
    border-color: #f87171;
    background: #fff8f8;
  }
  .field-input.has-error:focus {
    box-shadow: 0 0 0 3px rgba(248,113,113,0.12);
  }

  /* Input with left icon */
  .input-icon-wrap { position: relative; }
  .input-icon-wrap .field-input { padding-left: 42px; }
  .input-icon-wrap .input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: #b0bec5; pointer-events: none;
    transition: color 0.15s;
  }
  .input-icon-wrap:focus-within .input-icon { color: #6366f1; }

  /* Select arrow */
  select.field-input { cursor: pointer; appearance: none; }

  /* Error text */
  .error-msg { font-size: 11px; color: #ef4444; font-weight: 600; margin-top: 4px; }

  /* Label */
  .field-label {
    font-size: 12px; font-weight: 700; color: #64748b;
    text-transform: uppercase; letter-spacing: 0.06em;
    margin-bottom: 6px; display: block;
  }

  /* Manager toggle */
  .toggle-wrap {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1.5px solid #e8ecf0;
    background: #fafbfc;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    user-select: none;
  }
  .toggle-wrap:hover { border-color: #6366f1; background: #f5f3ff; }
  input[type="checkbox"].toggle-check { display: none; }
  .toggle-pill {
    width: 36px; height: 20px;
    border-radius: 99px;
    background: #e2e8f0;
    position: relative;
    flex-shrink: 0;
    transition: background 0.2s;
  }
  .toggle-pill::after {
    content: '';
    position: absolute; top: 3px; left: 3px;
    width: 14px; height: 14px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }
  .toggle-wrap.checked .toggle-pill { background: #6366f1; }
  .toggle-wrap.checked .toggle-pill::after { transform: translateX(16px); }

  /* Custom allotment card */
  .allot-card {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px;
    border: 1.5px solid #f0f0f8;
    border-radius: 14px;
    background: #fafbff;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .allot-card:hover {
    border-color: #c7d2fe;
    box-shadow: 0 2px 8px rgba(99,102,241,0.08);
  }
  .remove-btn { transition: background 0.12s, color 0.12s; border-radius: 8px; padding: 6px; }
  .remove-btn:hover { background: #fff1f2; color: #f43f5e; }

  /* Empty state */
  .empty-state {
    border: 2px dashed #e8ecf4;
    border-radius: 14px;
    background: #fafbfc;
    padding: 32px 16px;
    text-align: center;
  }

  /* Allotment builder */
  .builder-box {
    border: 1.5px solid #e8eeff;
    border-radius: 14px;
    background: #f9f8ff;
    padding: 20px;
  }

  /* Add leave btn */
  .add-leave-btn {
    background: linear-gradient(135deg, #6366f1, #818cf8);
    box-shadow: 0 3px 10px rgba(99,102,241,0.25);
    transition: filter 0.15s, box-shadow 0.15s, transform 0.15s;
    border-radius: 12px;
    color: #fff;
    font-weight: 700;
    font-size: 13px;
    padding: 10px;
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .add-leave-btn:hover {
    filter: brightness(1.08);
    box-shadow: 0 5px 16px rgba(99,102,241,0.35);
    transform: translateY(-1px);
  }

  /* Alert boxes */
  .alert-amber {
    background: #fffbeb; border: 1px solid #fde68a;
    color: #92400e; border-radius: 10px; padding: 10px 14px;
    font-size: 12px; font-weight: 600;
  }
  .alert-rose {
    background: #fff1f2; border: 1px solid #fecdd3;
    color: #9f1239; border-radius: 10px; padding: 10px 14px;
    font-size: 12px; font-weight: 600;
  }

  /* Collapse toggle btn */
  .collapse-btn {
    font-size: 12px; font-weight: 700;
    padding: 6px 14px; border-radius: 8px;
    transition: background 0.12s, color 0.12s;
    cursor: pointer;
  }

  /* File input */
  input[type="file"].field-input { padding: 7px 12px; }
  input[type="file"]::file-selector-button {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12px; font-weight: 700;
    color: #6366f1;
    background: #eef2ff;
    border: none; border-radius: 6px;
    padding: 4px 10px; margin-right: 10px;
    cursor: pointer;
    transition: background 0.12s;
  }
  input[type="file"]::file-selector-button:hover { background: #e0e7ff; }

  /* Back button */
  .back-btn {
    padding: 8px; border-radius: 10px;
    color: #64748b;
    transition: background 0.12s, color 0.12s;
  }
  .back-btn:hover { background: #f1f5f9; color: #334155; }

  /* Discard btn */
  .discard-btn {
    font-size: 13px; font-weight: 700; color: #94a3b8;
    padding: 8px 14px; border-radius: 10px;
    transition: background 0.12s, color 0.12s;
  }
  .discard-btn:hover { background: #f8fafc; color: #64748b; }
`;

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const employeeSchema = z.object({
  employee_fname: z.string().min(1, "First name is required").max(50),
  employee_lname: z.string().min(1, "Last name is required").max(50),
  employee_email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  employee_phonenumber: z.string().min(1, "Phone number is required").regex(/^\+?[0-9\s\-]{7,15}$/, "Enter a valid phone number"),
  employee_cnicnumber: z.string().min(1, "CNIC is required").regex(/^\d{5}\d{7}\d{1}$/, "CNIC must be 13 digits"),
  employee_dob: z.string().min(1, "Date of birth is required").refine((val) => {
    const age = new Date().getFullYear() - new Date(val).getFullYear();
    return age >= 18;
  }, "Employee must be at least 18 years old"),
  employee_maritalstatus: z.enum(["Single", "Married", "Other"]),
  employee_department: z.string().min(1, "Department is required"),
  employee_designation: z.string().min(1, "Designation is required"),
  employee_qualification: z.string().min(1, "Qualification is required").max(100),
  employee_lastorganization: z.string().max(100).optional(),
  employee_salary: z.string().min(1, "Salary is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Must be a positive number" }),
  employee_joiningdate: z.string().min(1, "Joining date is required"),
  is_manager: z.boolean(),
  medical_leaves: z.string().min(1, "Required").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, { message: "Must be a non-negative number" }),
  special_leaves: z.string().min(1, "Required").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, { message: "Must be a non-negative number" }),
  employment_status: z.enum(["Probation", "Permanent", "Terminated", "Ex"]),
});

/* ── Field component ── */
const Field = ({ label, error, children }) => (
  <div>
    <label className="field-label">{label}</label>
    {children}
    {error && <p className="error-msg">⚠ {error}</p>}
  </div>
);

const AddEmployee = () => {
  const navigate = useNavigate();

  const initialFormData = {
    employee_fname: "", employee_lname: "", employee_email: "",
    employee_phonenumber: "", employee_cnicnumber: "", employee_dob: "",
    employee_maritalstatus: "Single", employee_department: "",
    employee_designation: "", employee_qualification: "",
    employee_lastorganization: "", employee_salary: "",
    employee_joiningdate: "", employee_image: null,
    is_manager: false, medical_leaves: "5", special_leaves: "5",
    employment_status: "Probation",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [configuredLeaveTypes, setConfiguredLeaveTypes] = useState([]);
  const [customAllotments, setCustomAllotments] = useState([]);
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [selectedLeaveTypeId, setSelectedLeaveTypeId] = useState("");
  const [allotQuantity, setAllotQuantity] = useState("0");

  const formatLeaveKey = (title) => {
    let n = title.toLowerCase().trim();
    if (n.endsWith("leave")) n = n.slice(0, -5).trim() + "_leaves";
    else if (n.endsWith("leaves")) n = n.slice(0, -6).trim() + "_leaves";
    else n = n + "_leaves";
    return n.replace(/[\s\-]+/g, "_");
  };

  useEffect(() => {
    axios.get("http://localhost:5000/admin/all-leave-types")
      .then(r => { if (r.data?.success) setConfiguredLeaveTypes(r.data.leave_types || []); })
      .catch(console.error);
  }, []);

  const handleAddAllotment = () => {
    if (!selectedLeaveTypeId) { gooeyToast.error("Please select a leave type", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2000 } }); return; }
    const qty = Number(allotQuantity);
    if (isNaN(qty) || qty < 0) { gooeyToast.error("Enter a valid number of days", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2000 } }); return; }
    const leaveType = configuredLeaveTypes.find(t => t._id === selectedLeaveTypeId);
    if (!leaveType) return;
    const key = formatLeaveKey(leaveType.leave_type_title);
    if (customAllotments.find(i => i.key === key)) { gooeyToast.error(`"${leaveType.leave_type_title}" already allotted!`, { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2000 } }); return; }
    setCustomAllotments([...customAllotments, { id: leaveType._id, title: leaveType.leave_type_title, key, quantity: qty }]);
    setSelectedLeaveTypeId(""); setAllotQuantity("0");
    gooeyToast.success(`Added ${leaveType.leave_type_title} (${qty} days)`, { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 1500 } });
  };

  const handleRemoveAllotment = (key) => {
    setCustomAllotments(customAllotments.filter(i => i.key !== key));
    gooeyToast.success("Allotment removed", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 1500 } });
  };

  const availableLeaveTypes = configuredLeaveTypes.filter(type => {
    const key = formatLeaveKey(type.leave_type_title);
    if (["causual_leaves","medical_leaves","special_leaves","annual_leaves"].includes(key)) return false;
    return !customAllotments.some(a => a.key === key);
  });

  const departmentDesignations = {
    "Human Resources": ["HR Head", "HR Manager", "Recruiter"],
    "Software Engineering": ["Frontend Developer", "Backend Developer", "Software Engineer"],
    "Finance": ["Accounts Executive", "Finance Manager"],
    "Sales": ["Sales Executive", "Sales Manager"],
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setErrors(prev => ({ ...prev, [name]: undefined }));
    if (name === "employee_department") setFormData({ ...formData, employee_department: value, employee_designation: "" });
    else setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async () => {
    const result = employeeSchema.safeParse(formData);
    if (!result.success) {
      const fe = result.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fe).map(([k, msgs]) => [k, msgs[0]])));
      return;
    }
    setErrors({});
    try {
      const data = new FormData();
      for (let key in formData) data.append(key, formData[key]);
      const cl = {};
      customAllotments.forEach(i => { cl[i.key] = i.quantity; });
      data.append("custom_leaves", JSON.stringify(cl));
      const res = await axios.post("http://localhost:5000/admin/add-employee", data, { headers: { "Content-Type": "multipart/form-data" } });
      gooeyToast.success(res.data.message || "Employee added successfully", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 } });
      setFormData(initialFormData); setErrors({}); setCustomAllotments([]); setIsSectionOpen(false);
      if (document.querySelector('input[type="file"]')) document.querySelector('input[type="file"]').value = null;
    } catch (error) {
      gooeyToast.error(error.response?.data?.message || "Error adding employee", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 } });
    }
  };

  const ic = (e) => `field-input${e ? " has-error" : ""}`;

  return (
    <>
      <style>{styles}</style>
      <div className="page-root min-h-screen">

        {/* ── Sticky Header ── */}
        <div className="page-header px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="back-btn cursor-pointer">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 leading-tight tracking-tight">Add New Employee</h1>
              <p className="text-[11px] text-slate-400 font-medium">Fill in the details below to onboard a new team member</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="discard-btn cursor-pointer">Discard</button>
            <button onClick={handleSubmit} className="save-btn flex items-center gap-2 px-5 py-2.5 text-white text-sm font-bold rounded-xl cursor-pointer">
              <Save size={15} strokeWidth={2.5} />
              Save Profile
            </button>
          </div>
        </div>

        {/* ── Main ── */}
        <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">

          {/* Personal Details */}
          <div className="section-card">
            <div className="section-header px-7 py-4 flex items-center gap-3">
              <div className="section-header-icon bg-blue-50">
                <UserPlus size={16} className="text-blue-500" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">Personal Details</h2>
                <p className="text-[11px] text-slate-400 font-medium">Basic identity and contact information</p>
              </div>
            </div>
            <div className="p-7 grid md:grid-cols-2 gap-5">

              <Field label="First Name" error={errors.employee_fname}>
                <input type="text" placeholder="John" name="employee_fname" value={formData.employee_fname} onChange={handleChange} className={ic(errors.employee_fname)} />
              </Field>

              <Field label="Last Name" error={errors.employee_lname}>
                <input type="text" placeholder="Doe" name="employee_lname" value={formData.employee_lname} onChange={handleChange} className={ic(errors.employee_lname)} />
              </Field>

              <Field label="Email Address" error={errors.employee_email}>
                <input type="email" placeholder="john@company.com" name="employee_email" value={formData.employee_email} onChange={handleChange} className={ic(errors.employee_email)} />
              </Field>

              <Field label="Phone Number" error={errors.employee_phonenumber}>
                <input type="tel" placeholder="+92 300 1234567" name="employee_phonenumber" value={formData.employee_phonenumber} onChange={handleChange} className={ic(errors.employee_phonenumber)} />
              </Field>

              <Field label="CNIC Number" error={errors.employee_cnicnumber}>
                <input type="text" placeholder="3420100000001" name="employee_cnicnumber" value={formData.employee_cnicnumber} onChange={handleChange} className={ic(errors.employee_cnicnumber)} />
              </Field>

              <Field label="Date of Birth" error={errors.employee_dob}>
                <input type="date" name="employee_dob" value={formData.employee_dob} onChange={handleChange} className={ic(errors.employee_dob)} />
              </Field>

              <Field label="Marital Status">
                <select name="employee_maritalstatus" value={formData.employee_maritalstatus} onChange={handleChange} className="field-input">
                  <option>Single</option><option>Married</option><option>Other</option>
                </select>
              </Field>

              <Field label="Employee Photo">
                <input type="file" onChange={(e) => setFormData({ ...formData, employee_image: e.target.files[0] })} className="field-input" />
              </Field>

            </div>
          </div>

          {/* Employment Details */}
          <div className="section-card">
            <div className="section-header px-7 py-4 flex items-center gap-3">
              <div className="section-header-icon bg-violet-50">
                <Briefcase size={16} className="text-violet-500" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">Employment Details</h2>
                <p className="text-[11px] text-slate-400 font-medium">Role, compensation, and HR settings</p>
              </div>
            </div>
            <div className="p-7 grid md:grid-cols-2 gap-5">

              <Field label="Department" error={errors.employee_department}>
                <div className="input-icon-wrap">
                  <Building2 size={16} className="input-icon" />
                  <select name="employee_department" value={formData.employee_department} onChange={handleChange} className={ic(errors.employee_department) + " field-input"} style={{ paddingLeft: 42 }}>
                    <option value="">Select Department</option>
                    {Object.keys(departmentDesignations).map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </Field>

              <Field label="Designation" error={errors.employee_designation}>
                <div className="input-icon-wrap">
                  <UserCog size={16} className="input-icon" />
                  <select name="employee_designation" value={formData.employee_designation} onChange={handleChange} disabled={!formData.employee_department} className={ic(errors.employee_designation) + " field-input"} style={{ paddingLeft: 42 }}>
                    <option value="">{formData.employee_department ? "Select Designation" : "Select Department First"}</option>
                    {(departmentDesignations[formData.employee_department] || []).map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </Field>

              <Field label="Qualification" error={errors.employee_qualification}>
                <div className="input-icon-wrap">
                  <GraduationCap size={16} className="input-icon" />
                  <input type="text" placeholder="e.g. Masters in CS" name="employee_qualification" value={formData.employee_qualification} onChange={handleChange} className={ic(errors.employee_qualification)} style={{ paddingLeft: 42 }} />
                </div>
              </Field>

              <Field label="Last Organization Served" error={errors.employee_lastorganization}>
                <input type="text" placeholder="Previous Company Name" name="employee_lastorganization" value={formData.employee_lastorganization} onChange={handleChange} className={ic(errors.employee_lastorganization)} />
              </Field>

              <Field label="Monthly Salary (PKR)" error={errors.employee_salary}>
                <input type="number" placeholder="0.00" name="employee_salary" value={formData.employee_salary} onChange={handleChange} className={ic(errors.employee_salary)} style={{ fontFamily: 'monospace' }} />
              </Field>

              <Field label="Joining Date" error={errors.employee_joiningdate}>
                <div className="input-icon-wrap">
                  <Calendar size={16} className="input-icon" />
                  <input type="date" name="employee_joiningdate" value={formData.employee_joiningdate} onChange={handleChange} className={ic(errors.employee_joiningdate)} style={{ paddingLeft: 42 }} />
                </div>
              </Field>

              <Field label="Medical Leaves Allotted" error={errors.medical_leaves}>
                <input type="number" name="medical_leaves" value={formData.medical_leaves} onChange={handleChange} className={ic(errors.medical_leaves)} />
              </Field>

              <Field label="Special Leaves Allotted" error={errors.special_leaves}>
                <input type="number" name="special_leaves" value={formData.special_leaves} onChange={handleChange} className={ic(errors.special_leaves)} />
              </Field>

              <Field label="Employment Status">
                <select name="employment_status" value={formData.employment_status} onChange={handleChange} className="field-input">
                  <option value="Probation">Probation</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Terminated">Terminated</option>
                  <option value="Ex">Ex</option>
                </select>
              </Field>

              {/* Manager toggle */}
              <div className="flex flex-col justify-end">
                <label className="field-label">Role</label>
                <label
                  htmlFor="is_manager_checkbox"
                  className={`toggle-wrap ${formData.is_manager ? "checked" : ""}`}
                >
                  <input type="checkbox" id="is_manager_checkbox" name="is_manager" checked={formData.is_manager} onChange={handleChange} className="toggle-check" />
                  <div className="toggle-pill" />
                  <div>
                    <p className="text-sm font-bold text-slate-700">Manager Access</p>
                    <p className="text-[11px] text-slate-400 font-medium">Grant team management permissions</p>
                  </div>
                </label>
              </div>

            </div>
          </div>

          {/* Custom Leave Allotments */}
          <div className="section-card">
            <div className="section-header px-7 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="section-header-icon bg-indigo-50">
                  <Sparkles size={16} className="text-indigo-500" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-800">Custom Leave Allotments</h2>
                  <p className="text-[11px] text-slate-400 font-medium">Assign extra leave categories for this employee</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSectionOpen(!isSectionOpen)}
                className={`collapse-btn ${isSectionOpen ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
              >
                {isSectionOpen ? "Collapse" : "+ Add Allotment"}
              </button>
            </div>

            <div className="p-7 space-y-5">
              {customAllotments.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {customAllotments.map(a => (
                    <div key={a.key} className="allot-card">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{a.title}</p>
                        <p className="text-xs font-semibold text-indigo-500 mt-0.5">{a.quantity} days allotted</p>
                      </div>
                      <button type="button" onClick={() => handleRemoveAllotment(a.key)} className="remove-btn text-slate-400 cursor-pointer">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p className="text-sm text-slate-400 font-semibold">No custom leaves allotted yet</p>
                  {!isSectionOpen && (
                    <button type="button" onClick={() => setIsSectionOpen(true)} className="mt-2 text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer">
                      + Set up a custom allotment
                    </button>
                  )}
                </div>
              )}

              {isSectionOpen && (
                <div className="builder-box space-y-4">
                  <p className="text-[11px] font-extrabold text-indigo-700 uppercase tracking-wider">New Allotment</p>
                  <div className="grid sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-6">
                      <label className="field-label">Leave Type</label>
                      <select value={selectedLeaveTypeId} onChange={e => setSelectedLeaveTypeId(e.target.value)} className="field-input">
                        <option value="">Choose leave type…</option>
                        {availableLeaveTypes.map(t => (
                          <option key={t._id} value={t._id}>{t.leave_type_title} ({t.leave_type_annual_quantity} days)</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-3">
                      <label className="field-label">Days</label>
                      <input type="number" min="0" value={allotQuantity} onChange={e => setAllotQuantity(e.target.value)} className="field-input" style={{ fontFamily: 'monospace' }} />
                    </div>
                    <div className="sm:col-span-3">
                      <button type="button" onClick={handleAddAllotment} className="add-leave-btn cursor-pointer">
                        <Plus size={15} strokeWidth={2.5} /> Allot
                      </button>
                    </div>
                  </div>

                  {availableLeaveTypes.length === 0 && configuredLeaveTypes.length > 0 && (
                    <p className="alert-amber">All configured leave types have already been allotted.</p>
                  )}
                  {configuredLeaveTypes.length === 0 && (
                    <p className="alert-rose">No custom leave types configured. Set them up in the Leave Types module first.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom save bar */}
          <div className="flex justify-end gap-3 pb-6">
         
            <button onClick={handleSubmit} className="save-btn flex items-center gap-2 px-6 py-2.5 text-white text-sm font-bold rounded-xl cursor-pointer">
              <Save size={15} strokeWidth={2.5} />
              Save Profile
            </button>
          </div>

        </main>
      </div>
    </>
  );
};

export default AddEmployee;