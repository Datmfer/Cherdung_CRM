export default function Services() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen gap-4 shadow-lg">

      {/* Section Header */}
      <p className="text-gray-600 uppercase tracking-wider">
        Our Services
      </p>

      <h2 className="text-5xl font-bold">
        We help businesses.
      </h2>

      <p className="text-gray-600">
        Everything you need to manage your business efficiently.
      </p>

      {/* Cards */}
      <div className="flex gap-8 mt-12">

        {/* Card 1 */}
        <div className="bg-gray-300 p-10 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

          <div className="text-4xl mb-4">
            📈
          </div>

          <h3 className="text-xl font-bold mb-3">
            Sales Analytics
          </h3>

          <p className="text-gray-700">
            Track your revenue in real time.
          </p>

        </div>

        {/* Card 2 */}
        <div className="bg-gray-300 p-10 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

          <div className="text-4xl mb-4">
            📊
          </div>

          <h3 className="text-xl font-bold mb-3">
            Customer Management
          </h3>

          <p className="text-gray-700">
            Organize all customer information in one place.
          </p>

        </div>

        {/* Card 3 */}
        <div className="bg-gray-300 p-10 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

          <div className="text-4xl mb-4">
            🕒
          </div>

          <h3 className="text-xl font-bold mb-3">
            Task Management
          </h3>

          <p className="text-gray-700">
            Assign tasks and monitor project progress.
          </p>

        </div>

      </div>

    </section>
  );
}