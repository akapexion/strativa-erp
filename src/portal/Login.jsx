import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  User,
  ShieldAlert,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { gooeyToast } from "goey-toast";
import { API_BASE_URL } from "../config/api.js";
import { showValidationToast } from "../utils/formValidationToast.js";

const Login = ({ userLoggedIn }) => {
  const [step, setStep] = useState(1); // 1 = Employee ID step, 2 = Password step
  const [showPassword, setShowPassword] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  // Step 1: Validate Employee ID and advance
  const handleStepOneSubmit = (e) => {
    e.preventDefault();
    setFieldErrors({});

    if (!userCode.trim()) {
      const msg = "Please enter your Employee ID or username";
      setFieldErrors({ userCode: msg });
      showValidationToast(msg);
      return;
    }

    setIsLoading(true);
    // Smooth transition to password step without creating an unauthorized session
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      setRateLimitInfo(null);
    }, 250);
  };

  // Step 2: Authenticate credentials
  const handleFinalLogin = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    if (!password) {
      const msg = "Please enter your password";
      setFieldErrors({ password: msg });
      showValidationToast(msg);
      return;
    }

    setIsLoading(true);
    setRateLimitInfo(null);

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        user_code: userCode.trim(),
        user_password: password,
      });

      if (res.data?.success) {
        gooeyToast.success(res.data.message || "Login successful", {
          fillColor: "#FFF",
          bounce: 0.45,
          timing: { displayDuration: 2500 },
        });

        localStorage.setItem("token", res.data.token);
        userLoggedIn(res.data.loggedUser);

        setTimeout(() => {
          const role = res.data.loggedUser?.user_role;
          if (role === "user") {
            navigate("/hr360/user/employee-forms");
          } else if (role === "manager" || role === "ceo") {
            navigate("/hr360/manager/form-requests");
          } else {
            navigate("/hr360/admin/employees");
          }
        }, 300);
      }
    } catch (err) {
      console.error("Login failed:", err);
      const is429 = err.response?.status === 429 || err.response?.data?.isRateLimited;
      const errorMsg =
        err.response?.data?.message || "Authentication failed. Please check your credentials.";

      if (is429) {
        setRateLimitInfo(errorMsg);
      } else {
        setFieldErrors({ password: errorMsg });
      }

      showValidationToast(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStepOne = () => {
    setStep(1);
    setPassword("");
    setFieldErrors({});
    setRateLimitInfo(null);
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Left Sidebar - Refined Branding Section */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex-col justify-between p-8 relative overflow-hidden">
        {/* Sophisticated Background Design */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-slate-700/50 to-transparent rounded-full blur-3xl"></div>
        </div>

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)",
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Top Section */}
        <div className="relative z-10 space-y-12">
          <div>
            <Link to="/">
              <img
                src="./strativa.png"
                width={140}
                className="brightness-0 invert opacity-95 mb-2"
                alt="Strativa"
              />
            </Link>
            <div className="h-px w-12 bg-gradient-to-r from-emerald-500 to-transparent mt-4"></div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white leading-tight tracking-tight">
              Enterprise Access Management
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-md font-light">
              Securely manage your HR operations, team communications, and organizational
              workflows in one unified multi-firm platform.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-3">
            {[
              { icon: CheckCircle2, text: "Enterprise-grade Security & Rate Limiting" },
              { icon: CheckCircle2, text: "Multi-Firm Tenant Isolation" },
              { icon: CheckCircle2, text: "Biometric Attendance & PDF Payslips" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 group">
                <item.icon
                  size={20}
                  className="text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-slate-300 text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section - Certification Badge */}
        <div className="relative z-10 space-y-6">
          <div className="border-t border-slate-700/50"></div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
              Trusted by enterprises globally
            </p>
            <p className="text-xs text-slate-400">ISO 27001 Certified &bull; SOC 2 Compliant</p>
          </div>
        </div>
      </div>

      {/* Right Side - Two-Step Login Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-12 lg:p-16 relative">
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
          <img src="./strativa.png" width={120} alt="Strativa" className="opacity-90" />
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
              <span>Step {step} of 2</span>
              <span>&bull;</span>
              <span>{step === 1 ? "Employee Identification" : "Password Verification"}</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-950 tracking-tight">
              {step === 1 ? "Sign In to Strativa" : "Enter Your Password"}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {step === 1
                ? "Enter your unique Employee ID or code to get started"
                : `Authenticating user with ID `}
              {step === 2 && (
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                  {userCode}
                </span>
              )}
            </p>
          </div>

          {/* Rate Limit Warning Banner */}
          {rateLimitInfo && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
              <ShieldAlert size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                  Access Temporarily Restricted
                </p>
                <p className="text-xs text-rose-700 mt-1 leading-relaxed">{rateLimitInfo}</p>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════
              STEP 1: EMPLOYEE ID / USERNAME
          ════════════════════════════════════ */}
          {step === 1 && (
            <form className="space-y-6" onSubmit={handleStepOneSubmit}>
              <div className="space-y-2 group">
                <label
                  htmlFor="userCode"
                  className="text-xs uppercase tracking-widest text-slate-700 font-bold block"
                >
                  Employee ID / Code
                </label>
                <div className="relative">
                  <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full transition-all duration-300 ${
                      focusedField === "userCode" ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  ></div>
                  <input
                    id="userCode"
                    type="text"
                    placeholder="e.g., EMP001"
                    value={userCode}
                    autoFocus
                    onFocus={() => setFocusedField("userCode")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => {
                      setUserCode(e.target.value);
                      if (fieldErrors.userCode) setFieldErrors({});
                    }}
                    className={`w-full pl-5 pr-4 py-3 text-slate-900 placeholder:text-slate-400 border-b-2 ${
                      fieldErrors.userCode ? "border-rose-500 bg-rose-50/30" : "border-slate-300 focus:border-emerald-500"
                    } bg-transparent focus:bg-slate-50 outline-none transition-all duration-300 font-medium text-sm`}
                  />
                </div>
                {fieldErrors.userCode && (
                  <p className="text-xs text-rose-600 font-semibold mt-1">
                    &bull; {fieldErrors.userCode}
                  </p>
                )}
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-950 hover:bg-slate-900 disabled:bg-slate-400 text-white font-bold py-3.5 px-6 rounded-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 group relative overflow-hidden mt-8 text-sm uppercase tracking-wider cursor-pointer"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      Next Step
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-0.5 transition-transform duration-300"
                      />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>
          )}

          {/* ════════════════════════════════════
              STEP 2: PASSWORD VERIFICATION
          ════════════════════════════════════ */}
          {step === 2 && (
            <form className="space-y-6" onSubmit={handleFinalLogin}>
              {/* Back / Change User Action */}
              <button
                type="button"
                onClick={handleBackToStepOne}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-2 cursor-pointer"
              >
                <ArrowLeft size={14} />
                Change Employee ID
              </button>

              <div className="space-y-2 group">
                <div className="flex justify-between items-start">
                  <label
                    htmlFor="password"
                    className="text-xs uppercase tracking-widest text-slate-700 font-bold"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full transition-all duration-300 ${
                      focusedField === "password" ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  ></div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    autoFocus
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors({});
                    }}
                    className={`w-full pl-5 pr-12 py-3 text-slate-900 placeholder:text-slate-400 border-b-2 ${
                      fieldErrors.password ? "border-rose-500 bg-rose-50/30" : "border-slate-300 focus:border-emerald-500"
                    } bg-transparent focus:bg-slate-50 outline-none transition-all duration-300 font-medium text-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors duration-200 p-2 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-rose-600 font-semibold mt-1">
                    &bull; {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-950 hover:bg-slate-900 disabled:bg-slate-400 text-white font-bold py-3.5 px-6 rounded-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 group relative overflow-hidden mt-8 text-sm uppercase tracking-wider cursor-pointer"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-0.5 transition-transform duration-300"
                      />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative py-6 mt-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs text-slate-500 font-semibold uppercase tracking-widest">
                Secure Connection
              </span>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-3">
            <Lock size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                256-bit Enterprise Protection
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Protected against brute force with rate-limiting and encryption.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-slate-500">
            <p>&copy; 2026 Strativa Enterprise HRMS &bull; Apexion</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;