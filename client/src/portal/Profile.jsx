import React, { useRef, useState, useEffect } from "react";
import {
  ArrowLeft,
  UserCircle,
  Briefcase,
  Mail,
  Hash,
  UserCog,
  ShieldCheck,
  Camera,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const employeeId = storedUser.user_id;

  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/profile/${employeeId}`,
      );
      setProfile(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);


  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            My Profile
          </h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* ── Hero Card ── */}
        <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          {/* Banner */}
          <div className="h-28 bg-gradient-to-r from-blue-600 to-blue-400" />

          <div className="px-8 pb-7 flex flex-col sm:flex-row sm:items-end gap-5 -mt-12">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-md bg-blue-100 overflow-hidden flex items-center justify-center">
                <img
                  src={`http://localhost:5000/uploads/${profile?.user_image}`
                    }
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name & Meta */}
            <div className="pb-1">
              <h2 className="text-xl font-bold text-slate-900">
                {profile?.user_fullname || "—"}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <span className="text-sm text-slate-500 flex items-center gap-1.5">
                  <UserCog size={14} className="text-slate-400" />
                  {profile?.user_designation || "—"}
                </span>
                {profile?.user_role && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs rounded-lg">
                      <ShieldCheck size={12} />
                      {profile.user_role}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Personal Details ── */}
        <section className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-200 bg-slate-50 flex items-center gap-2 text-blue-600">
            <UserCircle size={18} />
            <h2 className="font-bold text-slate-800">Personal Details</h2>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-y-6 gap-x-10">
            {[
              {
                icon: <Mail size={15} />,
                label: "Email Address",
                value: profile?.user_email,
              },
              {
                icon: <Hash size={15} />,
                label: "Employee Code",
                value: profile?.user_code,
              },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="mt-0.5 p-2 bg-slate-100 rounded-lg text-slate-500 shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    {label}
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {value || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Employment Details ── */}
        <section className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-200 bg-slate-50 flex items-center gap-2 text-purple-600">
            <Briefcase size={18} />
            <h2 className="font-bold text-slate-800">Employment Details</h2>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-y-6 gap-x-10">
            {[
              {
                icon: <UserCog size={15} />,
                label: "Designation",
                value: profile?.user_designation,
              },
              {
                icon: <ShieldCheck size={15} />,
                label: "Role",
                value: profile?.user_role,
              },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="mt-0.5 p-2 bg-slate-100 rounded-lg text-slate-500 shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    {label}
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {value || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
