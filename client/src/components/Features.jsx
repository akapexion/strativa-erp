import React from 'react';
import { BarChart2, Users, Package, ShieldCheck, Globe, Cpu } from 'lucide-react';

const Features = () => {
  const modules = [
    {
      title: "Employee Analytics",
      description: "Gain real-time insights into employee performance, department productivity, and workforce trends through interactive charts and reports.",
      icon: <BarChart2 className="text-blue-600" size={24} />,
      color: "bg-blue-50",
    },
    {
      title: "Employee Management",
      description: "Centralize employee profiles, roles, departments, and records in one secure platform for efficient workforce management.",
      icon: <Users className="text-purple-600" size={24} />,
      color: "bg-purple-50",
    },
    {
      title: "Leave Management",
      description: "Streamline leave requests, approvals, and allocations while maintaining transparent leave balances for every employee.",
      icon: <Package className="text-amber-600" size={24} />,
      color: "bg-amber-50",
    },
    {
      title: "Enterprise Security",
      description: "Protect sensitive employee information with role-based access control and secure enterprise-grade data protection.",
      icon: <ShieldCheck className="text-emerald-600" size={24} />,
      color: "bg-emerald-50",
    },
    {
      title: "Employee Engagement",
      description: "Automatically track birthdays, anniversaries, and important milestones to build a stronger and more connected workplace culture.",
      icon: <Globe className="text-cyan-600" size={24} />,
      color: "bg-cyan-50",
    },
    {
      title: "Appraisal Automation",
      description: "Simplify employee performance reviews with structured appraisal forms, automated workflows, and transparent evaluation tracking.",
      icon: <Cpu className="text-rose-600" size={24} />,
      color: "bg-rose-50",
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Powerful HR Modules for Modern Organizations
          </h2>
          <p className="text-slate-600 max-w-2xl text-lg">
            Manage employees, track performance appraisals, handle leave requests, 
            and gain valuable workforce insights — all within one integrated platform.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <div 
              key={index}
              className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Icon Box */}
              <div className={`w-12 h-12 ${module.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {module.icon}
              </div>

              {/* Text Content */}
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {module.title}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                {module.description}
              </p>

              {/* Link */}
              <button className="text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more 
                <span>→</span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;