import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api.js";
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Users,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Key,
  Copy,
  Check,
} from "lucide-react";
import { gooeyToast } from "goey-toast";
import { showValidationToast } from "../../utils/formValidationToast.js";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .firm-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .firm-root { background: #f8fafc; min-height: 100vh; padding: 32px 24px; }

  .firm-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }

  .firm-table { width: 100%; border-collapse: collapse; }
  .firm-th {
    text-align: left; font-size: 11px; font-weight: 800;
    color: #94a3b8; text-transform: uppercase; letter-spacing: 0.07em;
    padding: 14px 20px; background: #fafbfc; border-bottom: 1px solid #f1f5f9;
  }
  .firm-th:first-child { padding-left: 28px; }
  .firm-th:last-child { padding-right: 28px; }

  .firm-tr { border-bottom: 1px solid #f8fafc; transition: background 0.12s; }
  .firm-tr:last-child { border-bottom: none; }
  .firm-tr:hover { background: #f8f7ff; }

  .firm-td { padding: 16px 20px; vertical-align: middle; }
  .firm-td:first-child { padding-left: 28px; }
  .firm-td:last-child { padding-right: 28px; }

  .firm-btn-primary {
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    color: #fff; border: none; border-radius: 12px;
    padding: 10px 20px; font-size: 13px; font-weight: 700;
    cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
    box-shadow: 0 4px 14px rgba(99,102,241,0.28);
    transition: transform 0.15s, filter 0.15s;
  }
  .firm-btn-primary:hover { filter: brightness(1.08); transform: translateY(-1px); }

  .firm-input {
    width: 100%; padding: 10px 14px;
    font-size: 13px; font-weight: 600; color: #0f172a;
    border: 1.5px solid #e8ecf0; border-radius: 12px;
    outline: none; transition: border-color 0.15s; box-sizing: border-box;
  }
  .firm-input:focus { border-color: #6366f1; }

  /* Modal */
  .firm-modal-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .firm-modal {
    background: #fff; border-radius: 24px; width: 100%; max-width: 520px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.15); overflow: hidden;
  }
  .firm-modal-header {
    padding: 20px 24px; background: #fafbfc; border-bottom: 1px solid #f1f5f9;
    display: flex; align-items: center; justify-content: space-between;
  }
  .firm-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .firm-modal-footer {
    padding: 16px 24px; background: #fafbfc; border-top: 1px solid #f1f5f9;
    display: flex; justify-content: flex-end; gap: 10px;
  }
`;

const Firms = () => {
  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingFirm, setEditingFirm] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    firm_name: "",
    firm_code: "",
    firm_email: "",
    firm_phone: "",
    firm_address: "",
    employee_limit: 50,
    status: "active",
  });

  // Manager Credentials Modal State
  const [managerModal, setManagerModal] = useState({
    open: false,
    firm: null,
    manager: null,
    loading: false,
    copied: false,
  });

  const openManagerModal = async (firm) => {
    setManagerModal({ open: true, firm, manager: null, loading: true, copied: false });
    try {
      const res = await axios.get(`${API_BASE_URL}/firm/${firm._id}/manager`);
      if (res.data?.success) {
        setManagerModal({
          open: true,
          firm,
          manager: res.data.manager,
          loading: false,
          copied: false,
        });
      }
    } catch (err) {
      console.error("Manager fetch/provision err:", err);
      showValidationToast(err.response?.data?.message || "Failed to load manager credentials");
      setManagerModal({ open: false, firm: null, manager: null, loading: false, copied: false });
    }
  };

  const copyManagerCredentials = () => {
    if (!managerModal.manager) return;
    const text = `Firm: ${managerModal.firm?.firm_name}\nManager Login Code: ${managerModal.manager.user_code}\nPassword: ${managerModal.manager.initial_password || "123"}\nEmail: ${managerModal.manager.user_email}`;
    navigator.clipboard.writeText(text);
    setManagerModal((prev) => ({ ...prev, copied: true }));
    gooeyToast.success("Manager credentials copied!", { fillColor: "#FFF", bounce: 0.45, timing: { displayDuration: 2000 } });
    setTimeout(() => {
      setManagerModal((prev) => ({ ...prev, copied: false }));
    }, 2500);
  };

  const fetchFirms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/firm/all`);
      if (res.data?.success) {
        setFirms(res.data.firms || []);
      }
    } catch (err) {
      console.error("Fetch firms error:", err);
      showValidationToast(err.response?.data?.message || "Failed to load firms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFirms();
  }, []);

  const openCreateModal = () => {
    setEditingFirm(null);
    setFormData({
      firm_name: "",
      firm_code: "",
      firm_email: "",
      firm_phone: "",
      firm_address: "",
      employee_limit: 50,
      status: "active",
    });
    setShowModal(true);
  };

  const openEditModal = (firm) => {
    setEditingFirm(firm);
    setFormData({
      firm_name: firm.firm_name,
      firm_code: firm.firm_code,
      firm_email: firm.firm_email,
      firm_phone: firm.firm_phone || "",
      firm_address: firm.firm_address || "",
      employee_limit: firm.employee_limit || 50,
      status: firm.status || "active",
    });
    setShowModal(true);
  };

  const handleSaveFirm = async (e) => {
    e.preventDefault();

    if (!formData.firm_name.trim()) {
      showValidationToast("Please enter a valid firm name");
      return;
    }
    if (!formData.firm_code.trim()) {
      showValidationToast("Please provide a unique firm code / slug");
      return;
    }
    if (!formData.firm_email.trim() || !formData.firm_email.includes("@")) {
      showValidationToast("Please enter a valid contact email for the firm");
      return;
    }
    if (Number(formData.employee_limit) < 1) {
      showValidationToast("Employee limit must be at least 1");
      return;
    }

    setSaving(true);
    try {
      if (editingFirm) {
        const res = await axios.put(`${API_BASE_URL}/firm/update/${editingFirm._id}`, formData);
        gooeyToast.success(res.data.message || "Firm updated successfully", {
          fillColor: "#FFF",
          bounce: 0.45,
          timing: { displayDuration: 2500 },
        });
      } else {
        const res = await axios.post(`${API_BASE_URL}/firm/create`, formData);
        gooeyToast.success(res.data.message || "Firm created successfully", {
          fillColor: "#FFF",
          bounce: 0.45,
          timing: { displayDuration: 2500 },
        });
      }
      setShowModal(false);
      fetchFirms();
    } catch (err) {
      console.error("Save firm error:", err);
      showValidationToast(err.response?.data?.message || "Failed to save firm details");
    } finally {
      setSaving(false);
    }
  };

  const filteredFirms = firms.filter(
    (f) =>
      f.firm_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.firm_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.firm_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>
      <div className="firm-root">
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Header Row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>
                Multi-Firm Management
              </h1>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                Configure client organizations, tenant profiles, and maximum employee limits
              </p>
            </div>

            <button onClick={openCreateModal} className="firm-btn-primary">
              <Plus size={16} strokeWidth={2.5} />
              Add New Firm
            </button>
          </div>

          {/* Search bar */}
          <div style={{ position: "relative", maxWidth: 400 }}>
            <Search
              size={16}
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
            />
            <input
              type="text"
              placeholder="Search firm by name, code, or email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="firm-input"
              style={{ paddingLeft: 40 }}
            />
          </div>

          {/* Table Card */}
          <div className="firm-card">
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", gap: 12 }}>
                <Loader2 size={28} color="#6366f1" className="animate-spin" />
                <p style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>Loading organizations…</p>
              </div>
            ) : filteredFirms.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 24px" }}>
                <Building2 size={36} color="#cbd5e1" style={{ margin: "0 auto 12px" }} />
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>No Organizations Found</h3>
                <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                  No firms match your query. Click "Add New Firm" to onboard your first organization.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="firm-table">
                  <thead>
                    <tr>
                      <th className="firm-th">Firm Name &amp; Code</th>
                      <th className="firm-th">Contact Info</th>
                      <th className="firm-th">Employee Capacity</th>
                      <th className="firm-th">Status</th>
                      <th className="firm-th" style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFirms.map((firm) => {
                      const active = firm.active_employees_count || 0;
                      const limit = firm.employee_limit || 50;
                      const isFull = active >= limit;
                      const percent = Math.min(100, Math.round((active / limit) * 100));

                      return (
                        <tr key={firm._id} className="firm-tr">
                          <td className="firm-td">
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div
                                style={{
                                  width: 42,
                                  height: 42,
                                  borderRadius: 12,
                                  background: "#eef2ff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#4f46e5",
                                  fontWeight: 900,
                                  fontSize: 14,
                                }}
                              >
                                {firm.firm_code}
                              </div>
                              <div>
                                <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
                                  {firm.firm_name}
                                </p>
                                <p style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>
                                  ID: {firm.firm_code}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="firm-td">
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                              {firm.firm_email}
                            </p>
                            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                              {firm.firm_phone || "—"}
                            </p>
                          </td>

                          <td className="firm-td" style={{ minWidth: 200 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                              <span style={{ fontSize: 12, fontWeight: 800, color: isFull ? "#e11d48" : "#0f172a" }}>
                                {active} / {limit} Employees
                              </span>
                              <span style={{ fontSize: 10, fontWeight: 700, color: isFull ? "#e11d48" : "#64748b" }}>
                                {isFull ? "CAPACITY FULL" : `${limit - active} slots left`}
                              </span>
                            </div>
                            <div style={{ width: "100%", height: 6, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                              <div
                                style={{
                                  width: `${percent}%`,
                                  height: "100%",
                                  background: isFull ? "#e11d48" : "#6366f1",
                                  borderRadius: 99,
                                }}
                              />
                            </div>
                          </td>

                          <td className="firm-td">
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 10px",
                                borderRadius: 8,
                                fontSize: 11,
                                fontWeight: 800,
                                background: firm.status === "active" ? "#ecfdf5" : "#f1f5f9",
                                color: firm.status === "active" ? "#059669" : "#64748b",
                                border: `1px solid ${firm.status === "active" ? "#a7f3d0" : "#e2e8f0"}`,
                                textTransform: "uppercase",
                              }}
                            >
                              {firm.status}
                            </span>
                          </td>

                          <td className="firm-td" style={{ textAlign: "right" }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                              <button
                                onClick={() => openManagerModal(firm)}
                                style={{
                                  padding: "6px 12px",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: "#059669",
                                  background: "#ecfdf5",
                                  border: "1.5px solid #a7f3d0",
                                  borderRadius: 8,
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 5,
                                  fontFamily: "inherit",
                                }}
                                title="View or provision Manager login credentials for this firm"
                              >
                                <Key size={13} strokeWidth={2.5} />
                                Manager Login
                              </button>
                              <button
                                onClick={() => openEditModal(firm)}
                                style={{
                                  padding: "6px 14px",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: "#6366f1",
                                  background: "#f5f3ff",
                                  border: "1.5px solid #e0e7ff",
                                  borderRadius: 8,
                                  cursor: "pointer",
                                  fontFamily: "inherit",
                                }}
                              >
                                Edit &amp; Limit
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal: Create or Edit Firm */}
        {showModal && (
          <div className="firm-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="firm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="firm-modal-header">
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>
                    {editingFirm ? "Configure Organization" : "Register New Organization"}
                  </h3>
                  <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                    Manage firm profile and employee onboarding capacity
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ border: "none", background: "#f1f5f9", borderRadius: 8, padding: 6, cursor: "pointer" }}
                >
                  <X size={16} color="#64748b" />
                </button>
              </div>

              <form onSubmit={handleSaveFirm}>
                <div className="firm-modal-body">
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                      Firm / Organization Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apexion Innovations Ltd"
                      value={formData.firm_name}
                      onChange={(e) => setFormData({ ...formData, firm_name: e.target.value })}
                      className="firm-input"
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                        Firm Code (Unique Slug) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. APEX"
                        disabled={!!editingFirm}
                        value={formData.firm_code}
                        onChange={(e) => setFormData({ ...formData, firm_code: e.target.value.toUpperCase() })}
                        className="firm-input"
                        style={{ textTransform: "uppercase" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                        Employee Capacity Limit *
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 50"
                        value={formData.employee_limit}
                        onChange={(e) => setFormData({ ...formData, employee_limit: e.target.value })}
                        className="firm-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                      Official Contact Email *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. hr@apexion.com"
                      value={formData.firm_email}
                      onChange={(e) => setFormData({ ...formData, firm_email: e.target.value })}
                      className="firm-input"
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="+92 300 1234567"
                        value={formData.firm_phone}
                        onChange={(e) => setFormData({ ...formData, firm_phone: e.target.value })}
                        className="firm-input"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="firm-input"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                      Physical / Office Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Suite 400, Strativa Tech Hub"
                      value={formData.firm_address}
                      onChange={(e) => setFormData({ ...formData, firm_address: e.target.value })}
                      className="firm-input"
                    />
                  </div>
                </div>

                <div className="firm-modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      padding: "8px 16px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#64748b",
                      background: "#f1f5f9",
                      border: "none",
                      borderRadius: 10,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      padding: "8px 20px",
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#fff",
                      background: "#6366f1",
                      border: "none",
                      borderRadius: 10,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {saving ? "Saving…" : editingFirm ? "Update Firm" : "Create Firm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Manager Credentials */}
        {managerModal.open && (
          <div
            className="firm-modal-overlay"
            onClick={() => setManagerModal({ open: false, firm: null, manager: null, loading: false, copied: false })}
          >
            <div className="firm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="firm-modal-header">
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>
                    Firm Manager Credentials
                  </h3>
                  <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    {managerModal.firm?.firm_name} ({managerModal.firm?.firm_code})
                  </p>
                </div>
                <button
                  onClick={() => setManagerModal({ open: false, firm: null, manager: null, loading: false, copied: false })}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="firm-modal-body">
                {managerModal.loading ? (
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <Loader2 size={26} color="#6366f1" className="animate-spin" style={{ margin: "0 auto 10px" }} />
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>
                      Retrieving manager account…
                    </p>
                  </div>
                ) : managerModal.manager ? (
                  <>
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 14,
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ fontSize: 11, fontWeight: 800, color: "#166534", textTransform: "uppercase" }}>
                            Login Identifier (Step 1)
                          </p>
                          <p style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", fontFamily: "monospace", letterSpacing: 0.5 }}>
                            {managerModal.manager.user_code}
                          </p>
                        </div>
                        <button
                          onClick={copyManagerCredentials}
                          style={{
                            padding: "6px 12px",
                            fontSize: 12,
                            fontWeight: 700,
                            color: managerModal.copied ? "#15803d" : "#4f46e5",
                            background: "#fff",
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          {managerModal.copied ? <Check size={14} /> : <Copy size={14} />}
                          {managerModal.copied ? "Copied" : "Copy"}
                        </button>
                      </div>

                      <div style={{ borderTop: "1px dashed #bbf7d0", paddingTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div>
                          <p style={{ fontSize: 10, fontWeight: 700, color: "#166534", textTransform: "uppercase" }}>
                            Password (Step 2)
                          </p>
                          <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
                            {managerModal.manager.initial_password || "123"}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: 10, fontWeight: 700, color: "#166534", textTransform: "uppercase" }}>
                            Manager Name
                          </p>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
                            {managerModal.manager.user_fullname}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: 14,
                        borderRadius: 12,
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <h4 style={{ fontSize: 12, fontWeight: 800, color: "#334155", marginBottom: 6 }}>
                        How to Add Employees to this Firm:
                      </h4>
                      <ol style={{ fontSize: 12, color: "#64748b", paddingLeft: 18, lineHeight: "1.6", margin: 0 }}>
                        <li>Sign out from your Admin account (or open an Incognito tab).</li>
                        <li>
                          Go to the login screen and enter Employee Code{" "}
                          <strong style={{ color: "#0f172a" }}>{managerModal.manager.user_code}</strong>.
                        </li>
                        <li>
                          Enter password <strong style={{ color: "#0f172a" }}>{managerModal.manager.initial_password || "123"}</strong> to enter the Firm Manager portal.
                        </li>
                        <li>
                          Click <strong>Employees &rarr; Add New Employee</strong> to onboard team members within your firm limit.
                        </li>
                      </ol>
                    </div>
                  </>
                ) : (
                  <p style={{ fontSize: 13, color: "#ef4444" }}>Could not load manager details.</p>
                )}
              </div>

              <div className="firm-modal-footer">
                <button
                  type="button"
                  onClick={() => setManagerModal({ open: false, firm: null, manager: null, loading: false, copied: false })}
                  style={{
                    padding: "8px 20px",
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#fff",
                    background: "#6366f1",
                    border: "none",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Firms;
