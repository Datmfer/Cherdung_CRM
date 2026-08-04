import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function InvestmentPlans() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 px-20 bg-gray-50 dark:bg-[#0f0f0f]">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Investment Plans
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Choose the perfect investment plan tailored to your financial goals and risk appetite.
            </p>
          </div>
        </section>

        {/* Investment Plans */}
        <section className="py-20 px-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-3 gap-8">

              {/* Starter Plan */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Starter Plan
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Perfect for beginners
                  </p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-indigo-500">NPR 1,33,000</span>
                    <span className="text-gray-600 dark:text-gray-400">/minimum</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-indigo-500 mr-2">✓</span>
                    Portfolio Management
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-indigo-500 mr-2">✓</span>
                    Basic Analytics
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-indigo-500 mr-2">✓</span>
                    Email Support
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-indigo-500 mr-2">✓</span>
                    Monthly Reports
                  </li>
                  <li className="flex items-center text-gray-400 dark:text-gray-500">
                    <span className="text-gray-400 dark:text-gray-600 mr-2">✗</span>
                    Priority Support
                  </li>
                  <li className="flex items-center text-gray-400 dark:text-gray-500">
                    <span className="text-gray-400 dark:text-gray-600 mr-2">✗</span>
                    Dedicated Advisor
                  </li>
                </ul>

                <Link 
                  href="/how-it-works"
                  className="w-full block bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition-colors text-center"
                >
                  Get Started
                </Link>
              </div>

              {/* Growth Plan */}
              <div className="bg-white dark:bg-[#1a1a1a] border-2 border-indigo-500 rounded-xl p-8 hover:shadow-lg transition-shadow relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Popular
                  </span>
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Growth Plan
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    For growing investors
                  </p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-indigo-500">NPR 13,30,000</span>
                    <span className="text-gray-600 dark:text-gray-400">/minimum</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-indigo-500 mr-2">✓</span>
                    Portfolio Management
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-indigo-500 mr-2">✓</span>
                    Advanced Analytics
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-indigo-500 mr-2">✓</span>
                    Priority Support
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-indigo-500 mr-2">✓</span>
                    Weekly Reports
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-indigo-500 mr-2">✓</span>
                    Tax Optimization
                  </li>
                  <li className="flex items-center text-gray-400 dark:text-gray-500">
                    <span className="text-gray-400 dark:text-gray-600 mr-2">✗</span>
                    Dedicated Advisor
                  </li>
                </ul>

                <Link 
                  href="/how-it-works"
                  className="w-full block bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition-colors text-center"
                >
                  Get Started
                </Link>
              </div>

              {/* Premium Plan */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Premium Plan
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    For serious investors
                  </p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-indigo-500">NPR 41,50,000</span>
                    <span className="text-gray-600 dark:text-gray-400">/minimum</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-indigo-500 mr-2">✓</span>
                    Portfolio Management
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-indigo-500 mr-2">✓</span>
                    Premium Analytics
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-indigo-500 mr-2">✓</span>
                    24/7 Support
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-indigo-500 mr-2">✓</span>
                    Daily Reports
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-indigo-500 mr-2">✓</span>
                    Tax Optimization
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-indigo-500 mr-2">✓</span>
                    Dedicated Advisor
                  </li>
                </ul>

                <Link 
                  href="/how-it-works"
                  className="w-full block bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition-colors text-center"
                >
                  Get Started
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="py-20 px-20 bg-gray-50 dark:bg-[#0f0f0f]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Why Choose Our Investment Plans?
            </h2>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  🎯 Tailored Strategies
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Each plan is designed to match your investment goals and risk tolerance.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  🔒 Secure Platform
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your investments are protected with bank-level security and encryption.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  📊 Real-time Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track your portfolio performance with comprehensive analytics tools.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  💼 Expert Support
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get guidance from experienced investment professionals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Investing?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Contact us today to discuss which investment plan is right for you.
            </p>
            <button className="bg-indigo-500 text-white px-8 py-3 rounded-lg hover:bg-indigo-600 transition-colors">
              Contact Us
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}