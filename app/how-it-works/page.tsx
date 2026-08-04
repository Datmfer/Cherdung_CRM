import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function HowItWorks() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 px-20 bg-gray-50 dark:bg-[#0f0f0f]">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              How It Works
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Start your investment journey in just a few simple steps
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20 px-20">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-12">

              {/* Step 1 */}
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Create Your Account
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Sign up in minutes with your email and basic information. Our secure registration process ensures your data is protected from the start.
                  </p>
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Time required:</span> 2-3 minutes
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Complete Your Profile
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Complete your profile by providing necessary details including investment goals, risk tolerance, and financial information for personalized recommendations.
                  </p>
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Time required:</span> 5-10 minutes
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Choose Your Investment Plan
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Select from our range of investment plans tailored to different investment levels and goals. Each plan offers unique features and benefits.
                  </p>
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Plans available:</span> Starter, Growth, Premium
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Fund Your Account
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Deposit funds securely using various payment methods including bank transfer, digital wallets, or other supported payment options.
                  </p>
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Processing time:</span> 1-3 business days
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Start Investing
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Once your account is funded, you can start investing based on your chosen plan. Monitor your portfolio performance and make adjustments as needed.
                  </p>
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Real-time tracking:</span> Available 24/7
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-20 bg-gray-50 dark:bg-[#0f0f0f]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              What Makes Us Different
            </h2>
            
            <div className="grid grid-cols-3 gap-8">
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Bank-Level Security
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your investments are protected with industry-leading encryption and security protocols.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Real-Time Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track your portfolio performance with comprehensive real-time analytics and reporting.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Expert Support
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get guidance from experienced investment professionals whenever you need it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Join thousands of investors who trust Cherdung Infotech with their investment journey.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/investment-plans"
                className="bg-indigo-500 text-white px-8 py-3 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Create Account
              </Link>
              <Link 
                href="/investment-plans"
                className="border border-indigo-500 text-indigo-500 dark:text-indigo-400 px-8 py-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}