import React, { useEffect, useState } from "react";
import {
  Form,
  ArrowRight,
  Filter,
  LayoutGrid,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const EmployeeForms = () => {
  const [activeTab, setActiveTab] = useState("listing");
  const [formsSubmissions, setformsSubmissions] = useState([]);

  const submissions = [
    {
      name: "Annual Appraisal",
      category: "Academics",
      toRaise: "/hr360/user/raise-appraisal",
      toSubmissions: "/hr360/user/appraisals"
    },
    {
      name: "Direct Financial Incentive - DFI",
      category: "Academics",
      toRaise: "/hr360/user/raise-dfi",
      toSubmissions: "/hr360/user/dfis"
    },
    {
      name: "Key Performance Indicator - KPI",
      category: "Academics",
      toRaise: "/hr360/user/raise-kpi",
      toSubmissions: "/hr360/user/kpis"
    },
  ];

  // ✅ STATUS STYLES
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-600 border border-red-200";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
  };

  // ✅ FETCH DATA
  const fetchFormSubmissions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(
        `http://localhost:5000/user/current-employee-formsubmissions/${user.user_code}`
      );
      setformsSubmissions(response.data.currentEmployeeFormSubmissions);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFormSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employee Forms</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse available forms or track your submission status.
          </p>
        </div>

        {/* TABS */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-300 w-fit">
          <button
            onClick={() => setActiveTab("listing")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "listing"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <LayoutGrid size={16} />
            Submissions
          </button>
          <button
            onClick={() => setActiveTab("status")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "status"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <ClipboardList size={16} />
            Easy Forms
          </button>
        </div>

        {/* ───────────── SUBMISSIONS TAB — TABLE ───────────── */}
        {activeTab === "listing" && (
          <section className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">

            {/* SECTION HEADER */}
            <div className="px-8 py-5 border-b border-gray-300 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600">
                <LayoutGrid size={18} />
                <h2 className="font-bold text-slate-800">My Submissions</h2>
              </div>
              <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs rounded-lg">
                {formsSubmissions.length} total
              </span>
            </div>

            {formsSubmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="p-4 bg-slate-100 rounded-full">
                  <Form size={30} className="text-slate-400" />
                </div>
                <p className="font-bold text-slate-700">No form submissions as of now</p>
                <p className="text-sm text-slate-400">Check back later.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300 bg-slate-50">
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                          Form No
                        </th>
                        <th className="text-left px-8 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                          Form Name
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                          Initiated By
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                          Status
                        </th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formsSubmissions.map((form) => (
                        <tr
                          key={form._id}
                          className="hover:bg-slate-50 transition-colors group"
                        >
                          {/* Form No */}
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                                <Form size={15} />
                              </div>
                              <span className="font-bold text-slate-800">
                                {form.form_no || "Untitled Form No"}
                              </span>
                            </div>
                          </td>
                          {/* Form Name */}
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-slate-800">
                                {form.form_title || "Untitled Form"}
                              </span>
                            </div>
                          </td>

                          {/* Submitted By */}
                          <td className="px-4 py-4 text-slate-500 text-sm">
                            {form.employee_name || "—"}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-4">
                            <span
                              className={`px-3 py-1 text-xs font-bold rounded-lg ${getStatusStyles(
                                form.form_status
                              )}`}
                            >
                              {form.form_status || "Pending"}
                            </span>
                          </td>

                          {/* Arrow */}
                          <td className="px-4 py-4 text-right">
                            <Link to={`/hr360/user/form-submission/${form._id}`}>
                            <ArrowRight
                              size={18}
                              className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all ml-auto"
                            />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* FOOTER */}
                <div className="px-8 py-4 border-t border-gray-300 bg-slate-50">
                  <p className="text-xs text-slate-400">
                    Showing{" "}
                    <span className="font-bold text-slate-700">
                      {formsSubmissions.length}
                    </span>{" "}
                    submissions
                  </p>
                </div>
              </>
            )}
          </section>
        )}

        {/* ───────────── EASY FORMS TAB — CARDS ───────────── */}
        {activeTab === "status" && (
          <div className="space-y-5">

            {/* SECTION HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600">
                <ClipboardList size={18} />
                <h2 className="font-bold text-slate-800">Easy Forms</h2>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-slate-500 hover:bg-white border border-transparent hover:border-gray-300 rounded-lg transition-all">
                <Filter size={14} />
                Filter
              </button>
            </div>

            {/* CARDS GRID */}
            <div className="grid md:grid-cols-2 gap-5">
              {submissions.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white p-5 rounded-2xl border border-gray-300 shadow-md hover:border-blue-500 hover:shadow-lg transition-all flex items-center justify-between"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                      <Form size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {item.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs rounded-lg">
                        <CheckCircle2 size={11} />
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT — Raise Button */}
                  <div className="flex gap-1">
                  <Link
                    to={item.toRaise}
                    className="flex items-center gap-1.5 px-4 py-2 border border-blue-600 text-blue-600 text-xs font-bold rounded-lg shadow shadow-blue-100 hover:bg-blue-700 hover:text-white transition-all shrink-0"
                  >
                    Raise
                    <ArrowRight size={13} />
                  </Link>
                  <Link
                    to={item.toSubmissions}
                    className="flex items-center gap-1.5 px-4 py-2 border border-blue-600 text-blue-600 text-xs font-bold rounded-lg shadow shadow-blue-100 hover:bg-blue-700 hover:text-white transition-all shrink-0"
                  >
                    Submissions
                    <ArrowRight size={13} />
                  </Link>
                  </div>
                </div>
                
              ))}
            </div>

            {/* FOOTER COUNT */}
            <p className="text-xs text-slate-400 px-1">
              Showing{" "}
              <span className="font-bold text-slate-700">
                {submissions.length}
              </span>{" "}
              forms
            </p>

          </div>
        )}

      </div>
    </div>
  );
};

export default EmployeeForms;