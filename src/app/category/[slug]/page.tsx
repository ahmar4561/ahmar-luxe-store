"use client";
import { useEffect, useState, use, useMemo, memo } from "react";
import { useCart } from "@/context/CartContext"; 
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

// --- FIXED IMAGE LOGIC (Category Specific) ---
const getCorrectImage = (img: string, category: string, index: number) => {
  const cat = (category || "").toLowerCase().trim();
  
  // Unique images using Unsplash + index + category keyword
  if (!img || img.startsWith('/images') || !img.includes('http')) {
    if (cat.includes('watch')) {
      return `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000&sig=wtch_${index}`;
    }
    if (cat.includes('mobile') || cat.includes('phone') || cat.includes('smartphone')) {
      return `https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=1000&sig=mob_${index}`;
    }
    if (cat.includes('laptop') || cat.includes('computer')) {
      return `https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000&sig=lap_${index}`;
    }
    return `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000&sig=def_${index}`;
  }
  return img; 
};

const ProductCard = memo(({ product, index, addToCart }: any) => {
  const displayImage = getCorrectImage(product.image, product.category, index);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      style={{ 
        border: "1px solid var(--card-border)", 
        borderRadius: "20px", 
        padding: "12px", 
        backgroundColor: "var(--card-bg)",
        cursor: "pointer"
      }}
    >
      <div style={{ position: "relative", borderRadius: "15px", height: "200px", overflow: "hidden", backgroundColor: "#000" }}>
        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} style={{ width: "100%", height: "100%", position: "relative" }}>
          <Image 
            src={displayImage} 
            alt={product.name}
            fill
            sizes="240px"
            style={{ objectFit: "cover" }}
            unoptimized={true}
          />
        </motion.div>
      </div>

      <div style={{ marginTop: "12px" }}>
        <span style={{ fontSize: "10px", color: "var(--accent)", fontWeight: 'bold', letterSpacing: '1px' }}>
          {product.category.toUpperCase()}
        </span>
        <h2 style={{ fontSize: "15px", margin: "5px 0", color: "var(--foreground)", fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {product.name}
        </h2>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
          <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--accent)" }}>
            Rs. {product.price.toLocaleString()}
          </span>
          <button 
            onClick={() => addToCart(product)} 
            style={{ backgroundColor: "var(--accent)", color: "#000", padding: "8px 16px", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}
          >
            + ADD
          </button>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = "ProductCard";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params); 
  const rawSlug = resolvedParams.slug;
  const { addToCart } = useCart(); 
  
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      // FORCE REFRESH: Purana cache clear kar do ek baar
      if (!sessionStorage.getItem("v2_fix")) {
        sessionStorage.removeItem("ultra_cache");
        sessionStorage.setItem("v2_fix", "true");
      }

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
    const sCat = rawSlug.toLowerCase().trim();
    
    // AGAR SLUG "ALL" HAI TO KUCH FILTER MAT KARO
    if (sCat === 'all' || sCat === 'collection') {
      return allProducts;
    }

    return allProducts.filter((p: any) => {
      const pCat = p.category.toLowerCase().trim();
      // Match "Mobile" with "Mobiles" and vice versa
      return pCat.includes(sCat) || sCat.includes(pCat);
    });
  }, [allProducts, rawSlug]);

  if (loading && allProducts.length === 0) {
    return <div style={{color: 'var(--accent)', textAlign: 'center', marginTop: '100px', fontWeight: 'bold'}}>LOADING COLLECTION...</div>;
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "var(--background)", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", fontSize: "28px", fontWeight: "900", color: "var(--accent)", marginBottom: "40px", textTransform: "uppercase" }}>
        {rawSlug}
      </h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "25px", maxWidth: "1400px", margin: "0 auto" }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((product: any, index: number) => (
            <ProductCard key={product._id} product={product} index={index} addToCart={addToCart} />
          ))}
        </AnimatePresence>
      </div>
      
      {filtered.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>No products found in this category.</p>
      )}
    </div>
  );
}