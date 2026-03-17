import React from 'react';
import { ArrowRight, BarChart3, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-24 lg:pb-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium">
              <Zap size={16} />
              <span>New HR insights — Track employees smarter</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Smarter Workforce <span className="text-blue-600">Management.</span> <br />
              <span className="text-slate-400">Better Decisions.</span>
            </h1>

            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Centralize employee appraisals, leave management, and workplace insights 
              into one powerful platform. Our ERP helps organizations track employee 
              performance, automate HR processes, and gain real-time workforce analytics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/hr360" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                Sign In
                <ArrowRight size={20} />
              </Link>
              <button className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
                Explore Features
              </button>
            </div>

            {/* Social Proof / Trust Badges */}
            <div className="pt-8 border-t border-slate-100 flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900">1000+</span>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Employees Managed</span>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900">Automated</span>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Appraisals</span>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900">Real-Time</span>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">HR Analytics</span>
              </div>
            </div>
          </div>

          {/* Right Visual Element (Mockup Placeholder) */}
          <div className="relative lg:h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent rounded-3xl -rotate-2" />
            <div className="relative w-full bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
              
              {/* Mockup Header */}
              <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700 flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>

              {/* Mockup Content */}
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-32 bg-slate-700 rounded" />
                  <div className="h-8 w-8 bg-blue-500/20 rounded-full border border-blue-500/50" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-slate-800 rounded-lg border border-slate-700 animate-pulse" />
                  ))}
                </div>

                <div className="h-40 bg-slate-800 rounded-lg border border-slate-700 flex items-end p-4 gap-2">
                   <div className="w-full h-1/2 bg-blue-500/40 rounded-t" />
                   <div className="w-full h-3/4 bg-blue-500/60 rounded-t" />
                   <div className="w-full h-full bg-blue-500 rounded-t" />
                   <div className="w-full h-2/3 bg-blue-500/50 rounded-t" />
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Data Protection</p>
                <p className="text-sm font-bold text-slate-900">Employee Data Secure</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;