"use client";
import { useState, useEffect } from "react";
import "./globals.css";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { CartProvider, useCart } from "@/context/CartContext";
import AIChatbot from "@/components/AIChatbot";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

// --- 1. ULTRA LUXE CART DRAWER (Updated for Professional & Responsive Look) ---
const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, cartTotal } = useCart();

  const handleCartCheckout = async () => {
    if (cart.length === 0) return alert("Your bag is empty!");
    try {
      const checkoutItems = cart.map((item: any) => ({
        name: item.name,
        price: item.price,
        quantity: item.qty,
        image: item.image || item.img
      }));

      const response = await fetch("/api/checkout", { 
        method: "POST",
        body: JSON.stringify({ items: checkoutItems }), 
        headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment Error: " + data.error);
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("System Busy: Stripe is not responding.");
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop: Blurred for premium feel */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1999 }}
          />

          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="cart-drawer-container"
            style={{ 
              position: 'fixed', 
              right: '10px', 
              top: '10px', 
              bottom: '10px',
              height: 'calc(100vh - 20px)', 
              width: 'calc(100% - 20px)',
              maxWidth: '420px', 
              background: 'var(--background)', 
              border: '1px solid var(--border)', 
              zIndex: 2000,
              display: 'flex', 
              flexDirection: 'column', 
              boxShadow: '-10px 0 40px rgba(0,0,0,0.4)',
              borderRadius: '24px', // Professional rounded look
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#D4AF37', letterSpacing: '2px', margin: 0 }}>MY BAG</h2>
                <span style={{ fontSize: '10px', opacity: 0.5, color: 'var(--foreground)' }}>{cart.length} ITEMS SELECTED</span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)} 
                style={{ background: "rgba(212, 175, 55, 0.1)", border: "none", borderRadius: "50%", width: "32px", height: "32px", color: "#D4AF37", cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >✕</button>
            </div>

            {/* Cart Items Area */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "100px", opacity: 0.5, color: 'var(--foreground)', fontSize: '12px', fontWeight: 'bold' }}>
                  YOUR ELITE BAG IS EMPTY.
                </div>
              ) : (
                cart.map((item: any) => (
                  <motion.div layout key={item._id} style={{ display: "flex", gap: "15px", padding: "12px", background: 'rgba(255,255,255,0.03)', borderRadius: "16px", border: "1px solid var(--border)", alignItems: 'center' }}>
                    <img src={item.image || item.img} style={{ width: "65px", height: "65px", objectFit: "cover", borderRadius: "12px" }} alt={item.name} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 4px", fontSize: "13px", color: 'var(--foreground)', fontWeight: '600' }}>{item.name}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: '#D4AF37' }}>Rs. {item.price.toLocaleString()}</p>
                        <button onClick={() => removeFromCart(item._id)} style={{ background: "none", border: "none", color: "#ff4444", cursor: "pointer", fontSize: "10px", fontWeight: 'bold' }}>REMOVE</button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            <div style={{ padding: '25px', background: 'var(--nav-bg)', borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <span style={{ opacity: 0.6, fontSize: '11px', color: 'var(--foreground)', fontWeight: 'bold' }}>TOTAL ESTIMATE</span>
                <span style={{ fontSize: "18px", fontWeight: "900", color: "#D4AF37" }}>Rs. {cartTotal.toLocaleString()}</span>
              </div>
              
              <button 
                onClick={handleCartCheckout}
                disabled={cart.length === 0}
                style={{ 
                  width: "100%", padding: "14px", 
                  background: cart.length === 0 ? "#333" : "linear-gradient(135deg, #D4AF37 0%, #F1D27B 100%)",
                  color: "#000", border: "none", borderRadius: "12px", 
                  fontWeight: "900", cursor: cart.length === 0 ? "not-allowed" : "pointer", fontSize: "13px", letterSpacing: '1px',
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                }}
              >
                PROCEED TO PAY 💎
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- 2. PREMIUM BAG ICON ---
const BagIcon = () => {
  const { setIsCartOpen, cartCount } = useCart();
  return (
    <motion.div 
      whileHover={{ scale: 1.1 }}
      onClick={() => setIsCartOpen(true)} 
      style={{ position: "relative", cursor: "pointer", fontSize: "24px" }}
    >
      🛍️
      {cartCount > 0 && (
        <motion.span 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          style={{
            position: "absolute", top: "-5px", right: "-8px", 
            backgroundColor: "#D4AF37", color: "#000", 
            borderRadius: "50%", minWidth: "18px", height: "18px", 
            display: "flex", alignItems: "center", justifyContent: "center", 
            fontSize: "10px", fontWeight: "900", border: '2px solid var(--background)'
          }}
        >
          {cartCount}
        </motion.span>
      )}
    </motion.div>
  );
};

// --- 3. ROOT LAYOUT ---
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem("ahmar_luxe_theme") || "dark";
    if (savedTheme === "dark") setDarkMode(true);
    setMounted(true);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    const themeStr = newMode ? "dark" : "light";
    localStorage.setItem("ahmar_luxe_theme", themeStr);
    document.documentElement.setAttribute("data-theme", themeStr);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(searchTerm.trim() ? `/?search=${searchTerm.trim()}` : "/");
  };

  const categories = [
    { name: "Watches", path: "/category/watches" },
    { name: "Mobile", path: "/category/mobile" },
    { name: "Fashion", path: "/category/fashion" },
    { name: "Electronics", path: "/category/electronics" },
    { name: "Gaming", path: "/category/gaming" },
    { name: "Laptop", path: "/category/laptop" }
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){const t=localStorage.getItem('ahmar_luxe_theme') || 'dark'; document.documentElement.setAttribute('data-theme', t)})()`
        }} />
      </head>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0, backgroundColor: "var(--background)", color: "var(--foreground)" }}>
        <CartProvider>
          {/* NAVIGATION */}
          <nav style={{ 
            padding: "10px 15px", display: "flex", justifyContent: "space-between", alignItems: "center",
            borderBottom: "1px solid var(--border)", backgroundColor: "var(--nav-bg)", position: "sticky", top: 0, zIndex: 1000
          }}>
            <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'var(--foreground)' }}>
                <b style={{ fontSize: "16px", fontWeight: "900", letterSpacing: "-1px", color: '#D4AF37' }}>AHMAR LUXE</b>
              </Link>
            </div>

            <form onSubmit={handleSearch} style={{ flex: 1, margin: "0 10px", maxWidth: "160px" }}>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: "100%", padding: "6px 12px", borderRadius: "20px", border: "1px solid var(--border)", 
                  backgroundColor: "var(--background)", color: "var(--foreground)", fontSize: "12px", outline: "none"
                }} 
              />
            </form>

            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexShrink: 0 }}>
              <button onClick={toggleDarkMode} style={{ cursor: "pointer", background: "none", border: "none", fontSize: "20px", display: "flex", alignItems: "center" }}>
                {darkMode ? "☀️" : "🌙"}
              </button>
              <BagIcon />
            </div>
          </nav>

          {/* CATEGORIES BAR */}
          <div style={{ 
            display: "flex", gap: "20px", padding: "12px 20px", 
            overflowX: "auto", whiteSpace: "nowrap", scrollbarWidth: "none",
            backgroundColor: "var(--background)", borderBottom: "1px solid var(--border)", 
            fontWeight: "700", letterSpacing: '1px', WebkitOverflowScrolling: "touch"
          }}>
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
            <Link 
              href="/" 
              style={{ 
                color: 'var(--foreground)', textDecoration: 'none', paddingRight: "15px", borderRight: "1px solid var(--border)",
                opacity: pathname === "/" ? 1 : 0.4,
                borderBottom: pathname === "/" ? "2px solid #D4AF37" : "2px solid transparent",
                paddingBottom: "5px", flexShrink: 0, fontSize: "11px"
              }}
            >
              ALL
            </Link>
            {categories.map((cat) => (
              <Link 
                key={cat.name} href={cat.path} 
                style={{ 
                  color: 'var(--foreground)', opacity: pathname === cat.path ? 1 : 0.4, 
                  textDecoration: 'none', flexShrink: 0, fontSize: "11px",
                  borderBottom: pathname === cat.path ? "2px solid #D4AF37" : "2px solid transparent",
                  paddingBottom: "5px", transition: "all 0.3s ease"
                }}
              >
                {cat.name.toUpperCase()}
              </Link>
            ))}
          </div>

          <main style={{ minHeight: "85vh" }}>
            {mounted ? children : null}
          </main>

          <CartDrawer />

          <footer style={{ 
            backgroundColor: "var(--nav-bg)", 
            borderTop: "1px solid var(--border)", 
            padding: "80px 40px 40px", 
            marginTop: "60px"
          }}>
            <div style={{ 
              maxWidth: "1200px", 
              margin: "0 auto", 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
              gap: "50px",
              textAlign: "left"
            }}>
              <div>
                <h2 style={{ color: "#D4AF37", fontWeight: "900", letterSpacing: "2px", marginBottom: "20px", fontSize: "24px" }}>AHMAR LUXE</h2>
                <p style={{ opacity: 0.6, lineHeight: "1.8", fontSize: "14px" }}>
                  Elevating your lifestyle with the world's most exclusive collections. Deliver the concierge experience to your doorstep.
                </p>
              </div>

              <div>
                <h4 style={{ color: "var(--foreground)", marginBottom: "25px", letterSpacing: "1px", fontWeight: "bold" }}>NAVIGATE</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                  <Link href="/" style={{ color: "var(--foreground)", opacity: 0.5, textDecoration: "none" }}>All Collections</Link>
                  <Link href="/category/watches" style={{ color: "var(--foreground)", opacity: 0.5, textDecoration: "none" }}>Elite Watches</Link>
                  <Link href="/category/fashion" style={{ color: "var(--foreground)", opacity: 0.5, textDecoration: "none" }}>Designer Fashion</Link>
                  <Link href="/privacy" style={{ color: "var(--foreground)", opacity: 0.5, textDecoration: "none" }}>Privacy Policy</Link>
                </div>
              </div>

              <div>
                <h4 style={{ color: "var(--foreground)", marginBottom: "25px", letterSpacing: "1px", fontWeight: "bold" }}>CONNECT</h4>
                <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                  {[
                    { id: 'FB', url: 'https://www.facebook.com/ahmarali.memon' },
                    { id: 'IG', url: 'https://www.instagram.com/ahmar_264?igsh=cHhhZ2ZiY2xzNTB6' },
                    { id: 'LI', url: 'https://www.linkedin.com/in/ahmar-memon-41a725235' },
                    { id: 'GH', url: 'https://github.com/ahmar4561' }
                  ].map((social) => (
                    <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <motion.div 
                        whileHover={{ scale: 1.1, backgroundColor: "#D4AF37", color: "#000" }}
                        style={{ 
                          width: "38px", height: "38px", borderRadius: "50%", border: "1px solid #D4AF37", 
                          display: "flex", alignItems: "center", justifyContent: "center", 
                          fontSize: "10px", fontWeight: "bold", color: "#D4AF37", cursor: "pointer", transition: "0.3s"
                        }}
                      >
                        {social.id}
                      </motion.div>
                    </a>
                  ))}
                </div>
                <p style={{ fontSize: "13px", opacity: 0.5 }}>Support: ahmaralimemon187@gmail.com</p>
              </div>
            </div>

            <div style={{ 
              maxWidth: "1200px", 
              margin: "60px auto 0", 
              paddingTop: "30px", 
              borderTop: "1px solid var(--border)", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              flexWrap: "wrap",
              gap: "20px"
            }}>
              <span style={{ fontSize: "11px", opacity: 0.4, letterSpacing: "2px" }}>
                © 2026 AHMAR LUXE. THE CONCIERGE EXPERIENCE.
              </span>
              <div style={{ display: "flex", gap: "20px", filter: "grayscale(1)", opacity: 0.3 }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: "15px" }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: "15px" }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: "15px" }} />
              </div>
            </div>
          </footer>

          <AIChatbot />
        </CartProvider>
      </body>
    </html>
  );
}