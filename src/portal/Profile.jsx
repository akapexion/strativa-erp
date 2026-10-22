import React, { useRef, useState, useEffect } from "react";
import {
  ArrowLeft,
  UserCircle,
  Briefcase,
  Mail,
  Hash,
  UserCog,
  ShieldCheck,
  RefreshCw,
  Building2,
  Phone,
  Calendar,
  CreditCard,
  Clock,
  DollarSign,
  Edit3,
  Check,
  X,
  Camera,
  Lock,
  LockKeyhole,
  GraduationCap,
  Heart,
  Landmark,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, getUploadUrl } from "../config/api.js";
import { gooeyToast } from "goey-toast";
import { showValidationToast } from "../utils/formValidationToast.js";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .prof-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .prof-root { background: #f8fafc; min-height: 100vh; }

  /* ── Header ── */
  .prof-header {
    background: #fff;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
    position: sticky; top: 0; z-index: 40;
  }

  .prof-back-btn {
    width: 36px; height: 36px;
    border-radius: 10px;
    border: 1.5px solid #e8ecf0;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    color: #64748b; cursor: pointer;
    transition: all 0.15s;
  }
  .prof-back-btn:hover { border-color: #6366f1; background: #f5f3ff; color: #6366f1; }

  .prof-btn-secondary {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px;
    font-size: 13px; font-weight: 700;
    color: #64748b;
    border: 1.5px solid #e8ecf0;
    border-radius: 12px;
    background: #fff;
    cursor: pointer;
    transition: all 0.15s;
  }
  .prof-btn-secondary:hover {
    border-color: #6366f1; background: #f5f3ff; color: #6366f1;
    box-shadow: 0 2px 8px rgba(99,102,241,0.12);
  }

  .prof-btn-primary {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 18px;
    font-size: 13px; font-weight: 700;
    color: #fff;
    background: #4f46e5;
    border: 1.5px solid #4f46e5;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .prof-btn-primary:hover { background: #4338ca; border-color: #4338ca; }

  /* ── Hero Card ── */
  .prof-hero {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }

  .prof-banner {
    height: 110px;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #3730a3 100%);
    position: relative;
  }
  .prof-banner::after {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  .prof-avatar-ring {
    width: 94px; height: 94px;
    border-radius: 22px;
    border: 4px solid #fff;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    overflow: hidden;
    background: #eff6ff;
    position: relative;
    flex-shrink: 0;
  }

  .prof-avatar-overlay {
    position: absolute; inset: 0;
    background: rgba(15, 23, 42, 0.45);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    color: #fff; font-size: 10px; font-weight: 700;
    opacity: 0; cursor: pointer; transition: opacity 0.15s;
  }
  .prof-avatar-ring:hover .prof-avatar-overlay { opacity: 1; }

  .prof-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px;
    border-radius: 8px;
    font-size: 11px; font-weight: 800;
    letter-spacing: 0.02em;
  }

  /* ── Section Cards ── */
  .prof-section {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
    overflow: hidden;
  }

  .prof-section-header {
    background: #fafbfc;
    border-bottom: 1px solid #f1f5f9;
    padding: 16px 24px;
    display: flex; align-items: center; justify-content: space-between;
  }

  /* ── Detail rows ── */
  .prof-field {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 16px 24px;
    border-bottom: 1px solid #f8fafc;
    transition: background 0.12s;
  }
  .prof-field:last-child { border-bottom: none; }
  .prof-field:hover { background: #fafafa; }

  .prof-field-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: #f1f5f9;
    border: 1px solid #e8ecf0;
    display: flex; align-items: center; justify-content: center;
    color: #64748b;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .prof-field-label {
    font-size: 10px; font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.08em;
    margin-bottom: 3px;
    display: flex; align-items: center; gap: 6px;
  }

  .prof-field-value {
    font-size: 13px; font-weight: 700;
    color: #0f172a;
  }

  .prof-protected-tag {
    font-size: 9px; font-weight: 700;
    padding: 1px 6px;
    border-radius: 4px;
    background: #f1f5f9; color: #64748b;
    text-transform: none; letter-spacing: normal;
  }

  .prof-input {
    width: 100%;
    max-width: 380px;
    font-size: 13px; font-weight: 600;
    color: #0f172a;
    padding: 8px 12px;
    border-radius: 10px;
    border: 1.5px solid #cbd5e1;
    background: #fff;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .prof-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }

  .prof-code-chip {
    font-size: 12px; font-weight: 700;
    color: #4f46e5;
    background: #eef2ff;
    border: 1px solid #c7d2fe;
    border-radius: 7px;
    padding: 2px 8px;
    font-family: 'Courier New', monospace;
  }

  /* ── Skeleton ── */
  .prof-skeleton {
    background: linear-gradient(90deg, #f1f5f9 25%, #e8ecf0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
  }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
`;

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const employeeId = storedUser?.user_id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Editable form state
  const [formData, setFormData] = useState({
    user_fullname: "",
    employee_phonenumber: "",
    employee_maritalstatus: "Single",
    employee_qualification: "",
  });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/profile/${employeeId}`);
      setProfile(res.data);
      setFormData({
        user_fullname: res.data.user_fullname || "",
        employee_phonenumber: res.data.employee_phonenumber || "",
        employee_maritalstatus: res.data.employee_maritalstatus || "Single",
        employee_qualification: res.data.employee_qualification || "",
      });
    } catch (err) {
      console.error(err);
      gooeyToast.error("Failed to load profile details", {
        fillColor: "#FFF",
        timing: { displayDuration: 3000 },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchProfile();
    }
  }, [employeeId]);

  // Handle personal info save
  const handleSaveProfile = async () => {
    if (!formData.user_fullname.trim()) {
      showValidationToast(["Full name cannot be empty."]);
      return;
    }

    setSaving(true);
    try {
      const res = await axios.put(`${API_BASE_URL}/profile/${employeeId}`, formData);
      if (res.data?.success) {
        gooeyToast.success("Profile updated successfully", {
          fillColor: "#FFF",
          timing: { displayDuration: 3000 },
        });

        // Update local storage user fullname if changed
        const updatedLocal = { ...storedUser, user_fullname: formData.user_fullname };
        localStorage.setItem("user", JSON.stringify(updatedLocal));

        setIsEditing(false);
        fetchProfile();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Error updating profile";
      showValidationToast([msg]);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setFormData({
        user_fullname: profile.user_fullname || "",
        employee_phonenumber: profile.employee_phonenumber || "",
        employee_maritalstatus: profile.employee_maritalstatus || "Single",
        employee_qualification: profile.employee_qualification || "",
      });
    }
    setIsEditing(false);
  };

  // Profile image upload
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showValidationToast(["Please select a valid image file (PNG, JPG, JPEG)."]);
      return;
    }

    const data = new FormData();
    data.append("user_image", file);

    setUploadingImage(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/profile/upload/${employeeId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        gooeyToast.success("Profile photo updated", {
          fillColor: "#FFF",
          timing: { displayDuration: 3000 },
        });

        // Update local user object
        const updatedUser = { ...storedUser, user_image: res.data.image };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        fetchProfile();
      }
    } catch (err) {
      showValidationToast(["Failed to upload image. Please try again."]);
    } finally {
      setUploadingImage(false);
    }
  };

  const profileBase =
    storedUser.user_role === "admin"
      ? "/hr360/admin"
      : storedUser.user_role === "manager"
      ? "/hr360/manager"
      : "/hr360/user";

  return (
    <>
      <style>{styles}</style>
      <div className="prof-root pb-16">
        {/* ── Top Sticky Header ── */}
        <div className="prof-header px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="prof-back-btn" onClick={() => navigate(-1)} title="Go Back">
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-base font-black text-slate-900 tracking-tight leading-tight">
                My Profile
              </h1>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                Personal details, firm assignment & compensation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={fetchProfile} className="prof-btn-secondary">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} strokeWidth={2.5} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link to={`${profileBase}/profile-changepassword`}>
              <button className="prof-btn-secondary text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                <LockKeyhole size={14} strokeWidth={2.5} />
                <span>Security</span>
              </button>
            </Link>
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 flex flex-col gap-6">
          {/* ── Hero Card ── */}
          <div className="prof-hero">
            <div className="prof-banner" />

            <div className="px-6 pb-6 -mt-11 flex flex-col sm:flex-row sm:items-end gap-5">
              {/* Avatar with Upload Trigger */}
              <div className="prof-avatar-ring">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                {profile?.user_image ? (
                  <img
                    src={getUploadUrl(profile.user_image)}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600 font-black text-3xl">
                    {profile?.user_fullname?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <div
                  className="prof-avatar-overlay"
                  onClick={() => fileInputRef.current?.click()}
                  title="Change Profile Photo"
                >
                  <Camera size={16} />
                  <span>{uploadingImage ? "Saving..." : "Change"}</span>
                </div>
              </div>

              {/* Name & Badges */}
              <div className="flex-1 min-w-0 sm:pt-12">
                {loading ? (
                  <>
                    <div className="prof-skeleton w-48 h-6 mb-2" />
                    <div className="prof-skeleton w-32 h-4" />
                  </>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          {profile?.user_fullname || "—"}
                        </h2>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <UserCog size={13} className="text-indigo-500" />
                          {profile?.user_designation || "Staff Member"}
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-600 font-mono font-bold">
                            {profile?.user_code}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="prof-badge bg-indigo-50 border border-indigo-100 text-indigo-700">
                          <ShieldCheck size={12} />
                          {profile?.user_role?.toUpperCase()}
                        </span>
                        <span className="prof-badge bg-emerald-50 border border-emerald-100 text-emerald-700">
                          <Building2 size={12} />
                          {profile?.firm_name || "Strativa"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── SECTION 1: Personal Information (Editable) ── */}
          <div className="prof-section">
            <div className="prof-section-header">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <UserCircle size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Editable personal details and contact
                  </p>
                </div>
              </div>

              {!loading && (
                <div>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={saving}
                        className="prof-btn-secondary py-1.5 px-3 text-xs"
                      >
                        <X size={13} />
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="prof-btn-primary py-1.5 px-3.5 text-xs"
                      >
                        <Check size={13} />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="prof-btn-secondary py-1.5 px-3.5 text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    >
                      <Edit3 size={13} />
                      Edit Details
                    </button>
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <div className="p-6 space-y-4">
                {[180, 240, 160].map((w, i) => (
                  <div key={i} className="prof-skeleton h-5" style={{ width: w }} />
                ))}
              </div>
            ) : (
              <div>
                {/* Full Name */}
                <div className="prof-field">
                  <div className="prof-field-icon">
                    <UserCircle size={15} />
                  </div>
                  <div className="flex-1">
                    <p className="prof-field-label">Full Name</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.user_fullname}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, user_fullname: e.target.value }))
                        }
                        className="prof-input"
                        placeholder="Enter full name"
                      />
                    ) : (
                      <p className="prof-field-value">{profile?.user_fullname || "—"}</p>
                    )}
                  </div>
                </div>

                {/* Email (Read Only - Managed by HR) */}
                <div className="prof-field">
                  <div className="prof-field-icon">
                    <Mail size={15} />
                  </div>
                  <div className="flex-1">
                    <p className="prof-field-label">
                      Email Address
                      <span className="prof-protected-tag">HR Protected</span>
                    </p>
                    <p className="prof-field-value font-mono">{profile?.user_email || "—"}</p>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="prof-field">
                  <div className="prof-field-icon">
                    <Phone size={15} />
                  </div>
                  <div className="flex-1">
                    <p className="prof-field-label">Phone Number</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.employee_phonenumber}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, employee_phonenumber: e.target.value }))
                        }
                        className="prof-input"
                        placeholder="e.g. 0300-1234567"
                      />
                    ) : (
                      <p className="prof-field-value">
                        {profile?.employee_phonenumber || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Marital Status */}
                <div className="prof-field">
                  <div className="prof-field-icon">
                    <Heart size={15} />
                  </div>
                  <div className="flex-1">
                    <p className="prof-field-label">Marital Status</p>
                    {isEditing ? (
                      <select
                        value={formData.employee_maritalstatus}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, employee_maritalstatus: e.target.value }))
                        }
                        className="prof-input"
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    ) : (
                      <p className="prof-field-value">
                        {profile?.employee_maritalstatus || "Single"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Highest Qualification */}
                <div className="prof-field">
                  <div className="prof-field-icon">
                    <GraduationCap size={15} />
                  </div>
                  <div className="flex-1">
                    <p className="prof-field-label">Highest Qualification</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.employee_qualification}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, employee_qualification: e.target.value }))
                        }
                        className="prof-input"
                        placeholder="e.g. BS Computer Science"
                      />
                    ) : (
                      <p className="prof-field-value">
                        {profile?.employee_qualification || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                {/* CNIC (Protected) */}
                <div className="prof-field">
                  <div className="prof-field-icon">
                    <CreditCard size={15} />
                  </div>
                  <div className="flex-1">
                    <p className="prof-field-label">
                      National ID (CNIC)
                      <span className="prof-protected-tag">HR Protected</span>
                    </p>
                    <p className="prof-field-value font-mono">
                      {profile?.employee_cnicnumber || "—"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SECTION 2: Employment & Firm Details (Read-only / HR Protected) ── */}
          <div className="prof-section">
            <div className="prof-section-header">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Briefcase size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Employment & Firm Details</h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Organization assignment and workplace attributes
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Lock size={12} /> Managed by HR
              </span>
            </div>

            {loading ? (
              <div className="p-6 space-y-4">
                {[140, 200, 180].map((w, i) => (
                  <div key={i} className="prof-skeleton h-5" style={{ width: w }} />
                ))}
              </div>
            ) : (
              <div>
                <div className="prof-field">
                  <div className="prof-field-icon">
                    <Building2 size={15} />
                  </div>
                  <div className="flex-1">
                    <p className="prof-field-label">Assigned Firm</p>
                    <p className="prof-field-value flex items-center gap-2">
                      <span>{profile?.firm_name || "Apexion Strativa Global"}</span>
                      <span className="prof-code-chip">{profile?.firm_code || "APEX"}</span>
                    </p>
                  </div>
                </div>

                <div className="prof-field">
                  <div className="prof-field-icon">
                    <Hash size={15} />
                  </div>
                  <div className="flex-1">
                    <p className="prof-field-label">Employee ID</p>
                    <p className="prof-field-value font-mono">{profile?.user_code || "—"}</p>
                  </div>
                </div>

                <div className="prof-field">
                  <div className="prof-field-icon">
                    <Briefcase size={15} />
                  </div>
                  <div className="flex-1">
                    <p className="prof-field-label">Department & Status</p>
                    <p className="prof-field-value">
                      {profile?.employee_department || "General"} ·{" "}
                      <span className="text-slate-500 font-normal">
                        {profile?.employment_status || "Permanent"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="prof-field">
                  <div className="prof-field-icon">
                    <Calendar size={15} />
                  </div>
                  <div className="flex-1">
                    <p className="prof-field-label">Joining Date</p>
                    <p className="prof-field-value">
                      {profile?.employee_joiningdate
                        ? new Date(profile.employee_joiningdate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SECTION 3: Shift & Compensation (Read-only / HR Protected) ── */}
          <div className="prof-section">
            <div className="prof-section-header">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <DollarSign size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Shift & Compensation</h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Working schedule, hourly expectations and payroll
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Lock size={12} /> Managed by HR
              </span>
            </div>

            {loading ? (
              <div className="p-6 space-y-4">
                {[170, 220].map((w, i) => (
                  <div key={i} className="prof-skeleton h-5" style={{ width: w }} />
                ))}
              </div>
            ) : (
              <div>
                <div className="prof-field">
                  <div className="prof-field-icon">
                    <Clock size={15} />
                  </div>
                  <div className="flex-1">
                    <p className="prof-field-label">Assigned Shift</p>
                    <p className="prof-field-value">
                      {profile?.assigned_shift?.shift_name || "Standard Morning Shift"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {profile?.assigned_shift?.start_time || "09:00 AM"} –{" "}
                      {profile?.assigned_shift?.end_time || "05:00 PM"} (
                      {profile?.assigned_shift?.expected_hours_per_day || 8.0} hrs/day)
                    </p>
                  </div>
                </div>

                <div className="prof-field">
                  <div className="prof-field-icon">
                    <DollarSign size={15} />
                  </div>
                  <div className="flex-1">
                    <p className="prof-field-label">Salary Basis & Amount</p>
                    <p className="prof-field-value flex items-center gap-2">
                      <span className="text-emerald-700 font-extrabold text-sm">
                        PKR {Number(profile?.employee_salary || 0).toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {profile?.salary_basis || "Monthly"}
                      </span>
                    </p>
                  </div>
                </div>

                {profile?.bank_details?.account_number && (
                  <div className="prof-field">
                    <div className="prof-field-icon">
                      <Landmark size={15} />
                    </div>
                    <div className="flex-1">
                      <p className="prof-field-label">Disbursement Bank</p>
                      <p className="prof-field-value">
                        {profile.bank_details.bank_name || "Bank Account"} ·{" "}
                        <span className="font-mono text-xs">
                          {profile.bank_details.account_number}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Profile;