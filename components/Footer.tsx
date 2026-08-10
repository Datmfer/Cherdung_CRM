import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Investment Plans", href: "/investment-plans" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact", href: "/contact" },
];

const serviceLinks = [
  "Portfolio Management",
  "Investor Portal",
  "Performance Analytics",
  "Document Management",
];

export default function Footer() {
  return (
    <footer
      className="pt-16 pb-8 px-6"
      style={{
        background: "#080c14",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                C
              </div>
              <span className="text-lg font-bold text-white">Cherdung Infotech</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#475569" }}>
              Secure digital investment solutions for modern businesses and
              investors. Grow your wealth with confidence.
            </p>
            {/* Stats row */}
            <div className="flex gap-6 mt-2">
              {[
                { value: "1,200+", label: "Investors" },
                { value: "NPR 66.5L", label: "Managed" },
                { value: "24%", label: "Avg. Growth" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-sm font-bold text-indigo-400">{s.value}</p>
                  <p className="text-xs" style={{ color: "#475569" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors duration-200 hover:text-indigo-400"
                    style={{ color: "#475569" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services + Contact */}
          <div className="flex flex-col gap-8">
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Services
              </h4>
              <ul className="flex flex-col gap-2.5">
                {serviceLinks.map((s) => (
                  <li key={s} className="text-sm" style={{ color: "#475569" }}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Contact
              </h4>
              <div className="flex flex-col gap-2 text-sm" style={{ color: "#475569" }}>
                <a href="mailto:info@cherdung.com" className="hover:text-indigo-400 transition-colors">
                  info@cherdung.com
                </a>
                <span>+977 9800000000</span>
                <span>Kathmandu, Nepal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            color: "#334155",
          }}
        >
          <span>© 2026 Cherdung Infotech. All Rights Reserved.</span>
          <div className="flex gap-6">
            <Link href="/contact" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}