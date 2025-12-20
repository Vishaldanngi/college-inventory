import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="bg-gray-100 p-4 flex justify-center gap-6 shadow">
      <Link to="/inventory" className="font-medium hover:text-blue-500">
        Inventory
      </Link>
      <Link to="/add" className="font-medium hover:text-blue-500">
        Add Item
      </Link>
    </nav>
  );
}
