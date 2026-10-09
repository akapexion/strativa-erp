import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, getUploadUrl } from "../../config/api.js";
import {
  Users,
  Search,
  UserPlus,
  Briefcase,
  Calendar,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { gooeyToast } from "goey-toast";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .emp-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .emp-root { background: #f8fafc; min-height: 100vh; }

  /* Page title */
  .page-title {
    font-size: 22px; font-weight: 900; color: #0f172a;
    letter-spacing: -0.03em; line-height: 1.2;
  }

  /* Add button */
  .add-btn {
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    box-shadow: 0 4px 14px rgba(99,102,241,0.28);
    transition: filter 0.15s, box-shadow 0.15s, transform 0.15s;
    border-radius: 12px;
    color: #fff;
    font-weight: 700;
    font-size: 13px;
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 18px;
    white-space: nowrap;
  }
  .add-btn:hover {
    filter: brightness(1.08);
    box-shadow: 0 6px 20px rgba(99,102,241,0.38);
    transform: translateY(-1px);
  }
  .add-btn:active { transform: translateY(0); }

  /* Search box */
  .search-wrap { position: relative; }
  .search-wrap input {
    font-family: 'Plus Jakarta Sans', sans-serif;
    width: 100%; padding: 10px 16px 10px 44px;
    border-radius: 12px;
    border: 1.5px solid #e8ecf0;
    outline: none;
    font-size: 13px; font-weight: 500; color: #1e293b;
    background: #fff;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .search-wrap input::placeholder { color: #c0cad6; font-weight: 400; }
  .search-wrap input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
  .search-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: #c0cad6; pointer-events: none; transition: color 0.15s;
  }
  .search-wrap:focus-within .search-icon { color: #6366f1; }
  .clear-btn {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    color: #c0cad6; cursor: pointer; padding: 2px;
    transition: color 0.12s;
  }
  .clear-btn:hover { color: #64748b; }

  /* Stat chip */
  .stat-chip {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 12px;
    padding: 10px 18px;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }

  /* Table card */
  .table-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }

  /* Table header */
  .table-head th {
    font-size: 10px; font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.1em;
    padding: 14px 24px;
    background: #fafbfc;
    border-bottom: 1px solid #f1f5f9;
  }

  /* Table row */
  .table-row {
    transition: background 0.12s;
    border-bottom: 1px solid #f8fafc;
  }
  .table-row:last-child { border-bottom: none; }
  .table-row:hover { background: #faf9ff; }

  /* Avatar ring */
  .emp-avatar {
    width: 40px; height: 40px;
    border-radius: 12px;
    object-fit: cover;
    border: 2px solid #f1f5f9;
    flex-shrink: 0;
  }

  /* Employee code badge */
  .emp-code {
    font-size: 10px; font-weight: 800;
    font-family: monospace;
    color: #6366f1;
    background: #eef2ff;
    border-radius: 5px;
    padding: 1px 6px;
    letter-spacing: 0.08em;
    display: inline-block;
    margin-top: 2px;
  }

  /* Status badges */
  .badge {
    display: inline-flex; align-items: center;
    padding: 2px 9px; border-radius: 99px;
    font-size: 10px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.08em;
    border: 1px solid transparent;
    margin-top: 5px;
  }
  .badge-permanent { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
  .badge-probation  { background: #fffbeb; color: #b45309; border-color: #fde68a; }
  .badge-terminated { background: #fff1f2; color: #be123c; border-color: #fecdd3; }
  .badge-ex         { background: #f8fafc; color: #64748b; border-color: #e2e8f0; }

  /* Action buttons */
  .action-btn {
    padding: 7px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.12s, color 0.12s, transform 0.12s;
    cursor: pointer;
  }
  .action-btn:active { transform: scale(0.94); }
  .edit-btn  { background: #eef2ff; color: #4f46e5; }
  .edit-btn:hover  { background: #4f46e5; color: #fff; }
  .del-btn   { background: #fff1f2; color: #f43f5e; }
  .del-btn:hover   { background: #f43f5e; color: #fff; }

  /* Skeleton shimmer */
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .skeleton {
    background: linear-gradient(90deg, #f1f5f9 25%, #e8ecf0 50%, #f1f5f9 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 8px;
  }

  /* Empty state */
  .empty-state {
    padding: 64px 24px;
    text-align: center;
    color: #94a3b8;
  }
`;

const statusBadge = (status) => {
  const map = {
    Permanent: "badge-permanent",
    Probation: "badge-probation",
    Terminated: "badge-terminated",
    Ex: "badge-ex",
  };
  return (
    <span className={`badge ${map[status] || "badge-probation"}`}>
      {status || "Probation"}
    </span>
  );
};

const SkeletonRow = () => (
  <tr className="table-row">
    {[...Array(5)].map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="skeleton h-8 w-full" />
      </td>
    ))}
  </tr>
);

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/admin/all-employees`);
      if (data.success) setEmployees(data.employees);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`${API_BASE_URL}/admin/delete-employee/${id}`);
      if (data.success) {
        setEmployees(prev => prev.filter(e => e._id !== id));
        gooeyToast.success("Employee deleted successfully", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 } });
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filtered = employees.filter(emp =>
    `${emp.employee_fname} ${emp.employee_lname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>
      <div className="emp-root p-5 md:p-8">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* ── Page Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <Users size={18} className="text-indigo-500" />
                </div>
                <h1 className="page-title">Employee Directory</h1>
              </div>
              <p className="text-[13px] text-slate-400 font-medium ml-0.5">
                Manage and view all registered staff members
              </p>
            </div>
            <Link to="/hr360/admin/add-employee" className="add-btn">
              <UserPlus size={16} strokeWidth={2.5} />
              Add New Employee
            </Link>
          </div>

          {/* ── Search + Count ── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="search-wrap flex-1">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search by name or employee code…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-btn" onClick={() => setSearchTerm("")}>
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="stat-chip min-w-[140px]">
              <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Total</span>
              <span className="text-xl font-black text-indigo-500">{loading ? "—" : filtered.length}</span>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="table-card overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="table-head">
                  <th>Employee</th>
                  <th>Department & Role</th>
                  <th>Contact</th>
                  <th>Joined</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">
                        <div className="inline-flex p-4 rounded-2xl bg-slate-50 mb-3">
                          <Users size={28} strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-semibold">No employees found</p>
                        <p className="text-xs mt-1 text-slate-400">Try adjusting your search term</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map(emp => (
                    <tr key={emp._id} className="table-row">

                      {/* Employee Info */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={getUploadUrl(emp.employee_image)}
                            alt=""
                            className="emp-avatar"
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-800 leading-tight">
                              {emp.employee_fname} {emp.employee_lname}
                            </p>
                            <span className="emp-code">{emp.employee_code}</span>
                          </div>
                        </div>
                      </td>

                      {/* Department & Role */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                          <Briefcase size={13} className="text-slate-400 shrink-0" />
                          {emp.employee_designation}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">{emp.employee_department}</p>
                        {statusBadge(emp.employment_status)}
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-3.5">
                        <p className="text-[13px] font-medium text-slate-600">{emp.employee_email}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">{emp.employee_phonenumber}</p>
                      </td>

                      {/* Joining Date */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-1.5 text-[13px] text-slate-600 font-medium">
                          <Calendar size={13} className="text-slate-400 shrink-0" />
                          {new Date(emp.employee_joiningdate).toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric"
                          })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-3.5">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => navigate(`/hr360/admin/update-employee/${emp._id}`)}
                            className="action-btn edit-btn"
                            title="Edit Employee"
                          >
                            <Edit2 size={15} strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => handleDelete(emp._id)}
                            className="action-btn del-btn"
                            title="Delete Employee"
                          >
                            <Trash2 size={15} strokeWidth={2} />
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
    </>
  );
};

export default Employees;