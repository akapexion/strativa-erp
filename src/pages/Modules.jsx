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

const moduleList = [
  {
    id: "employee-management",
    title: "Employee Management",
    badge: "Core Platform",
    tagline: "Complete employee lifecycle and records administration",
    icon: Users,
    accent: "#2563EB",
    description: "A centralized directory for maintaining employee profiles, personal details, department assignments, emergency contacts, and professional documentation.",
    features: [
      "Granular employee profiles and document storage",
      "Role-based privilege assignment (Admin, Manager, Employee, CEO)",
      "Department-level categorization and contact directory",
      "Secure onboarding and profile credential management"
    ],
    roleAccess: ["Admins", "Managers", "Employees"]
  },
  {
    id: "appraisal-management",
    title: "Appraisal & Performance",
    badge: "Talent & Growth",
    tagline: "Objective appraisals with structured KPIs and DFIs",
    icon: BarChart2,
    accent: "#7C3AED",
    description: "Automate quarterly and annual performance reviews. Empower staff to submit Key Performance Indicators (KPIs) and Direct Factor Indicators (DFIs) for transparent manager evaluation.",
    features: [
      "Structured KPI and DFI submission pipelines",
      "Manager review, evaluation comments, and rating workflows",
      "Transparent appraisal history and progress logs",
      "Actionable performance records for promotions and compensation"
    ],
    roleAccess: ["Admins", "Managers", "Employees"]
  },
  {
    id: "leave-management",
    title: "Leave Management & Attendance",
    badge: "Operations",
    tagline: "Frictionless leave requests and daily attendance monitoring",
    icon: CalendarDays,
    accent: "#D97706",
    description: "Streamline the entire leave lifecycle. Define custom leave types, set quota limits, provide self-service applications, and track daily attendance check-ins and check-outs.",
    features: [
      "Configurable leave types with custom quota balances",
      "Instant leave requests with automated manager alerts",
      "Real-time attendance logging with check-in and check-out tracking",
      "Transparent leave approval and rejection history"
    ],
    roleAccess: ["Admins", "Managers", "Employees"]
  },
  {
    id: "hr-analytics",
    title: "Workforce Analytics",
    badge: "Insights",
    tagline: "Actionable workforce visibility and operational metrics",
    icon: Layers,
    accent: "#0891B2",
    description: "Empower leadership with live metrics on employee headcount, attendance consistency, leave distribution, and appraisal completion across every department.",
    features: [
      "Real-time operational dashboard with critical metrics",
      "Attendance rates and department-level presence trends",
      "Appraisal completion ratios and evaluation timelines",
      "Instant executive summaries for managerial planning"
    ],
    roleAccess: ["Admins", "Managers", "CEO"]
  },
  {
    id: "payroll-payslip",
    title: "Payroll & Salary Payslips",
    badge: "Finance & HR",
    tagline: "Transparent compensation records and digital payslips",
    icon: Receipt,
    accent: "#059669",
    description: "Give employees instant access to verified digital payslips. View detailed breakdowns of basic salary, allowances, deductions, and net payouts with full audit integrity.",
    features: [
      "Digital payslip generation with itemized salary breakdown",
      "Self-service employee download and view access",
      "Confidential compensation access with authentication",
      "Historical payment record archive"
    ],
    roleAccess: ["Admins", "Employees"]
  },
  {
    id: "custom-forms",
    title: "Dynamic Custom HR Forms",
    badge: "Automation",
    tagline: "Flexible form builder for organizational workflows",
    icon: FileText,
    accent: "#E11D48",
    description: "Build custom administrative forms tailored to organizational needs. Collect specialized submissions from employees and route them directly to managers for review.",
    features: [
      "Admin custom form creation with dynamic field types",
      "Employee self-service submission portal",
      "Manager review and status feedback workflow",
      "Centralized form record keeping and search"
    ],
    roleAccess: ["Admins", "Managers", "Employees"]
  }
];

const Modules = ({ userLogged }) => {
  const destination = !userLogged
    ? "/login"
    : userLogged.user_role === 0
    ? "/hr360/admin"
    : "/hr360/user";

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
            <span>Comprehensive Platform Architecture</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Strativa Modules &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Capabilities
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
            Every module in Strativa is purpose-built to streamline operations,
            empower HR teams, and provide clear visibility across your workforce.
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
            All Modules
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
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Applicable Roles</h3>
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
                        <span>Security & Role Governance</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                        Protected by JWT token authorization, encrypted session handling, and granular access controls.
                      </p>
                    </div>

                    <Link
                      to={destination}
                      className="group flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:shadow-lg active:scale-[0.98] cursor-pointer"
                      style={{ background: `linear-gradient(135deg, ${mod.accent} 0%, #1E293B 120%)`, boxShadow: `0 4px 14px ${mod.accent}30` }}
                    >
                      <span>{userLogged ? "Access in Portal" : "Sign In to Access"}</span>
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
              Looking for a Customized Setup?
            </h3>
            <p className="text-slate-300 text-sm md:text-base">
              Learn how Strativa, presented by Apexion, can be configured to support your organization's unique structure.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/contact-us"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.98] transition-all duration-200 shadow-md cursor-pointer"
              >
                <span>Contact Our Team</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/about-us"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <span>About the Platform</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Modules;
