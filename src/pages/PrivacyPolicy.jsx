import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 text-slate-800">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <section className="relative pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/80 shadow-xs">
            <ShieldCheck size={14} className="text-blue-600" />
            <span>Compliance & Data Protection</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Strativa Privacy Policy
          </h1>

          <p className="text-slate-500 text-sm md:text-base">
            Last Updated: October 2026 • Effective for all Strativa platform users
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto pb-24 space-y-10">
        <div className="rounded-3xl p-8 md:p-12 bg-white border border-slate-200/90 shadow-md space-y-8 leading-relaxed text-slate-600 text-sm md:text-base">
          
          <div className="space-y-3">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              1. Overview and Scope
            </h2>
            <p>
              Strativa, an enterprise workforce management platform launched by Apexion, is committed to safeguarding the privacy and security of employee and organizational data. This Privacy Policy details how we collect, process, store, and protect employee records, attendance, appraisals, and payroll information.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              2. Information We Collect
            </h2>
            <p>
              In providing workforce management services, the platform collects data directly from authorized corporate administrators and employee users, including:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li><strong>Personal Identifiers:</strong> Full legal name, official email, phone numbers, employee identification codes, and government identification (CNIC/SSN where mandated).</li>
              <li><strong>Employment & Organizational Details:</strong> Department, job title, manager hierarchy, date of joining, and salary classifications.</li>
              <li><strong>Attendance & Leave Data:</strong> Check-in and check-out logs, leave requests, leave quotas, and reason for absence.</li>
              <li><strong>Performance & Appraisal Records:</strong> Key Performance Indicators (KPIs), Direct Factor Indicators (DFIs), self-appraisals, and managerial ratings.</li>
              <li><strong>Financial & Payroll Records:</strong> Bank details, gross earnings, standard deductions, and payslips.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              3. Purpose of Processing
            </h2>
            <p>
              Employee data is processed strictly for legitimate workplace purposes, including:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Facilitating daily HR operations, leave management, and organizational directory lookups.</li>
              <li>Running objective performance appraisal cycles and recording promotion assessments.</li>
              <li>Calculating accurate payroll allocations and generating compliant payslips.</li>
              <li>Maintaining system security, audit logs, and role authentication.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              4. Role-Based Access Controls
            </h2>
            <p>
              Strativa enforces strict role-based separation:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li><strong>Employees:</strong> Can only view their own profile, submit leave/appraisals, and view their own attendance and payslips.</li>
              <li><strong>Managers:</strong> Have access only to assigned subordinates for approvals, appraisal reviews, and attendance oversight.</li>
              <li><strong>Administrators:</strong> Maintain authorized organizational oversight under corporate governance.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              5. Data Security & Encryption
            </h2>
            <p>
              We employ industry-standard administrative, physical, and technical safeguards. All user credentials use salted hashing algorithms, API interactions require cryptographically verified tokens, and communications are transmitted via TLS encryption.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              6. Contacting the Data Protection Officer
            </h2>
            <p>
              For inquiries regarding data confidentiality or to exercise employee data access rights, please contact our administrative desk at <a href="mailto:hr-support@strativa.com" className="text-blue-600 font-bold hover:underline">hr-support@strativa.com</a>.
            </p>
          </div>

        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            ← Back to Homepage
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
