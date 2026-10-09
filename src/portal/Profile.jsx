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
  IdCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, getUploadUrl } from "../config/api.js";

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
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }
  .prof-back-btn:hover { border-color: #6366f1; background: #f5f3ff; color: #6366f1; }

  .prof-refresh-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px;
    font-size: 13px; font-weight: 700;
    color: #64748b;
    border: 1.5px solid #e8ecf0;
    border-radius: 12px;
    background: #fff;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s, box-shadow 0.15s;
  }
  .prof-refresh-btn:hover {
    border-color: #6366f1; background: #f5f3ff; color: #6366f1;
    box-shadow: 0 2px 8px rgba(99,102,241,0.12);
  }

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
    width: 88px; height: 88px;
    border-radius: 20px;
    border: 4px solid #fff;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    overflow: hidden;
    background: #eff6ff;
    flex-shrink: 0;
  }

  .prof-role-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 12px;
    border-radius: 9px;
    font-size: 11px; font-weight: 800;
    background: #f5f3ff; border: 1.5px solid #e0d9ff; color: #6366f1;
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
    padding: 16px 28px;
    display: flex; align-items: center; gap: 10px;
  }

  .prof-section-icon {
    padding: 8px;
    border-radius: 10px;
    display: flex;
    flex-shrink: 0;
  }

  /* ── Detail rows ── */
  .prof-field {
    display: flex; align-items: center; gap: 14px;
    padding: 18px 28px;
    border-bottom: 1px solid #f8fafc;
    transition: background 0.12s;
  }
  .prof-field:last-child { border-bottom: none; }
  .prof-field:hover { background: #f8f7ff; }

  .prof-field-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: #f1f5f9;
    border: 1px solid #e8ecf0;
    display: flex; align-items: center; justify-content: center;
    color: #64748b;
    flex-shrink: 0;
  }

  .prof-field-label {
    font-size: 10px; font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.08em;
    margin-bottom: 3px;
  }

  .prof-field-value {
    font-size: 13px; font-weight: 700;
    color: #0f172a;
  }

  .prof-code-chip {
    font-size: 12px; font-weight: 700;
    color: #64748b;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    padding: 3px 10px;
    font-family: 'Courier New', monospace;
    letter-spacing: 0.04em;
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

const Field = ({ icon, label, value, chip }) => (
  <div className="prof-field">
    <div className="prof-field-icon">{icon}</div>
    <div style={{ flex: 1 }}>
      <p className="prof-field-label">{label}</p>
      {chip
        ? <span className="prof-code-chip">{value || "—"}</span>
        : <p className="prof-field-value">{value || "—"}</p>
      }
    </div>
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const employeeId = storedUser?.user_id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/profile/${employeeId}`);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="prof-root">

        {/* ── Header ── */}
        <div className="prof-header px-6 py-3.5 flex items-center justify-between">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="prof-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                My Profile
              </h1>
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>
                Personal &amp; employment details
              </p>
            </div>
          </div>

          <button onClick={fetchProfile} className="prof-refresh-btn">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} strokeWidth={2.5} />
            Refresh
          </button>
        </div>

        <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ── Hero Card ── */}
          <div className="prof-hero">
            <div className="prof-banner" />

            <div style={{ padding: "0 28px 28px", marginTop: -44, display: "flex", alignItems: "flex-end", gap: 18 }}>
              {/* Avatar */}
              <div className="prof-avatar-ring">
                {profile?.user_image
                  ? <img src={getUploadUrl(profile.user_image)} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#eff6ff", color: "#6366f1", fontWeight: 900, fontSize: 28 }}>
                      {profile?.user_fullname?.[0]?.toUpperCase() || "?"}
                    </div>
                }
              </div>

              {/* Name & badges */}
              <div style={{ paddingBottom: 4, flex: 1 }}>
                {loading
                  ? <>
                      <div className="prof-skeleton" style={{ width: 180, height: 20, marginBottom: 8, marginTop: 46 }} />
                      <div className="prof-skeleton" style={{ width: 110, height: 14 }} />
                    </>
                  : <>
                      <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", marginTop: 46, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                        {profile?.user_fullname || "—"}
                      </h2>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
                        {profile?.user_designation && (
                          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                            <UserCog size={13} color="#94a3b8" strokeWidth={2.5} />
                            {profile.user_designation}
                          </span>
                        )}
                        {profile?.user_role && (
                          <>
                            <span style={{ color: "#cbd5e1", fontSize: 14 }}>·</span>
                            <span className="prof-role-badge">
                              <ShieldCheck size={11} strokeWidth={2.5} />
                              {profile.user_role}
                            </span>
                          </>
                        )}
                      </div>
                    </>
                }
              </div>
            </div>
          </div>

          {/* ── Personal Details ── */}
          <div className="prof-section">
            <div className="prof-section-header">
              <div className="prof-section-icon" style={{ background: "#eff6ff" }}>
                <UserCircle size={16} color="#3b82f6" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Personal Details</p>
                <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 1 }}>Contact &amp; identification</p>
              </div>
            </div>

            {loading
              ? <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
                  {[160, 120].map((w, i) => <div key={i} className="prof-skeleton" style={{ width: w, height: 14 }} />)}
                </div>
              : <>
                  <Field icon={<Mail size={15} strokeWidth={2.5} />} label="Email Address" value={profile?.user_email} />
                  <Field icon={<Hash size={15} strokeWidth={2.5} />} label="Employee Code" value={profile?.user_code} chip />
                </>
            }
          </div>

          {/* ── Employment Details ── */}
          <div className="prof-section">
            <div className="prof-section-header">
              <div className="prof-section-icon" style={{ background: "#faf5ff" }}>
                <Briefcase size={16} color="#7c3aed" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Employment Details</p>
                <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 1 }}>Role &amp; designation</p>
              </div>
            </div>

            {loading
              ? <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
                  {[140, 100].map((w, i) => <div key={i} className="prof-skeleton" style={{ width: w, height: 14 }} />)}
                </div>
              : <>
                  <Field icon={<Building2 size={15} strokeWidth={2.5} />} label="Designation" value={profile?.user_designation} />
                  <Field icon={<ShieldCheck size={15} strokeWidth={2.5} />} label="Role" value={profile?.user_role} />
                </>
            }
          </div>

        </main>
      </div>
    </>
  );
};

export default Profile;