import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AboutUsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white dark:bg-[#111827]">
        <section className="py-28">
          <div className="max-w-7xl mx-auto px-8">
            <span className="inline-block rounded-full bg-indigo-100 text-indigo-600 px-4 py-2 text-sm font-semibold">
              ABOUT US
            </span>
            <h1 className="mt-6 text-5xl font-bold text-gray-900 dark:text-white">
              About Cherdung CRM
            </h1>
            <p className="mt-5 text-lg text-gray-600 dark:text-gray-400 leading-8">
              Cherdung CRM helps teams manage customers, analyze sales, and grow
              with one powerful platform.
            </p>

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/70 p-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Our mission
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-7">
                  We build a CRM experience that helps growing businesses stay
                  organized, close more deals, and keep customer information
                  secure.
                </p>
              </div>
              <div className="rounded-3xl bg-indigo-50 dark:bg-indigo-900/30 p-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Why Cherdung CRM?
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-7">
                  Simple workflows, analytics in one place, and accessible tools
                  for teams who want to scale faster.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
