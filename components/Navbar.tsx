export default function Navbar() {
    return (
        <nav className="flex justify-between item center p-6 bg-gray-700 text-white">
            <h1 className="text-2xl font-bold">Cherdung CRM</h1>
            <ul className="flex gap-8">
                <li>
                    <a href="#">Home</a>
                </li>
                <li>
                    <a href="#">Investment Solutions</a>
                </li>
                <li>
                    <a href="#">How It Works</a>
                </li>
                <li>
                    <a href="#">About Us</a>
                </li>
                <li>
                    <a href="#">Contact</a>
                </li>
            </ul>
        </nav>
    );
}
