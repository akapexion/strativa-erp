import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  UserPlus,
  Briefcase,
  GraduationCap,
  Calendar,
  Building2,
  UserCog,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { gooeyToast } from "goey-toast";
import { z } from "zod";

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const employeeSchema = z.object({
  employee_fname: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be under 50 characters"),

  employee_lname: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be under 50 characters"),

  employee_email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  employee_phonenumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9\s\-]{7,15}$/, "Enter a valid phone number"),

  employee_cnicnumber: z
    .string()
    .min(1, "CNIC is required")
    .regex(/^\d{5}\d{7}\d{1}$/, "CNIC format must be in proper format"),

  employee_dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => {
      const dob = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      return age >= 18;
    }, "Employee must be at least 18 years old"),

  employee_maritalstatus: z.enum(["Single", "Married", "Other"]),

  employee_department: z.string().min(1, "Department is required"),

  employee_designation: z.string().min(1, "Designation is required"),

  employee_qualification: z
    .string()
    .min(1, "Qualification is required")
    .max(100, "Qualification must be under 100 characters"),

  employee_lastorganization: z
    .string()
    .max(100, "Organization name must be under 100 characters")
    .optional(),

  employee_salary: z
    .string()
    .min(1, "Salary is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Salary must be a positive number",
    }),

  employee_joiningdate: z.string().min(1, "Joining date is required"),

  is_manager: z.boolean(),
});
// ─────────────────────────────────────────────────────────────────────────────

