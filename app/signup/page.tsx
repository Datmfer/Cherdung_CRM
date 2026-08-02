import Link from "next/link";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-16 dark:from-[#0f172a] dark:via-[#111827] dark:to-[#1e1b4b]">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-800 dark:bg-[#111827]">
        {/* Logo */}

        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white shadow-lg">
            C
          </div>
        </div>

        {/* Heading */}

        <div className="mt-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Create Your Account
          </h1>

          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Join Cherdung CRM and start managing your business today.
          </p>
        </div>

        {/* Form */}

        <form className="mt-8 space-y-5">
          {/* Full Name */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Full Name
            </label>

            <div className="relative">
              <User
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="John Doe"
                className="w-full rounded-2xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-gray-700 dark:bg-[#0f172a] dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40"
              />
            </div>
          </div>

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
                placeholder="Create a password"
                className="w-full rounded-2xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-gray-700 dark:bg-[#0f172a] dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40"
              />
            </div>

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Must contain at least 8 characters.
            </p>
          </div>

          {/* Confirm Password */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>

            <div className="relative">
              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full rounded-2xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-gray-700 dark:bg-[#0f172a] dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40"
              />
            </div>
          </div>

          {/* Terms */}

          <label className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />

            <span>
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-medium text-indigo-600 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-indigo-600 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {/* Button */}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
          >
            Create Account
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Footer */}

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
