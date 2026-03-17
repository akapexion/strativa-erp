import React, { useEffect, useState } from 'react';
import { FilePlus, Clock, CheckCircle2, Search, FileText, ArrowRight, Filter } from 'lucide-react';
import axios from 'axios'

const EmployeeForms = () => {
  const [activeTab, setActiveTab] = useState('listing');
  const [availableForms, setAvailableForms] = useState([]);

    const fetchEmployeeForms = async() => {
      try{
        const response = await axios.get("http://localhost:5000/user/employee-forms");
        console.log(response.data.employee_forms);
        setAvailableForms(response.data.employee_forms);
      }
      catch(err){
        console.log(err);
      }
    }

    useEffect(() => {
      fetchEmployeeForms();
    }, []);

  const submittedForms = [
    { id: 101, name: "Leave Request", date: "2026-03-05", status: "Approved" },
    { id: 102, name: "Expense Reimbursement", date: "2026-03-07", status: "Pending" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="w-full mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Easy Forms</h1>
          <p className="text-slate-500">Select a form to fill or track your previous submissions.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-full md:w-fit mb-8">
          <button
            onClick={() => setActiveTab('listing')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
              activeTab === 'listing' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FilePlus size={18} />
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
              activeTab === 'status' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Clock size={18} />
          </button>
        </div>

        {/* Tab Content: Form Listing */}
        {activeTab === 'listing' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search for a form (e.g. Leave, IT...)" 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {availableForms.map((form) => (
                <div key={form.id} className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{form.form_title}</h3>
                    </div>
                  </div>
                  <ArrowRight className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Submission Status */}
        {activeTab === 'status' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <span className="font-bold text-slate-700">Recent Activity</span>
              <button className="text-slate-500 hover:text-slate-900 flex items-center gap-1 text-sm font-medium">
                <Filter size={14} /> Filter
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-xs uppercase font-bold">
                  <th className="px-6 py-4">Form Name</th>
                  <th className="px-6 py-4">Submission Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submittedForms.map((submission) => (
                  <tr key={submission.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{submission.name}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{submission.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        submission.status === 'Approved' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-amber-50 text-amber-600'
                      }`}>
                        {submission.status === 'Approved' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-600 hover:underline text-sm font-bold cursor-pointer">
                      View Details
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default EmployeeForms;