const AddEmployee = () => {
  const navigate = useNavigate();

  const initialFormData = {
    employee_fname: "",
    employee_lname: "",
    employee_email: "",
    employee_phonenumber: "",
    employee_cnicnumber: "",
    employee_dob: "",
    employee_maritalstatus: "Single",
    employee_department: "",
    employee_designation: "",
    employee_qualification: "",
    employee_lastorganization: "",
    employee_salary: "",
    employee_joiningdate: "",
    employee_image: null,
    is_manager: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({}); // ← new: holds field-level errors

  const departmentDesignations = {
    "Human Resources": ["HR Head", "HR Manager", "Recruiter"],
    "Software Engineering": [
      "Frontend Developer",
      "Backend Developer",
      "Software Engineer",
    ],
    Finance: ["Accounts Executive", "Finance Manager"],
    Sales: ["Sales Executive", "Sales Manager"],
  };

  const departments = Object.keys(departmentDesignations);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Clear the error for this field as the user types
    setErrors((prev) => ({ ...prev, [name]: undefined }));

    if (name === "employee_department") {
      setFormData({
        ...formData,
        employee_department: value,
        employee_designation: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      employee_image: e.target.files[0],
    });
  };

  const handleSubmit = async () => {
    // ─── Zod Validation ───────────────────────────────────────────────────────
    const result = employeeSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      // flatten() gives us { fieldName: ["error msg", ...], ... }
      // We pick the first message per field for display
      const firstErrors = Object.fromEntries(
        Object.entries(fieldErrors).map(([key, msgs]) => [key, msgs[0]])
      );
      setErrors(firstErrors);
      gooeyToast.error("Please correct the highlighted fields before submitting", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });
      return; // stop submission
    }

    setErrors({}); // clear errors on success
    // ─────────────────────────────────────────────────────────────────────────

    try {
      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }

      const res = await axios.post(
        "http://localhost:5000/admin/add-employee",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      gooeyToast.success(res.data.message || "Employee added successfully", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });

      setFormData(initialFormData);
      setErrors({});
      document.querySelector('input[type="file"]').value = null;
    } catch (error) {
      console.error(error);
      gooeyToast.error(
        error.response?.data?.message || "Error adding employee",
        {
          fillColor: "#FFF",
          bounce: 0.45,
          timing: { displayDuration: 2500 },
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Add New Employee
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
          >
            Discard
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            <Save size={18} />
            Save Profile
          </button>
        </div>
      </div>

      {/* Main Form */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Personal Details */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 text-blue-600">
            <UserPlus size={18} />
            <h2 className="font-bold text-slate-800">Personal Details</h2>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-6">

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">First Name</label>
              <input
                type="text"
                placeholder="John"
                name="employee_fname"
                value={formData.employee_fname}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.employee_fname ? "border-red-400 bg-red-50" : "border-slate-200"
                }`}
              />
              {errors.employee_fname && (
                <p className="text-xs text-red-500">{errors.employee_fname}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                name="employee_lname"
                value={formData.employee_lname}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.employee_lname ? "border-red-400 bg-red-50" : "border-slate-200"
                }`}
              />
              {errors.employee_lname && (
                <p className="text-xs text-red-500">{errors.employee_lname}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                placeholder="john@company.com"
                name="employee_email"
                value={formData.employee_email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.employee_email ? "border-red-400 bg-red-50" : "border-slate-200"
                }`}
              />
              {errors.employee_email && (
                <p className="text-xs text-red-500">{errors.employee_email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 234 567 890"
                name="employee_phonenumber"
                value={formData.employee_phonenumber}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.employee_phonenumber ? "border-red-400 bg-red-50" : "border-slate-200"
                }`}
              />
              {errors.employee_phonenumber && (
                <p className="text-xs text-red-500">{errors.employee_phonenumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">CNIC Number</label>
              <input
                type="text"
                placeholder="00000-0000000-0"
                name="employee_cnicnumber"
                value={formData.employee_cnicnumber}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.employee_cnicnumber ? "border-red-400 bg-red-50" : "border-slate-200"
                }`}
              />
              {errors.employee_cnicnumber && (
                <p className="text-xs text-red-500">{errors.employee_cnicnumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Date of Birth</label>
              <input
                type="date"
                name="employee_dob"
                value={formData.employee_dob}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.employee_dob ? "border-red-400 bg-red-50" : "border-slate-200"
                }`}
              />
              {errors.employee_dob && (
                <p className="text-xs text-red-500">{errors.employee_dob}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Marital Status</label>
              <select
                name="employee_maritalstatus"
                value={formData.employee_maritalstatus}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
              >
                <option>Single</option>
                <option>Married</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Employee Image</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
              />
            </div>

          </div>
        </section>

        {/* Employment Details */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 text-purple-600">
            <Briefcase size={18} />
            <h2 className="font-bold text-slate-800">Employment Details</h2>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-6">

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Department</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  name="employee_department"
                  value={formData.employee_department}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer appearance-none ${
                    errors.employee_department ? "border-red-400 bg-red-50" : "border-slate-200"
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              {errors.employee_department && (
                <p className="text-xs text-red-500">{errors.employee_department}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Designation</label>
              <div className="relative">
                <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  name="employee_designation"
                  value={formData.employee_designation}
                  onChange={handleChange}
                  disabled={!formData.employee_department}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer appearance-none ${
                    errors.employee_designation ? "border-red-400 bg-red-50" : "border-slate-200"
                  }`}
                >
                  <option value="">
                    {formData.employee_department ? "Select Designation" : "Select Department First"}
                  </option>
                  {formData.employee_department &&
                    departmentDesignations[formData.employee_department]?.map((desig) => (
                      <option key={desig} value={desig}>{desig}</option>
                    ))}
                </select>
              </div>
              {errors.employee_designation && (
                <p className="text-xs text-red-500">{errors.employee_designation}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Qualification</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="e.g. Masters in CS"
                  name="employee_qualification"
                  value={formData.employee_qualification}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.employee_qualification ? "border-red-400 bg-red-50" : "border-slate-200"
                  }`}
                />
              </div>
              {errors.employee_qualification && (
                <p className="text-xs text-red-500">{errors.employee_qualification}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Last Organization Served</label>
              <input
                type="text"
                placeholder="Previous Co. Name"
                name="employee_lastorganization"
                value={formData.employee_lastorganization}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.employee_lastorganization ? "border-red-400 bg-red-50" : "border-slate-200"
                }`}
              />
              {errors.employee_lastorganization && (
                <p className="text-xs text-red-500">{errors.employee_lastorganization}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Monthly Salary (PKR)</label>
              <input
                type="number"
                placeholder="0.00"
                name="employee_salary"
                value={formData.employee_salary}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none font-mono ${
                  errors.employee_salary ? "border-red-400 bg-red-50" : "border-slate-200"
                }`}
              />
              {errors.employee_salary && (
                <p className="text-xs text-red-500">{errors.employee_salary}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Joining Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  name="employee_joiningdate"
                  value={formData.employee_joiningdate}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.employee_joiningdate ? "border-red-400 bg-red-50" : "border-slate-200"
                  }`}
                />
              </div>
              {errors.employee_joiningdate && (
                <p className="text-xs text-red-500">{errors.employee_joiningdate}</p>
              )}
            </div>

            <div className="space-y-2 space-x-3">
              <input
                type="checkbox"
                name="is_manager"
                checked={formData.is_manager}
                onChange={handleChange}
              />
              <label>Is he a Manager?</label>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default AddEmployee;