import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Settings2,
  Plus,
  Trash2,
  Edit3,
  CalendarCheck,
  Info,
} from "lucide-react";
import { gooeyToast } from "goey-toast";

const LeaveTypes = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ type: "", quantity: "" });

  const fetchLeaveTypes = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/admin/all-leave-types",
      );
      if (data.success) setLeaveTypes(data.leave_types);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/admin/add-leave-type", formData);
      setFormData({ type: "", quantity: "" });
      fetchLeaveTypes();
      gooeyToast.success("Leave Type Inserted", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });
    } catch (err) {
      alert("Error adding leave type");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Settings2 className="text-blue-600" size={32} /> Leave
            Configuration
          </h1>
          <p className="text-slate-500">
            Define annual leave quotas for different categories.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add New Type Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus size={18} className="text-blue-600" /> Add New Type
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sick Leave"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Annual Allowance (Days)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 12"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                />
              </div>
              <button className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-slate-200 active:scale-95">
                Save
              </button>
            </form>
          </div>

          {/* Table Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-xs uppercase font-bold border-b border-slate-100">
                    <th className="px-6 py-4">Leave Category</th>
                    <th className="px-6 py-4">Annual Quota</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="p-10 text-center text-slate-400"
                      >
                        Fetching...
                      </td>
                    </tr>
                  ) : (
                    leaveTypes.map((type) => (
                      <tr
                        key={type._id}
                        className="hover:bg-slate-50 transition-colors group"
                      >
                        <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <CalendarCheck size={18} />
                          </div>
                          {type.leave_type_title}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600">
                          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
                            {type.leave_type_annual_quantity} Days / Year
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                              <Edit3 size={16} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {leaveTypes.length === 0 && !loading && (
                <div className="p-10 text-center text-slate-400 flex flex-col items-center gap-2">
                  <Info size={32} />
                  <p>No leave types configured yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveTypes;
