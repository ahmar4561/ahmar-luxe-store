"use client";
import { useEffect, useState, Suspense, useMemo, memo } from "react";
import { useCart } from "@/context/CartContext";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
import Image from 'next/image';

const Chatbot = dynamic(() => import('@/components/AIChatbot'), { ssr: false });

// --- STABLE IMAGES LOGIC (Shared with Categories) ---
const getCorrectImage = (img: string, category: string, index: number) => {
  const cat = (category || "").toLowerCase().trim();
  
  if (cat.includes('mobile')) {
    const images = [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "https://images.unsplash.com/photo-1592890288564-76628a30a657",
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37"
    ];
    return `${images[index % images.length]}?q=80&w=600&auto=format`;
  }

  if (cat.includes('watch')) {
    const images = [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6",
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade"
    ];
    return `${images[index % images.length]}?q=80&w=600&auto=format`;
  }

  if (cat.includes('laptop')) {
    const images = [
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=600"
    ];
    return images[index % images.length];
  }

  if (cat.includes('gaming')) {
    const images = [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420"
    ];
    return `${images[index % images.length]}?q=80&w=600&auto=format`;
  }

  return `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&sig=${index}`;
};

// --- 1. UPDATED PRODUCT CARD WITH ZOOM EFFECT ---
const ProductCard = memo(({ product, index, addToCart }: any) => {
  const displayImage = getCorrectImage(product.image, product.category, index);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ 
        y: -8, 
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
      <div style={{ 
        position: "relative", 
        borderRadius: "15px", 
        height: "200px", 
        overflow: "hidden", 
        backgroundColor: "#000" 
      }}>
        <motion.div
          whileHover={{ scale: 1.1 }} 
          transition={{ duration: 0.5 }}
          style={{ width: "100%", height: "100%", position: "relative" }}
        >
          <Image 
            src={displayImage} 
            alt={product.name}
            fill
            sizes="240px"
            priority={index < 8}
            quality={75}
            unoptimized
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
            // FIX: Sending the EXACT displayed image to the cart
            onClick={() => addToCart({ ...product, image: displayImage })} 
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
  );
});

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
      try {
        const res = await fetch("/api/products"); 
        const data = await res.json();
        setAllProducts(data);
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