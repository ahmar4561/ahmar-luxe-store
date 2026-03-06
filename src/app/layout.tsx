"use client";
import { useState, useEffect } from "react";
import "./globals.css";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { CartProvider, useCart } from "@/context/CartContext";
import AIChatbot from "@/components/AIChatbot";
import { motion, AnimatePresence } from "framer-motion";

// --- 1. ULTRA LUXE CART DRAWER ---
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
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1999 }}
          />

          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ 
              position: 'fixed', right: 0, top: 0, height: '100vh', width: '100%', maxWidth: '400px', 
              background: '#050505', borderLeft: '1px solid #D4AF3744', zIndex: 2000,
              padding: '40px', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#D4AF37', letterSpacing: '3px', margin: 0 }}>MY BAG</h2>
                <div style={{ width: '40px', height: '2px', background: '#D4AF37', marginTop: '5px' }}></div>
              </div>
              <button onClick={() => setIsCartOpen(false)} style={{ background: "none", border: "none", fontSize: "28px", color: "#D4AF37", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", paddingRight: "10px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "100px", opacity: 0.5, letterSpacing: '1px' }}>YOUR ELITE BAG IS EMPTY.</div>
              ) : (
                cart.map((item: any) => (
                  <motion.div layout key={item._id} style={{ display: "flex", gap: "15px", marginBottom: "25px", paddingBottom: "15px", borderBottom: "1px solid #111", alignItems: 'center' }}>
                    <img src={item.image || item.img} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "12px", border: '1px solid #222' }} alt={item.name} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: "15px", color: '#fff' }}>{item.name}</h4>
                      <p style={{ margin: "5px 0", fontSize: "16px", fontWeight: "bold", color: '#D4AF37' }}>Rs. {item.price.toLocaleString()}</p>
                      <button onClick={() => removeFromCart(item._id)} style={{ background: "none", border: "none", color: "#ff4444", cursor: "pointer", fontSize: "11px", fontWeight: 'bold' }}>REMOVE</button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                  <span style={{ opacity: 0.6, letterSpacing: '1px' }}>ESTIMATED TOTAL</span>
                  <span style={{ fontSize: "22px", fontWeight: "900", color: "#D4AF37" }}>Rs. {cartTotal.toLocaleString()}</span>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCartCheckout}
                  style={{ 
                    width: "100%", padding: "20px", 
                    background: "linear-gradient(135deg, #D4AF37 0%, #F1D27B 50%, #D4AF37 100%)",
                    color: "#000", border: "none", borderRadius: "15px", 
                    fontWeight: "900", cursor: "pointer", fontSize: "14px", letterSpacing: '3px',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
                  }}
                >
                  PROCEED TO PAY 💎
                </motion.button>
              </div>
            )}
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
            fontSize: "10px", fontWeight: "900", border: '2px solid #000'
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
            padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center",
            borderBottom: "1px solid var(--border)", backgroundColor: "var(--nav-bg)", position: "sticky", top: 0, zIndex: 1000
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'var(--foreground)' }}>
                <b style={{ fontSize: "22px", fontWeight: "900", letterSpacing: "-1px", color: '#D4AF37' }}>AHMAR LUXE</b>
              </Link>
              <form onSubmit={handleSearch} style={{ position: "relative" }}>
                <input 
                  type="text" placeholder="Search luxury..." value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    padding: "10px 18px", borderRadius: "25px", border: "1px solid var(--border)", 
                    backgroundColor: "var(--background)", color: "var(--foreground)", width: "220px", 
                    outline: "none", fontSize: "13px", transition: '0.3s'
                  }}
                />
              </form>
            </div>
            <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
              <button onClick={toggleDarkMode} style={{ cursor: "pointer", background: "none", border: "none", fontSize: "20px" }}>
                {darkMode ? "☀️" : "🌙"}
              </button>
              <BagIcon />
            </div>
          </nav>

          {/* CATEGORIES BAR */}
          <div style={{ 
            display: "flex", gap: "25px", padding: "12px 40px", justifyContent: "center", 
            fontSize: "11px", backgroundColor: "var(--background)", borderBottom: "1px solid var(--border)", 
            fontWeight: "700", letterSpacing: '1px'
          }}>
            <Link 
              href="/" 
              style={{ 
                color: 'var(--foreground)', textDecoration: 'none', paddingRight: "15px", borderRight: "1px solid var(--border)",
                opacity: pathname === "/" ? 1 : 0.4,
                borderBottom: pathname === "/" ? "2px solid #D4AF37" : "2px solid transparent",
                paddingBottom: "2px"
              }}
            >
              ALL
            </Link>
            {categories.map((cat) => (
              <Link 
                key={cat.name} href={cat.path} 
                style={{ 
                  color: 'var(--foreground)', opacity: pathname === cat.path ? 1 : 0.4, 
                  textDecoration: 'none',
                  borderBottom: pathname === cat.path ? "2px solid #D4AF37" : "2px solid transparent",
                  paddingBottom: "2px", transition: "all 0.3s ease"
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

          {/* --- ULTRA LUXE PROFESSIONAL FOOTER --- */}
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