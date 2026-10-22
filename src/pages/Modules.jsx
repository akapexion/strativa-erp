import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  BarChart2, 
  CalendarDays, 
  Receipt, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Layers,
  LayoutGrid
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

// Static module definitions — translated strings resolved inside component via t()
const MODULE_DEFS = [
  {
    id: "employee-management",
    icon: Users,
    accent: "#2563EB",
    titleKey: "mod_emp_title",
    badgeKey: "mod_emp_badge",
    taglineKey: "mod_emp_tagline",
    descKey: "mod_emp_desc_long",
    featureKeys: ["mod_emp_f1", "mod_emp_f2", "mod_emp_f3", "mod_emp_f4"],
    roleAccess: ["Admins", "Managers", "Employees"]
  },
  {
    id: "appraisal-management",
    icon: BarChart2,
    accent: "#7C3AED",
    titleKey: "mod_appraisal_title",
    badgeKey: "mod_appraisal_badge",
    taglineKey: "mod_appraisal_tagline",
    descKey: "mod_appraisal_desc_long",
    featureKeys: ["mod_appraisal_f1", "mod_appraisal_f2", "mod_appraisal_f3", "mod_appraisal_f4"],
    roleAccess: ["Admins", "Managers", "Employees"]
  },
  {
    id: "leave-management",
    icon: CalendarDays,
    accent: "#D97706",
    titleKey: "mod_leave_title",
    badgeKey: "mod_leave_badge",
    taglineKey: "mod_leave_tagline",
    descKey: "mod_leave_desc_long",
    featureKeys: ["mod_leave_f1", "mod_leave_f2", "mod_leave_f3", "mod_leave_f4"],
    roleAccess: ["Admins", "Managers", "Employees"]
  },
  {
    id: "hr-analytics",
    icon: Layers,
    accent: "#0891B2",
    titleKey: "mod_analytics_title",
    badgeKey: "mod_analytics_badge",
    taglineKey: "mod_analytics_tagline",
    descKey: "mod_analytics_desc_long",
    featureKeys: ["mod_analytics_f1", "mod_analytics_f2", "mod_analytics_f3", "mod_analytics_f4"],
    roleAccess: ["Admins", "Managers", "CEO"]
  },
  {
    id: "payroll-payslip",
    icon: Receipt,
    accent: "#059669",
    titleKey: "mod_payroll_title",
    badgeKey: "mod_payroll_badge",
    taglineKey: "mod_payroll_tagline",
    descKey: "mod_payroll_desc_long",
    featureKeys: ["mod_payroll_f1", "mod_payroll_f2", "mod_payroll_f3", "mod_payroll_f4"],
    roleAccess: ["Admins", "Employees"]
  },
  {
    id: "custom-forms",
    icon: FileText,
    accent: "#E11D48",
    titleKey: "mod_forms_title",
    badgeKey: "mod_forms_badge",
    taglineKey: "mod_forms_tagline",
    descKey: "mod_forms_desc_long",
    featureKeys: ["mod_forms_f1", "mod_forms_f2", "mod_forms_f3", "mod_forms_f4"],
    roleAccess: ["Admins", "Managers", "Employees"]
  }
];

const Modules = ({ userLogged }) => {
  const { t } = useLanguage();
  const destination = !userLogged
    ? "/login"
    : userLogged.user_role === 0
    ? "/hr360/admin"
    : "/hr360/user";

  // Resolve translated strings into moduleList at render time
  const moduleList = MODULE_DEFS.map((m) => ({
    ...m,
    title: t(m.titleKey),
    badge: t(m.badgeKey),
    tagline: t(m.taglineKey),
    description: t(m.descKey),
    features: m.featureKeys.map((k) => t(k)),
  }));

  const [activeFilter, setActiveFilter] = useState("all");
  const listRef = useRef(null);

  const filtered = activeFilter === "all"
    ? moduleList
    : moduleList.filter((m) => m.id === activeFilter);

  const handleFilter = (id) => {
    setActiveFilter(id);
    // Smooth scroll to list without touching URL
    setTimeout(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 left-10 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <section className="relative pt-20 pb-12 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 border border-blue-200/80 dark:border-blue-500/25 shadow-xs">
            <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
            <span>{t('mpage_badge')}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {t('mpage_h1_a')}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {t('mpage_h1_b')}
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
            {t('mpage_sub')}
          </p>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <div className="sticky top-[57px] z-30 bg-white/90 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 flex flex-wrap items-center gap-2">
          {/* All pill */}
          <button
            onClick={() => handleFilter("all")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
              activeFilter === "all"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <LayoutGrid size={13} />
            {t('mpage_all')}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
              activeFilter === "all"
                ? "bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
            }`}>
              {moduleList.length}
            </span>
          </button>

          {moduleList.map((m) => {
            const Icon = m.icon;
            const isActive = activeFilter === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleFilter(m.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border"
                style={{
                  background: isActive ? m.accent : undefined,
                  color: isActive ? "white" : m.accent,
                  borderColor: isActive ? m.accent : `${m.accent}40`,
                  boxShadow: isActive ? `0 4px 12px ${m.accent}35` : "none",
                }}
              >
                <Icon size={13} />
                {m.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Modules List ── */}
      <section
        ref={listRef}
        className="px-6 md:px-12 max-w-7xl mx-auto pb-24 pt-10 space-y-12 scroll-mt-32"
      >
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            No modules match your filter.
          </div>
        ) : (
          filtered.map((mod, index) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="rounded-3xl p-8 md:p-12 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {/* Colored top bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: mod.accent }} />

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  {/* Left: Overview */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider" style={{ background: `${mod.accent}15`, color: mod.accent }}>
                        {mod.badge}
                      </span>
                      <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                        Module {String(moduleList.findIndex(m => m.id === mod.id) + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: `${mod.accent}15`, color: mod.accent }}>
                        <Icon size={26} />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{mod.title}</h2>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{mod.tagline}</p>
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">{mod.description}</p>

                    <div className="space-y-2.5 pt-2">
                      {mod.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-3">
                          <CheckCircle2 size={17} className="shrink-0 mt-0.5" style={{ color: mod.accent }} />
                          <span className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Meta panel */}
                  <div className="lg:col-span-5 bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl p-6 md:p-8 border border-slate-100 dark:border-slate-700 flex flex-col justify-between space-y-6">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">{t('mpage_roles')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {mod.roleAccess.map((role) => (
                          <span key={role} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 shadow-2xs">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
                        <ShieldCheck size={16} className="text-emerald-600" />
                        <span>{t('mpage_security')}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                        {t('mpage_security_desc')}
                      </p>
                    </div>

                    <Link
                      to={destination}
                      className="group flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:shadow-lg active:scale-[0.98] cursor-pointer"
                      style={{ background: `linear-gradient(135deg, ${mod.accent} 0%, #1E293B 120%)`, boxShadow: `0 4px 14px ${mod.accent}30` }}
                    >
                      <span>{userLogged ? t('mpage_access_portal') : t('mpage_signin_access')}</span>
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Bottom CTA */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-24">
        <div className="rounded-3xl p-8 md:p-12 text-center bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h3 className="text-3xl md:text-4xl font-black tracking-tight">
              {t('mpage_cta_h')}
            </h3>
            <p className="text-slate-300 text-sm md:text-base">
              {t('mpage_cta_sub')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/contact-us"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.98] transition-all duration-200 shadow-md cursor-pointer"
              >
                <span>{t('mpage_cta_contact')}</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/about-us"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <span>{t('mpage_cta_about')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Modules;
