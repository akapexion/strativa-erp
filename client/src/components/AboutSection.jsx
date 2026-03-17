import React from 'react';
import { CheckCircle2, TrendingUp, Users2, Globe2 } from 'lucide-react';

const AboutSection = () => {
  const stats = [
    { label: "Employees Managed", value: "5K+", icon: <Users2 size={20} /> },
    { label: "HR Records Processed", value: "1M+", icon: <TrendingUp size={20} /> },
    { label: "Departments Connected", value: "50+", icon: <Globe2 size={20} /> },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Side: Text Content */}
          <div className="lg:w-1/2">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">
              Our Vision
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-6 leading-tight">
              Empowering organizations with <br /> 
              <span className="text-slate-400 font-medium italic">smarter workforce management.</span>
            </h2>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Strativa was created to simplify how organizations manage their people. 
              From employee records and performance appraisals to leave management 
              and workforce insights, our platform brings every HR process into a 
              single, centralized system designed for modern workplaces.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                "Centralized employee records and performance tracking",
                "Automated appraisal workflows and HR processes",
                "Real-time workforce insights and analytics dashboards"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="text-blue-600" size={22} />
                  {item}
                </li>
              ))}
            </ul>

            <button className="text-slate-900 font-bold border-b-2 border-blue-600 pb-1 hover:text-blue-600 transition-colors">
              Learn more about our platform
            </button>
          </div>

          {/* Right Side: Stats Grid / Visual */}
          <div className="lg:w-1/2 w-full">
            <div className="grid grid-cols-2 gap-6">

              {/* Feature Image / Decoration */}
              <div className="col-span-2 bg-slate-900 h-64 rounded-3xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-blue-600/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                   <div className="text-center">
                      <p className="text-white/60 text-sm uppercase tracking-tighter mb-2">Our Approach</p>
                      <p className="text-white text-2xl font-semibold italic">
                        "Great organizations start with empowered employees."
                      </p>
                   </div>
                </div>
              </div>

              {/* Stats Cards */}
              {stats.map((stat, index) => (
                <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                  <div className="text-blue-600 mb-3 bg-white w-10 h-10 rounded-lg shadow-sm flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <h4 className="text-3xl font-bold text-slate-900">{stat.value}</h4>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                </div>
              ))}

              <div className="bg-blue-600 p-6 rounded-2xl flex flex-col justify-end text-white">
                <h4 className="text-xl font-bold">Empower Your Workforce.</h4>
                <p className="text-blue-100 text-sm mb-4">
                  Simplify HR operations with Strativa.
                </p>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-lg">→</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;