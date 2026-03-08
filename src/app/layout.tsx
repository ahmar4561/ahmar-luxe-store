"use client";
import { useState, useEffect } from "react";
import "./globals.css";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { CartProvider, useCart } from "@/context/CartContext";
import AIChatbot from "@/components/AIChatbot";
import { motion, AnimatePresence } from "framer-motion";

// --- CART DRAWER & BAG ICON (No Logic Change) ---
const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, cartTotal } = useCart();
  const handleCartCheckout = async () => {
    if (cart.length === 0) return alert("Your bag is empty!");
    try {
      const response = await fetch("/api/checkout", { 
        method: "POST", body: JSON.stringify({ items: cart.map((i:any)=>({name:i.name, price:i.price, quantity:i.qty, image:i.image||i.img})) }), 
        headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (err) { alert("System Busy."); }
  };
  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1999 }} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} style={{ position: 'fixed', right: '10px', top: '10px', bottom: '10px', height: 'calc(100vh - 20px)', width: 'calc(100% - 20px)', maxWidth: '420px', background: 'var(--background)', border: '1px solid var(--border)', zIndex: 2000, display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 40px rgba(0,0,0,0.4)', borderRadius: '24px', overflow: 'hidden' }}>
            <div style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#D4AF37' }}>MY BAG</h2>
              <button onClick={() => setIsCartOpen(false)} style={{ background: "none", border: "none", color: "#D4AF37", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              {cart.length === 0 ? <div style={{ textAlign: "center", marginTop: "50px", opacity: 0.5 }}>EMPTY BAG</div> : 
                cart.map((item: any) => (
                  <div key={item._id} style={{ display: "flex", gap: "15px", marginBottom: "15px", alignItems: 'center' }}>
                    <img src={item.image || item.img} style={{ width: "50px", height: "50px", borderRadius: "8px" }} alt="" />
                    <div style={{ flex: 1 }}><h4 style={{ fontSize: "12px", margin: 0 }}>{item.name}</h4><p style={{ color: '#D4AF37', margin: 0 }}>Rs. {item.price}</p></div>
                  </div>
                ))
              }
            </div>
            <div style={{ padding: '20px', borderTop: "1px solid var(--border)" }}>
              <button onClick={handleCartCheckout} style={{ width: "100%", padding: "12px", background: "#D4AF37", color: "#000", border: "none", borderRadius: "10px", fontWeight: "900" }}>CHECKOUT</button>
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
    <div onClick={() => setIsCartOpen(true)} style={{ position: "relative", cursor: "pointer", fontSize: "22px" }}>
      🛍️ {cartCount > 0 && <span style={{ position: "absolute", top: "-5px", right: "-8px", backgroundColor: "#D4AF37", color: "#000", borderRadius: "50%", padding: "2px 6px", fontSize: "10px", fontWeight: "900" }}>{cartCount}</span>}
    </div>
  );
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const t = localStorage.getItem("ahmar_luxe_theme") || "dark";
    setDarkMode(t === "dark");
    document.documentElement.setAttribute("data-theme", t);
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    const m = !darkMode ? "dark" : "light";
    setDarkMode(!darkMode);
    document.documentElement.setAttribute("data-theme", m);
    localStorage.setItem("ahmar_luxe_theme", m);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(searchTerm.trim() ? `/?search=${searchTerm.trim()}` : "/");
  };

  return (
    <html lang="en">
      <body suppressHydrationWarning style={{ margin: 0, backgroundColor: "var(--background)", color: "var(--foreground)" }}>
        <CartProvider>
          {/* NAVIGATION - RESPONSIVE FIXED */}
          <nav className="navbar-container">
            <div className="nav-wrapper">
              <Link href="/" className="nav-logo">AHMAR LUXE</Link>

              <form onSubmit={handleSearch} className="nav-search-form">
                <input 
                  type="text" placeholder="Search..." 
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="nav-search-input"
                />
              </form>

              <div className="nav-icons">
                <button onClick={toggleDarkMode} className="nav-theme-btn">{darkMode ? "☀️" : "🌙"}</button>
                <BagIcon />
              </div>
            </div>
          </nav>

          {/* CATEGORIES BAR */}
          <div className="category-scroll-bar">
            {["ALL", "WATCHES", "MOBILE", "FASHION", "ELECTRONICS", "GAMING", "LAPTOP"].map((cat) => (
              <Link key={cat} href={cat === "ALL" ? "/" : `/category/${cat.toLowerCase()}`}
                className={`cat-item ${ (pathname.includes(cat.toLowerCase()) || (pathname === "/" && cat === "ALL")) ? "active" : "" }`}>
                {cat}
              </Link>
            ))}
          </div>

          <main style={{ minHeight: "80vh", maxWidth: "1400px", margin: "0 auto", padding: "0 10px" }}>
            {mounted ? children : null}
          </main>

          <CartDrawer />

          {/* LUXURY FOOTER */}
          <footer className="footer-luxe">
             <div className="footer-content">
               <div className="footer-section">
                 <h2 className="footer-title">AHMAR LUXE</h2>
                 <p className="footer-text">The world's most exclusive collections.</p>
               </div>
               <div className="footer-section">
                 <h4 className="footer-sub">CONNECT</h4>
                 <div className="footer-socials">
                  {[
                    { id: 'FB', url: 'https://www.facebook.com/ahmarali.memon' },
                    { id: 'IG', url: 'https://www.instagram.com/ahmar_264?igsh=cHhhZ2ZiY2xzNTB6' },
                    { id: 'LI', url: 'https://www.linkedin.com/in/ahmar-memon-41a725235' },
                    { id: 'GH', url: 'https://github.com/ahmar4561' }
                  ].map((s) => (
                    <a key={s.id} href={s.url} target="_blank" className="social-link">{s.id}</a>
                  ))}
                 </div>
               </div>
             </div>
             <div className="footer-rights">© 2026 AHMAR LUXE. ALL RIGHTS RESERVED.</div>
          </footer>

          <AIChatbot />

          <style jsx global>{`
            /* Navbar Core */
            .navbar-container {
              background: var(--nav-bg); border-bottom: 1px solid var(--border);
              position: sticky; top: 0; z-index: 1000; padding: 10px 0;
            }
            .nav-wrapper {
              max-width: 1300px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 0 20px;
            }
            .nav-logo { color: #D4AF37; font-size: 20px; font-weight: 900; text-decoration: none; letter-spacing: 1px; flex-shrink: 0; }
            .nav-search-form { flex: 1; display: flex; justify-content: center; margin: 0 20px; }
            .nav-search-input { 
              width: 100%; max-width: 500px; padding: 8px 15px; border-radius: 20px; 
              border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: var(--foreground); outline: none;
            }
            .nav-icons { display: flex; gap: 15px; align-items: center; flex-shrink: 0; }
            .nav-theme-btn { background: none; border: none; font-size: 20px; cursor: pointer; }

            /* Categories */
            .category-scroll-bar {
              display: flex; gap: 25px; padding: 12px 20px; justify-content: center;
              overflow-x: auto; white-space: nowrap; border-bottom: 1px solid var(--border);
            }
            .category-scroll-bar::-webkit-scrollbar { display: none; }
            .cat-item { text-decoration: none; color: var(--foreground); font-size: 11px; font-weight: 700; opacity: 0.5; transition: 0.3s; }
            .cat-item.active { opacity: 1; color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 4px; }

            /* Footer */
            .footer-luxe { background: var(--nav-bg); padding: 50px 20px 20px; border-top: 1px solid var(--border); margin-top: 50px; }
            .footer-content { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; }
            .footer-title { color: #D4AF37; font-size: 18px; margin-bottom: 10px; }
            .footer-text { opacity: 0.6; font-size: 13px; }
            .footer-sub { color: #D4AF37; font-size: 12px; margin-bottom: 15px; }
            .footer-socials { display: flex; gap: 10px; }
            .social-link { width: 30px; height: 30px; border: 1px solid #D4AF37; color: #D4AF37; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 9px; border-radius: 50%; }
            .footer-rights { text-align: center; margin-top: 30px; font-size: 10px; opacity: 0.3; }

            /* MOBILE FIXES (Based on your first picture) */
            @media (max-width: 768px) {
              .nav-wrapper { padding: 0 10px; }
              .nav-logo { font-size: 15px; letter-spacing: 0; }
              .nav-search-form { margin: 0 8px; }
              .nav-search-input { padding: 5px 12px; font-size: 12px; }
              .nav-icons { gap: 8px; }
              .nav-theme-btn { font-size: 16px; }
              .category-scroll-bar { justify-content: flex-start; gap: 18px; }
            }
          `}</style>
        </CartProvider>
      </body>
    </html>
  );
}