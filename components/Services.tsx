export default function Services() {
  const services = [
    {
      icon: "📈",
      title: "Sales Analytics",
      description:
        "Monitor revenue, track performance, and make smarter business decisions with real-time analytics.",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: "👥",
      title: "Customer Management",
      description:
        "Manage customer profiles, interactions, and relationships from one secure platform.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: "✅",
      title: "Task Management",
      description:
        "Assign tasks, monitor deadlines, and keep your team productive with powerful workflows.",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <section className="py-28 bg-gray-50 dark:bg-[#111827]">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-indigo-100 text-indigo-600 px-4 py-2 text-sm font-semibold">
            OUR SERVICES
          </span>

          <h2 className="mt-6 text-5xl font-bold text-gray-900 dark:text-white">
            Solutions That Help Your Business Grow
          </h2>

          <p className="mt-5 text-lg text-gray-600 dark:text-gray-400 leading-8">
            Everything you need to manage customers, investments, and operations
            from one powerful platform.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${service.color}`}
              >
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                {service.title}
              </h3>

              {/* Description */}
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-7">
                {service.description}
              </p>

              {/* Link */}
              <button className="mt-8 text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
