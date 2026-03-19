import React, { useEffect, useState } from 'react';
import { FilePlus, Clock, CheckCircle2, Search, FileText, ArrowRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom'

const EmployeeForms = () => {
  const [activeTab, setActiveTab] = useState('listing');
  const [availableForms, setAvailableForms] = useState([]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="w-full mx-auto">
        
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
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
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

        {/* Tab Content: Submission Status */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <span className="font-bold text-slate-700">Easy Forms</span>
              <button className="text-slate-500 hover:text-slate-900 flex items-center gap-1 text-sm font-medium">
                <Filter size={14} /> Filter
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-xs uppercase font-bold">
                  <th className="px-6 py-4">Form Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold">Annual Appraisal</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold`}>
                         <CheckCircle2 size={12} />
                         Academics
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-600 hover:underline text-sm font-bold cursor-pointer">
                      <Link to="/hr360/user/raise-appraisal">
                      Raise
                      </Link>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold">Direct Financial Incentive - DFI</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold`}>
                         <CheckCircle2 size={12} />
                         Academics
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-600 hover:underline text-sm font-bold cursor-pointer">
                      <Link to="/hr360/user/raise-dfi">
                      Raise
                      </Link>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold">Key Performance Indicator - KPI</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold`}>
                         <CheckCircle2 size={12} />
                         Academics
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-600 hover:underline text-sm font-bold cursor-pointer">
                      <Link to="/hr360/user/raise-kpi">
                      Raise
                      </Link>
                    </td>
                  </tr>
              </tbody>
            </table>
          </div>


        <div>

        </div>

      </div>
    </div>
  );
};

export default EmployeeForms;