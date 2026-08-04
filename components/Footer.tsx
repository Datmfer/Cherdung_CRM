import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-8">

        <div className="grid grid-cols-4 gap-8">

          {/* Company */}
          <div>
            <h3 className="text-2xl font-bold text-indigo-400">
              Cherdung Infotech
            </h3>

            <p className="mt-4 text-gray-400">
              Secure digital investment solutions for modern businesses
              and investors.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">
              Quick Links
            </h4>

            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link href="/investment-plans" className="hover:text-indigo-400 transition-colors">Investments</Link></li>
              <li><Link href="/about-us" className="hover:text-indigo-400 transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">
              Services
            </h4>

            <ul className="space-y-2 text-gray-400">
              <li>Portfolio Management</li>
              <li>Investor Portal</li>
              <li>Performance Analytics</li>
              <li>Document Management</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">
              Contact
            </h4>

            <p className="text-gray-400">
              Email: info@cherdung.com
            </p>

            <p className="text-gray-400 mt-2">
              Phone: +977 9800000000
            </p>

            <p className="text-gray-400 mt-2">
              Kathmandu, Nepal
            </p>
          </div>

        </div>

        <hr className="my-8 border-gray-800" />

        <p className="text-center text-gray-500">
          © 2026 Cherdung Infotech. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
}