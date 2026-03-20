import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  TrendingUp,
  BadgeCheck,
  BadgeX,
  Calendar,
  Star,
  Search,
  RefreshCw,
  ChevronRight,
  Loader2,
  InboxIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AppraisalSubmissions = () => {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user);
      const res = await axios.get(
        `http://localhost:5000/user/appraisals/${user.user_code}`
      );
      setSubmissions(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load appraisal submissions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const totalCount = submissions.length;
  const qualifiedCount = submissions.filter(
    (s) => s.appraisal_sep_qualification?.toLowerCase() === "yes"
  ).length;
  const notQualifiedCount = submissions.filter(
    (s) => s.appraisal_sep_qualification?.toLowerCase() === "no"
  ).length;

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
            Appraisal Submissions
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSubmissions}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
          <button
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            <TrendingUp size={18} />
            <Link to="/hr360/user/raise-appraisal">
                New Appraisal
            </Link>
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">
                Total Submissions
              </p>
              <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <BadgeCheck size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">SEP Qualified</p>
              <p className="text-2xl font-bold text-slate-900">
                {qualifiedCount}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5 flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <BadgeX size={20} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">
                Not Qualified
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {notQualifiedCount}
              </p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table */}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/40">
                    <th className="text-left px-8 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Employee
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Joining Date
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Last Increment
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Achievements
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                      SEP
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((s, index) => (
                    <tr
                      key={s._id || index}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Employee */}
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                            <img src={`http://localhost:5000/uploads/${s.employee_image}`} alt="" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">
                              {s.employee_fname && s.employee_lname
                                ? `${s.employee_fname} ${s.employee_lname}`
                                : s.employee_name || "—"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {s.employee_designation || s.employee_department || ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Joining Date */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Calendar size={14} className="text-slate-400" />
                          {s.appraisal_joining_date}
                        </div>
                      </td>

                      {/* Last Increment */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <TrendingUp size={14} className="text-slate-400" />
                          {s.appraisal_lastincrement_date}
                        </div>
                      </td>

                      {/* Achievements */}
                      <td className="px-4 py-4 max-w-xs">
                        <p className="text-slate-600 truncate">
                          {s.appraisal_achievements || "—"}
                        </p>
                      </td>

                      {/* SEP Qualification */}
                      <td className="px-4 py-4">
                        {s.appraisal_sep_qualification?.toLowerCase() === "yes" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-xs rounded-lg">
                            <BadgeCheck size={13} />
                            Qualified
                          </span>
                        ) : s.appraisal_sep_qualification?.toLowerCase() === "no" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-100 text-red-600 font-bold text-xs rounded-lg">
                            <BadgeX size={13} />
                            Not Qualified
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>

                      {/* Arrow */}
                      <td className="px-4 py-4">
                        <button
                          className="p-1.5 rounded-lg text-slate-300 group-hover:text-slate-500 hover:bg-slate-100 transition-all"
                        >
                          <Link to={`/hr360/user/form-submission/${s._id}`}>
                              <ChevronRight size={16} />
                          </Link>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer count */}
          {!loading && !error && (
            <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/40">
              <p className="text-xs text-slate-400 font-medium">
                Showing{" "}
                submissions
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AppraisalSubmissions;