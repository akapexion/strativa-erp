import React from "react";
import { Link } from "react-router-dom";
import { Building, ShieldCheck, Zap, Layers, Lock, Cpu, ArrowRight } from "lucide-react";

const CorporateSolutions = ({ userLogged }) => {
  const destination = !userLogged
    ? "/login"
    : userLogged.user_role === 0
    ? "/hr360/admin"
    : "/hr360/user";

  const solutions = [
    {
      icon: Layers,
      title: "Scalable Organization Hierarchy",
      desc: "Effortlessly model complex enterprise departments, managerial trees, and multi-tier approval structures.",
      badge: "Structure"
    },
    {
      icon: Lock,
      title: "Granular Role-Based Permissions",
      desc: "Protect sensitive corporate data with strict authorization controls tailored for Admins, Managers, Staff, and Executives.",
      badge: "Governance"
    },
    {
      icon: Cpu,
      title: "Automated Evaluation Workflows",
      desc: "Replace chaotic annual review spreadsheets with automated KPI & DFI submission and managerial appraisal cycles.",
      badge: "Automation"
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Data Protection",
      desc: "Enterprise-grade encryption, secure session tokens, and protected payroll / attendance records.",
      badge: "Security"
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 text-slate-800">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero */}
      <section className="relative pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/80 shadow-xs">
            <Building size={14} className="text-blue-600" />
            <span>Enterprise Solutions</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Corporate Solutions Built to Scale
          </h1>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            Designed for growing companies and established enterprises. Strativa delivers 
            the security, flexibility, and automation modern organizations require.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((sol, i) => {
            const Icon = sol.icon;
            return (
              <div
                key={i}
                className="p-8 md:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Icon size={24} />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                    {sol.badge}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900">{sol.title}</h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  {sol.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 rounded-3xl p-8 md:p-12 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-center shadow-xl space-y-6">
          <h2 className="text-3xl font-black">Empower Your Entire Organization</h2>
          <p className="text-blue-100 text-base max-w-2xl mx-auto">
            Ready to deploy Strativa across your company? Connect with our team to explore tailored corporate onboarding.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/contact-us"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-white text-blue-700 hover:bg-blue-50 active:scale-[0.98] transition-all shadow-md cursor-pointer"
            >
              <span>Schedule Corporate Demo</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/modules"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-blue-800 hover:bg-blue-900 text-white border border-white/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Explore Platform Modules</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CorporateSolutions;
