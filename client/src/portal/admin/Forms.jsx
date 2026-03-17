import React, { useEffect, useState } from 'react';
import { FileText, Search, Plus, MoreVertical, Edit2, Trash2, Filter, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom'

const Forms = () => {
  const [availableForms, setAvailableForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEmployeeForms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user/employee-forms");
      setAvailableForms(response.data.employee_forms);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeForms();
  }, []);

  const filteredForms = availableForms.filter(form =>
    form.form_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.form_target_role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <FileText className="text-blue-600" size={32} /> Form Management
            </h1>
            <p className="text-slate-500 mt-1">Configure and manage employee-facing dynamic forms.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-slate-200 active:scale-95">
            <Link to="/hr360/admin/add-form" className='flex items-center gap-2 cursor-pointer'>
            <Plus size={20} /> Create New Form
            </Link>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by form title or target role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* Forms Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-xs uppercase font-bold border-b border-slate-100">
                <th className="px-6 py-5">Form Title</th>
                <th className="px-6 py-5">Target Designation</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-medium">Loading Form Templates...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredForms.length > 0 ? (
                filteredForms.map((form) => (
                  <tr key={form._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <FileText size={20} />
                        </div>
                        <span className="font-bold text-slate-800">{form.form_title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        {form.form_target_role}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                        Active
                      </span>
                    </td>
                    <td className="px-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Edit2 size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 group-hover:hidden transition-all">
                        <MoreVertical size={18} />
                      </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">
                    No forms match your current search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Forms;