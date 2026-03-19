import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Percent,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const KPISubmissions = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        `http://localhost:5000/user/kpis/${user.user_code}`
      );

      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 📊 Stats
  const totalCount = data.length;
  const totalDO = data.reduce(
    (sum, k) => sum + (Number(k.kpi_do_count) || 0),
    0
  );
  const avgAttendance =
    data.length > 0
      ? Math.round(
          data.reduce(
            (sum, k) =>
              sum +
              Number(
                k.kpi_batch_attendence_percentage?.replace("%", "") || 0
              ),
            0
          ) / data.length
        )
      : 0;

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
            KPI Submissions
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700">
            <TrendingUp size={18} />
            <Link to="/hr360/user/raise-kpi">New KPI</Link>
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-300 px-6 py-5 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total KPI</p>
              <p className="text-2xl font-bold">{totalCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-300 px-6 py-5 flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <BookOpen size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total DO Count</p>
              <p className="text-2xl font-bold">{totalDO}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-300 px-6 py-5 flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Percent size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Avg Attendance</p>
              <p className="text-2xl font-bold">{avgAttendance}%</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <section className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          {!loading && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300 bg-slate-50">
                    <th className="text-left px-8 py-3 text-xs font-bold text-slate-500 uppercase">
                      Employee
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                      Batch
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                      Semester
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                      DO Count
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                      Attendance
                    </th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {data.map((k) => (
                    <tr
                      key={k._id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-8 py-4 font-semibold text-slate-800">
                        {k.employee_name}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {k.kpi_batch}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {k.kpi_batch_semester}
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold">
                          {k.kpi_do_count}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right font-bold text-green-600">
                        {k.kpi_batch_attendence_percentage}%
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            navigate(`/admin/kpi/${k._id}`)
                          }
                          className="p-1.5 text-slate-300 group-hover:text-slate-500 hover:bg-slate-100 rounded-lg"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && (
            <div className="px-8 py-4 border-t border-gray-300 bg-slate-50 text-xs text-slate-400">
              Showing KPI submissions
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default KPISubmissions;