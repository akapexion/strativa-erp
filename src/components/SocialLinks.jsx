import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

const DURATION = 0.25;
const STAGGER = 0.022;

const SOCIALS = [
  { label: 'Twitter',   href: 'https://twitter.com',   color: '#1DA1F2' },
  { label: 'LinkedIn',  href: 'https://linkedin.com',   color: '#0A66C2' },
  { label: 'Facebook',  href: 'https://facebook.com',   color: '#1877F2' },
  { label: 'Instagram', href: 'https://instagram.com',  color: '#E1306C' },
];

/* ── Flip letter link ────────────────────────────────────────────────────── */
const FlipLink = ({ children, href, color, baseColor }) => (
  <motion.a
    initial="initial"
    whileHover="hovered"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="relative block overflow-hidden whitespace-nowrap select-none"
    style={{ lineHeight: 0.85 }}
  >
    {/* Default row */}
    <div aria-hidden className="flex">
      {children.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={{ initial: { y: 0 }, hovered: { y: '-100%' } }}
          transition={{ duration: DURATION, ease: 'easeInOut', delay: STAGGER * i }}
          className="inline-block font-black uppercase tracking-tight
                     text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem]"
          style={{ color: baseColor }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>

    {/* Brand-coloured ghost row */}
    <div aria-hidden className="absolute inset-0 flex">
      {children.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={{ initial: { y: '100%' }, hovered: { y: 0 } }}
          transition={{ duration: DURATION, ease: 'easeInOut', delay: STAGGER * i }}
          className="inline-block font-black uppercase tracking-tight
                     text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem]"
          style={{ color }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>

    <span className="sr-only">{children}</span>
  </motion.a>
);

/* ── Section ─────────────────────────────────────────────────────────────── */
const SocialLinks = () => {
  const { isDark } = useTheme();

  // Match Features / AboutSection colour tokens exactly
  const bg = isDark
    ? 'linear-gradient(160deg, #0F172A 0%, #1E293B 40%, #0F172A 100%)'
    : 'linear-gradient(160deg, #F8FAFF 0%, #F1F5FB 40%, #EEF2FF 100%)';

  const baseTextColor   = isDark ? '#f1f5f9' : '#0f172a';   // slate-100 / slate-900
  const labelColor      = isDark ? '#60a5fa' : '#2563eb';   // blue-400 / blue-600
  const dividerColor    = isDark ? 'rgba(51,65,85,0.8)' : 'rgba(226,232,240,0.8)'; // slate-700 / slate-200
  const subtextColor    = isDark ? '#475569' : '#94a3b8';   // slate-600 / slate-400
  const glowColor       = isDark
    ? 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)'
    : 'radial-gradient(circle, #BFDBFE 0%, transparent 70%)';
  const dotColor        = isDark ? '#334155' : '#94A3B8';   // grid dots

  return (
    <section
      className="relative overflow-hidden transition-colors duration-300 py-24 md:py-32"
      style={{ background: bg }}
    >
      {/* Grid dot texture — same as Features */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Glow blob top-right — same as Features */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30 pointer-events-none"
        style={{ background: glowColor }}
      />
      {/* Glow blob bottom-left — same as Features */}
      <div
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-20 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, #DDD6FE 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">

        {/* Section label — same style as Features & About */}
        <div className="flex items-center gap-3 mb-12 md:mb-16">
          <div className="h-px w-8" style={{ background: labelColor }} />
          <span
            className="text-xs font-black tracking-[0.18em] uppercase"
            style={{ color: labelColor }}
          >
            Follow Us
          </span>
        </div>

        {/* Divider above links */}
        <div className="h-px mb-8" style={{ background: dividerColor }} />

        {/* Flip links */}
        <div className="flex flex-col gap-1">
          {SOCIALS.map(({ label, href, color }) => (
            <FlipLink
              key={label}
              href={href}
              color={color}
              baseColor={baseTextColor}
            >
              {label}
            </FlipLink>
          ))}
        </div>

        {/* Divider below links */}
        <div className="h-px mt-10" style={{ background: dividerColor }} />

        {/* Tagline */}
        <p
          className="mt-8 text-sm font-medium leading-relaxed max-w-sm"
          style={{ color: subtextColor }}
        >
          Stay connected — follow Strativa for product updates, HR insights, and company news.
        </p>
      </div>
    </section>
  );
};

export default SocialLinks;
