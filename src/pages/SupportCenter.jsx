import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HelpCircle, ChevronDown, ChevronUp, Mail, ArrowRight, ShieldCheck, Search } from "lucide-react";

const SupportCenter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: "How do I log in to my employee account?",
      a: "Click 'Sign In' at the top right of the website. Enter your designated company email and password provided by your HR administrator. If this is your first time logging in, you may be prompted to update your credentials under your profile settings."
    },
    {
      q: "How are leave balances calculated in Strativa?",
      a: "Leave balances are configured by the HR department according to your company policy (Annual, Casual, Sick). Each approved leave application automatically subtracts from your allocated quota in real time."
    },
    {
      q: "Can I edit an appraisal submission after sending it?",
      a: "Once an appraisal form (KPI or DFI) is submitted to your manager, it enters the review pipeline. If you need to make changes, please contact your evaluating manager or HR admin to release the submission for editing."
    },
    {
      q: "Where can I view and download my monthly payslips?",
      a: "In your employee portal, navigate to the 'Payslips' tab in the navigation menu. Select the desired pay period to view itemized earnings and deductions, or click 'Download' to save an official copy."
    },
    {
      q: "What should I do if I forget my login password?",
      a: "Please reach out to your HR administrator or email hr-support@strativa.com with your Employee ID and full name. An administrator will initiate a secure credential reset."
    },
    {
      q: "Is my personal employee data secure on Strativa?",
      a: "Yes. Strativa uses enterprise-grade role-based access control, cryptographic password hashing, and encrypted JWT tokens. Only authorized administrators and your direct evaluating manager have access to relevant records."
    }
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 text-slate-800">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <section className="relative pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/80 shadow-xs">
            <HelpCircle size={14} className="text-blue-600" />
            <span>Help Desk & Troubleshooting</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Strativa Support Center
          </h1>

          <p className="text-slate-600 text-base md:text-lg">
            Quick answers, common troubleshooting questions, and direct support resources.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto pt-4 relative">
            <Search size={18} className="absolute left-4 top-7 text-slate-400" />
            <input
              type="text"
              placeholder="Search help topics (e.g. login, leave, payslip)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm transition-all"
            />
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto pb-24 space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No questions matched your search. Please contact HR support below.
          </div>
        ) : (
          filteredFaqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left font-bold text-slate-900 text-base md:text-lg hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp size={20} className="text-blue-600 shrink-0 ml-4" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400 shrink-0 ml-4" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Contact Help Box */}
        <div className="mt-12 p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl font-black">Still need assistance?</h4>
            <p className="text-slate-400 text-sm">
              Our support team is available during standard business hours.
            </p>
          </div>
          <Link
            to="/contact-us"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors shrink-0"
          >
            <Mail size={15} />
            <span>Contact Support</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SupportCenter;
