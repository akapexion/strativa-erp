import React, { useState } from 'react';
import { ArrowLeft, Save, FileEdit, Info, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { gooeyToast } from 'goey-toast';

const AddForm = () => {
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState('');
  const [targetRole, setTargetRole] = useState('');

  const roles = [
    "Finance",
    "Human Resources",
    "Software Engineering",
    "Sales"
  ];

  const handlePublish = async () => {
    if (!formTitle.trim() || !targetRole) {
      return alert("Please fill in both the title and the target role");
    }

    try {
      const res = await axios.post("http://localhost:5000/admin/add-form", {
        form_title: formTitle,
        form_target_role: targetRole
      });

      gooeyToast.success(res.data.message, {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 }
      });

      // Reset form
      setFormTitle('');
      setTargetRole('');

    } catch (err) {
      console.error(err);
      gooeyToast.error(err.response?.data?.message || "Error adding form", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 }
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Create New Entry</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
            Cancel
          </button>
          <button onClick={handlePublish} disabled={!formTitle.trim() || !targetRole} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 disabled:bg-blue-300 text-white font-bold rounded-full shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95">
            <Save size={18} />
            Save Form
          </button>
        </div>
      </div>

      {/* Form Body */}
      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="space-y-8">
          <div className="text-center">
            <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-4">
              <FileEdit size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Form Configuration</h2>
            <p className="text-slate-500 mt-2">Define who sees this form and what it's called.</p>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <label className="absolute -top-3 left-4 px-2 bg-white text-xs font-bold text-blue-600 tracking-widest uppercase transition-all group-focus-within:text-blue-500">Form Title</label>
              <input 
                autoFocus
                type="text" 
                placeholder="e.g., Q1 Performance Review"
                className="w-full px-6 py-5 bg-white border-2 border-slate-100 rounded-2xl text-xl font-semibold text-slate-800 placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            <div className="relative group">
              <label className="absolute -top-3 left-4 px-2 bg-white text-xs font-bold text-blue-600 tracking-widest uppercase transition-all group-focus-within:text-blue-500">Target Role / Audience</label>
              <div className="relative">
                <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                <select 
                  className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-2xl text-lg font-semibold text-slate-800 appearance-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all cursor-pointer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                >
                  <option value="" disabled>Select Target Role</option>
                  {roles.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-slate-600 leading-relaxed"><strong>Tip:</strong> Selecting a specific role limits form visibility to ensure data is only collected from relevant personnel.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddForm;