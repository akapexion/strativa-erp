import axios from "axios";
import { gooeyToast } from "goey-toast";
import React, { useState } from "react";
import { KeyRound, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";

const ProfileChangePassword = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const employeeId = storedUser?.user_id;

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showFields, setShowFields] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);

  const fields = [
    { name: "currentPassword", placeholder: "Current Password", label: "Current Password" },
    { name: "newPassword", placeholder: "New Password", label: "New Password" },
    { name: "confirmPassword", placeholder: "Confirm New Password", label: "Confirm New Password" },
  ];

  const passwordsMatch =
    passwords.newPassword &&
    passwords.confirmPassword &&
    passwords.newPassword === passwords.confirmPassword;

  const passwordsMismatch =
    passwords.newPassword &&
    passwords.confirmPassword &&
    passwords.newPassword !== passwords.confirmPassword;

  // ✅ Change Password Handler
  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      gooeyToast.error("New password and confirm password do not match", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/profile/${employeeId}/change-password`,
        passwords
      );

      gooeyToast.success("Password updated successfully", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      gooeyToast.error(err.response?.data?.message || "Error updating password", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Card */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Card Header */}
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 text-blue-600">
            <KeyRound size={18} />
            <h2 className="font-bold text-slate-800">Change Password</h2>
          </div>

          {/* Card Body */}
          <div className="p-8 space-y-5">

            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  {field.label}
                </label>
                <div className="relative">
                  <KeyRound
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={17}
                  />
                  <input
                    type={showFields[field.name] ? "text" : "password"}
                    placeholder={field.placeholder}
                    value={passwords[field.name]}
                    onChange={(e) =>
                      setPasswords({ ...passwords, [field.name]: e.target.value })
                    }
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowFields({
                        ...showFields,
                        [field.name]: !showFields[field.name],
                      })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showFields[field.name] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ))}

            {/* Match / Mismatch Indicator */}
            {passwordsMatch && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-bold text-emerald-700">
                <ShieldCheck size={15} />
                Passwords match
              </div>
            )}
            {passwordsMismatch && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm font-bold text-red-600">
                <ShieldCheck size={15} />
                Passwords do not match
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-60 mt-2"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <KeyRound size={18} />
              )}
              {loading ? "Updating..." : "Update Password"}
            </button>

          </div>
        </section>

      </div>
    </div>
  );
};

export default ProfileChangePassword;