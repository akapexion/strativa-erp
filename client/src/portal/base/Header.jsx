import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Bell, 
  ChevronDown, 
  Logs, 
  FileText, 
  User, 
  Settings, 
  LogOut, 
  Key,
  UserCircle,
  Gift,
  IdCardLanyard
} from "lucide-react";
import LogoImage from "/public/strativa.png";

const Header = ({userLoggedOut, userLogged}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Unified click-outside logic using useState
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-50">
      
      {/* Left: App Grid Launcher */}
      <div className="flex items-center relative" ref={menuRef}>
        <button
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            setIsProfileOpen(false); // Close other dropdown
          }}
          className={`p-2 rounded-lg transition-all ${
            isMenuOpen ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          <Logs size={24} strokeWidth={2.5} />
        </button>

        {isMenuOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl py-3 animate-in fade-in zoom-in duration-150 z-[9999]">
            <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Applications
            </div>


            {userLogged.user_role === "user" ?
            <>
            <Link to="/hr360/user/employee-forms">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
            >
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                <FileText size={18} />
              </div>
              <span className="font-bold text-sm">Easy Forms</span>
            </button>
            </Link>
            

            <Link to="/hr360/user/raise-appraisal">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
            >
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                <FileText size={18} />
              </div>
              <span className="font-bold text-sm">Raise Appraisal</span>
            </button>
            </Link>
            </>
            : 
            <>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
            >
              
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                <FileText size={18} />
              </div>
              <Link to="/hr360/admin/forms">
              <span className="font-bold text-sm">Available Forms</span>
              </Link>
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
            >
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Gift size={18} />
              </div>
              <Link to="/hr360/admin/leave-types">
              <span className="font-bold text-sm">Leave Types</span>
              </Link>
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
            >
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                <IdCardLanyard size={18} />
                
              </div>
              <Link to="/hr360/admin/employees">
              <span className="font-bold text-sm">
                
                Employees
                
                </span>
                </Link>
            </button>
            </>
            }
          </div>
        )}
      </div>

      {/* Center: Logo */}
      <div className="flex items-center">
        <Link to="/hr360">
          <img src={LogoImage} width={140} alt="Strativa Logo" className="hover:opacity-80 transition-opacity" />
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
          <Bell size={22} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block" />

        {/* Profile Dropdown Container */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsMenuOpen(false); // Close other dropdown
            }}
            className={`flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl cursor-pointer transition-all select-none ${
                isProfileOpen ? 'bg-slate-50' : 'hover:bg-slate-50'
            }`}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-tight">{userLogged.user_fullname}</p>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-tighter">{userLogged.user_designation}</p>
            </div>

            <div className="relative">
              <img
                src="https://ui-avatars.com/api/?name=Asad&background=0D8ABC&color=fff"
                alt="Profile"
                className="w-9 h-9 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>

            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {/* Profile Menu Dropdown */}
          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[9999]">
              <div className="px-4 py-3 border-b border-slate-50 mb-1 sm:hidden">
                <p className="text-sm font-bold text-slate-900">Asad</p>
                <p className="text-xs text-slate-500">Associate Faculty</p>
              </div>

              <button
                onClick={() => handleNavigate("/profile")}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <UserCircle size={18} className="text-slate-400" />
                My Profile
              </button>
              
              <button
                onClick={() => handleNavigate("/settings")}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <Key size={18} className="text-slate-400" />
                Change Password
              </button>

              <div className="my-2 border-t border-slate-100" />

              <button
                onClick={userLoggedOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-all group"
              >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;