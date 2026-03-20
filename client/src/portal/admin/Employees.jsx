import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Search,
  UserPlus,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Edit2,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { gooeyToast } from 'goey-toast';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/admin/all-employees");
      if (data.success) setEmployees(data.employees);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
      try {
        const { data } = await axios.delete(
          `http://localhost:5000/admin/delete-employee/${id}`
        );
        if (data.success) {
          setEmployees(employees.filter((emp) => emp._id !== id));
          gooeyToast.success("Employee Deleted Successfully", {
                        fillColor: "#FFF",
                        bounce: 0.45,
                        timing: { displayDuration: 2500 },
                      });
        }
      } catch (err) {
        console.error("Delete failed", err);
      }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      `${emp.employee_fname} ${emp.employee_lname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="text-blue-600" size={32} /> Employee Directory
            </h1>
            <p className="text-slate-500 mt-1">Manage and view all registered staff members.</p>
          </div>
          <Link
            to="/hr360/admin/add-employee"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <UserPlus size={20} /> Add New Employee
          </Link>
        </div>

        {/* Search & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, code or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>
          <div className="bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <span className="text-slate-500 font-medium">Total:</span>
            <span className="text-2xl font-bold text-blue-600">{filteredEmployees.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-xs uppercase font-bold border-b border-slate-100">
                <th className="px-6 py-5">Employee Info</th>
                <th className="px-6 py-5">Department & Role</th>
                <th className="px-6 py-5">Contact Details</th>
                <th className="px-6 py-5">Joining Date</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-400">Loading...</td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={`http://localhost:5000/uploads/${emp.employee_image}`}
                          alt="avatar"
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-100"
                        />
                        <div>
                          <div className="font-bold text-slate-800">{emp.employee_fname} {emp.employee_lname}</div>
                          <div className="text-xs font-mono text-blue-600 font-bold uppercase">{emp.employee_code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      <div className="flex items-center gap-2"><Briefcase size={14} /> {emp.employee_designation}</div>
                      <div className="text-xs text-slate-400 font-normal">{emp.employee_department}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div>{emp.employee_email}</div>
                      <div className="text-xs text-slate-400">{emp.employee_phonenumber}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(emp.employee_joiningdate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        {/* Direct Update Button */}
                        <button
                          onClick={() => navigate(`/hr360/admin/update-employee/${emp._id}`)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          title="Update Employee"
                        >
                          <Edit2 size={18} />
                        </button>
                        {/* Direct Delete Button */}
                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Delete Employee"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;