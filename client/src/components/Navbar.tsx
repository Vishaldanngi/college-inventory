import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow mb-4">
      <div className="max-w-6xl mx-auto p-4 flex justify-between">
        <span className="font-bold">Club Inventory</span>
        <Link to="/inventory" className="text-blue-600">
          Inventory
        </Link>
      </div>
    </nav>
  );
}
