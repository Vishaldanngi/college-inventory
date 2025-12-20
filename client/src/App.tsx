import { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Inventory from "./pages/Inventory";
import AddItem from "./pages/AddItem";
import Login from "./pages/Login";

function App() {
  // React state tracks login token
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  // Optional: sync with localStorage if changed elsewhere
  useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem("token"));
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUser({});
  };

  return (
    <>
      <nav className="bg-gray-100 p-4 flex justify-center gap-6">
        {token && (
          <>
            <Link to="/inventory" className="font-medium hover:underline">
              Inventory
            </Link>
            {user.role === "admin" && (
              <Link to="/add" className="font-medium hover:underline">
                Add Item
              </Link>
            )}
          </>
        )}

        {!token && (
          <Link to="/login" className="font-medium hover:underline">
            Login
          </Link>
        )}

        {token && (
          <button
            className="font-medium text-red-600 hover:underline"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </nav>

      <Routes>
        <Route
          path="/login"
          element={
            !token ? (
              <Login
                onLogin={(newToken: string, newUser: any) => {
                  setToken(newToken);
                  setUser(newUser);
                  localStorage.setItem("token", newToken);
                  localStorage.setItem("user", JSON.stringify(newUser));
                }}
              />
            ) : (
              <Navigate to="/inventory" />
            )
          }
        />

        <Route
          path="/inventory"
          element={token ? <Inventory /> : <Navigate to="/login" />}
        />

        <Route
          path="/add"
          element={
            token && user.role === "admin" ? <AddItem /> : <Navigate to="/inventory" />
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
