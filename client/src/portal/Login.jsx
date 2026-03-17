import React, { useState } from 'react';
import { Eye, EyeOff, Lock, ArrowRight, ShieldCheck, Hash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { gooeyToast } from 'goey-toast';

const Login = ({userLoggedIn}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userCode || !password) return alert("Please fill in both fields");

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
        userLoggedIn(res.data.loggedUser);

        if(res.data.loggedUser.user_role === "user"){
        navigate('/hr360/user/employee-forms'); 
        }
        else {
          navigate('/hr360/admin/add-employee'); 
        }
      }
    } catch (err) {
      console.error(err);
      gooeyToast.error(err.response?.data?.message || "Login failed", {
              fillColor: "#FFF",
              bounce: 0.45,
              timing: { displayDuration: 2500 }
            });
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      
      {/* Left Side: Branding & Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10">
          <div className="mb-12">
             <img src="./strativa.png" width={140} className="brightness-0 invert" alt="Strativa Logo" />
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
            Welcome back to the <br /> 
            <span className="text-blue-500">Strativa Ecosystem.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-sm">
            Access your unified dashboard to manage operations, 
            teams, and growth in real-time.
          </p>
        </div>

        <div className="relative z-10 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 shadow-inner">
              <ShieldCheck size={28} />
            </div>
            <div>
              <p className="text-white font-bold tracking-tight">Secured Session</p>
              <p className="text-slate-400 text-xs uppercase font-black tracking-widest mt-1">
                AES-256 Encrypted
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo Only */}
          <div className="mb-10 lg:hidden">
            <img src="./strativa.png" width={120} alt="Strativa Logo" />
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sign In</h1>
            <p className="text-slate-500 mt-2 font-medium">Enter your credentials to access your account.</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Employee Code */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                Emp Code
              </label>
              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="AK123"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold text-slate-800"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Password
                </label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold text-slate-800"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center gap-3 py-2">
              <button 
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-10 h-5 rounded-full transition-all relative ${rememberMe ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${rememberMe ? 'left-6' : 'left-1'}`}></div>
              </button>
              <span className="text-sm font-bold text-slate-600 select-none">Stay signed in</span>
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 group">
              Sign In
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Login;