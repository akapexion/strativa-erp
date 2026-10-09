import React from "react";
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
  Layers
} from "lucide-react";

const Modules = ({ userLogged }) => {
  const destination = !userLogged
    ? "/login"
    : userLogged.user_role === 0
    ? "/hr360/admin"
    : "/hr360/user";

  const moduleList = [
    {
      id: "employee-management",
      title: "Employee Management",
      badge: "Core Platform",
      tagline: "Complete employee lifecycle and records administration",
      icon: Users,
      accent: "#2563EB",
      bgLight: "bg-blue-50/50",
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
      title: "Appraisal & Performance Management",
      badge: "Talent & Growth",
      tagline: "Objective appraisals with structured KPIs and DFIs",
      icon: BarChart2,
      accent: "#7C3AED",
      bgLight: "bg-purple-50/50",
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
      bgLight: "bg-amber-50/50",
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
      title: "Workforce Analytics & Intelligence",
      badge: "Insights",
      tagline: "Actionable workforce visibility and operational metrics",
      icon: Layers,
      accent: "#0891B2",
      bgLight: "bg-cyan-50/50",
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
      bgLight: "bg-emerald-50/50",
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
      bgLight: "bg-rose-50/50",
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

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 text-slate-800">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 left-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <section className="relative pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/80 shadow-xs">
            <Sparkles size={14} className="text-blue-600" />
            <span>Comprehensive Platform Architecture</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Strativa Modules &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Capabilities
            </span>
          </h1>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            Every module in Strativa is purpose-built to streamline operations, 
            empower HR teams, and provide clear visibility across your workforce.
          </p>

          {/* Quick anchor pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {moduleList.map((m) => (
              <a
                key={m.id}
                href={`#${m.id}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-xs cursor-pointer"
              >
                {m.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Modules List */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-24 space-y-12">
        {moduleList.map((mod, index) => {
          const Icon = mod.icon;
          const isEven = index % 2 === 0;

          return (
            <div
              key={mod.id}
              id={mod.id}
              className="scroll-mt-28 rounded-3xl p-8 md:p-12 bg-white border border-slate-200/90 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ background: mod.accent }}
              />

              <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Left Overview */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                      style={{ background: `${mod.accent}15`, color: mod.accent }}
                    >
                      {mod.badge}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      Module 0{index + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{ background: `${mod.accent}15`, color: mod.accent }}
                    >
                      <Icon size={26} />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                        {mod.title}
                      </h2>
                      <p className="text-sm font-medium text-slate-500">
                        {mod.tagline}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    {mod.description}
                  </p>

                  {/* Feature bullet list */}
                  <div className="space-y-2.5 pt-2">
                    {mod.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3">
                        <CheckCircle2
                          size={17}
                          className="shrink-0 mt-0.5"
                          style={{ color: mod.accent }}
                        />
                        <span className="text-xs md:text-sm text-slate-700 font-medium">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Card / Meta Info */}
                <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl p-6 md:p-8 border border-slate-100 flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                      Applicable Roles
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {mod.roleAccess.map((role) => (
                        <span
                          key={role}
                          className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <ShieldCheck size={16} className="text-emerald-600" />
                      <span>Security & Role Governance</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-normal">
                      Protected by JWT token authorization, encrypted session handling, and granular access controls.
                    </p>
                  </div>

                  {/* Improved Action Button */}
                  <Link
                    to={destination}
                    className="group flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:shadow-lg active:scale-[0.98] cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${mod.accent} 0%, #1E293B 120%)`,
                      boxShadow: `0 4px 14px ${mod.accent}30`
                    }}
                  >
                    <span>{userLogged ? "Access in Portal" : "Sign In to Access"}</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom CTA */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-24">
        <div className="rounded-3xl p-8 md:p-12 text-center bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h3 className="text-3xl md:text-4xl font-black tracking-tight">
              Looking for a Customized Setup?
            </h3>
            <p className="text-slate-300 text-sm md:text-base">
              Learn how Strativa, presented by Apexion, can be configured to support your organization’s unique structure.
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
