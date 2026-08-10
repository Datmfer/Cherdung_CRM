const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    color: "rgba(99,102,241,0.15)",
    iconColor: "#818cf8",
    title: "Investment Portfolio",
    description:
      "View investment opportunities, portfolio holdings, and performance in one secure platform.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    color: "rgba(16,185,129,0.15)",
    iconColor: "#34d399",
    title: "Performance Analytics",
    description:
      "Analyze investment performance with detailed reports and real-time insights.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    color: "rgba(245,158,11,0.15)",
    iconColor: "#fbbf24",
    title: "Secure Investor Portal",
    description:
      "Access your investment information securely from anywhere, any time.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    color: "rgba(139,92,246,0.15)",
    iconColor: "#a78bfa",
    title: "Digital Onboarding",
    description:
      "Streamline your investment onboarding with a fully digital, paperless process.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
    ),
    color: "rgba(236,72,153,0.12)",
    iconColor: "#f472b6",
    title: "Document Management",
    description:
      "Store and manage all your investment documents in one secure, organised location.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
      </svg>
    ),
    color: "rgba(20,184,166,0.12)",
    iconColor: "#2dd4bf",
    title: "Dedicated Support",
    description:
      "Get personalised support from our investment specialists whenever you need it.",
  },
];

export default function Features() {
  return (
    <section
      className="py-24 px-6"
      style={{ background: "linear-gradient(180deg, #080c14 0%, #0d1117 100%)" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.25)",
              color: "#818cf8",
            }}
          >
            Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Everything you need to{" "}
            <span className="gradient-text">grow</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#64748b" }}>
            A complete toolkit for modern investors — built for clarity,
            security, and performance.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="card-glow rounded-2xl p-6 flex flex-col gap-4"
              style={{
                background: "#0f172a",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: f.color, color: f.iconColor }}
              >
                {f.icon}
              </div>

              {/* Text */}
              <div>
                <h3 className="text-base font-semibold text-white mb-1.5">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}