import React, { useState, useEffect } from 'react';
import { ArrowRight, BarChart3, ShieldCheck, Zap, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── Animated counter ─────────────────────────────────────── */
const Counter = ({ to, suffix = '' }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / 40);
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(t); }
      else setVal(start);
    }, 30);
    return () => clearInterval(t);
  }, [to]);
  return <>{val.toLocaleString()}{suffix}</>;
};

/* ─── Mini Live Chart ───────────────────────────────────────── */
const LiveChart = () => {
  const bars = [42, 65, 55, 78, 60, 88, 72, 95, 80, 100];
  return (
    <div className="flex items-end gap-1.5 h-16">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-700"
          style={{
            height: `${h}%`,
            background: i === bars.length - 1
              ? 'linear-gradient(180deg, #60A5FA 0%, #2563EB 100%)'
              : `rgba(96,165,250,${0.2 + i * 0.06})`,
            animationDelay: `${i * 80}ms`,
          }}
        />
      ))}
    </div>
  );
};

/* ─── Dashboard Mockup ──────────────────────────────────────── */
const DashboardMockup = () => (
  <div
    className="relative w-full rounded-2xl overflow-hidden border"
    style={{
      background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)',
      borderColor: 'rgba(148,163,184,0.1)',
      boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
    }}
  >
    {/* Title bar */}
    <div
      className="flex items-center justify-between px-4 py-3 border-b"
      style={{ borderColor: 'rgba(148,163,184,0.1)', background: 'rgba(255,255,255,0.03)' }}
    >
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <span className="text-xs text-slate-500 font-mono">hr360.dashboard</span>
      </div>
      <div className="flex gap-2">
        <div className="h-4 w-16 rounded bg-slate-700/60" />
        <div className="h-4 w-10 rounded bg-blue-500/30 border border-blue-500/40" />
      </div>
    </div>

    <div className="p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-3 w-28 rounded bg-slate-600/60 mb-1.5" />
          <div className="h-5 w-16 rounded bg-slate-500/40" />
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-400"
          style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.2)' }}
        >
          <TrendingUp size={12} />
          +12.4%
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active Staff', value: '1,248', color: '#3B82F6' },
          { label: 'On Leave', value: '34', color: '#F59E0B' },
          { label: 'Appraisals', value: '98%', color: '#10B981' },
        ].map((kpi, i) => (
          <div
            key={i}
            className="rounded-xl p-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="text-xs text-slate-500 mb-1">{kpi.label}</div>
            <div className="text-base font-black" style={{ color: kpi.color }}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div
        className="rounded-xl p-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400 font-semibold">Performance Overview</span>
          <span className="text-xs text-blue-400 font-bold">This Quarter</span>
        </div>
        <LiveChart />
      </div>

      {/* Employee rows */}
      <div className="space-y-2">
        {['Sara Ahmed', 'Usman Raza', 'Ayesha Khan'].map((name, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 px-3 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                style={{ background: ['#2563EB', '#7C3AED', '#059669'][i] }}
              >
                {name[0]}
              </div>
              <span className="text-xs text-slate-300 font-medium">{name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-16 rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${[88, 74, 92][i]}%`,
                    background: ['#2563EB', '#7C3AED', '#059669'][i],
                  }}
                />
              </div>
              <span className="text-xs text-slate-400">{[88, 74, 92][i]}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Main Hero ─────────────────────────────────────────────── */
const Hero = () => {
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
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #F0F4FF 0%, #FAFBFF 50%, #EDF2FF 100%)',
        minHeight: '100vh',
      }}
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle, #94A3B8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Top-right glow */}
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 65%)' }}
        />
        {/* Bottom-left glow */}
        <div
          className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%)' }}
        />
        {/* Diagonal accent line */}
        <div
          className="absolute top-0 right-1/3 w-px h-full opacity-20"
          style={{ background: 'linear-gradient(180deg, transparent, #2563EB 30%, transparent 70%)' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-24 lg:pt-28 lg:pb-36">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left ── */}
          <div className="relative z-10 space-y-8">

            {/* Eyebrow badge & Apexion Representation */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50/90 border border-indigo-200/80 shadow-2xs"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span>Presented by <strong className="font-black text-indigo-950">Apexion</strong></span>
              </div>
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50/90 border border-blue-200/80 shadow-2xs"
              >
                <Zap size={13} className="text-blue-500" fill="currentColor" />
                <span>Workforce Intelligence Platform</span>
              </div>
            </div>

            {/* Heading */}
            <div>
              <h1
                className="font-black text-slate-900 leading-none tracking-tight"
                style={{
                  fontSize: 'clamp(2.6rem, 5.5vw, 4.5rem)',
                  letterSpacing: '-0.04em',
                }}
              >
                Smarter
                <span
                  className="block text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(90deg, #1D4ED8 0%, #4F46E5 100%)' }}
                >
                  Workforce
                </span>
                <span className="block">Management.</span>
              </h1>
              <div
                className="mt-3 text-3xl md:text-4xl font-black tracking-tight"
                style={{
                  letterSpacing: '-0.03em',
                  color: '#94A3B8',
                }}
              >
                Better Decisions.
              </div>
            </div>

            {/* Body */}
            <p
              className="text-slate-500 leading-relaxed max-w-md"
              style={{ fontSize: '1.05rem' }}
            >
              Centralize employee appraisals, leave management, and workplace insights
              into one powerful platform. Automate HR processes and gain real-time
              workforce analytics — built for modern organizations.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to={destination}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-md hover:shadow-xl hover:shadow-blue-600/30 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #1D4ED8 0%, #4338CA 100%)',
                }}
              >
                <span>{user ? "Go to Dashboard" : "Sign In to Strativa"}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/modules"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-slate-700 hover:text-blue-700 text-sm transition-all duration-200 bg-white/90 hover:bg-white border border-slate-200 hover:border-blue-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-xs hover:shadow-md backdrop-blur-sm cursor-pointer"
              >
                Explore Modules
              </Link>
            </div>

            {/* Stats */}
            <div
              className="pt-8 border-t flex flex-wrap items-center gap-8"
              style={{ borderColor: 'rgba(226,232,240,0.6)' }}
            >
              {[
                { value: 1000, suffix: '+', label: 'Employees Managed' },
                { value: 98, suffix: '%', label: 'Appraisal Accuracy' },
                { value: 24, suffix: '/7', label: 'Live Analytics' },
              ].map((stat, i) => (
                <React.Fragment key={i}>
                  <div>
                    <div
                      className="text-2xl font-black text-slate-900"
                    >
                      <Counter to={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                  {i < 2 && (
                    <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ── Right: Dashboard ── */}
          <div className="relative lg:h-[580px] flex items-center">
            {/* Tilt wrapper */}
            <div
              className="relative w-full transition-transform duration-500 hover:rotate-0"
              style={{ transform: 'rotate(1.5deg)' }}
            >
              {/* Glow behind card */}
              <div
                className="absolute -inset-4 rounded-3xl blur-2xl opacity-40"
                style={{ background: 'linear-gradient(135deg, #2563EB22, #7C3AED22)' }}
              />
              <DashboardMockup />
            </div>

            {/* Floating: Security badge */}
            <div
              className="absolute -bottom-4 -left-6 flex items-center gap-3 px-4 py-3 rounded-2xl z-20"
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(226,232,240,0.9)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                backdropFilter: 'blur(12px)',
                animation: 'floatY 3s ease-in-out infinite',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.1)' }}
              >
                <ShieldCheck size={20} className="text-emerald-600" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold">Enterprise Grade</div>
                <div className="text-sm font-black text-slate-900">Data Protected</div>
              </div>
            </div>

            {/* Floating: Active users badge */}
            <div
              className="absolute -top-4 -right-4 flex items-center gap-2.5 px-4 py-3 rounded-2xl z-20"
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(226,232,240,0.9)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.10)',
                backdropFilter: 'blur(12px)',
                animation: 'floatY 3.5s ease-in-out infinite reverse',
              }}
            >
              <div className="flex -space-x-2">
                {['#2563EB', '#7C3AED', '#059669'].map((c, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-black text-white"
                    style={{ background: c }}
                  >
                    {['S', 'U', 'A'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold">Active now</div>
                <div className="text-sm font-black text-slate-900 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  1,248 online
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Float keyframes */}
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
};

export default Hero;