import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  TrendingUp,
  Calendar,
  Star,
  BadgeCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { gooeyToast } from "goey-toast";

const RaiseAppraisal = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const initialFormData = {
    employee_code: user?.user_code || "",
    employee_name: user?.user_fullname || "",
    employee_image :user?.user_image || "",
    joining_date: "",
    lastincrement_date: "",
    achievements: "",
    sep_qualification: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/user/raise-appraisal",
        formData
      );

      gooeyToast.success(res.data.message || "Appraisal submitted successfully", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });

      setFormData(initialFormData);
    } catch (error) {
      console.error(error);
      gooeyToast.error(
        error.response?.data?.message || "Error submitting appraisal",
        {
          fillColor: "#FFF",
          bounce: 0.45,
          timing: { displayDuration: 2500 },
        }
      );
    }
  };

  // Compute duration since last increment
  const getDuration = () => {
    if (!formData.lastincrement_date) return null;
    const from = new Date(formData.lastincrement_date);
    const now = new Date();
    const totalMonths =
      (now.getFullYear() - from.getFullYear()) * 12 +
      (now.getMonth() - from.getMonth());
    if (totalMonths < 0) return null;
    const yrs = Math.floor(totalMonths / 12);
    const mo = totalMonths % 12;
    const parts = [];
    if (yrs > 0) parts.push(`${yrs} ${yrs === 1 ? "year" : "years"}`);
    if (mo > 0) parts.push(`${mo} ${mo === 1 ? "month" : "months"}`);
    return parts.length ? parts.join(", ") : "Less than a month";
  };

  const duration = getDuration();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Raise Appraisal
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all"
          >
            <TrendingUp size={16} />
            <Link to="/hr360/user/appraisals">
            View Submissions
            </Link>
          </button>
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
            Submit Appraisal
          </button>
        </div>
      </div>

      {/* Main Form */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* Employment Timeline */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 text-blue-600">
            <Calendar size={18} />
            <h2 className="font-bold text-slate-800">Employment Timeline</h2>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-6">
            {/* Joining Date */}
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
                  name="joining_date"
                  value={formData.joining_date}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Last Increment Date */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Last Increment Date
              </label>
              <div className="relative">
                <TrendingUp
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="date"
                  name="lastincrement_date"
                  value={formData.lastincrement_date}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Duration since last increment */}
            {duration && (
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <TrendingUp size={16} className="text-blue-500" />
                  <span className="text-sm text-slate-600">
                    Duration since last increment:
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {duration}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Performance & Qualifications */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 text-purple-600">
            <Star size={18} />
            <h2 className="font-bold text-slate-800">
              Performance &amp; Qualifications
            </h2>
          </div>
          <div className="p-8 space-y-6">
            {/* Achievements */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Achievements
              </label>
              <div className="relative">
                <Star
                  className="absolute left-3 top-3.5 text-slate-400"
                  size={18}
                />
                <textarea
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe key achievements, contributions, and milestones during this period..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* SEP Qualification */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  SEP Qualification
                </label>
                <div className="relative">
                  <BadgeCheck
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <select
                    name="sep_qualification"
                    value={formData.sep_qualification}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer appearance-none"
                  >
                    <option value="">Select Qualification</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* Qualification Badge */}
                {formData.sep_qualification === "yes" && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <BadgeCheck size={15} className="text-emerald-500" />
                    <span className="text-sm font-bold text-emerald-600">
                      Qualified
                    </span>
                  </div>
                )}
                {formData.sep_qualification === "no" && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl">
                    <BadgeCheck size={15} className="text-red-400" />
                    <span className="text-sm font-bold text-red-500">
                      Not Qualified
                    </span>
                  </div>
                )}
              </div>

              {/* Helper text */}
              <p className="text-sm text-slate-400 leading-relaxed pt-7">
                Indicates whether the employee meets the Standard Eligibility
                Parameters required for a raise appraisal.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default RaiseAppraisal;