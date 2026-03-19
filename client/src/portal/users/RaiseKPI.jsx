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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/user/raise-kpi",
        formData
      );

      gooeyToast.success(res.data.message || "KPI submitted successfully");
      setFormData(initialFormData);

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
          <h1 className="text-xl font-bold text-slate-900">
            Raise KPI
          </h1>
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
            <h2 className="font-bold text-slate-800">
              Employee Information
            </h2>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-slate-700">
                Employee Code
              </label>
              <input
                type="text"
                value={formData.employee_code}
                disabled
                className="w-full mt-2 px-4 py-2.5 rounded-xl border border-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Employee Name
              </label>
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
            <h2 className="font-bold text-slate-800">
              KPI Details
            </h2>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-6">

            {/* Batch */}
            <div>
              <label className="text-sm font-bold text-slate-700">
                Batch
              </label>
              <div className="relative mt-2">
                <Layers
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  name="kpi_batch"
                  value={formData.kpi_batch}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300"
                  placeholder="Enter batch"
                />
              </div>
            </div>

            {/* Semester */}
            <div>
              <label className="text-sm font-bold text-slate-700">
                Semester
              </label>
              <div className="relative mt-2">
                <BookOpen
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  name="kpi_batch_semester"
                  value={formData.kpi_batch_semester}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300"
                  placeholder="Enter semester"
                />
              </div>
            </div>

            {/* DO Count */}
            <div>
              <label className="text-sm font-bold text-slate-700">
                DO Count
              </label>
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300"
                  placeholder="Enter DO count"
                />
              </div>
            </div>

            {/* Attendance */}
            <div>
              <label className="text-sm font-bold text-slate-700">
                Attendance Percentage
              </label>
              <div className="relative mt-2">
                <Percent
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  name="kpi_batch_attendence_percentage"
                  value={formData.kpi_batch_attendence_percentage}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300"
                  placeholder="e.g. 85%"
                />
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
};

export default KPIRaise;