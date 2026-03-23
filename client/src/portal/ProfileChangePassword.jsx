import axios from "axios";
import { gooeyToast } from "goey-toast";
import React, { useState } from "react";
import { KeyRound, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { z } from "zod";

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(64, "New password must be under 64 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),

    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });
// ─────────────────────────────────────────────────────────────────────────────

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

  const [errors, setErrors] = useState({}); // ← new: holds field-level errors
  const [loading, setLoading] = useState(false);

  const fields = [
    {
      name: "currentPassword",
      placeholder: "Current Password",
      label: "Current Password",
    },
    { name: "newPassword", placeholder: "New Password", label: "New Password" },
    {
      name: "confirmPassword",
      placeholder: "Confirm New Password",
      label: "Confirm New Password",
    },
  ];

  const passwordsMatch =
    passwords.newPassword &&
    passwords.confirmPassword &&
    passwords.newPassword === passwords.confirmPassword;

  const passwordsMismatch =
    passwords.newPassword &&
    passwords.confirmPassword &&
    passwords.newPassword !== passwords.confirmPassword;

  const handleChangePassword = async () => {
    // ─── Zod Validation ─────────────────────────────────────────────────────
    const result = changePasswordSchema.safeParse(passwords);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const firstErrors = Object.fromEntries(
        Object.entries(fieldErrors).map(([key, msgs]) => [key, msgs[0]]),
      );
      setErrors(firstErrors);
      gooeyToast.error("Please correct the highlighted fields before submitting", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });
      return; // stop submission
    }

    setErrors({}); // clear errors on success
    // ────────────────────────────────────────────────────────────────────────

    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/profile/${employeeId}/change-password`,
        passwords,
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
      setErrors({});
    } catch (err) {
      gooeyToast.error(
        err.response?.data?.message || "Error updating password",
        {
          fillColor: "#FFF",
          bounce: 0.45,
          timing: { displayDuration: 2500 },
        },
      );
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
                    onChange={(e) => {
                      // Clear the error for this field as the user types
                      setErrors((prev) => ({
                        ...prev,
                        [field.name]: undefined,
                      }));
                      setPasswords({
                        ...passwords,
                        [field.name]: e.target.value,
                      });
                    }}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm ${
                      errors[field.name]
                        ? "border-red-400 bg-red-50"
                        : "border-slate-200"
                    }`}
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
                    {showFields[field.name] ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {errors[field.name] && (
                  <p className="text-xs text-red-500">{errors[field.name]}</p>
                )}
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
