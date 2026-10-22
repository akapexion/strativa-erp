import React from "react";
import { Link } from "react-router-dom";
import { FileCheck, Shield, CheckCircle2 } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 text-slate-800">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <section className="relative pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/80 shadow-xs">
            <FileCheck size={14} className="text-blue-600" />
            <span>Legal Agreement</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Strativa Terms of Service
          </h1>

          <p className="text-slate-500 text-sm md:text-base">
            Last Updated: October 2026 • Governs access to the Strativa Workforce Platform
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto pb-24 space-y-10">
        <div className="rounded-3xl p-8 md:p-12 bg-white border border-slate-200/90 shadow-md space-y-8 leading-relaxed text-slate-600 text-sm md:text-base">

          <div className="space-y-3">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or logging into Strativa ("the Platform"), introduced and launched by Apexion Ltd., organizations and authorized users agree to be bound by these Terms of Service. If you are using the platform on behalf of an employer or organization, you represent that you possess authority to bind that entity.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              2. User Accounts & Security
            </h2>
            <p>
              Accounts are provisioned by enterprise administrators. Users are strictly responsible for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Maintaining the confidentiality of their login credentials and access tokens.</li>
              <li>Not sharing or transferring account access to unauthorized third parties.</li>
              <li>Immediately reporting suspected unauthorized access to HR or platform administrators.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              3. Permitted Organizational Use
            </h2>
            <p>
              Strativa is designed strictly for internal organizational management, including employee profiling, performance appraisals, leave administration, custom HR form submissions, and payroll record reviews. Users shall not:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Interfere with or compromise the security and stability of the platform.</li>
              <li>Upload malicious code, harmful payloads, or falsified identity records.</li>
              <li>Attempt unauthorized privilege escalation to administrative endpoints.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              4. Intellectual Property
            </h2>
            <p>
              All software architecture, designs, interfaces, trademarks, and documentation related to Strativa are the proprietary intellectual property of Apexion Ltd. All rights not expressly granted under organizational licensing are reserved.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              5. Service Availability & Support
            </h2>
            <p>
              We strive to maintain a 99.9% uptime SLA. Scheduled maintenance is communicated in advance. For service assistance, contact <a href="mailto:hr-support@strativa.com" className="text-blue-600 font-bold hover:underline">hr-support@strativa.com</a>.
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

export default TermsOfService;
