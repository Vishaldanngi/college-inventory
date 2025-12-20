import { useEffect, useState } from "react";
import { api } from "../api/api";

interface Item {
  id: number;
  name: string;
  category: string;
  quantity: number;
  condition: string;
  description: string;
}

interface User {
  id: number;
  name: string;
  role: string; // "admin" or "member"
}

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get logged-in user role from localStorage
  const user: User = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  // Fetch items from backend
  const fetchItems = () => {
    setLoading(true);
    setError("");
    api
      .get("/items")
      .then((res) => setItems(res.data))
      .catch(() => setError("Failed to fetch items"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Delete item
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await api.delete(`/items/${id}`);
      setItems(items.filter((item) => item.id !== id)); // remove from UI
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-8 text-gray-500 animate-pulse text-lg">
        Loading inventory...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-8 text-red-500 text-lg font-medium">
        {error}
      </p>
    );

  if (items.length === 0)
    return (
      <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow text-center text-gray-500 bg-white">
        No items found in the inventory.
        <br />
        <span
          onClick={fetchItems}
          className="text-blue-500 underline cursor-pointer mt-2 inline-block"
        >
          Refresh Inventory
        </span>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Inventory</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={fetchItems}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Refresh Inventory
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold mb-1">{item.name}</h2>
            <p className="text-gray-600 mb-1">{item.category}</p>
            <p className="mb-1">
              Quantity: <span className="font-medium">{item.quantity}</span>
            </p>
            <p className="mb-1">Condition: {item.condition}</p>
            <p className="text-gray-500 text-sm">{item.description}</p>

            {/* DELETE BUTTON ONLY FOR ADMINS */}
            {isAdmin && (
              <button
                onClick={() => handleDelete(item.id)}
                className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
