"use client";
import { useEffect, useState, use, useMemo, memo } from "react";
import { useCart } from "@/context/CartContext"; 
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

// --- ONLINE ONLY UNIQUE IMAGES LOGIC ---
const getCorrectImage = (img: string, category: string, index: number) => {
  const cat = (category || "").toLowerCase().trim();
  
  // Mobile Category ke liye unique online images
  if (cat.includes('mobile') || cat.includes('phone')) {
    const mobPhotos = [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "https://images.unsplash.com/photo-1592890288564-76628a30a657",
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37"
    ];
    return `${mobPhotos[index % mobPhotos.length]}?q=80&w=800`;
  }
  
  // Watch Category ke liye unique online images
  if (cat.includes('watch')) {
    const watchPhotos = [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      "https://images.unsplash.com/photo-1508685096489-8a054a0553ef",
      "https://images.unsplash.com/photo-1542496658-91bd65836a0a",
      "https://images.unsplash.com/photo-1526173176685-5a8b4306822e"
    ];
    return `${watchPhotos[index % watchPhotos.length]}?q=80&w=800`;
  }

  // Default Laptop or others
  return `https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800`;
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
        <span style={{ fontSize: "9px", color: "var(--accent)", fontWeight: 'bold' }}>
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
            style={{ backgroundColor: "var(--accent)", color: "#000", padding: "8px 16px", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: '11px' }}
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
  const slug = resolvedParams.slug;
  const { addToCart } = useCart(); 
  
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      // Speed ke liye pehle cache load karo
      const cached = sessionStorage.getItem("ultra_cache");
      if (cached) setAllProducts(JSON.parse(cached));

      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setAllProducts(data);
        sessionStorage.setItem("ultra_cache", JSON.stringify(data));
      } catch (err) { console.error(err); }
    }
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    const sCat = slug.toLowerCase().trim();
    if (sCat === 'all' || sCat === 'collection') return allProducts;

    return allProducts.filter((p: any) => {
      const pCat = p.category.toLowerCase().trim();
      return pCat.includes(sCat) || sCat.includes(pCat.replace('s', ''));
    });
  }, [allProducts, slug]);

  return (
    <div style={{ padding: "20px", backgroundColor: "var(--background)", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", fontSize: "28px", fontWeight: "900", color: "var(--accent)", marginBottom: "40px", textTransform: "uppercase" }}>
        {slug}
      </h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "25px", maxWidth: "1400px", margin: "0 auto" }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((product: any, index: number) => (
            <ProductCard key={product._id} product={product} index={index} addToCart={addToCart} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}