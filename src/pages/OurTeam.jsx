import React from "react";
import { Link } from "react-router-dom";
import { Users2, Shield, Award, HeartHandshake, ArrowRight, Building2 } from "lucide-react";

const OurTeam = ({ userLogged }) => {
  const destination = !userLogged
    ? "/login"
    : userLogged.user_role === 0
    ? "/hr360/admin"
    : "/hr360/user";

  const tiers = [
    {
      title: "Platform Administration (HR)",
      role: "System Architects & People Officers",
      desc: "Controls workforce records, establishes leave policies, designs custom forms, and ensures compliance across departments.",
      icon: Shield,
      accent: "#2563EB"
    },
    {
      title: "Managerial Leadership",
      role: "Department Leads & Team Heads",
      desc: "Conducts quarterly appraisals, reviews KPI/DFI submissions, approves leave requests, and guides employee performance.",
      icon: Award,
      accent: "#7C3AED"
    },
    {
      title: "Workforce & Staff",
      role: "Team Members & Contributors",
      desc: "Self-service access to attendance logging, leave balances, custom form submissions, and verified digital payslips.",
      icon: Users2,
      accent: "#059669"
    },
    {
      title: "Executive Oversight (CEO)",
      role: "Strategic Direction",
      desc: "Comprehensive visibility into workforce analytics, departmental headcount, evaluation completion, and retention metrics.",
      icon: HeartHandshake,
      accent: "#D97706"
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 text-slate-800">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero */}
      <section className="relative pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 shadow-xs">
            <Building2 size={14} className="text-indigo-600" />
            <span>Apexion Product Engineering</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            The People & Roles Powering Strativa
          </h1>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            Launched by Apexion, Strativa connects cross-functional teams and leadership 
            through structured roles, shared accountability, and transparent workflows.
          </p>
        </div>
      </section>

      {/* Role Architecture */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">
            Unified Role Architecture
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            How Strativa organizes responsibilities to create harmony between managers and teams.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: `${t.accent}15`, color: t.accent }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{t.title}</h3>
                  <div
                    className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ color: t.accent }}
                  >
                    {t.role}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Apexion Attribution Box */}
        <div className="mt-16 rounded-3xl p-8 md:p-10 bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">
              Technology & Innovation
            </span>
            <h3 className="text-2xl font-black">Crafted & Supported by Apexion</h3>
            <p className="text-slate-400 text-sm max-w-xl">
              Our engineering and product teams at Apexion continuously refine Strativa 
              to ensure high availability, enterprise-grade data security, and an intuitive user experience.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              to="/about-us"
              className="px-6 py-3 rounded-xl text-sm font-bold bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-md"
            >
              Learn More
            </Link>
            <Link
              to={destination}
              className="px-6 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              Open Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurTeam;
