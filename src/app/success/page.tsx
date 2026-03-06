"use client";
import { useEffect, useState, useRef } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function SuccessPage() {
  const { clearCart, cartTotal } = useCart();
  const [orderId, setOrderId] = useState("");
  const hasSentEmail = useRef(false);

  useEffect(() => {
    // 1. Generate Order ID
    const newOrderId = `AL-${Math.floor(Math.random() * 90000) + 10000}`;
    setOrderId(newOrderId);

    // 2. Trigger Automated Confirmation Email
    const triggerEmail = async () => {
      if (hasSentEmail.current) return; 
      hasSentEmail.current = true;

      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "ahmaralimemon187@gmail.com",
            orderId: newOrderId,
            total: cartTotal.toLocaleString(),
          }),
        });
        console.log("Professional Confirmation Email Dispatched.");
      } catch (err) {
        console.error("Email dispatch failed:", err);
      }
    };

    triggerEmail();

    // 3. Clear Bag with Delay
    const timer = setTimeout(() => {
      if (clearCart) clearCart();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', minHeight: '90vh', textAlign: 'center',
      backgroundColor: '#fff', padding: '40px', color: '#000'
    }}>
      {/* Aesthetic Checkmark */}
      <div style={{ 
        width: '80px', height: '80px', borderRadius: '50%', 
        border: '1px solid #000', display: 'flex', alignItems: 'center', 
        justifyContent: 'center', fontSize: '30px', marginBottom: '30px'
      }}>
        ✓
      </div>

      <div style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px', opacity: 0.6 }}>
        Payment Confirmed
      </div>

      <h1 style={{ 
        fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '300', 
        letterSpacing: '-1px', margin: '0 0 20px 0' 
      }}>
        Thank you for your order.
      </h1>

      <p style={{ 
        color: '#666', fontSize: '16px', maxWidth: '540px', 
        lineHeight: '1.8', margin: '0 0 40px 0' 
      }}>
        We have received your payment for order <strong>{orderId}</strong>. 
        A confirmation email has been sent to your inbox. 
        Our artisans are now preparing your luxury items for shipment.
      </p>

      <Link href="/" style={{ 
        background: '#000', color: '#fff', padding: '15px 40px', 
        borderRadius: '0px', textDecoration: 'none', fontWeight: '500', 
        fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase',
        transition: 'all 0.3s ease'
      }}>
        Return to Collections
      </Link>

      <div style={{ marginTop: '60px', borderTop: '1px solid #eee', paddingTop: '20px', width: '100%', maxWidth: '200px' }}>
        <p style={{ fontSize: '11px', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '1px' }}>
          AHMAR LUXE Official
        </p>
      </div>
    </div>
  );
}