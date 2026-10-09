import React, { useState } from 'react';
import { BarChart2, Users, Package, ShieldCheck, Globe, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const modules = [
  {
    id: "hr-analytics",
    title: "Employee Analytics",
    description: "Gain real-time insights into employee performance, department productivity, and workforce trends through interactive charts and reports.",
    icon: BarChart2,
    accent: "#2563EB",
    tag: "Insights",
    number: "01",
  },
  {
    id: "employee-management",
    title: "Employee Management",
    description: "Centralize employee profiles, roles, departments, and records in one secure platform for efficient workforce management.",
    icon: Users,
    accent: "#7C3AED",
    tag: "People",
    number: "02",
  },
  {
    id: "leave-management",
    title: "Leave Management",
    description: "Streamline leave requests, approvals, and allocations while maintaining transparent leave balances for every employee.",
    icon: Package,
    accent: "#D97706",
    tag: "Operations",
    number: "03",
  },
  {
    id: "payroll-payslip",
    title: "Enterprise Security & Payroll",
    description: "Protect sensitive employee information with role-based access control and secure enterprise-grade data protection.",
    icon: ShieldCheck,
    accent: "#059669",
    tag: "Security",
    number: "04",
  },
  {
    id: "custom-forms",
    title: "Dynamic HR Forms",
    description: "Create and route tailored organizational forms with dynamic fields, file attachments, and manager actions.",
    icon: Globe,
    accent: "#0891B2",
    tag: "Forms",
    number: "05",
  },
  {
    id: "appraisal-management",
    title: "Appraisal Automation",
    description: "Simplify performance reviews with structured appraisal forms, automated workflows, and transparent evaluation tracking.",
    icon: Cpu,
    accent: "#E11D48",
    tag: "Growth",
    number: "06",
  },
];

const FeatureCard = ({ module, index }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = module.icon;

  return (
    <Link
      to={`/modules#${module.id}`}
      className="relative group cursor-pointer block h-full text-inherit no-underline"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-3xl border transition-all duration-500 ease-out h-full"
        style={{
          background: hovered
            ? `linear-gradient(145deg, ${module.accent}08 0%, ${module.accent}18 100%)`
            : 'rgba(255,255,255,0.7)',
          borderColor: hovered ? `${module.accent}40` : 'rgba(226,232,240,0.8)',
          boxShadow: hovered
            ? `0 24px 60px ${module.accent}20, 0 4px 16px rgba(0,0,0,0.06)`
            : '0 2px 12px rgba(0,0,0,0.04)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '150px',
          }}
        />

        {/* Accent glow blob */}
        <div
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-opacity duration-500"
          style={{
            background: module.accent,
            opacity: hovered ? 0.12 : 0,
          }}
        />

        <div className="relative p-8 flex flex-col h-full">
          {/* Top row */}
          <div className="flex items-start justify-between mb-8">
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
              style={{
                background: hovered ? module.accent : `${module.accent}14`,
                boxShadow: hovered ? `0 8px 24px ${module.accent}40` : 'none',
                transform: hovered ? 'rotate(-6deg) scale(1.08)' : 'rotate(0deg) scale(1)',
              }}
            >
              <Icon
                size={22}
                style={{ color: hovered ? '#fff' : module.accent }}
                className="transition-colors duration-300"
              />
            </div>

            {/* Tag pill */}
            <span
              className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full transition-all duration-300"
              style={{
                color: module.accent,
                background: `${module.accent}14`,
                letterSpacing: '0.1em',
              }}
            >
              {module.tag}
            </span>
          </div>

          {/* Number + Title */}
          <div className="mb-4 flex-1">
            <div
              className="text-xs font-black tracking-widest mb-2 font-mono transition-colors duration-300"
              style={{ color: hovered ? module.accent : '#CBD5E1' }}
            >
              {module.number}
            </div>
            <h3 className="text-xl font-black text-slate-900 leading-tight mb-3"
              style={{ letterSpacing: '-0.02em' }}
            >
              {module.title}
            </h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              {module.description}
            </p>
          </div>

          {/* CTA */}
          <div className="mt-6 flex items-center gap-2">
            <span
              className="text-sm font-bold transition-all duration-300"
              style={{ color: module.accent }}
            >
              Explore module
            </span>
            <div
              className="transition-all duration-300 overflow-hidden"
              style={{ maxWidth: hovered ? '24px' : '0px', opacity: hovered ? 1 : 0 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke={module.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {/* Static arrow when not hovered */}
            <svg
              className="transition-all duration-300"
              style={{ opacity: hovered ? 0 : 1, marginLeft: hovered ? '-16px' : '0' }}
              width="16" height="16" viewBox="0 0 16 16" fill="none"
            >
              <path d="M3 8h10M9 4l4 4-4 4" stroke={module.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Features = () => {
  const user = (() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();
  const destination = !user
    ? "/login"
    : user.user_role === 0
    ? "/hr360/admin"
    : "/hr360/user";

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #F8FAFF 0%, #F1F5FB 40%, #EEF2FF 100%)',
      }}
    >
      {/* Background geometric decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large circle top right */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #BFDBFE 0%, transparent 70%)' }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'radial-gradient(circle, #94A3B8 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Bottom left blob */}
        <div
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #DDD6FE 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="mb-20 max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-blue-500" />
            <span
              className="text-xs font-black tracking-widest uppercase text-blue-600"
              style={{ letterSpacing: '0.18em' }}
            >
              Platform Modules
            </span>
          </div>

          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-none"
            style={{
              letterSpacing: '-0.03em',
            }}
          >
            Powerful HR Modules
            <span className="block text-transparent bg-clip-text" style={{
              backgroundImage: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
            }}>
              for Modern Teams
            </span>
          </h2>

          <p className="text-slate-500 text-lg leading-relaxed max-w-xl">
            Manage employees, track performance appraisals, handle leave requests,
            and gain valuable workforce insights — all within one integrated platform.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 mt-10">
            {[
              { value: '6', label: 'Integrated Modules' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '10k+', label: 'Happy Teams' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span
                  className="text-2xl font-black text-slate-900"
                >
                  {stat.value}
                </span>
                <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <FeatureCard key={index} module={module} index={index} />
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div
          className="mt-16 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #312E81 100%)',
            boxShadow: '0 20px 60px rgba(30,58,138,0.3)',
          }}
        >
          <div>
            <p className="text-blue-200 text-xs font-bold tracking-widest uppercase mb-2">
              Ready to transform your HR?
            </p>
            <h3
              className="text-2xl md:text-3xl font-black text-white"
              style={{ letterSpacing: '-0.02em' }}
            >
              Start using Strativa today.
            </h3>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <Link
              to="/modules"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-slate-800 bg-white hover:bg-blue-50 active:scale-[0.98] transition-all duration-200 hover:shadow-lg cursor-pointer"
            >
              Explore Modules
            </Link>
            <Link
              to={destination}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-white active:scale-[0.98] transition-all duration-200 hover:opacity-90 hover:shadow-lg cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)' }}
            >
              Get Started →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;