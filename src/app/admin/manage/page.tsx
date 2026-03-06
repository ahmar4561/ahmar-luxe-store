"use client";
import { useState, useEffect } from "react";

export default function ManageProducts() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  // --- 1. LOGIN LOGIC ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = "Admin786"; // Aap yahan apna password change kar sakte hain

    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError("");
      sessionStorage.setItem("isAdmin", "true");
    } else {
      setError("❌ Access Denied: Galat Password!");
    }
  };

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isAdmin");
    if (loggedIn === "true") setIsAuthenticated(true);
  }, []);

  // --- 2. PRODUCT MANAGEMENT LOGIC (Aapka Purana Code) ---
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const deleteProduct = async (id: string) => {
    if (confirm("Kya aap waqai ye product delete karna chahte hain?")) {
      try {
        const res = await fetch("/api/products", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          alert("Product deleted successfully!");
          fetchProducts();
        } else {
          alert("Delete failed.");
        }
      } catch (err) {
        alert("System Busy: Try again");
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAdmin");
    setIsAuthenticated(false);
  };

  // --- 3. SECURITY SCREEN (Pehle ye dikhega) ---
  if (!isAuthenticated) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "var(--background)" }}>
        <div style={{ padding: "40px", borderRadius: "15px", border: "1px solid var(--border)", textAlign: "center", maxWidth: "400px", width: "90%", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "10px" }}>ADMIN LOCK</h1>
          <p style={{ fontSize: "12px", opacity: 0.5, marginBottom: "30px" }}>Authorized Personnel Only</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid var(--border)", backgroundColor: "var(--nav-bg)", color: "var(--foreground)", marginBottom: "15px", textAlign: "center", outline: "none" }}
            />
            {error && <p style={{ color: "#ff4d4d", fontSize: "13px", marginBottom: "15px" }}>{error}</p>}
            <button type="submit" style={{ width: "100%", padding: "15px", backgroundColor: "var(--foreground)", color: "var(--background)", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>UNLOCK DASHBOARD</button>
          </form>
        </div>
      </div>
    );
  }

  // --- 4. ADMIN DASHBOARD (Password ke baad ye dikhega) ---
  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2>Admin Dashboard: Manage Products 🛠️</h2>
        <button onClick={handleLogout} style={{ padding: "10px 20px", backgroundColor: "#333", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Logout</button>
      </div>
      
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "var(--nav-bg)", color: "var(--foreground)" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--border)", textAlign: "left" }}>
              <th style={{ padding: "15px", border: "1px solid var(--border)" }}>Product Name</th>
              <th style={{ padding: "15px", border: "1px solid var(--border)" }}>Price</th>
              <th style={{ padding: "15px", border: "1px solid var(--border)", textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p: any) => (
                <tr key={p._id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "15px", border: "1px solid var(--border)" }}>{p.name}</td>
                  <td style={{ padding: "15px", border: "1px solid var(--border)" }}>Rs. {p.price.toLocaleString()}</td>
                  <td style={{ padding: "15px", border: "1px solid var(--border)", textAlign: "center" }}>
                    <button onClick={() => deleteProduct(p._id)} style={{ backgroundColor: "#ff4d4d", color: "white", border: "none", padding: "8px 16px", cursor: "pointer", borderRadius: "6px", fontWeight: "bold" }}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ padding: "20px", textAlign: "center", opacity: 0.5 }}>No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}