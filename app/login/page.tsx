import Link from "next/link";
import { Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-16 dark:from-[#0f172a] dark:via-[#111827] dark:to-[#1e1b4b]">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-800 dark:bg-[#111827]">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:bg-[#111827] dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
          >
            <ArrowLeft size={16} />
            Home
          </Link>
        </div>

        {/* Logo */}

        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white shadow-lg">
            C
          </div>
        </div>

        {/* Heading */}

        <div className="mt-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>

          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Sign in to continue to your dashboard.
          </p>
        </div>

        {/* Form */}

        <form className="mt-8 space-y-6">
          {/* Email */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email
            </label>

            <div className="relative">
              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-gray-700 dark:bg-[#0f172a] dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40"
              />
            </div>
          </div>

          {/* Password */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Password
            </label>

            <div className="relative">
              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-gray-700 dark:bg-[#0f172a] dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40"
              />
            </div>
          </div>

          {/* Options */}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Remember me
            </label>

            <Link
              href="/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Button */}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
          >
            Sign In
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Footer */}

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}
