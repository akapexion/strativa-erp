import React, { useState } from 'react';
import { Eye, EyeOff, Lock, ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { gooeyToast } from 'goey-toast';

const Login = ({ userLoggedIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userCode || !password) {
      gooeyToast.error("Please fill in all fields", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 }
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/auth/login', {
        user_code: userCode,
        user_password: password
      });

      if (res.data.success) {
        gooeyToast.success(res.data.message, {
          fillColor: "#FFF",
          bounce: 0.45,
          timing: { displayDuration: 2500 }
        });
        localStorage.setItem("token", res.data.token);
        userLoggedIn(res.data.loggedUser);

        setTimeout(() => {
          if (res.data.loggedUser.user_role === "user") {
            navigate('/hr360/user/employee-forms');
          } else if (res.data.loggedUser.user_role === "manager") {
            navigate('/hr360/manager/form-requests');
          } else {
            navigate('/hr360/admin/add-employee');
          }
        }, 300);
      }
    } catch (err) {
      console.error(err);
      gooeyToast.error(err.response?.data?.message || "Authentication failed", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 }
      });
    } finally {
      setIsLoading(false);
    }
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
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }}></div>

        {/* Top Section */}
        <div className="relative z-10 space-y-12">
            <div>
              <Link to="/">
              <img src="./strativa.png" width={140} className="brightness-0 invert opacity-95 mb-2" alt="Strativa" />
              </Link>
              <div className="h-px w-12 bg-gradient-to-r from-emerald-500 to-transparent mt-4"></div>
            </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white leading-tight tracking-tight">
              Enterprise Access Management
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-md font-light">
              Securely manage your HR operations, team communications, and organizational workflows in one unified platform.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-3">
            {[
              { icon: CheckCircle2, text: 'Enterprise-grade Security' },
              { icon: CheckCircle2, text: 'Real-time Collaboration' },
              { icon: CheckCircle2, text: '24/7 System Availability' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 group">
                <item.icon size={20} className="text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-slate-300 text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section - Certification Badge */}
        <div className="relative z-10 space-y-6">
          <div className="border-t border-slate-700/50"></div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Trusted by enterprises globally</p>
            <p className="text-xs text-slate-400">ISO 27001 Certified • SOC 2 Compliant</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-12 lg:p-16 relative">
        
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
          <img src="./strativa.png" width={120} alt="Strativa" className="opacity-90" />
        </div>

        <div className="w-full max-w-md">
          
          {/* Header */}
          <div className="mb-12 space-y-2">
            <h2 className="text-3xl font-bold text-slate-950 tracking-tight">Welcome Back</h2>
            <p className="text-slate-600 text-sm leading-relaxed">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form className="space-y-8" onSubmit={handleLogin}>
            
            {/* Employee Code Input */}
            <div className="space-y-3 group">
              <label htmlFor="userCode" className="text-xs uppercase tracking-widest text-slate-700 font-bold block">
                Employee ID
              </label>
              <div className="relative">
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full transition-all duration-300 ${focusedField === 'userCode' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <input
                  id="userCode"
                  type="text"
                  placeholder="e.g., EMP001"
                  value={userCode}
                  onFocus={() => setFocusedField('userCode')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-full pl-5 pr-4 py-3 text-slate-900 placeholder:text-slate-400 border-b-2 border-slate-300 focus:border-emerald-500 bg-transparent focus:bg-slate-50 outline-none transition-all duration-300 font-medium text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-3 group">
              <div className="flex justify-between items-start">
                <label htmlFor="password" className="text-xs uppercase tracking-widest text-slate-700 font-bold">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full transition-all duration-300 ${focusedField === 'password' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-5 pr-12 py-3 text-slate-900 placeholder:text-slate-400 border-b-2 border-slate-300 focus:border-emerald-500 bg-transparent focus:bg-slate-50 outline-none transition-all duration-300 font-medium text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors duration-200"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-950 hover:bg-slate-900 disabled:bg-slate-400 text-white font-bold py-3.5 px-6 rounded-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 group relative overflow-hidden mt-10 text-sm uppercase tracking-wider"
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
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Divider */}
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-xs text-slate-500 font-semibold uppercase tracking-widest">Secure Connection</span>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-3">
              <Lock size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">256-bit Encryption</p>
                <p className="text-xs text-slate-600 mt-1">Your connection is secure and encrypted</p>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-slate-500">
            <p>© 2024 Strativa. All rights reserved.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        input::placeholder {
          font-weight: 400;
        }

        button, input {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default Login;