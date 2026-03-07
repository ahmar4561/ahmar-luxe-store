"use client";
import { useEffect, useState, use, useMemo, memo } from "react";
import { useCart } from "@/context/CartContext"; 
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

// --- FIXED IMAGE LOGIC (Category Specific & Unique) ---
const getCorrectImage = (img: string, category: string, index: number) => {
  if (!img || img.startsWith('/images') || !img.includes('http')) {
    const cat = category.toLowerCase().trim();
    // Unique images using Unsplash source + index for variety
    if (cat.includes('watch')) {
      return `https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&sig=${index}`;
    }
    if (cat.includes('mobile') || cat.includes('phone')) {
      return `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&sig=${index}`;
    }
    if (cat.includes('laptop')) {
      return `https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&sig=${index}`;
    }
    return `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&sig=${index}`;
  }
  return img; 
};

// --- PRODUCT CARD (Original Effects Ke Saath) ---
const ProductCard = memo(({ product, index, addToCart }: any) => {
  const displayImage = getCorrectImage(product.image, product.category, index);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ 
        y: -8, // Wahi Float Effect
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
      <div style={{ position: "relative", borderRadius: "15px", height: "200px", overflow: "hidden", backgroundColor: "#000" }}>
        <motion.div
          whileHover={{ scale: 1.1 }} // Wahi Inner Zoom
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
            style={{ objectFit: "cover" }}
            unoptimized={true}
          />
        </motion.div>
      </div>

      <div style={{ marginTop: "12px" }}>
        <span style={{ fontSize: "9px", color: "var(--accent)", letterSpacing: '1px', fontWeight: 'bold' }}>
          {product.category.toUpperCase()}
        </span>
        <h2 style={{ fontSize: "15px", margin: "5px 0", color: "var(--foreground)", fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
  );
});

ProductCard.displayName = "ProductCard";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params); 
  const slug = resolvedParams.slug;
  const { addToCart } = useCart(); 
  
  const [allProducts, setAllProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      // 1. Instant Loading Check
      const cached = sessionStorage.getItem("ultra_cache");
      if (cached) {
        setAllProducts(JSON.parse(cached));
        setLoading(false);
      }

      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setAllProducts(data);
        sessionStorage.setItem("ultra_cache", JSON.stringify(data));
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    }
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    return allProducts.filter((p: any) => {
      const pCat = p.category.toLowerCase().trim();
      const sCat = slug.toLowerCase().trim();
      return pCat === sCat || pCat === `${sCat}s` || sCat === `${pCat}s` || sCat === 'all';
    });
  }, [allProducts, slug]);

  const displayProducts = filtered.slice(0, visibleCount);

  // Sirf pehli baar loading dikhayega, navigation fast rakhega
  if (loading && allProducts.length === 0) {
    return <div style={{color: 'var(--accent)', textAlign: 'center', marginTop: '100px', fontWeight: 'bold'}}>LOADING LUXE...</div>;
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "var(--background)", minHeight: "100vh" }}>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", fontSize: "28px", fontWeight: "900", color: "var(--accent)", marginBottom: "40px", marginTop: "20px", textTransform: "uppercase", letterSpacing: "3px" }}
      >
        {slug}
      </motion.h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "25px", maxWidth: "1400px", margin: "0 auto" }}>
        <AnimatePresence mode="popLayout">
          {displayProducts.map((product: any, index: number) => (
            <ProductCard key={product._id} product={product} index={index} addToCart={addToCart} />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length > visibleCount && (
        <div style={{ textAlign: 'center', marginTop: '50px', paddingBottom: '40px' }}>
          <button onClick={() => setVisibleCount(v => v + 10)} className="load-more-btn">EXPLORE MORE</button>
        </div>
      )}

      <style jsx global>{`
        .load-more-btn { padding: 14px 50px; background: var(--accent); color: #000; border: none; cursor: pointer; border-radius: 30px; font-weight: 900; letter-spacing: 2px; transition: 0.3s; box-shadow: 0 10px 20px rgba(212, 175, 55, 0.15); }
        .load-more-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3); opacity: 0.95; }
      `}</style>
    </div>
  );
}