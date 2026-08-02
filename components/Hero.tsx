export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto flex items-center justify-between gap-20 px-8 py-28">
      {/* Left */}
      <div className="max-w-xl">
        <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold">
          Trusted Investment Platform
        </span>

        <h1 className="mt-6 text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">
          Invest Smarter.
          <br />
          Grow with Confidence.
        </h1>

        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
          A secure digital investment platform that helps investors discover
          opportunities, track portfolio performance, and manage investments
          with complete transparency.
        </p>

        <div className="mt-10 flex gap-5">
          <button className="rounded-xl bg-indigo-600 px-7 py-4 text-white font-semibold shadow-lg hover:bg-indigo-700 transition">
            Become an Investor
          </button>

          <button className="rounded-xl border border-gray-300 px-7 py-4 font-semibold hover:bg-gray-100 transition dark:border-gray-700 dark:hover:bg-gray-800">
            Explore Investments →
          </button>
        </div>
      </div>

      {/* Dashboard */}
      <div className="w-[460px] rounded-3xl bg-white border border-gray-200 shadow-2xl p-8 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Investment Dashboard</h2>

          <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600">
            Live
          </span>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-indigo-50 p-5">
            <p className="text-sm text-gray-500">Investors</p>
            <h3 className="text-3xl font-bold mt-2">1,240</h3>
          </div>

          <div className="rounded-xl bg-green-50 p-5">
            <p className="text-sm text-gray-500">Revenue</p>
            <h3 className="text-3xl font-bold mt-2">$50K</h3>
          </div>

          <div className="rounded-xl bg-orange-50 p-5">
            <p className="text-sm text-gray-500">Active Tasks</p>
            <h3 className="text-3xl font-bold mt-2">18</h3>
          </div>

          <div className="rounded-xl bg-purple-50 p-5">
            <p className="text-sm text-gray-500">Growth</p>
            <h3 className="text-3xl font-bold mt-2">+24%</h3>
          </div>
        </div>

        {/* Fake Chart */}

        <div className="mt-8">
          <div className="flex items-end gap-3 h-36">
            <div className="w-8 h-20 rounded bg-indigo-300"></div>

            <div className="w-8 h-28 rounded bg-indigo-400"></div>

            <div className="w-8 h-16 rounded bg-indigo-300"></div>

            <div className="w-8 h-32 rounded bg-indigo-500"></div>

            <div className="w-8 h-24 rounded bg-indigo-400"></div>

            <div className="w-8 h-36 rounded bg-indigo-600"></div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Portfolio growth over the last 6 months
          </p>
        </div>
      </div>
    </section>
  );
}
