import React from "react";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Target, 
  Sparkles, 
  Users2, 
  ShieldCheck, 
  ArrowRight, 
  BarChart3, 
  CheckCircle2, 
  Award 
} from "lucide-react";

const AboutUs = ({ userLogged }) => {
  const destination = !userLogged
    ? "/login"
    : userLogged.user_role === 0
    ? "/hr360/admin"
    : "/hr360/user";

  const pillars = [
    {
      icon: Users2,
      title: "People-First Workforce Architecture",
      desc: "Designed around real employee lifecycles — from onboarding and record management to daily attendance and career development.",
      color: "#2563EB"
    },
    {
      icon: BarChart3,
      title: "Objective Appraisal Framework",
      desc: "Empowering management and team members with structured KPIs, DFIs, and transparent multi-tier review workflows.",
      color: "#7C3AED"
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Governance & Security",
      desc: "Granular role-based permissions (Admin, Manager, Employee, Executive) with secure session handling and encrypted records.",
      color: "#059669"
    },
    {
      icon: Sparkles,
      title: "Operational Efficiency",
      desc: "Eliminating manual spreadsheets and disjointed tools through unified automation for leaves, payslips, and custom requests.",
      color: "#D97706"
    }
  ];

  const milestones = [
    { value: "1,000+", label: "Employees Managed Across Teams" },
    { value: "98%", label: "Appraisal Completion Rate" },
    { value: "99.9%", label: "Platform Uptime & Reliability" },
    { value: "50+", label: "Integrated Departments & Roles" }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 text-slate-800">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 left-10 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Header */}
      <section className="relative pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span>Presented & Launched by Apexion</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Building Smarter Solutions for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Modern Workforces
            </span>
          </h1>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            Strativa is an enterprise workforce intelligence and HR management platform 
            developed and launched by Apexion to help organizations centralize operations, 
            automate performance appraisals, and empower employees.
          </p>
        </div>
      </section>

      {/* Apexion Representation Banner */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-20">
        <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                <Building2 size={16} />
                <span>The Story Behind Strativa</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Launched & Powered by Apexion
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Apexion introduced Strativa to address the friction modern organizations face 
                with fragmented HR tooling, manual appraisals, and disparate records. By combining 
                real-time analytics, automated evaluation cycles, and self-service employee portals into 
                a single unified experience, Strativa empowers both leadership and staff to thrive.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
              <Link
                to="/modules"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-slate-900 hover:bg-slate-100 hover:shadow-lg transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <span>Explore Modules</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/contact-us"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-400/30 hover:border-indigo-400/50 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <span>Get in Touch</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 md:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Target size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Our Vision</h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              To be the most reliable, transparent, and comprehensive workforce ecosystem — enabling companies 
              to eliminate administrative burden and focus on nurturing talent, celebrating milestones, and scaling sustainably.
            </p>
            <div className="pt-2 space-y-2">
              {[
                "Transparent evaluations based on measurable KPIs",
                "Frictionless self-service portal for every team member",
                "Actionable managerial oversight and approval pipelines"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs md:text-sm text-slate-700 font-medium">
                  <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 md:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Award size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Our Purpose</h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              Strativa was built with a singular purpose: connecting organizational goals with individual growth. 
              By structuring appraisals, leave balances, custom requests, and compensation transparency into a single hub, 
              we build trust between leadership and employees.
            </p>
            <div className="pt-2 space-y-2">
              {[
                "Zero data silos across HR and functional departments",
                "Real-time attendance and leave quota visibility",
                "Enterprise security with end-to-end data safety"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs md:text-sm text-slate-700 font-medium">
                  <CheckCircle2 size={16} className="text-indigo-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Pillars */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">
            Core Foundations
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            How Strativa Drives Organization Value
          </h2>
          <p className="text-slate-500 text-sm md:text-base">
            Every feature in Strativa is tailored to ensure accuracy, transparency, and operational clarity.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-105"
                    style={{ background: `${pillar.color}15`, color: pillar.color }}
                  >
                    <Icon size={22} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">
                    {pillar.title}
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Numbers / Stats */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24">
        <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {milestones.map((item, idx) => (
            <div key={idx} className={`pt-4 lg:pt-0 ${idx > 0 ? "lg:pl-8" : ""}`}>
              <div className="text-3xl md:text-4xl font-black text-blue-400 mb-1">
                {item.value}
              </div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-24">
        <div className="rounded-3xl p-8 md:p-12 text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl md:text-4xl font-black tracking-tight">
              Ready to Upgrade Your HR Operations?
            </h3>
            <p className="text-blue-100 text-base">
              Experience the power of centralized workforce management with Strativa, presented by Apexion.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to={destination}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-white text-blue-700 hover:bg-blue-50 active:scale-[0.98] transition-all duration-200 shadow-md cursor-pointer"
              >
                <span>{userLogged ? "Open Dashboard" : "Sign In to Platform"}</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/modules"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-blue-700/60 hover:bg-blue-700/80 text-white border border-white/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <span>View All Modules</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
