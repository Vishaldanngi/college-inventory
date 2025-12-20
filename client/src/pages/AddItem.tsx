import { useState } from "react";
import { api } from "../api/api";

export default function AddItem() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [condition, setCondition] = useState("Good");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await api.post("/items", { name, category, quantity, condition, description });
      setMessage("✅ Item added successfully!");
      // Reset form
      setName("");
      setCategory("");
      setQuantity(0);
      setCondition("Good");
      setDescription("");
    } catch (err) {
      setMessage("❌ Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Add Item</h1>

      {message && (
        <p
          className={`mb-4 text-center font-medium ${
            message.includes("✅") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Item Name"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={0}
          required
        />
        <select
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        >
          <option value="Good">Good</option>
          <option value="Average">Average</option>
          <option value="Poor">Poor</option>
        </select>
        <textarea
          placeholder="Description"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  );
}
