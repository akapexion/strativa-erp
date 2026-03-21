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

const AddEmployee = () => {
  const navigate = useNavigate();

  // Initial form state
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

  // Handle file input
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      employee_image: e.target.files[0],
    });
  };

  // Submit form
  const handleSubmit = async () => {
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
        },
      );

      // Show success toast
      gooeyToast.success(res.data.message || "Employee added successfully", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });

      // Reset form
      setFormData(initialFormData);

      // Clear file input manually
      document.querySelector('input[type="file"]').value = null;
    } catch (error) {
      console.error(error);
      gooeyToast.error(
        error.response?.data?.message || "Error adding employee",
        {
          fillColor: "#FFF",
          bounce: 0.45,
          timing: { displayDuration: 2500 },
        },
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
              <label className="text-sm font-bold text-slate-700">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                name="employee_fname"
                value={formData.employee_fname}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                name="employee_lname"
                value={formData.employee_lname}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@company.com"
                name="employee_email"
                value={formData.employee_email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 234 567 890"
                name="employee_phonenumber"
                value={formData.employee_phonenumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                CNIC Number
              </label>
              <input
                type="text"
                placeholder="00000-0000000-0"
                name="employee_cnicnumber"
                value={formData.employee_cnicnumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="employee_dob"
                value={formData.employee_dob}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Marital Status
              </label>
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
              <label className="text-sm font-bold text-slate-700">
                Employee Image
              </label>
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
              <label className="text-sm font-bold text-slate-700">
                Department
              </label>
              <div className="relative">
                <Building2
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <select
                  name="employee_department"
                  value={formData.employee_department}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer appearance-none"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Designation
              </label>
              <div className="relative">
                <UserCog
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <select
                  name="employee_designation"
                  value={formData.employee_designation}
                  onChange={handleChange}
                  disabled={!formData.employee_department}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer appearance-none"
                >
                  <option value="">
                    {formData.employee_department
                      ? "Select Designation"
                      : "Select Department First"}
                  </option>

                  {formData.employee_department &&
                    departmentDesignations[formData.employee_department]?.map(
                      (desig) => (
                        <option key={desig} value={desig}>
                          {desig}
                        </option>
                      ),
                    )}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Qualification
              </label>
              <div className="relative">
                <GraduationCap
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="e.g. Masters in CS"
                  name="employee_qualification"
                  value={formData.employee_qualification}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Last Organization Served
              </label>
              <input
                type="text"
                placeholder="Previous Co. Name"
                name="employee_lastorganization"
                value={formData.employee_lastorganization}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Monthly Salary (PKR)
              </label>
              <input
                type="number"
                placeholder="0.00"
                name="employee_salary"
                value={formData.employee_salary}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Joining Date
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="date"
                  name="employee_joiningdate"
                  value={formData.employee_joiningdate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
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
