"use client";
import { useEffect, useState, Suspense, useMemo, memo } from "react";
import { useCart } from "@/context/CartContext";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
import Image from 'next/image';

const Chatbot = dynamic(() => import('@/components/AIChatbot'), { ssr: false });

// --- 1. UPDATED PRODUCT CARD WITH ZOOM EFFECT ---
const ProductCard = memo(({ product, index, addToCart }: any) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ 
      y: -8, // Halka sa upar uthay ga
      transition: { duration: 0.3 }
    }}
    transition={{ duration: 0.2 }}
    style={{ 
      border: "1px solid var(--card-border)", 
      borderRadius: "20px", 
      padding: "12px", 
      backgroundColor: "var(--card-bg)",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden"
    }}
  >
    {/* Image Container with Inner Zoom */}
    <div style={{ 
      position: "relative", 
      borderRadius: "15px", 
      height: "200px", 
      overflow: "hidden", 
      backgroundColor: "#000" 
    }}>
      <motion.div
        whileHover={{ scale: 1.1 }} // Sirf image zoom hogi container ke andar
        transition={{ duration: 0.5 }}
        style={{ width: "100%", height: "100%", position: "relative" }}
      >
        <Image 
          src={product.image} 
          alt={product.name}
          fill
          sizes="240px"
          priority={index < 8}
          quality={75}
          style={{ objectFit: "cover" }}
        />
      </motion.div>
    </div>

    <div style={{ marginTop: "12px" }}>
      <span style={{ fontSize: "9px", color: "var(--accent)", letterSpacing: '1px', fontWeight: 'bold' }}>
        {product.category.toUpperCase()}
      </span>
      <h2 style={{ 
        fontSize: "15px", 
        margin: "5px 0", 
        color: "var(--foreground)", 
        fontWeight: '600', 
        whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis' 
      }}>
        {product.name}
      </h2>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
        <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--accent)" }}>
          Rs. {product.price.toLocaleString()}
        </span>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => addToCart(product)} 
          style={{ 
            backgroundColor: "var(--accent)", 
            color: "#000", 
            padding: "8px 16px", 
            border: "none", 
            borderRadius: "10px", 
            cursor: "pointer", 
            fontWeight: "bold", 
            fontSize: '11px',
            boxShadow: "0 4px 15px rgba(212, 175, 55, 0.2)"
          }}
        >
          + ADD
        </motion.button>
      </div>
    </div>
  </motion.div>
));

ProductCard.displayName = "ProductCard";

function HomeContent() {
  const [allProducts, setAllProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  
  const search = searchParams.get("search")?.toLowerCase() || "";
  const category = searchParams.get("category")?.toLowerCase() || "all";
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    setVisibleCount(12);
  }, [category, search]);

  useEffect(() => {
    if (!mounted) return;
    const fetchProducts = async () => {
      const cached = sessionStorage.getItem("ultra_cache");
      if (cached) { setAllProducts(JSON.parse(cached)); setLoading(false); }
      try {
        const res = await fetch("/api/products"); 
        const data = await res.json();
        setAllProducts(data);
        sessionStorage.setItem("ultra_cache", JSON.stringify(data));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchProducts();
  }, [mounted]);

  const filteredResults = useMemo(() => {
    if (!allProducts.length) return [];
    return allProducts.filter((p: any) => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search);
      const matchesCategory = category === "all" || p.category.toLowerCase() === category;
      return matchesSearch && matchesCategory;
    });
  }, [allProducts, search, category]);

  const displayProducts = filteredResults.slice(0, visibleCount);

  if (!mounted) return null;

  return (
    <div style={{ padding: "20px", backgroundColor: "var(--background)", minHeight: "100vh" }}>
      
      {/* --- GOLDEN HEADER --- */}
      <div style={{ textAlign: "center", marginBottom: "30px", marginTop: "10px", minHeight: "40px" }}>
        <AnimatePresence mode="wait">
          {!search && (
            <motion.h1 
              key={category}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ 
                fontSize: "28px", 
                fontWeight: "900", 
                color: "var(--accent)", 
                letterSpacing: "2px",
                textTransform: "uppercase"
              }}
            >
              {category === "all" ? "EXCLUSIVE COLLECTION" : category}
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", 
        gap: "25px", 
        maxWidth: "1400px", 
        margin: "0 auto" 
      }}>
        <AnimatePresence mode="popLayout">
          {displayProducts.map((product: any, index: number) => (
            <ProductCard key={product._id} product={product} index={index} addToCart={addToCart} />
          ))}
        </AnimatePresence>
      </div>

      {!loading && filteredResults.length > displayProducts.length && (
        <div style={{ textAlign: 'center', marginTop: '50px', paddingBottom: '40px' }}>
          <button onClick={() => setVisibleCount(v => v + 10)} className="load-more-btn">EXPLORE MORE</button>
        </div>
      )}
      <Chatbot />
      <style jsx global>{`
        .load-more-btn { 
          padding: 14px 50px; 
          background: var(--accent); 
          color: #000; 
          border: none; 
          cursor: pointer; 
          border-radius: 30px; 
          font-weight: 900; 
          letter-spacing: 2px;
          transition: 0.3s; 
          box-shadow: 0 10px 20px rgba(212, 175, 55, 0.15);
        }
        .load-more-btn:hover { 
          transform: translateY(-3px); 
          box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3);
          opacity: 0.95; 
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return <Suspense fallback={null}><HomeContent /></Suspense>;
}