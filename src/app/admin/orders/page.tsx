"use client";
import { useEffect, useState } from "react";

export default function ViewOrders() {
  const [orders, setOrders] = useState([]);

  // Orders load karne ka function
  const fetchOrders = () => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Order status update karne ka function
  const updateStatus = async (id: string) => {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "Delivered" }),
    });

    if (res.ok) {
      alert("Mubarak ho! Order delivered mark ho gaya. ✅");
      fetchOrders(); // List ko refresh karne ke liye
    } else {
      alert("Status update nahi ho saka.");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
      <h2 style={{ borderBottom: "3px solid #0070f3", paddingBottom: "10px", color: "#222" }}>
        📥 Customer Orders Management
      </h2>
      
      <div style={{ marginTop: "30px" }}>
        {orders.length === 0 ? <p>Abhi tak koi order nahi aaya.</p> : 
          orders.map((order: any) => (
            <div key={order._id} style={{ 
              border: "none", padding: "25px", borderRadius: "15px", 
              marginBottom: "20px", backgroundColor: "white", 
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div>
                <h3 style={{ margin: "0 0 10px 0", color: "#0070f3" }}>👤 {order.customerName}</h3>
                <p style={{ margin: "5px 0" }}>📞 <strong>Phone:</strong> {order.phone}</p>
                <p style={{ margin: "5px 0" }}>📍 <strong>Address:</strong> {order.address}</p>
                <p style={{ margin: "5px 0" }}>🎒 <strong>Items:</strong> {order.itemsCount}</p>
                <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "10px" }}>
                  📅 {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ 
                  marginBottom: "15px", padding: "8px 15px", borderRadius: "20px",
                  display: "inline-block", fontWeight: "bold", fontSize: "0.9rem",
                  backgroundColor: order.status === "Delivered" ? "#e6fffa" : "#fff5f5",
                  color: order.status === "Delivered" ? "#28a745" : "#e53e3e",
                  border: `1px solid ${order.status === "Delivered" ? "#28a745" : "#e53e3e"}`
                }}>
                  {order.status || "Pending"}
                </div>
                <br />
                {order.status !== "Delivered" && (
                  <button 
                    onClick={() => updateStatus(order._id)}
                    style={{ 
                      backgroundColor: "#28a745", color: "white", border: "none", 
                      padding: "10px 20px", borderRadius: "8px", cursor: "pointer",
                      fontWeight: "bold", transition: "0.3s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#218838"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#28a745"}
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}