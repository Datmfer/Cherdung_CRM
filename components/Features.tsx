export default function Features() {
  return (
    <section className="py-20 px-20 bg-gray-50 dark:bg-[#0f0f0f]">

      <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
        Our Features
      </h2>

      <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
        Everything you need to grow your business.
      </p>

      <div className="grid grid-cols-3 gap-8 mt-12">

        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-8 hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            📊 Investment Portfolio
          </h3>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            View investment opportunities, portfolio holdings, and performance in one secure platform.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-8 hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            📈 Performance Analytics
          </h3>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Analyze investment performance with detailed reports.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-8 hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
           🔒 Secure Investor Portal
          </h3>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Access your investment information securely from anywhere.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-8 hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
           📝 Digital Onboarding
          </h3>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Streamline your investment onboarding process with our digital platform.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-8 hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
           📄 Document Management
          </h3>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Store and manage all your investment documents in one secure location.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-8 hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
           👨‍💼 Dedicated Investment Support
          </h3>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Get personalized support for all your investment needs.
          </p>
        </div>

      </div>

    </section>
  );
}