import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

const plans = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Perfect for beginners",
    price: "NPR 1,33,000",
    accent: "#6366f1",
    glow: "rgba(99,102,241,0.1)",
    border: "rgba(255,255,255,0.06)",
    popular: false,
    features: [
      { label: "Portfolio Management", included: true },
      { label: "Basic Analytics", included: true },
      { label: "Email Support", included: true },
      { label: "Monthly Reports", included: true },
      { label: "Priority Support", included: false },
      { label: "Dedicated Advisor", included: false },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For growing investors",
    price: "NPR 13,30,000",
    accent: "#818cf8",
    glow: "rgba(99,102,241,0.14)",
    border: "rgba(99,102,241,0.35)",
    popular: true,
    features: [
      { label: "Portfolio Management", included: true },
      { label: "Advanced Analytics", included: true },
      { label: "Priority Support", included: true },
      { label: "Weekly Reports", included: true },
      { label: "Tax Optimization", included: true },
      { label: "Dedicated Advisor", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "For serious investors",
    price: "NPR 41,50,000",
    accent: "#a78bfa",
    glow: "rgba(139,92,246,0.1)",
    border: "rgba(255,255,255,0.06)",
    popular: false,
    features: [
      { label: "Portfolio Management", included: true },
      { label: "Premium Analytics", included: true },
      { label: "24/7 Support", included: true },
      { label: "Daily Reports", included: true },
      { label: "Tax Optimization", included: true },
      { label: "Dedicated Advisor", included: true },
    ],
  },
];

const whyUs = [
  { icon: "🎯", title: "Tailored Strategies", body: "Each plan is designed to match your investment goals and risk tolerance.", color: "#6366f1" },
  { icon: "🔒", title: "Secure Platform", body: "Your investments are protected with bank-level security and encryption.", color: "#10b981" },
  { icon: "📊", title: "Real-time Analytics", body: "Track your portfolio performance with comprehensive analytics tools.", color: "#f59e0b" },
  { icon: "💼", title: "Expert Support", body: "Get guidance from experienced investment professionals.", color: "#8b5cf6" },
];

export default function InvestmentPlans() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#080c14" }}>

        {/* ── Hero ── */}
        <section className="relative py-24 px-6 text-center overflow-hidden">
          <div
            className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }}
          />
          <div className="relative z-10 max-w-3xl mx-auto">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#818cf8" }}
            >
              Pricing
            </span>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Investment <span className="gradient-text">Plans</span>
            </h1>
            <p className="text-xl" style={{ color: "#94a3b8" }}>
              Choose the perfect plan tailored to your financial goals and risk appetite.
            </p>
          </div>
        </section>

        {/* ── Plans Grid ── */}
        <section className="py-12 px-6" style={{ background: "#0d1117" }}>
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 items-start">
            {plans.map((p) => (
              <div
                key={p.id}
                className="relative rounded-2xl p-8 flex flex-col gap-6 card-glow"
                style={{
                  background: p.popular
                    ? "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)"
                    : "#0f172a",
                  border: `1px solid ${p.border}`,
                }}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className="px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase"
                      style={{ background: "linear-gradient(90deg,#6366f1,#8b5cf6)", color: "#fff" }}
                    >
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Header */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{p.name}</h3>
                  <p className="text-sm" style={{ color: "#475569" }}>{p.tagline}</p>
                  <p className="text-3xl font-extrabold mt-4" style={{ color: p.accent }}>
                    {p.price}
                    <span className="text-sm font-normal ml-1" style={{ color: "#475569" }}>/minimum</span>
                  </p>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-3 flex-1">
                  {p.features.map((f) => (
                    <li key={f.label} className="flex items-center gap-2.5 text-sm">
                      {f.included ? (
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke={p.accent} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="#334155" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span style={{ color: f.included ? "#cbd5e1" : "#334155" }}>{f.label}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/signup"
                  className="block text-center py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={
                    p.popular
                      ? { background: "linear-gradient(90deg,#6366f1,#8b5cf6)", color: "#fff" }
                      : { background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }
                  }
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── Why Choose Us ── */}
        <section className="py-20 px-6" style={{ background: "#080c14" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12 tracking-tight">
              Why Choose Our <span className="gradient-text">Plans?</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {whyUs.map((w, i) => (
                <div
                  key={i}
                  className="card-glow rounded-2xl p-6 flex gap-4 items-start"
                  style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${w.color}18` }}
                  >
                    {w.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{w.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{w.body}</p>
                  </div>
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
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Investing?</h2>
            <p className="mb-8" style={{ color: "#94a3b8" }}>
              Contact us today to discuss which investment plan is right for you.
            </p>
            <Link
              href="/contact"
              className="btn-glow inline-block rounded-xl bg-indigo-600 px-8 py-3 text-white font-semibold text-sm shadow-lg"
            >
              Contact Us
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}