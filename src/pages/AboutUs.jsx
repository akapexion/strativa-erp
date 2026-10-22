import React from "react";
import { Link } from "react-router-dom";
import { Building2, Target, Sparkles, Users2, ShieldCheck, ArrowRight, BarChart3, CheckCircle2, Award } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const AboutUs = ({ userLogged }) => {
  const destination = !userLogged ? "/login" : userLogged.user_role === 0 ? "/hr360/admin" : "/hr360/user";
  const { t } = useLanguage();

  const pillars = [
    { icon: Users2,     title: t('about_pillar1_title'), desc: t('about_pillar1_desc'), color: "#2563EB" },
    { icon: BarChart3,  title: t('about_pillar2_title'), desc: t('about_pillar2_desc'), color: "#7C3AED" },
    { icon: ShieldCheck,title: t('about_pillar3_title'), desc: t('about_pillar3_desc'), color: "#059669" },
    { icon: Sparkles,   title: t('about_pillar4_title'), desc: t('about_pillar4_desc'), color: "#D97706" },
  ];

  const milestones = [
    { value: "1,000+", label: t('about_ms1') },
    { value: "98%",    label: t('about_ms2') },
    { value: "99.9%",  label: t('about_ms3') },
    { value: "50+",    label: t('about_ms4') },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 left-10 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <section className="relative pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/80 dark:border-indigo-500/25 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
            <span>{t('about_page_badge')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {t('about_page_h1_a')}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{t('about_page_h1_b')}</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
            {t('about_page_sub')}
          </p>
        </div>
      </section>

      {/* Apexion Banner — always dark */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-20">
        <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                <Building2 size={16} /><span>{t('about_story_label')}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">{t('about_story_h')}</h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                {t('about_story_body')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
              <Link to="/modules" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-slate-900 hover:bg-slate-100 hover:shadow-lg transition-all duration-200 active:scale-[0.98] cursor-pointer">
                <span>{t('about_story_btn1')}</span><ArrowRight size={15} />
              </Link>
              <Link to="/contact-us" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-400/30 hover:border-indigo-400/50 transition-all duration-200 active:scale-[0.98] cursor-pointer">
                <span>{t('about_story_btn2')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Purpose */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 md:p-10 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Target size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{t('about_vision_h')}</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              {t('about_vision_body')}
            </p>
            <div className="pt-2 space-y-2">
              {[t('about_vision_i1'), t('about_vision_i2'), t('about_vision_i3')].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs md:text-sm text-slate-700 dark:text-slate-300 font-medium">
                  <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" /><span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 md:p-10 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Award size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{t('about_purpose_h')}</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              {t('about_purpose_body')}
            </p>
            <div className="pt-2 space-y-2">
              {[t('about_purpose_i1'), t('about_purpose_i2'), t('about_purpose_i3')].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs md:text-sm text-slate-700 dark:text-slate-300 font-medium">
                  <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" /><span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Pillars */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest">{t('about_pillars_label')}</div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{t('about_pillars_h')}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">{t('about_pillars_sub')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-105" style={{ background: `${pillar.color}15`, color: pillar.color }}>
                    <Icon size={22} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{pillar.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats — always dark */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24">
        <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {milestones.map((item, idx) => (
            <div key={idx} className={`pt-4 lg:pt-0 ${idx > 0 ? "lg:pl-8" : ""}`}>
              <div className="text-3xl md:text-4xl font-black text-blue-400 mb-1">{item.value}</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — always dark gradient */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-24">
        <div className="rounded-3xl p-8 md:p-12 text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl md:text-4xl font-black tracking-tight">{t('about_cta2_h')}</h3>
            <p className="text-blue-100 text-base">{t('about_cta2_sub')}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to={destination} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-white text-blue-700 hover:bg-blue-50 active:scale-[0.98] transition-all duration-200 shadow-md cursor-pointer">
                <span>{userLogged ? t('about_cta2_btn1_loggedin') : t('about_cta2_btn1_loggedout')}</span><ArrowRight size={15} />
              </Link>
              <Link to="/modules" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-blue-700/60 hover:bg-blue-700/80 text-white border border-white/20 active:scale-[0.98] transition-all duration-200 cursor-pointer">
                <span>{t('about_cta2_btn2')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
