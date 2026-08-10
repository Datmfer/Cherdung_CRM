import Link from "next/link";

const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    accent: "#6366f1",
    glow: "rgba(99,102,241,0.12)",
    tag: "Analytics",
    title: "Sales Analytics",
    description:
      "Monitor revenue, track performance, and make smarter business decisions with real-time analytics.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    accent: "#10b981",
    glow: "rgba(16,185,129,0.12)",
    tag: "CRM",
    title: "Customer Management",
    description:
      "Manage customer profiles, interactions, and relationships from one secure platform.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
    accent: "#f59e0b",
    glow: "rgba(245,158,11,0.12)",
    tag: "Workflow",
    title: "Task Management",
    description:
      "Assign tasks, monitor deadlines, and keep your team productive with powerful workflows.",
  },
];

export default function Services() {
  return (
    <section
      className="py-24 px-6"
      style={{ background: "#0d1117" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
            style={{
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.25)",
              color: "#a78bfa",
            }}
          >
            Our Services
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Solutions that help your{" "}
            <span className="gradient-text">business grow</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#64748b" }}>
            Everything you need to manage customers, investments, and operations
            from one powerful platform.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={i}
              className="card-glow group relative rounded-2xl p-8 flex flex-col gap-6 overflow-hidden"
              style={{
                background: "#0f172a",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Subtle top glow */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${s.accent}60, transparent)`,
                }}
              />

              {/* Icon + Tag row */}
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: s.glow, color: s.accent }}
                >
                  {s.icon}
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: `${s.glow}`,
                    color: s.accent,
                  }}
                >
                  {s.tag}
                </span>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-xl font-bold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                  {s.description}
                </p>
              </div>

              {/* Link */}
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-2.5"
                style={{ color: s.accent }}
              >
                Learn More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
