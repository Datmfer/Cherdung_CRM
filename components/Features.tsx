export default function Features() {
  return (
    <section className="py-20 px-20">

      <h2 className="text-4xl font-bold text-center">
        Our Features
      </h2>

      <p className="text-center text-gray-500 mt-4">
        Everything you need to grow your business.
      </p>

      <div className="grid grid-cols-3 gap-8 mt-12">

        <div className="shadow-lg rounded-xl p-8">
          <h3 className="text-2xl font-bold">
            📊 Investment Portfolio
          </h3>

          <p className="mt-4 text-gray-600">
            View investment opportunities, portfolio holdings, and performance in one secure platform.
          </p>
        </div>

        <div className="shadow-lg rounded-xl p-8">
          <h3 className="text-2xl font-bold">
            📈 Performance Analytics
          </h3>

          <p className="mt-4 text-gray-600">
            Analyze investment performance with detailed reports.
          </p>
        </div>

        <div className="shadow-lg rounded-xl p-8">
          <h3 className="text-2xl font-bold">
           🔒 Secure Investor Portal
          </h3>

          <p className="mt-4 text-gray-600">
            Access your investment information securely from anywhere.
          </p>
        </div>

        <div className="shadow-lg rounded-xl p-8">
          <h3 className="text-2xl font-bold">
           📝 Digital Onboarding
          </h3>

          <p className="mt-4 text-gray-600">
            Streamline your investment onboarding process with our digital platform.
          </p>
        </div>

        <div className="shadow-lg rounded-xl p-8">
          <h3 className="text-2xl font-bold">
           📄 Document Management
          </h3>

          <p className="mt-4 text-gray-600">
            Store and manage all your investment documents in one secure location.
          </p>
        </div>

        <div className="shadow-lg rounded-xl p-8">
          <h3 className="text-2xl font-bold">
           👨‍💼 Dedicated Investment Support
          </h3>

          <p className="mt-4 text-gray-600">
            Get personalized support for all your investment needs.
          </p>
        </div>

      </div>

    </section>
  );
}