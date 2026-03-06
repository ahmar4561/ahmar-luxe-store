"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Watches",
    image: "",
    description: ""
  });

  const inputStyle = {
    width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px",
    border: "1px solid var(--border)", backgroundColor: "var(--nav-bg)",
    color: "var(--foreground)", outline: "none"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price) // Price ko number mein convert karna zaroori hai
        }),
      });

      if (res.ok) {
        alert("Mubarak ho! Product add ho gaya.");
        router.push("/admin/manage"); // Direct manage page par le jayega dekhne ke liye
      } else {
        alert("Error: Product add nahi ho saka.");
      }
    } catch (err) {
      alert("Network Error: Connection check karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Add New Luxury Product 💎</h1>
      <form onSubmit={handleSubmit}>
        <label>Product Name</label>
        <input style={inputStyle} type="text" required placeholder="Rolex Datejust" 
          onChange={(e) => setFormData({...formData, name: e.target.value})} />

        <label>Price (Rs.)</label>
        <input style={inputStyle} type="number" required placeholder="550000" 
          onChange={(e) => setFormData({...formData, price: e.target.value})} />

        <label>Category</label>
        <select style={inputStyle} onChange={(e) => setFormData({...formData, category: e.target.value})}>
          <option>Watches</option>
          <option>Mobile</option>
          <option>Fashion</option>
          <option>Electronics</option>
          <option>Laptop</option>
        </select>

        <label>Image URL (Link)</label>
        <input style={inputStyle} type="text" required placeholder="https://example.com/watch.jpg" 
          onChange={(e) => setFormData({...formData, image: e.target.value})} />

        <label>Description</label>
        <textarea style={{...inputStyle, height: "100px"}} required placeholder="Product details..." 
          onChange={(e) => setFormData({...formData, description: e.target.value})} />

        <button type="submit" disabled={loading} style={{
          width: "100%", padding: "15px", backgroundColor: "#0070f3", color: "white",
          border: "none", borderRadius: "8px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer"
        }}>
          {loading ? "Saving..." : "Add Product to Store"}
        </button>
      </form>
    </div>
  );
}