import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Settings2,
  Plus,
  Trash2,
  Edit3,
  CalendarCheck,
  Info,
  Search,
  Calendar,
  Layers,
  X,
  Loader2,
  AlertTriangle,
  FileSpreadsheet,
  TrendingUp,
} from "lucide-react";
import { gooeyToast } from "goey-toast";

// ─── Design-system styles (mirrors Employees.jsx pattern) ────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .lt-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .lt-root { background: #f8fafc; min-height: 100vh; }

  /* Page title */
  .page-title {
    font-size: 22px; font-weight: 900; color: #0f172a;
    letter-spacing: -0.03em; line-height: 1.2;
  }

  /* Stat chips */
  .stat-chip {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 12px;
    padding: 10px 18px;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }

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
    box-sizing: border-box;
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
    color: #c0cad6; cursor: pointer; padding: 2px; background: none; border: none;
    transition: color 0.12s; display: flex;
  }
  .clear-btn:hover { color: #64748b; }

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

  /* Table rows */
  .table-row { transition: background 0.12s; border-bottom: 1px solid #f8fafc; }
  .table-row:last-child { border-bottom: none; }
  .table-row:hover { background: #faf9ff; }

  /* Leave type icon box */
  .lt-icon-box {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* Quota badge */
  .quota-badge {
    display: inline-flex; align-items: center; gap: 4px;
    background: #f0fdf4; color: #15803d;
    border: 1px solid #bbf7d0;
    border-radius: 99px;
    font-size: 10px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.08em;
    padding: 2px 9px;
  }

  /* Action buttons */
  .action-btn {
    padding: 7px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.12s, color 0.12s, transform 0.12s;
    cursor: pointer; border: none;
  }
  .action-btn:active { transform: scale(0.94); }
  .edit-btn  { background: #eef2ff; color: #4f46e5; }
  .edit-btn:hover  { background: #4f46e5; color: #fff; }
  .del-btn   { background: #fff1f2; color: #f43f5e; }
  .del-btn:hover   { background: #f43f5e; color: #fff; }

  /* Add form card */
  .form-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }
  .form-card-top-bar {
    height: 3px;
    background: linear-gradient(90deg, #4f46e5, #818cf8);
  }

  /* Form input */
  .form-input {
    font-family: 'Plus Jakarta Sans', sans-serif;
    width: 100%; padding: 10px 14px;
    border-radius: 10px;
    border: 1.5px solid #e8ecf0;
    outline: none; font-size: 13px; font-weight: 500; color: #1e293b;
    background: #fafbfc;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    box-sizing: border-box;
  }
  .form-input::placeholder { color: #c0cad6; }
  .form-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
    background: #fff;
  }
  .form-label {
    font-size: 10px; font-weight: 800;
    color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;
    display: block; margin-bottom: 6px;
  }

  /* Submit button */
  .submit-btn {
    width: 100%;
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    box-shadow: 0 4px 14px rgba(99,102,241,0.28);
    border: none; border-radius: 12px;
    color: #fff; font-weight: 700; font-size: 13px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 11px 20px; cursor: pointer;
    transition: filter 0.15s, box-shadow 0.15s, transform 0.15s;
  }
  .submit-btn:hover:not(:disabled) {
    filter: brightness(1.08);
    box-shadow: 0 6px 20px rgba(99,102,241,0.38);
    transform: translateY(-1px);
  }
  .submit-btn:active:not(:disabled) { transform: translateY(0); }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  /* Modal overlay */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 50;
    display: flex; align-items: center; justify-content: center; padding: 16px;
  }
  .modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(15,23,42,0.4);
    backdrop-filter: blur(4px);
  }
  .modal-box {
    background: #fff;
    border-radius: 20px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 24px 64px rgba(0,0,0,0.14), 0 8px 16px rgba(0,0,0,0.06);
    width: 100%; max-width: 420px;
    position: relative; z-index: 10;
    overflow: hidden;
    animation: scaleIn 0.18s ease both;
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.96) translateY(8px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);   }
  }

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

  /* Spin */
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .spin { animation: spin 1s linear infinite; }
`;

// ─── Row colour cycling (matches leave type icon accent) ─────────────────────
const ACCENTS = [
  { bg: "#eef2ff", color: "#4f46e5" }, // indigo
  { bg: "#ecfdf5", color: "#10b981" }, // emerald
  { bg: "#fdf4ff", color: "#a855f7" }, // purple
  { bg: "#fff7ed", color: "#f97316" }, // orange
  { bg: "#fdf2f8", color: "#ec4899" }, // pink
];
const accent = (i) => ACCENTS[i % ACCENTS.length];

// ─── Skeleton row ────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="table-row">
    {[...Array(3)].map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="skeleton" style={{ height: 32, width: "100%" }} />
      </td>
    ))}
  </tr>
);

// ─── Main component ───────────────────────────────────────────────────────────
const LeaveTypes = () => {
  const [leaveTypes, setLeaveTypes]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [searchQuery, setSearchQuery]     = useState("");

  const [formData, setFormData]           = useState({ type: "", quantity: "" });
  const [adding, setAdding]               = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingType, setEditingType]         = useState(null);
  const [editFormData, setEditFormData]       = useState({ type: "", quantity: "" });
  const [updating, setUpdating]               = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingType, setDeletingType]           = useState(null);
  const [deleting, setDeleting]                   = useState(false);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const fetchLeaveTypes = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/admin/all-leave-types");
      if (data.success) setLeaveTypes(data.leave_types || []);
    } catch (err) {
      console.error(err);
      gooeyToast.error("Failed to fetch leave types", { fillColor: "#FFF", bounce: 0.4, timing: { displayDuration: 2500 } });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchLeaveTypes(); }, []);

  // ── Add ───────────────────────────────────────────────────────────────────
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type.trim() || !formData.quantity) return;
    setAdding(true);
    try {
      await axios.post("http://localhost:5000/admin/add-leave-type", formData);
      setFormData({ type: "", quantity: "" });
      await fetchLeaveTypes();
      gooeyToast.success("New Leave Type Added", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 } });
    } catch (err) {
      console.error(err);
      gooeyToast.error("Error adding leave type", { fillColor: "#FFF", bounce: 0.4, timing: { displayDuration: 2500 } });
    } finally {
      setAdding(false);
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const handleEditClick = (type) => {
    setEditingType(type);
    setEditFormData({ type: type.leave_type_title, quantity: type.leave_type_annual_quantity });
    setIsEditModalOpen(true);
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingType || !editFormData.type.trim() || !editFormData.quantity) return;
    setUpdating(true);
    try {
      const { data } = await axios.put(
        `http://localhost:5000/admin/update-leave-type/${editingType._id}`, editFormData
      );
      if (data.success) {
        setIsEditModalOpen(false); setEditingType(null);
        await fetchLeaveTypes();
        gooeyToast.success("Leave Type Updated", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 } });
      }
    } catch (err) {
      console.error(err);
      gooeyToast.error("Failed to update leave type", { fillColor: "#FFF", bounce: 0.4, timing: { displayDuration: 2500 } });
    } finally {
      setUpdating(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteClick  = (type) => { setDeletingType(type); setIsDeleteModalOpen(true); };
  const handleDeleteConfirm = async () => {
    if (!deletingType) return;
    setDeleting(true);
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/admin/delete-leave-type/${deletingType._id}`
      );
      if (data.success) {
        setIsDeleteModalOpen(false); setDeletingType(null);
        await fetchLeaveTypes();
        gooeyToast.success("Leave Type Deleted", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2500 } });
      }
    } catch (err) {
      console.error(err);
      gooeyToast.error("Failed to delete leave type", { fillColor: "#FFF", bounce: 0.4, timing: { displayDuration: 2500 } });
    } finally {
      setDeleting(false);
    }
  };

  // ── Derived stats ─────────────────────────────────────────────────────────
  const totalCategories = leaveTypes.length;
  const totalDays       = leaveTypes.reduce((s, t) => s + (Number(t.leave_type_annual_quantity) || 0), 0);
  const maxQuota        = leaveTypes.reduce((m, t) => Math.max(m, Number(t.leave_type_annual_quantity) || 0), 0);

  const filtered = leaveTypes.filter((t) =>
    t.leave_type_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <div className="lt-root p-5 md:p-8">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* ── Page Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <Settings2 size={18} className="text-indigo-500" />
                </div>
                <h1 className="page-title">Leave Configuration</h1>
              </div>
              <p className="text-[13px] text-slate-400 font-medium ml-0.5">
                Define and manage annual leave quotas for employees
              </p>
            </div>
          </div>

          {/* ── Stat Chips ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: <Layers size={16} className="text-indigo-400" />, label: "Total Categories", value: loading ? "—" : totalCategories, accent: "#6366f1" },
              { icon: <Calendar size={16} className="text-emerald-400" />, label: "Total Annual Days", value: loading ? "—" : `${totalDays}`, accent: "#10b981" },
              { icon: <TrendingUp size={16} className="text-purple-400" />, label: "Highest Quota", value: loading ? "—" : `${maxQuota} days`, accent: "#a855f7" },
            ].map(({ icon, label, value, accent: ac }) => (
              <div className="stat-chip" key={label}>
                <div className="flex items-center gap-2">
                  {icon}
                  <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
                </div>
                <span style={{ color: ac }} className="text-xl font-black">{value}</span>
              </div>
            ))}
          </div>

          {/* ── Main Grid: form + table ── */}
          <div className="grid lg:grid-cols-[300px_1fr] gap-5 items-start">

            {/* ── Add Form ── */}
            <div className="form-card">
              <div className="form-card-top-bar" />
              <div className="p-5 space-y-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 rounded-xl">
                    <Plus size={16} className="text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-[14px] font-800 font-extrabold text-slate-800 leading-tight">Add New Type</p>
                    <p className="text-[11px] text-slate-400 font-medium">Create a leave category</p>
                  </div>
                </div>

                <form onSubmit={handleAddSubmit} className="space-y-4">
                  <div>
                    <label className="form-label">Category Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Sick Leave"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Annual Allowance (Days)</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      placeholder="e.g. 12"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                    />
                  </div>

                  {/* Live preview */}
                  {formData.type && formData.quantity && (
                    <div style={{
                      background: "#fafbfc", border: "1.5px dashed #c7d2fe",
                      borderRadius: 10, padding: "10px 14px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#4f46e5" }}>{formData.type}</span>
                      <span className="quota-badge"><CalendarCheck size={10} />{formData.quantity} days/yr</span>
                    </div>
                  )}

                  <button type="submit" className="submit-btn" disabled={adding}>
                    {adding
                      ? <><Loader2 size={15} className="spin" /> Saving…</>
                      : <><Plus size={15} /> Save Category</>}
                  </button>
                </form>
              </div>
            </div>

            {/* ── Table Section ── */}
            <div className="space-y-3">

              {/* Search + count row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="search-wrap flex-1">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search categories…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className="clear-btn" onClick={() => setSearchQuery("")}>
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="stat-chip" style={{ minWidth: 140 }}>
                  <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Showing</span>
                  <span className="text-xl font-black text-indigo-500">{loading ? "—" : filtered.length}</span>
                </div>
              </div>

              {/* Table */}
              <div className="table-card overflow-x-auto">
                <table className="w-full text-left" style={{ minWidth: 500 }}>
                  <thead>
                    <tr className="table-head">
                      <th>Leave Category</th>
                      <th>Annual Quota</th>
                      <th style={{ textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={3}>
                          <div style={{ padding: "56px 24px", textAlign: "center", color: "#94a3b8" }}>
                            <div style={{
                              display: "inline-flex", padding: 16,
                              borderRadius: 16, background: "#f8fafc", marginBottom: 12,
                            }}>
                              <Info size={28} strokeWidth={1.5} />
                            </div>
                            <p style={{ fontSize: 14, fontWeight: 700, color: "#475569", margin: "0 0 4px" }}>
                              No leave types found
                            </p>
                            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                              {searchQuery
                                ? `No results match "${searchQuery}"`
                                : "Add your first category using the form"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((type, i) => {
                        const { bg, color } = accent(i);
                        return (
                          <tr key={type._id} className="table-row">

                            {/* Category */}
                            <td className="px-6 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="lt-icon-box" style={{ background: bg, color }}>
                                  <CalendarCheck size={17} strokeWidth={1.8} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-800 leading-tight">
                                    {type.leave_type_title}
                                  </p>
                                  <span style={{
                                    fontSize: 10, fontWeight: 800, fontFamily: "monospace",
                                    color: "#6366f1", background: "#eef2ff",
                                    borderRadius: 5, padding: "1px 6px",
                                    letterSpacing: "0.08em", display: "inline-block", marginTop: 2,
                                  }}>
                                    ID-{type._id?.slice(-5).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Quota */}
                            <td className="px-6 py-3.5">
                              <span className="quota-badge">
                                <CalendarCheck size={10} />
                                {type.leave_type_annual_quantity} days / yr
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-3.5">
                              <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                                <button
                                  className="action-btn edit-btn"
                                  onClick={() => handleEditClick(type)}
                                  title="Edit"
                                >
                                  <Edit3 size={15} strokeWidth={2} />
                                </button>
                                <button
                                  className="action-btn del-btn"
                                  onClick={() => handleDeleteClick(type)}
                                  title="Delete"
                                >
                                  <Trash2 size={15} strokeWidth={2} />
                                </button>
                              </div>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>

                {/* Table footer */}
                {filtered.length > 0 && !loading && (
                  <div style={{
                    padding: "10px 24px",
                    borderTop: "1px solid #f1f5f9",
                    background: "#fafbfc",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                      Showing {filtered.length} of {totalCategories} categories
                    </span>
                    <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 700 }}>
                      {totalDays} total days configured
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)} />
          <div className="modal-box">
            <div style={{ height: 3, background: "linear-gradient(90deg, #4f46e5, #818cf8)" }} />

            {/* Header */}
            <div style={{
              padding: "18px 22px 14px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <Edit3 size={16} className="text-indigo-500" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Edit Category</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
                    {editingType?.leave_type_title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{
                  background: "#f8fafc", border: "1.5px solid #e8ecf0",
                  borderRadius: 8, padding: 6,
                  display: "flex", cursor: "pointer", color: "#94a3b8",
                  transition: "color 0.12s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#475569"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
              >
                <X size={15} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="form-label">Category Title</label>
                <input
                  type="text" className="form-input"
                  value={editFormData.type}
                  onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">Annual Allowance (Days)</label>
                <input
                  type="number" min="0" className="form-input"
                  value={editFormData.quantity}
                  onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{
                    padding: "9px 18px", background: "none",
                    border: "1.5px solid #e8ecf0", borderRadius: 10,
                    fontSize: 13, fontWeight: 600, color: "#64748b",
                    cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={updating}
                  style={{ width: "auto", padding: "9px 22px" }}
                >
                  {updating
                    ? <><Loader2 size={14} className="spin" /> Saving…</>
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="modal-box" style={{ borderColor: "#fecdd3" }}>
            <div style={{ height: 3, background: "linear-gradient(90deg, #f43f5e, #fb7185)" }} />
            <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: 18 }}>

              <div className="flex items-start gap-3.5">
                <div style={{
                  width: 44, height: 44, minWidth: 44,
                  background: "#fff1f2", border: "1px solid #fecdd3",
                  borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#f43f5e",
                }}>
                  <AlertTriangle size={20} strokeWidth={2} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Delete Category?</p>
                  <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div style={{
                background: "#fff8f8", border: "1px solid #fecdd3",
                borderRadius: 10, padding: "12px 14px",
                fontSize: 13, color: "#475569", lineHeight: 1.7,
              }}>
                You are about to permanently delete{" "}
                <strong style={{ color: "#0f172a" }}>"{deletingType?.leave_type_title}"</strong>
                {" "}({deletingType?.leave_type_annual_quantity} days/yr).
                Employees will no longer be able to select this type.
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  style={{
                    padding: "9px 18px", background: "none",
                    border: "1.5px solid #e8ecf0", borderRadius: 10,
                    fontSize: 13, fontWeight: 600, color: "#64748b",
                    cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                  Keep It
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  style={{
                    padding: "9px 22px",
                    background: "linear-gradient(135deg, #f43f5e, #fb7185)",
                    border: "none", borderRadius: 10,
                    fontSize: 13, fontWeight: 700, color: "#fff",
                    cursor: deleting ? "not-allowed" : "pointer",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    display: "flex", alignItems: "center", gap: 8,
                    boxShadow: "0 4px 12px rgba(244,63,94,0.28)",
                    opacity: deleting ? 0.7 : 1,
                    transition: "opacity 0.15s",
                  }}
                >
                  {deleting
                    ? <><Loader2 size={14} className="spin" /> Deleting…</>
                    : <><Trash2 size={14} /> Yes, Delete</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaveTypes;