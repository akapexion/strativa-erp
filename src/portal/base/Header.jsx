import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, getUploadUrl } from "../../config/api.js";
import {
  Bell,
  ChevronDown,
  Logs,
  FileText,
  LogOut,
  Key,
  UserCircle,
  Gift,
  IdCardLanyard,
  Check,
  CheckCheck,
  Trash2,
  Clock,
  Sparkles,
  BookCheck,
  TextAlignJustify
} from "lucide-react";
import LogoImage from "/public/strativa.png";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .header-root * { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* Dropdown */
  @keyframes dropdown-in {
    from { opacity: 0; transform: translateY(-6px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .dropdown-in { animation: dropdown-in 0.18s cubic-bezier(0.16,1,0.3,1) forwards; }

  /* Badge pulse */
  @keyframes badge-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
    50%      { box-shadow: 0 0 0 4px rgba(239,68,68,0); }
  }
  .badge-pulse { animation: badge-pulse 2s ease-in-out infinite; }

  /* Notification unread accent bar */
  .notif-row { position: relative; }
  .notif-row.unread::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: linear-gradient(to bottom, #6366f1, #8b5cf6);
    border-radius: 0 2px 2px 0;
  }

  /* Smooth scrollbar */
  .notif-scroll::-webkit-scrollbar { width: 3px; }
  .notif-scroll::-webkit-scrollbar-track { background: #f8fafc; }
  .notif-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }

  /* Menu item */
  .menu-item { transition: background 0.12s, color 0.12s; }
  .menu-item:hover { background: #f0f4ff; color: #4f46e5; }
  .menu-item:hover .menu-icon { background: #e0e7ff; color: #4f46e5; }
  .menu-icon { transition: background 0.12s, color 0.12s; }

  /* Avatar glow */
  .avatar-img { transition: box-shadow 0.2s; }
  .profile-trigger:hover .avatar-img {
    box-shadow: 0 0 0 3px #c7d2fe;
  }

  /* Profile menu item */
  .profile-item { transition: background 0.12s, color 0.12s; }
  .profile-item:hover { background: #f0f4ff; color: #4f46e5; }
  .profile-item:hover .profile-icon { color: #4f46e5; }
  .profile-icon { transition: color 0.12s; }

  /* Icon button */
  .icon-btn { transition: background 0.12s, color 0.12s; }
  .icon-btn:hover { background: #f1f5f9; color: #334155; }
  .icon-btn-active { background: #eef2ff; color: #4f46e5; }

  /* Sign out */
  .signout-btn { transition: background 0.12s; }
  .signout-btn:hover { background: #fff1f2; }
  .signout-icon { transition: transform 0.15s; }
  .signout-btn:hover .signout-icon { transform: translateX(-3px); }
`;

/* ── Helpers ── */
const formatTimeAgo = (dateStr) => {
  const secs = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (secs < 60) return "just now";
  const m = Math.floor(secs / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const getNotifConfig = (notif) => {
  if (notif.type === "leave_submission")
    return { iconBg: "bg-violet-50", iconColor: "text-violet-600", Icon: Gift };
  if (notif.type === "leave_action" || notif.type === "form_action") {
    const rejected = notif.title.toLowerCase().includes("reject");
    return rejected
      ? { iconBg: "bg-rose-50", iconColor: "text-rose-500", Icon: Trash2 }
      : { iconBg: "bg-emerald-50", iconColor: "text-emerald-600", Icon: Check };
  }
  return { iconBg: "bg-indigo-50", iconColor: "text-indigo-600", Icon: FileText };
};

/* ══════════════════════════════════════
   HEADER
══════════════════════════════════════ */
const Header = ({ userLoggedOut, userLogged }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) setIsNotificationsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/notifications`);
      if (res.data?.success) setNotifications(res.data.notifications || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (userLogged) {
      fetchNotifications();
      const id = setInterval(fetchNotifications, 15000);
      return () => clearInterval(id);
    }
  }, [userLogged]);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/mark-read/${id}`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, is_read: true } : n));
    } catch (err) { console.error(err); }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/mark-all-read`);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) { console.error(err); }
  };

  const handleClearAll = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/notifications/clear-all`);
      setNotifications([]);
    } catch (err) { console.error(err); }
  };

  const handleNotificationClick = async (notif) => {
    await handleMarkAsRead(notif._id);
    setIsNotificationsOpen(false);
    const role = userLogged.user_role;
    if (role === "manager") {
      if (notif.type === "form_submission" && notif.reference_id) navigate(`/hr360/manager/form-requests/${notif.reference_id}`);
      else if (notif.type === "leave_submission") navigate("/hr360/manager/leave-requests");
    } else if (role === "user") {
      if (notif.type === "form_action" && notif.reference_id) navigate(`/hr360/user/form-submission/${notif.reference_id}`);
      else if (notif.type === "leave_action") navigate("/hr360/user/leaves");
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  /* ── Nav links ── */
  const isHRHead = userLogged.user_designation === "HR Head";
  const isCEO = userLogged.user_role === "ceo" || userLogged.user_designation === "CEO";
  const navLinks =
    userLogged.user_role === "user"
      ? [
          { to: "/hr360/user/employee-forms", icon: FileText, label: "Easy Forms" },
          { to: "/hr360/user/leaves", icon: IdCardLanyard, label: "Leaves" },
          { to: "/hr360/user/attendance", icon: BookCheck, label: "Attendance" },
          ...(isHRHead ? [
            { to: "/hr360/admin/employees", icon: IdCardLanyard, label: "Employees" },
            { to: "/hr360/admin/leave-types", icon: Gift, label: "Leave Types" },
          ] : []),
        ]
      : (userLogged.user_role === "manager" || isCEO)
      ? [
          { to: "/hr360/manager/form-requests", icon: FileText, label: "Awaiting Approvals" },
          { to: "/hr360/manager/leave-requests", icon: Gift, label: "Leave Approvals" },
          ...(userLogged.user_role === "manager" ? [
            { to: "/hr360/user/employee-forms", icon: FileText, label: "Easy Forms" }
          ] : []),
          ...(isHRHead ? [
            { to: "/hr360/admin/employees", icon: IdCardLanyard, label: "Employees" },
            { to: "/hr360/admin/leave-types", icon: Gift, label: "Leave Types" },
          ] : []),
        ]
      : [
          { to: "/hr360/admin/forms", icon: FileText, label: "Available Forms" },
          { to: "/hr360/admin/leave-types", icon: Gift, label: "Leave Types" },
          { to: "/hr360/admin/employees", icon: IdCardLanyard, label: "Employees" },
        ];

  const profileBase =
    userLogged.user_role === "admin" ? "/hr360/admin" :
    (userLogged.user_role === "manager" || isCEO) ? "/hr360/manager" : "/hr360/user";

  const avatarSrc = getUploadUrl(userLogged.user_image);

  return (
    <>
      <style>{styles}</style>

      <header className="header-root w-full h-16 bg-white border-b border-gray-100 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)" }}
      >

        {/* ── LEFT: Grid Launcher ── */}
        <div className="flex items-center relative" ref={menuRef}>
          <button
            onClick={() => { setIsMenuOpen(p => !p); setIsProfileOpen(false); setIsNotificationsOpen(false); }}
            aria-label="Apps"
            className={`icon-btn p-2 rounded-xl text-slate-500 cursor-pointer ${isMenuOpen ? "icon-btn-active" : ""}`}
          >

            <TextAlignJustify size={22} strokeWidth={2} />
          </button>

          {isMenuOpen && (
            <div className="dropdown-in absolute top-full left-0 mt-2.5 w-64 bg-white border border-gray-100 rounded-2xl py-2 z-[9999]"
              style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <p className="px-4 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">
                Applications
              </p>
              {navLinks.map(({ to, icon: Icon, label }) => (
                <Link to={to} key={to} onClick={() => setIsMenuOpen(false)}>
                  <div className="menu-item flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl cursor-pointer text-slate-600">
                    <div className="menu-icon p-2 bg-slate-100 rounded-lg text-slate-500">
                      <Icon size={16} strokeWidth={2} />
                    </div>
                    <span className="text-sm font-semibold">{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── CENTER: Logo ── */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link to="/hr360">
            <img
              src={LogoImage}
              width={132}
              alt="Strativa"
              className="hover:opacity-80 transition-opacity duration-200"
            />
          </Link>
        </div>

        {/* ── RIGHT ── */}
        <div className="flex items-center gap-1 md:gap-2">

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => {
                setIsNotificationsOpen(p => !p);
                setIsProfileOpen(false);
                setIsMenuOpen(false);
                if (!isNotificationsOpen) fetchNotifications();
              }}
              aria-label="Notifications"
              className={`icon-btn relative p-2 rounded-xl text-slate-500 cursor-pointer ${isNotificationsOpen ? "icon-btn-active" : ""}`}
            >
              <Bell size={20} strokeWidth={2} />
              {unreadCount > 0 && (
                <span className="badge-pulse absolute top-1.5 right-1.5 min-w-[17px] h-[17px] bg-rose-500 rounded-full flex items-center justify-center text-[9px] font-black text-white px-1 leading-none border-2 border-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div
                className="dropdown-in absolute top-full right-0 mt-2.5 w-80 md:w-[380px] bg-white border border-gray-100 rounded-2xl overflow-hidden z-[9999]"
                style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.10), 0 2px 10px rgba(0,0,0,0.06)" }}
              >
                {/* Panel header */}
                <div className="px-4 py-3.5 flex items-center justify-between bg-white border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                    {unreadCount > 0 && (
                      <p className="text-[11px] text-indigo-500 font-semibold mt-0.5">{unreadCount} unread</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} title="Mark all read"
                        className="icon-btn p-2 rounded-lg text-slate-400 hover:text-indigo-600 cursor-pointer">
                        <CheckCheck size={15} />
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button onClick={handleClearAll} title="Clear all"
                        className="icon-btn p-2 rounded-lg text-slate-400 hover:text-rose-500 cursor-pointer">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Panel body */}
                <div className="notif-scroll max-h-[320px] overflow-y-auto divide-y divide-gray-50 bg-white">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-10 flex flex-col items-center gap-3">
                      <div className="p-3.5 rounded-2xl bg-slate-50 text-slate-400">
                        <Sparkles size={22} strokeWidth={1.5} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-500">All caught up!</p>
                        <p className="text-xs text-slate-400 mt-0.5">No notifications right now.</p>
                      </div>
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const { iconBg, iconColor, Icon } = getNotifConfig(notif);
                      const isUnread = !notif.is_read;
                      return (
                        <div
                          key={notif._id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`notif-row ${isUnread ? "unread" : ""} flex gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-slate-50 ${isUnread ? "bg-indigo-50/30" : "bg-white"}`}
                        >
                          <div className={`shrink-0 p-2.5 rounded-xl h-fit ${iconBg} ${iconColor}`}>
                            <Icon size={15} strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-xs leading-snug ${isUnread ? "font-bold text-slate-800" : "font-semibold text-slate-600"}`}>
                                {notif.title}
                              </p>
                              <span className="text-[10px] text-slate-400 font-medium shrink-0 flex items-center gap-1 mt-0.5">
                                <Clock size={9} />{formatTimeAgo(notif.createdAt)}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Vertical divider */}
          <div className="w-px h-6 bg-gray-200 mx-1 hidden md:block" />

          {/* Profile trigger */}
          <div className="relative" ref={profileRef}>
            <div
              onClick={() => { setIsProfileOpen(p => !p); setIsMenuOpen(false); setIsNotificationsOpen(false); }}
              className={`profile-trigger flex items-center gap-2.5 pl-2 pr-2 py-1.5 rounded-xl cursor-pointer select-none transition-colors ${isProfileOpen ? "bg-slate-50" : "hover:bg-slate-50"}`}
            >
              {/* Name + designation */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-tight">
                  {userLogged.user_fullname}
                </p>
                <p className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">
                  {userLogged.user_designation}
                </p>
              </div>

              {/* Avatar */}
              <div className="relative">
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className="avatar-img w-9 h-9 rounded-full object-cover ring-2 ring-white border border-gray-200"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
              </div>

              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </div>

            {isProfileOpen && (
              <div
                className="dropdown-in absolute top-full right-0 mt-2.5 w-52 bg-white border border-gray-100 rounded-2xl py-2 z-[9999]"
                style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)" }}
              >
                {/* Mobile name */}
                <div className="px-4 py-3 border-b border-gray-100 mb-1 sm:hidden">
                  <p className="text-sm font-bold text-slate-800">{userLogged.user_fullname}</p>
                  <p className="text-[11px] text-indigo-500 font-bold mt-0.5">{userLogged.user_designation}</p>
                </div>

                <Link to={`${profileBase}/profile`} onClick={() => setIsProfileOpen(false)}>
                  <div className="profile-item flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl cursor-pointer text-slate-600">
                    <UserCircle size={16} strokeWidth={2} className="profile-icon text-slate-400" />
                    <span className="text-sm font-semibold">My Profile</span>
                  </div>
                </Link>

                <Link to={`${profileBase}/profile-changepassword`} onClick={() => setIsProfileOpen(false)}>
                  <div className="profile-item flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl cursor-pointer text-slate-600">
                    <Key size={16} strokeWidth={2} className="profile-icon text-slate-400" />
                    <span className="text-sm font-semibold">Change Password</span>
                  </div>
                </Link>

                <div className="mx-3 my-1.5 h-px bg-gray-100" />

                <button
                  onClick={() => { setIsProfileOpen(false); userLoggedOut(); }}
                  className="signout-btn w-full flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-rose-500 cursor-pointer rounded-b-2xl"
                >
                  <LogOut size={16} className="signout-icon" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;