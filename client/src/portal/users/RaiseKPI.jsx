import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  TrendingUp,
  BookOpen,
  Percent,
  Layers,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { gooeyToast } from "goey-toast";
import { z } from "zod";

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const kpiSchema = z.object({
  kpi_batch: z
    .string()
    .min(1, "Batch is required")
    .max(50, "Batch must be under 50 characters"),

  kpi_batch_semester: z
    .string()
    .min(1, "Semester is required")
    .max(50, "Semester must be under 50 characters"),

  kpi_do_count: z
    .string()
    .min(1, "DO count is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "DO count must be a non-negative number",
    })
    .refine((val) => Number.isInteger(Number(val)), {
      message: "DO count must be a whole number",
    }),

  kpi_batch_attendence_percentage: z
    .string()
    .min(1, "Attendance percentage is required")
    .refine((val) => {
      const num = parseFloat(val.replace("%", "").trim());
      return !isNaN(num) && num >= 0 && num <= 100;
    }, "Attendance must be a valid percentage between 0 and 100"),
});
// ─────────────────────────────────────────────────────────────────────────────

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
  const [errors, setErrors] = useState({}); // ← new: holds field-level errors

  const handleChange = (e) => {
    // Clear the error for this field as the user types
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // ─── Zod Validation ───────────────────────────────────────────────────────
    const result = kpiSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const firstErrors = Object.fromEntries(
        Object.entries(fieldErrors).map(([key, msgs]) => [key, msgs[0]])
      );
      setErrors(firstErrors);
      gooeyToast.error("Please fix the errors before submitting.", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });
      return; // stop submission
    }

    setErrors({}); // clear errors on success
    // ─────────────────────────────────────────────────────────────────────────

    try {
      const res = await axios.post(
        "http://localhost:5000/user/raise-kpi",
        formData
      );

      gooeyToast.success(res.data.message || "KPI submitted successfully");
      setFormData(initialFormData);
      setErrors({});
    } catch (err) {
      gooeyToast.error(
        err.response?.data?.message || "Error submitting KPI"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Raise KPI</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">
            <TrendingUp size={16} />
            <Link to="/hr360/user/kpis">View Submissions</Link>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-bold text-slate-500"
          >
            Discard
          </button>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700"
          >
            <Save size={18} />
            Submit KPI
          </button>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* Employee Info */}
        <section className="bg-white rounded-2xl border border-gray-300 shadow-sm">
          <div className="px-8 py-5 border-b border-gray-300">
            <h2 className="font-bold text-slate-800">Employee Information</h2>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-slate-700">Employee Code</label>
              <input
                type="text"
                value={formData.employee_code}
                disabled
                className="w-full mt-2 px-4 py-2.5 rounded-xl border border-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">Employee Name</label>
              <input
                type="text"
                value={formData.employee_name}
                disabled
                className="w-full mt-2 px-4 py-2.5 rounded-xl border border-gray-300"
              />
            </div>
          </div>
        </section>

        {/* KPI Details */}
        <section className="bg-white rounded-2xl border border-gray-300 shadow-sm">
          <div className="px-8 py-5 border-b border-gray-300 flex items-center gap-2 text-purple-600">
            <BookOpen size={18} />
            <h2 className="font-bold text-slate-800">KPI Details</h2>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-6">

            {/* Batch */}
            <div>
              <label className="text-sm font-bold text-slate-700">Batch</label>
              <div className="relative mt-2">
                <Layers
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  name="kpi_batch"
                  value={formData.kpi_batch}
                  onChange={handleChange}
                  placeholder="Enter batch"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    errors.kpi_batch ? "border-red-400 bg-red-50" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.kpi_batch && (
                <p className="text-xs text-red-500 mt-1">{errors.kpi_batch}</p>
              )}
            </div>

            {/* Semester */}
            <div>
              <label className="text-sm font-bold text-slate-700">Semester</label>
              <div className="relative mt-2">
                <BookOpen
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  name="kpi_batch_semester"
                  value={formData.kpi_batch_semester}
                  onChange={handleChange}
                  placeholder="Enter semester"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    errors.kpi_batch_semester ? "border-red-400 bg-red-50" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.kpi_batch_semester && (
                <p className="text-xs text-red-500 mt-1">{errors.kpi_batch_semester}</p>
              )}
            </div>

            {/* DO Count */}
            <div>
              <label className="text-sm font-bold text-slate-700">DO Count</label>
              <div className="relative mt-2">
                <TrendingUp
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="number"
                  name="kpi_do_count"
                  value={formData.kpi_do_count}
                  onChange={handleChange}
                  placeholder="Enter DO count"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    errors.kpi_do_count ? "border-red-400 bg-red-50" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.kpi_do_count && (
                <p className="text-xs text-red-500 mt-1">{errors.kpi_do_count}</p>
              )}
            </div>

            {/* Attendance */}
            <div>
              <label className="text-sm font-bold text-slate-700">Attendance Percentage</label>
              <div className="relative mt-2">
                <Percent
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  name="kpi_batch_attendence_percentage"
                  value={formData.kpi_batch_attendence_percentage}
                  onChange={handleChange}
                  placeholder="e.g. 85%"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    errors.kpi_batch_attendence_percentage
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
              </div>
              {errors.kpi_batch_attendence_percentage && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.kpi_batch_attendence_percentage}
                </p>
              )}
            </div>

          </div>
        </section>

      </main>
    </div>
  );
};

export default KPIRaise;