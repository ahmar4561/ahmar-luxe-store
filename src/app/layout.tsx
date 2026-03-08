"use client";
import { useState, useEffect } from "react";
import "./globals.css";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { CartProvider, useCart } from "@/context/CartContext";
import AIChatbot from "@/components/AIChatbot";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

// --- 1. CART DRAWER ---
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
            className="cart-drawer-container"
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

// --- 2. BAG ICON ---
const BagIcon = () => {
  const { setIsCartOpen, cartCount } = useCart();
  return (
    <motion.div whileHover={{ scale: 1.1 }} onClick={() => setIsCartOpen(true)} style={{ position: "relative", cursor: "pointer", fontSize: "22px" }}>
      🛍️ {cartCount > 0 && <span style={{ position: "absolute", top: "-5px", right: "-8px", backgroundColor: "#D4AF37", color: "#000", borderRadius: "50%", minWidth: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "900", border: '1px solid var(--background)' }}>{cartCount}</span>}
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
          {/* PROFESSIONAL NAV BAR - RESPONSIVE */}
          <nav className="main-nav">
            <Link href="/" className="logo-text">AHMAR LUXE</Link>

            <form onSubmit={handleSearch} className="search-form">
              <input 
                type="text" placeholder="Search premium collection..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </form>

            <div className="nav-actions">
              <button onClick={toggleDarkMode} className="theme-toggle">
                {darkMode ? "☀️" : "🌙"}
              </button>
              <BagIcon />
            </div>
          </nav>

          {/* CATEGORIES - SCROLLABLE ON MOBILE, CENTERED ON LAPTOP */}
          <div className="category-bar">
            {["ALL", "WATCHES", "MOBILE", "FASHION", "ELECTRONICS", "GAMING", "LAPTOP"].map((cat) => (
              <Link key={cat} href={cat === "ALL" ? "/" : `/category/${cat.toLowerCase()}`}
                className={`cat-link ${ (pathname.includes(cat.toLowerCase()) || (pathname === "/" && cat === "ALL")) ? "active" : "" }`}>
                {cat}
              </Link>
            ))}
          </div>

          <main style={{ minHeight: "85vh", maxWidth: "1400px", margin: "0 auto" }}>
            {mounted ? children : null}
          </main>

          <CartDrawer />

          {/* LUXURY FOOTER WITH SOCIALS - FIXED FOR LAPTOP */}
          <footer className="luxe-footer">
             <div className="footer-grid">
               <div>
                 <h2 className="footer-brand">AHMAR LUXE</h2>
                 <p className="footer-desc">Elevating your lifestyle with the world's most exclusive collections.</p>
               </div>
               <div>
                 <h4 className="footer-head">NAVIGATE</h4>
                 <div className="footer-links">
                    <Link href="/">Home</Link>
                    <Link href="/privacy">Privacy Policy</Link>
                 </div>
               </div>
               <div>
                 <h4 className="footer-head">CONNECT</h4>
                 <div className="social-icons">
                  {[
                    { id: 'FB', url: 'https://www.facebook.com/ahmarali.memon' },
                    { id: 'IG', url: 'https://www.instagram.com/ahmar_264?igsh=cHhhZ2ZiY2xzNTB6' },
                    { id: 'LI', url: 'https://www.linkedin.com/in/ahmar-memon-41a725235' },
                    { id: 'GH', url: 'https://github.com/ahmar4561' }
                  ].map((social) => (
                    <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="social-box">
                      {social.id}
                    </a>
                  ))}
                 </div>
                 <p className="footer-email">ahmaralimemon187@gmail.com</p>
               </div>
             </div>
             <div className="footer-bottom">
               © 2026 AHMAR LUXE. ALL RIGHTS RESERVED.
             </div>
          </footer>
          <AIChatbot />

          <style jsx global>{`
            .main-nav {
              min-height: 70px; display: flex; alignItems: center; justifyContent: space-between;
              padding: 10px 5%; borderBottom: 1px solid var(--border); backgroundColor: var(--nav-bg);
              position: sticky; top: 0; zIndex: 1000; gap: 15px;
            }
            .logo-text { textDecoration: none; color: #D4AF37; fontSize: 22px; fontWeight: 900; letterSpacing: 1.5px; flexShrink: 0; }
            .search-form { flex: 1; maxWidth: 700px; margin: 0 10px; }
            .search-input { width: 100%; padding: 10px 20px; borderRadius: 10px; border: 1px solid var(--border); backgroundColor: rgba(255,255,255,0.05); color: var(--foreground); outline: none; fontSize: 14px; }
            .nav-actions { display: flex; gap: 20px; alignItems: center; flexShrink: 0; }
            .theme-toggle { cursor: pointer; background: none; border: none; fontSize: 22px; }

            .category-bar { display: flex; justifyContent: center; gap: 30px; padding: 15px 20px; borderBottom: 1px solid var(--border); overflowX: auto; whiteSpace: nowrap; scrollbarWidth: none; }
            .category-bar::-webkit-scrollbar { display: none; }
            .cat-link { textDecoration: none; color: var(--foreground); fontSize: 12px; fontWeight: 700; letterSpacing: 1px; opacity: 0.4; transition: 0.3s; paddingBottom: 5px; }
            .cat-link.active { opacity: 1; borderBottom: 2px solid #D4AF37; }

            .luxe-footer { backgroundColor: var(--nav-bg); borderTop: 1px solid var(--border); padding: 60px 5% 30px; marginTop: 80px; }
            .footer-grid { maxWidth: 1200px; margin: 0 auto; display: grid; gridTemplateColumns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; }
            .footer-brand { color: #D4AF37; fontWeight: 900; letterSpacing: 2px; marginBottom: 10px; fontSize: 18px; }
            .footer-desc { opacity: 0.6; lineHeight: 1.6; fontSize: 13px; }
            .footer-head { color: #D4AF37; fontSize: 12px; marginBottom: 15px; fontWeight: 800; letterSpacing: 1px; }
            .footer-links { display: flex; flexDirection: column; gap: 10px; fontSize: 13px; }
            .footer-links a { color: var(--foreground); opacity: 0.6; textDecoration: none; }
            .social-icons { display: flex; gap: 10px; marginBottom: 15px; }
            .social-box { width: 32px; height: 32px; borderRadius: 50%; border: 1px solid rgba(212, 175, 55, 0.3); display: flex; alignItems: center; justifyContent: center; fontSize: 9px; fontWeight: bold; color: #D4AF37; textDecoration: none; transition: 0.3s; }
            .social-box:hover { background: #D4AF37; color: #000; }
            .footer-email { fontSize: 12px; opacity: 0.5; }
            .footer-bottom { textAlign: center; marginTop: 40px; opacity: 0.3; fontSize: 10px; letterSpacing: 1px; borderTop: 1px solid rgba(255,255,255,0.05); paddingTop: 20px; }

            /* Mobile Adjustments */
            @media (max-width: 768px) {
              .main-nav { padding: 10px 15px; minHeight: 60px; }
              .logo-text { fontSize: 16px; }
              .search-input { padding: 6px 12px; fontSize: 12px; }
              .category-bar { justifyContent: flex-start; gap: 20px; padding: 12px 15px; }
              .cat-link { fontSize: 11px; }
              .nav-actions { gap: 12px; }
              .theme-toggle { fontSize: 18px; }
            }
          `}</style>
        </CartProvider>
      </body>
    </html>
  );
}