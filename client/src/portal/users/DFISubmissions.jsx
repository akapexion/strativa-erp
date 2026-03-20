import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  TrendingUp,
  BadgeDollarSign,
  Repeat,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const DFISubmissions = () => {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get(
        `http://localhost:5000/user/dfis/${user.user_code}`
      );

      setSubmissions(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load DFI submissions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // 📊 Stats
  const totalCount = submissions.length;
  const totalAmount = submissions.reduce(
    (sum, s) => sum + (Number(s.dfi_amount) || 0),
    0
  );
  const totalAlternates = submissions.reduce(
    (sum, s) => sum + (Number(s.dfi_alternate_count) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">
            DFI Submissions
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSubmissions}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700">
            <TrendingUp size={18} />
            <Link to="/hr360/user/raise-dfi">New DFI</Link>
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-300 px-6 py-5 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Submissions</p>
              <p className="text-2xl font-bold">{totalCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-300 px-6 py-5 flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <BadgeDollarSign size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Amount</p>
              <p className="text-2xl font-bold">{totalAmount}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-300 px-6 py-5 flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Repeat size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Alternates</p>
              <p className="text-2xl font-bold">{totalAlternates}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <section className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300 bg-slate-50">
                    <th className="text-left px-8 py-3 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">
                      Employee
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">
                      Employee Code
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">
                      Alternate Count
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">
                      Amount
                    </th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {submissions.map((s, index) => (
                    <tr
                      key={s._id || index}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      {/* Name */}
                      <td className="px-8 py-4 font-semibold text-slate-800 whitespace-nowrap">
                        {s.employee_name}
                      </td>

                      {/* Code */}
                      <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                        {s.employee_code}
                      </td>

                      {/* Alternate */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold">
                          {s.dfi_alternate_count}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-right font-bold text-green-600 whitespace-nowrap">
                        {s.dfi_amount}
                      </td>

                      {/* Arrow */}
                      <td className="px-6 py-4 text-right">
                        <button
                          className="p-1.5 text-slate-300 group-hover:text-slate-500 hover:bg-slate-100 rounded-lg transition-all"
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

          {/* Footer */}
          {!loading && !error && (
            <div className="px-8 py-4 border-t border-gray-300 bg-slate-50 text-xs text-slate-400">
              Showing submissions
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DFISubmissions;