export default function Hero() {
  return (
    <section className="flex items-center justify-between px-20 py-24">
      
      {/* Left Side */}
      <div className="max-w-xl">
        <h1 className="text-5xl font-bold leading-tight">
          Invest Smarter. Grow with Confidence.
        </h1>

        <p className="mt-6 text-gray-600 text-lg">
        
         A secure digital investment platform that helps investors
        discover opportunities, track portfolio performance,
        and manage investments with complete transparency.

        </p>

        <div className="mt-8 flex gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Become an Investor
          </button>

          <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50">
            Explore Investments
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-96 h-80 bg-gray-200 rounded-xl items-center justify-center">
        <h1 className="text-3xl font-bold">CRM dashboard</h1>
        <p className="text-2xl">Customer: 1240</p>
        <p className="text-2xl">Sales: $50,000</p>
        <p className="text-2xl">Task: 18</p>
      </div>

    </section>
  );
}