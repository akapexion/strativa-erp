import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, TrendingUp, Users2, Globe2, ArrowUpRight } from 'lucide-react';

const AboutSection = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: "Employees Managed", value: "5K+", icon: <Users2 size={18} strokeWidth={1.5} /> },
    { label: "HR Records Processed", value: "1M+", icon: <TrendingUp size={18} strokeWidth={1.5} /> },
    { label: "Departments Connected", value: "50+", icon: <Globe2 size={18} strokeWidth={1.5} /> },
  ];

  const checkItems = [
    "Centralized employee records and performance tracking",
    "Automated appraisal workflows and HR processes",
    "Real-time workforce insights and analytics dashboards",
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-28 bg-white overflow-hidden"
    >
      {/* Subtle grid texture background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.5,
        }}
      />

      {/* Accent blob */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-blue-50 blur-3xl opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-20 items-center">

          {/* ── LEFT ── */}
          <div
            className={`lg:w-[48%] transition-all duration-700 ease-out ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-6 h-px bg-blue-600" />
              <span className="text-blue-600 text-xs font-semibold tracking-[0.18em] uppercase">
                Our Vision
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-[2.65rem] font-bold text-slate-900 leading-[1.15] mb-5 tracking-tight">
              Empowering organizations
              <br />
              <span className="text-slate-400 font-light italic">
                with smarter workforce
                <br />management.
              </span>
            </h2>

            <p className="text-[1.05rem] text-slate-500 leading-relaxed mb-9 max-w-lg">
              Strativa was created to simplify how organizations manage their people.
              From employee records and performance appraisals to leave management
              and workforce insights — every HR process in one centralized system
              designed for modern workplaces.
            </p>

            {/* Checklist */}
            <ul className="space-y-3 mb-10">
              {checkItems.map((item, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-3 transition-all duration-500 ease-out ${
                    visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${150 + i * 80}ms` }}
                >
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                    <CheckCircle2 className="text-blue-600" size={13} strokeWidth={2.5} />
                  </span>
                  <span className="text-slate-700 text-[0.93rem] leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors duration-200">
              Learn more about our platform
              <ArrowUpRight
                size={15}
                className="text-blue-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          </div>

          {/* ── RIGHT ── */}
          <div
            className={`lg:w-[52%] w-full transition-all duration-700 delay-200 ease-out ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="grid grid-cols-2 gap-4">

              {/* Quote card */}
              <div className="col-span-2 relative bg-slate-900 rounded-3xl overflow-hidden h-60 flex items-end p-8">
                {/* Decorative circle */}
                <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border border-white/10" />
                <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full border border-white/10" />
                {/* Blue accent dot */}
                <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-blue-500" />

                <div className="relative z-10">
                  <div className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-3">
                    Our Approach
                  </div>
                  <p className="text-white text-xl font-light leading-snug max-w-sm">
                    "Great organizations start with{' '}
                    <em className="text-blue-300 not-italic font-medium">empowered employees.</em>"
                  </p>
                </div>
              </div>

              {/* Stat cards */}
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`group relative bg-slate-50 hover:bg-white border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50 rounded-2xl p-6 transition-all duration-300 ${
                    index === 2 ? 'col-span-2 sm:col-span-1' : ''
                  }`}
                >
                  {/* Icon */}
                  <div className="mb-4 w-9 h-9 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-slate-900 tracking-tight leading-none mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}

              {/* CTA card */}
              <div className="bg-blue-600 rounded-2xl p-6 flex flex-col justify-between min-h-[9rem] relative overflow-hidden">
                {/* Decorative ring */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full border-2 border-white/15" />
                <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full border border-white/10" />

                <div>
                  <h4 className="text-white font-bold text-lg leading-tight mb-1">
                    Empower Your Workforce.
                  </h4>
                  <p className="text-blue-200 text-sm">
                    Simplify HR operations with Strativa.
                  </p>
                </div>

                <button className="self-start mt-4 inline-flex items-center gap-1.5 bg-white text-blue-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-md">
                  Get started
                  <ArrowUpRight size={13} />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;