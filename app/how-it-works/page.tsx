import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

const steps = [
  {
    n: "01",
    title: "Create Your Account",
    body: "Sign up in minutes with your email and basic information. Our secure registration ensures your data is protected from the start.",
    meta: "⏱ 2–3 minutes",
    color: "#6366f1",
    glow: "rgba(99,102,241,0.12)",
  },
  {
    n: "02",
    title: "Complete Your Profile",
    body: "Provide your investment goals, risk tolerance, and financial information for personalised recommendations.",
    meta: "⏱ 5–10 minutes",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.12)",
  },
  {
    n: "03",
    title: "Choose Your Plan",
    body: "Select from Starter, Growth, or Premium plans — each tailored to different investment levels and goals.",
    meta: "📋 Starter · Growth · Premium",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.12)",
  },
  {
    n: "04",
    title: "Fund Your Account",
    body: "Deposit securely via bank transfer, digital wallets, or other supported payment methods.",
    meta: "🏦 1–3 business days",
    color: "#10b981",
    glow: "rgba(16,185,129,0.12)",
  },
  {
    n: "05",
    title: "Start Investing",
    body: "Once funded, begin investing and monitor your portfolio performance in real time, 24/7.",
    meta: "📊 Real-time tracking available",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.12)",
  },
];

const differentiators = [
  {
    icon: "🔒",
    title: "Bank-Level Security",
    body: "Your investments are protected with industry-leading encryption and security protocols.",
    color: "#6366f1",
    glow: "rgba(99,102,241,0.1)",
  },
  {
    icon: "📊",
    title: "Real-Time Analytics",
    body: "Track your portfolio performance with comprehensive real-time analytics and reporting.",
    color: "#10b981",
    glow: "rgba(16,185,129,0.1)",
  },
  {
    icon: "💬",
    title: "Expert Support",
    body: "Get guidance from experienced investment professionals whenever you need it.",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.1)",
  },
];

export default function HowItWorks() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#080c14" }}>

        {/* ── Hero ── */}
        <section className="relative py-24 px-6 text-center overflow-hidden">
          <div
            className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }}
          />
          <div className="relative z-10 max-w-3xl mx-auto">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#818cf8" }}
            >
              Process
            </span>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight">
              How It <span className="gradient-text">Works</span>
            </h1>
            <p className="text-xl" style={{ color: "#94a3b8" }}>
              Start your investment journey in just a few simple steps.
            </p>
          </div>
        </section>

        {/* ── Steps ── */}
        <section className="py-16 px-6" style={{ background: "#0d1117" }}>
          <div className="max-w-3xl mx-auto flex flex-col gap-0">
            {steps.map((s, i) => (
              <div key={i} className="relative flex gap-6">
                {/* connector */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0 z-10"
                    style={{ background: s.glow, color: s.color, border: `1px solid ${s.color}30` }}
                  >
                    {s.n}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 mt-2 mb-2" style={{ background: "rgba(255,255,255,0.06)" }} />
                  )}
                </div>
                {/* content */}
                <div className="pb-10 flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "#64748b" }}>{s.body}</p>
                  <span
                    className="inline-block text-xs px-3 py-1 rounded-full"
                    style={{ background: s.glow, color: s.color }}
                  >
                    {s.meta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Differentiators ── */}
        <section className="py-16 px-6" style={{ background: "#080c14" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12 tracking-tight">
              What Makes Us <span className="gradient-text">Different</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {differentiators.map((d, i) => (
                <div
                  key={i}
                  className="card-glow rounded-2xl p-8 text-center"
                  style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5"
                    style={{ background: d.glow }}
                  >
                    {d.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{d.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{d.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-6" style={{ background: "#0d1117" }}>
          <div
            className="max-w-2xl mx-auto text-center rounded-3xl p-12"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.08) 100%)",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="mb-8" style={{ color: "#94a3b8" }}>
              Join thousands of investors who trust Cherdung with their investment journey.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/signup"
                className="btn-glow rounded-xl bg-indigo-600 px-8 py-3 text-white font-semibold text-sm shadow-lg"
              >
                Create Account
              </Link>
              <Link
                href="/investment-plans"
                className="rounded-xl px-8 py-3 font-semibold text-sm transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
              >
                View Plans
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}