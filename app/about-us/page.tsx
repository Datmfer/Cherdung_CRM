import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AboutUsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1" style={{ background: "#080c14" }}>

        {/* ── Hero ── */}
        <section className="relative py-24 px-6 overflow-hidden">
          {/* orb */}
          <div
            className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)" }}
          />
          <div className="max-w-4xl mx-auto relative z-10">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#818cf8" }}
            >
              About Us
            </span>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              About{" "}
              <span className="gradient-text">Cherdung CRM</span>
            </h1>
            <p className="text-xl leading-relaxed max-w-2xl" style={{ color: "#94a3b8" }}>
              Cherdung CRM helps teams manage customers, analyze sales, and grow
              with one powerful, transparent platform built for modern investors.
            </p>
          </div>
        </section>

        {/* ── Mission cards ── */}
        <section className="py-16 px-6" style={{ background: "#0d1117" }}>
          <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-2">

            <div
              className="card-glow rounded-2xl p-10"
              style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
                style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="leading-7" style={{ color: "#64748b" }}>
                We build a CRM experience that helps growing businesses stay
                organized, close more deals, and keep customer information
                secure — with complete transparency at every step.
              </p>
            </div>

            <div
              className="card-glow rounded-2xl p-10"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.06) 100%)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
                style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa" }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Why Cherdung CRM?</h2>
              <p className="leading-7" style={{ color: "#64748b" }}>
                Simple workflows, analytics in one place, and accessible tools
                for teams who want to scale faster — without the complexity of
                enterprise software.
              </p>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="py-16 px-6" style={{ background: "#080c14" }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "1,200+", label: "Active Investors", color: "#6366f1" },
                { value: "NPR 66.5L", label: "Assets Managed", color: "#10b981" },
                { value: "24%", label: "Average Growth", color: "#f59e0b" },
                { value: "99.9%", label: "Uptime", color: "#8b5cf6" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl p-6 text-center"
                  style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <p className="text-3xl font-extrabold mb-1" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-sm" style={{ color: "#475569" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
