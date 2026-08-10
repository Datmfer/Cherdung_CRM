"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const contactInfo = [
  { icon: "📍", label: "Address", value: "Kathmandu, Nepal", color: "#6366f1" },
  { icon: "📧", label: "Email", value: "info@cherdung.com", color: "#10b981" },
  { icon: "📞", label: "Phone", value: "+977 9800000000", color: "#f59e0b" },
  { icon: "🕐", label: "Business Hours", value: "Mon–Fri: 9:00 AM – 6:00 PM", color: "#8b5cf6" },
];

const faqs = [
  {
    q: "How do I get started with investing?",
    a: "Simply create an account, complete your profile, choose an investment plan, and fund your account. Our team will guide you through each step.",
  },
  {
    q: "What is the minimum investment amount?",
    a: "Our Starter Plan begins at NPR 1,33,000, making it accessible for new investors looking to begin their journey.",
  },
  {
    q: "Is my investment secure?",
    a: "Yes, we use bank-level security and encryption to protect your investments and personal information at all times.",
  },
  {
    q: "How can I withdraw my investment?",
    a: "You can request withdrawals through your investor portal. Processing typically takes 3–5 business days depending on your bank.",
  },
];

const inputCls =
  "w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition focus:ring-2 focus:ring-indigo-500";
const inputStyle = {
  background: "#080c14",
  border: "1px solid rgba(255,255,255,0.07)",
};

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
              Get in Touch
            </span>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-xl" style={{ color: "#94a3b8" }}>
              Have questions? We&apos;d love to hear from you. Send us a message
              and we&apos;ll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* ── Contact grid ── */}
        <section className="py-16 px-6" style={{ background: "#0d1117" }}>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

            {/* Form */}
            <div
              className="rounded-2xl p-8"
              style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>

              {isSubmitted && (
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm mb-6"
                  style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" }}
                >
                  <span>✓</span> Thank you! Your message has been sent successfully.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
                  { name: "email", label: "Email Address", type: "email", placeholder: "john@example.com" },
                  { name: "subject", label: "Subject", type: "text", placeholder: "How can we help?" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#475569" }}>
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      name={f.name}
                      value={(formData as any)[f.name]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      required
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#475569" }}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Your message here..."
                    required
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-glow w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-6">
              <div
                className="rounded-2xl p-8 flex-1"
                style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <h2 className="text-2xl font-bold text-white mb-3">Contact Information</h2>
                <p className="text-sm mb-8" style={{ color: "#64748b" }}>
                  Reach out through any of these channels. Our team is available
                  to assist with your investment needs.
                </p>

                <div className="flex flex-col gap-5">
                  {contactInfo.map((c) => (
                    <div key={c.label} className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: `${c.color}18` }}
                      >
                        {c.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: c.color }}>
                          {c.label}
                        </p>
                        <p className="text-sm" style={{ color: "#94a3b8" }}>{c.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div
                className="rounded-2xl h-36 flex items-center justify-center text-sm"
                style={{
                  background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))",
                  border: "1px solid rgba(99,102,241,0.15)",
                  color: "#475569",
                }}
              >
                📍 Kathmandu, Nepal
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 px-6" style={{ background: "#080c14" }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12 tracking-tight">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <div className="flex flex-col gap-4">
              {faqs.map((f, i) => (
                <div
                  key={i}
                  className="card-glow rounded-2xl p-6"
                  style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <h3 className="font-semibold text-white mb-2">{f.q}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{f.a}</p>
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