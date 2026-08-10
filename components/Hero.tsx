'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[92vh] px-6 text-center overflow-hidden noise-bg">
      {/* ── Background gradient orbs ── */}
      <div
        className="orb-1 absolute top-[-180px] left-[-120px] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
        }}
      />
      <div
        className="orb-2 absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
        {/* Badge */}
        <span
          className="animate-fade-up delay-100 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
          style={{
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#818cf8',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Trusted Investment Platform
        </span>

        {/* Headline */}
        <h1 className="animate-fade-up delay-200 text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.08] tracking-tight text-white">
          Invest Smarter. <span className="gradient-text">Grow with Confidence.</span>
        </h1>

        {/* Sub-headline */}
        <p
          className="animate-fade-up delay-300 text-lg sm:text-xl leading-relaxed max-w-xl"
          style={{ color: '#94a3b8' }}
        >
          A secure platform that helps investors discover opportunities, track portfolio
          performance, and manage investments with complete transparency.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up delay-400 flex flex-col sm:flex-row items-center gap-4 mt-2">
          <Link
            href="/signup"
            id="hero-get-started"
            className="btn-glow rounded-xl bg-indigo-600 px-8 py-3.5 text-white font-semibold text-base shadow-lg"
          >
            Get Started — It&apos;s Free
          </Link>

          <Link
            href="/investment-plans"
            id="hero-explore"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-base transition-colors duration-200"
            style={{ color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = '#c4b5fd';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(99,102,241,0.4)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)';
            }}
          >
            Explore Plans
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {/* Trust line */}
        <p className="animate-fade-up delay-500 text-sm mt-4" style={{ color: '#475569' }}>
          Trusted by{' '}
          <span style={{ color: '#6366f1' }} className="font-semibold">
            1,200+
          </span>{' '}
          investors · NPR 66.5L+ managed · 24% avg. growth
        </p>
      </div>

      {/* ── Bottom fade ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #080c14 0%, transparent 100%)',
        }}
      />
    </section>
  );
}
