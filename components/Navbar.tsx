"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const activeClass =
    "text-indigo-400 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-indigo-400";
  const inactiveClass =
    "text-slate-400 hover:text-indigo-400 transition-colors duration-200";

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md" style={{ background: 'rgba(8,12,20,0.85)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            C
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">
              Cherdung CRM
            </h1>
            <p className="text-xs" style={{ color: '#475569' }}>
              Investment Platform
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <ul className="hidden md:flex items-center gap-10 font-medium">
          <li>
            <Link
              href="/"
              className={pathname === "/" ? activeClass : inactiveClass}
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/investment-plans"
              className={
                pathname === "/investment-plans" ? activeClass : inactiveClass
              }
            >
              Investment Plans
            </Link>
          </li>

          <li>
            <Link
              href="/how-it-works"
              className={
                pathname === "/how-it-works" ? activeClass : inactiveClass
              }
            >
              How It Works
            </Link>
          </li>

          <li>
            <Link
              href="/about-us"
              className={pathname === "/about-us" ? activeClass : inactiveClass}
            >
              About Us
            </Link>
          </li>

          <li>
            <Link
              href="/contact"
              className={pathname === "/contact" ? activeClass : inactiveClass}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {loading ? null : user ? (
            <>
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-sm font-semibold text-white">
                  {user.name}
                </span>
                <span className="text-xs capitalize" style={{ color: '#475569' }}>
                  {user.role}
                </span>
              </div>

              <Link
                href={
                  user.role === "admin"
                    ? "/admin/dashboard"
                    : user.role === "support"
                      ? "/support/dashboard"
                      : "/user-dashboard/dashboard"
                }
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white font-semibold shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-300"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:block font-medium text-sm transition-colors duration-200 hover:text-indigo-400"
                style={{ color: '#94a3b8' }}
              >
                Login
              </Link>

              <Link
                href="/login"
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white font-semibold shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-300"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
