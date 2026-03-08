"use client";
import { useState, useEffect } from "react";
import "./globals.css";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { CartProvider, useCart } from "@/context/CartContext";
import AIChatbot from "@/components/AIChatbot";
import { motion, AnimatePresence } from "framer-motion";

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, cartTotal } = useCart();
  const handleCartCheckout = async () => {
    if (cart.length === 0) return alert("Your bag is empty!");
    try {
      const checkoutItems = cart.map((item: any) => ({
        name: item.name, price: item.price, quantity: item.qty, image: item.image || item.img
      }));
      const response = await fetch("/api/checkout", { 
        method: "POST", body: JSON.stringify({ items: checkoutItems }), 
        headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
      else alert("Payment Error: " + data.error);
    } catch (err) {
      alert("System Busy: Stripe is not responding.");
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1999 }}
          />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ 
              position: 'fixed', right: '10px', top: '10px', bottom: '10px',
              height: 'calc(100vh - 20px)', width: 'calc(100% - 20px)', maxWidth: '420px', 
              background: 'var(--background)', border: '1px solid var(--border)', 
              zIndex: 2000, display: 'flex', flexDirection: 'column', 
              boxShadow: '-10px 0 40px rgba(0,0,0,0.4)', borderRadius: '24px', overflow: 'hidden'
            }}
          >
            <div style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#D4AF37', letterSpacing: '2px', margin: 0 }}>MY BAG</h2>
                <span style={{ fontSize: '10px', opacity: 0.5 }}>{cart.length} ITEMS SELECTED</span>
              </div>
              <button onClick={() => setIsCartOpen(false)} 
                style={{ background: "rgba(212, 175, 55, 0.1)", border: "none", borderRadius: "50%", width: "32px", height: "32px", color: "#D4AF37", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {cart.length === 0 ? <div style={{ textAlign: "center", marginTop: "100px", opacity: 0.5 }}>YOUR ELITE BAG IS EMPTY.</div> : 
                cart.map((item: any) => (
                  <div key={item._id} style={{ display: "flex", gap: "15px", padding: "12px", background: 'rgba(255,255,255,0.03)', borderRadius: "16px", border: "1px solid var(--border)", alignItems: 'center' }}>
                    <img src={item.image || item.img} style={{ width: "65px", height: "65px", objectFit: "cover", borderRadius: "12px" }} alt={item.name} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0", fontSize: "13px" }}>{item.name}</h4>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: '#D4AF37' }}>Rs. {item.price.toLocaleString()}</p>
                      <button onClick={() => removeFromCart(item._id)} style={{ background: "none", border: "none", color: "#ff4444", cursor: "pointer", fontSize: "10px" }}>REMOVE</button>
                    </div>
                  </div>
                ))
              }
            </div>
            <div style={{ padding: '25px', background: 'var(--nav-bg)', borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <span style={{ opacity: 0.6, fontSize: '11px' }}>TOTAL ESTIMATE</span>
                <span style={{ fontSize: "18px", fontWeight: "900", color: "#D4AF37" }}>Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <button onClick={handleCartCheckout} disabled={cart.length === 0} 
                style={{ width: "100%", padding: "14px", background: cart.length === 0 ? "#333" : "linear-gradient(135deg, #D4AF37 0%, #F1D27B 100%)", color: "#000", border: "none", borderRadius: "12px", fontWeight: "900", cursor: "pointer" }}>
                PROCEED TO PAY 💎
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const BagIcon = () => {
  const { setIsCartOpen, cartCount } = useCart();
  return (
    <motion.div whileHover={{ scale: 1.1 }} onClick={() => setIsCartOpen(true)} style={{ position: "relative", cursor: "pointer", fontSize: "22px" }}>
      🛍️ {cartCount > 0 && <span style={{ position: "absolute", top: "-5px", right: "-8px", backgroundColor: "#D4AF37", color: "#000", borderRadius: "50%", minWidth: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "900", border: '1px solid var(--background)' }}>{cartCount}</span>}
    </motion.div>
  );
};

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
    document.documentElement.setAttribute("data-theme", newMode ? "dark" : "light");
    localStorage.setItem("ahmar_luxe_theme", newMode ? "dark" : "light");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(searchTerm.trim() ? `/?search=${searchTerm.trim()}` : "/");
  };

  return (
    <html lang="en">
      <body suppressHydrationWarning style={{ margin: 0, backgroundColor: "var(--background)", color: "var(--foreground)" }}>
        <CartProvider>
          {/* PROFESSIONAL NAV BAR */}
          <nav style={{ 
            minHeight: "75px", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 5%", borderBottom: "1px solid var(--border)", backgroundColor: "var(--nav-bg)",
            position: "sticky", top: 0, zIndex: 1000, gap: "20px"
          }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#D4AF37', fontSize: "22px", fontWeight: "900", letterSpacing: "1.5px", flexShrink: 0 }}>
              AHMAR LUXE
            </Link>

            <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: "700px", margin: "0 20px" }}>
              <input 
                type="text" placeholder="Search premium collection..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: "100%", padding: "12px 25px", borderRadius: "10px", border: "1px solid var(--border)", 
                  backgroundColor: "rgba(255,255,255,0.05)", color: "var(--foreground)", outline: "none", fontSize: "14px"
                }} 
              />
            </form>

            <div style={{ display: "flex", gap: "25px", alignItems: "center", flexShrink: 0 }}>
              <button onClick={toggleDarkMode} style={{ cursor: "pointer", background: "none", border: "none", fontSize: "22px" }}>
                {darkMode ? "☀️" : "🌙"}
              </button>
              <BagIcon />
            </div>
          </nav>

          {/* CATEGORIES */}
          <div style={{ 
            display: "flex", justifyContent: "center", gap: "30px", padding: "15px 20px", 
            borderBottom: "1px solid var(--border)", overflowX: "auto", whiteSpace: "nowrap", scrollbarWidth: "none"
          }}>
            {["ALL", "WATCHES", "MOBILE", "FASHION", "ELECTRONICS", "GAMING", "LAPTOP"].map((cat) => (
              <Link key={cat} href={cat === "ALL" ? "/" : `/category/${cat.toLowerCase()}`}
                style={{ 
                  textDecoration: "none", color: "var(--foreground)", fontSize: "12px", fontWeight: "700", letterSpacing: "1px",
                  opacity: pathname.includes(cat.toLowerCase()) || (pathname === "/" && cat === "ALL") ? 1 : 0.4,
                  borderBottom: pathname.includes(cat.toLowerCase()) || (pathname === "/" && cat === "ALL") ? "2px solid #D4AF37" : "none",
                  paddingBottom: "5px"
                }}>
                {cat}
              </Link>
            ))}
          </div>

          {/* MAIN CONTENT CONTAINER (Optimized for 4-product grid look) */}
          <main style={{ minHeight: "85vh", maxWidth: "1400px", margin: "0 auto" }}>
            {mounted ? children : null}
          </main>

          <CartDrawer />

          <footer style={{ backgroundColor: "var(--nav-bg)", borderTop: "1px solid var(--border)", padding: "80px 5% 40px", marginTop: "100px" }}>
             <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "50px" }}>
               <div>
                 <h2 style={{ color: "#D4AF37", fontWeight: "900", letterSpacing: "2px", marginBottom: "15px", fontSize: "20px" }}>AHMAR LUXE</h2>
                 <p style={{ opacity: 0.6, lineHeight: "1.8", fontSize: "14px" }}>Elevating your lifestyle with the world's most exclusive collections.</p>
               </div>
               <div>
                 <h4 style={{ color: "#D4AF37", fontSize: "13px", marginBottom: "20px", fontWeight: "800" }}>NAVIGATE</h4>
                 <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                    <Link href="/" style={{ color: "var(--foreground)", opacity: 0.6, textDecoration: "none" }}>Home</Link>
                    <Link href="/privacy" style={{ color: "var(--foreground)", opacity: 0.6, textDecoration: "none" }}>Privacy Policy</Link>
                 </div>
               </div>
               <div>
                 <h4 style={{ color: "#D4AF37", fontSize: "13px", marginBottom: "20px", fontWeight: "800" }}>CONTACT</h4>
                 <p style={{ fontSize: "14px", opacity: 0.5 }}>ahmaralimemon187@gmail.com</p>
               </div>
             </div>
             <div style={{ textAlign: "center", marginTop: "60px", opacity: 0.3, fontSize: "11px", letterSpacing: "1px" }}>
               © 2026 AHMAR LUXE. ALL RIGHTS RESERVED.
             </div>
          </footer>
          <AIChatbot />
        </CartProvider>
      </body>
    </html>
  );
}