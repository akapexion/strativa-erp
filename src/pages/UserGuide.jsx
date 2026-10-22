import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, LogIn, Calendar, Award, Receipt, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

const UserGuide = ({ userLogged }) => {
  const destination = !userLogged
    ? "/login"
    : userLogged.user_role === 0
    ? "/hr360/admin"
    : "/hr360/user";

  const guides = [
    {
      step: "01",
      icon: LogIn,
      title: "Signing In & Portal Navigation",
      desc: "Log in using your assigned corporate credentials. Based on your role (Employee, Manager, or Admin), your sidebar and dashboard automatically load relevant tools and permissions."
    },
    {
      step: "02",
      icon: Calendar,
      title: "Daily Attendance & Leave Requests",
      desc: "Record your attendance daily using the Attendance module. When taking time off, submit a leave application with designated leave types (Casual, Sick, Annual) for immediate manager review."
    },
    {
      step: "03",
      icon: Award,
      title: "Submitting Appraisals (KPIs & DFIs)",
      desc: "During evaluation cycles, navigate to the Appraisal section. Complete your KPI and DFI forms, add supporting comments, and track the evaluation status from your department head."
    },
    {
      step: "04",
      icon: Receipt,
      title: "Accessing Payslips & Personal Records",
      desc: "Review monthly payroll records under the Payslip tab. Check gross salary, tax deductions, allowances, and download official payment summaries whenever required."
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 text-slate-800">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <section className="relative pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/80 shadow-xs">
            <BookOpen size={14} className="text-blue-600" />
            <span>Documentation & Guidelines</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Strativa User Guide
          </h1>

          <p className="text-slate-600 text-base md:text-lg">
            A practical walkthrough to help employees and managers get the most out of the Strativa platform.
          </p>
        </div>
      </section>

      {/* Guide Steps */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-24 space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {guides.map((g, i) => {
            const Icon = g.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 space-y-4 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Icon size={24} />
                  </div>
                  <span className="text-2xl font-black text-slate-200 font-mono">
                    {g.step}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900">{g.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{g.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Manager/Admin Tips */}
        <div className="rounded-3xl p-8 md:p-10 bg-slate-900 text-white border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} className="text-indigo-400" />
            <h3 className="text-2xl font-black">Manager & Administrator Guidelines</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
            Department managers receive instant notifications when direct reports request leaves or submit custom forms. 
            Review details, evaluate KPI scores, and record decisions with full audit transparency.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            {[
              "Review leave requests promptly to avoid team bottlenecks",
              "Provide constructive feedback during KPI & DFI evaluations",
              "Maintain confidential salary and performance documentation"
            ].map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to={destination}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              <span>{userLogged ? "Go to Dashboard" : "Sign In to Get Started"}</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/support-center"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <span>View Support FAQs</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserGuide;
