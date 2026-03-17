import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Save, User, Briefcase, 
  Phone, Mail, Fingerprint, Milestone, 
  GraduationCap, Landmark, Banknote, CalendarDays
} from 'lucide-react';
import { gooeyToast } from 'goey-toast';

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch specific employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/admin/employee/${id}`);
        if (data.success) {
          setFormData(data.employee);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        gooeyToast.error("Failed to fetch employee data", {
      fillColor: "#FFF",
      bounce: 0.45,
      timing: { displayDuration: 2500 },
    });
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle PUT Request
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const { data } = await axios.put(`http://localhost:5000/admin/update-employee/${id}`, formData);
      if (data.success) {
        gooeyToast.success("Employee Updated Successfully", {
              fillColor: "#FFF",
              bounce: 0.45,
              timing: { displayDuration: 2500 },
            });
        navigate('/hr360/admin/employees');
      }
    } catch (err) {
      console.error("Update failed:", err);
       gooeyToast.error("Error updating record. Please try again.", {
              fillColor: "#FFF",
              bounce: 0.45,
              timing: { displayDuration: 2500 },
            });
    } finally {
      setIsUpdating(false);
    }
  };

  // Helper to format Date for input fields (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold">Synchronizing Employee Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold w-fit"
          >
            <ArrowLeft size={20} /> Back to Directory
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-extrabold text-slate-900">Update Profile</h1>
            <p className="text-blue-600 font-mono text-sm uppercase font-bold">{formData.employee_code}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateSubmit} className="space-y-8">
          
          {/* PERSONAL DETAILS SECTION */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 p-4 px-8 flex items-center gap-3 text-white">
              <User size={20} className="text-blue-400" />
              <h2 className="font-bold uppercase tracking-widest text-sm">Personal Information</h2>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: "First Name", name: "employee_fname", icon: <User size={16}/> },
                { label: "Last Name", name: "employee_lname", icon: <User size={16}/> },
                { label: "Email Address", name: "employee_email", type: "email", icon: <Mail size={16}/> },
                { label: "Phone Number", name: "employee_phonenumber", icon: <Phone size={16}/> },
                { label: "CNIC Number", name: "employee_cnicnumber", icon: <Fingerprint size={16}/> },
                { label: "Marital Status", name: "employee_maritalstatus", icon: <Milestone size={16}/> },
                { label: "Date of Birth", name: "employee_dob", type: "date", icon: <CalendarDays size={16}/> },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 ml-1 tracking-wider flex items-center gap-1">
                    {field.icon} {field.label}
                  </label>
                  <input 
                    type={field.type || "text"}
                    name={field.name}
                    value={field.type === "date" ? formatDateForInput(formData[field.name]) : (formData[field.name] || "")}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-semibold text-slate-700"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* PROFESSIONAL DETAILS SECTION */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 p-4 px-8 flex items-center gap-3 text-white">
              <Briefcase size={20} className="text-emerald-400" />
              <h2 className="font-bold uppercase tracking-widest text-sm">Employment Details</h2>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: "Department", name: "employee_department", icon: <Landmark size={16}/> },
                { label: "Designation", name: "employee_designation", icon: <Briefcase size={16}/> },
                { label: "Qualification", name: "employee_qualification", icon: <GraduationCap size={16}/> },
                { label: "Salary Package", name: "employee_salary", icon: <Banknote size={16}/> },
                { label: "Previous Org", name: "employee_lastorganization", icon: <Milestone size={16}/> },
                { label: "Joining Date", name: "employee_joiningdate", type: "date", icon: <CalendarDays size={16}/> },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 ml-1 tracking-wider flex items-center gap-1">
                    {field.icon} {field.label}
                  </label>
                  <input 
                    type={field.type || "text"}
                    name={field.name}
                    value={field.type === "date" ? formatDateForInput(formData[field.name]) : (formData[field.name] || "")}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-semibold text-slate-700"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex flex-col md:flex-row items-center justify-end gap-4 border-t border-slate-200 pt-8 pb-12">
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="w-full md:w-auto px-10 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-all"
            >
              Discard Changes
            </button>
            <button 
              type="submit" 
              disabled={isUpdating}
              className={`w-full md:w-auto flex items-center justify-center gap-3 px-12 py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 ${
                isUpdating ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
              }`}
            >
              {isUpdating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save size={20} /> Save & Apply Updates
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEmployee;