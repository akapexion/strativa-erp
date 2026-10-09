import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Building2 } from "lucide-react";

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "HR / Operations",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 text-slate-800">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <section className="relative pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/80 shadow-xs">
            <Mail size={14} className="text-blue-600" />
            <span>Support & Inquiries</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Contact Strativa Support
          </h1>

          <p className="text-slate-600 text-base md:text-lg">
            Have questions about platform integration, account setup, or need HR assistance? 
            Our dedicated team is here to help.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-24">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Info Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl p-8 bg-slate-900 text-white space-y-6 border border-slate-800 shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Platform Operations
                </span>
                <h3 className="text-2xl font-black mt-1">Get in Touch</h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Strativa is launched and backed by Apexion. For enterprise onboarding, security queries, or general HR support, reach out directly.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <a
                  href="mailto:hr-support@strativa.com"
                  className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Official HR Email</div>
                    <div className="text-sm font-semibold">hr-support@strativa.com</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-800/60 text-slate-300">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Organization & Launch</div>
                    <div className="text-sm font-semibold">Apexion Ltd.</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-800/60 text-slate-300">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Response SLA</div>
                    <div className="text-sm font-semibold">Within 24 Business Hours</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="rounded-3xl p-6 bg-white border border-slate-200/90 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Looking for immediate help?</h4>
              <p className="text-xs text-slate-500">
                Check our documentation or review common platform guidelines before contacting support.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/user-guide"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  • Read the Strativa User Guide →
                </Link>
                <Link
                  to="/support-center"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  • Visit the Support Center FAQ →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-10 border border-slate-200/90 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Message Received!</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Thank you for contacting Strativa support. Our HR operations team will review your inquiry and follow up shortly at <strong className="text-slate-800">{formData.email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", department: "HR / Operations", message: "" });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Send an Inquiry</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill out the form below and an HR representative will get back to you promptly.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Official Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Department / Role</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm transition-all bg-white"
                  >
                    <option value="HR / Operations">HR / Operations</option>
                    <option value="Management & Leadership">Management & Leadership</option>
                    <option value="Employee / Staff">Employee / Staff</option>
                    <option value="Technical & IT Support">Technical & IT Support</option>
                    <option value="Corporate Inquiry">Corporate Inquiry</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Your Message *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your question, request, or issue in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm transition-all resize-none"
                  />
                </div>

                {/* Improved Submit Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98] cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #1D4ED8 0%, #4338CA 100%)",
                  }}
                >
                  <Send size={15} />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactUs;
