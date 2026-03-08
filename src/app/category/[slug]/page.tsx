"use client";
import { useEffect, useState, use, useMemo, memo } from "react";
import { useCart } from "@/context/CartContext"; 
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

// --- STABLE IMAGES LOGIC ---
const getCorrectImage = (img: string, category: string, index: number) => {
  const cat = (category || "").toLowerCase().trim();
  
  // 1. MOBILE (No Changes)
  if (cat.includes('mobile')) {
    const images = [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "https://images.unsplash.com/photo-1592890288564-76628a30a657",
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37"
    ];
    return `${images[index % images.length]}?q=80&w=600&auto=format`;
  }

  // 2. WATCHES (No Changes)
  if (cat.includes('watch')) {
    const images = [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6",
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314"
    ];
    return `${images[index % images.length]}?q=80&w=600&auto=format`;
  }

  // 3. FASHION (No Changes)
  if (cat.includes('fashion') || cat.includes('clothing')) {
    const images = [
      "https://images.unsplash.com/photo-1445205170230-053b83016050",
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b",
      "https://images.unsplash.com/photo-1467043237213-65f2da53396f"
    ];
    return `${images[index % images.length]}?q=80&w=600&auto=format`;
  }

  // 4. ELECTRONICS (No Changes)
  if (cat.includes('electronic')) {
    const images = [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      "https://images.unsplash.com/photo-1523206489230-c012c64b2b48",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
      "https://images.unsplash.com/photo-1491933382434-500287f9b54b"
    ];
    return `${images[index % images.length]}?q=80&w=600&auto=format`;
  }

  // 5. GAMING (FIXED WITH NEW PERMANENT LINKS)
  if (cat.includes('gaming')) {
    const images = [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420",
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575"
    ];
    return `${images[index % images.length]}?q=80&w=600&auto=format`;
  }

  // 6. LAPTOP (No Changes)
  if (cat.includes('laptop')) {
    const images = [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
      "https://images.unsplash.com/photo-1517336712462-877523366436",
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2"
    ];
    return `${images[index % images.length]}?q=80&w=600&auto=format`;
  }

  return `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&sig=${index}`;
};

const ProductCard = memo(({ product, index, addToCart }: any) => {
  const displayImage = getCorrectImage(product.image, product.category, index);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }} 
      style={{ border: "1px solid var(--card-border)", borderRadius: "20px", padding: "12px", backgroundColor: "var(--card-bg)", cursor: "pointer" }}
    >
      <div style={{ position: "relative", borderRadius: "15px", height: "200px", overflow: "hidden", backgroundColor: "#000" }}>
        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} style={{ width: "100%", height: "100%", position: "relative" }}>
          <Image src={displayImage} alt={product.name} fill style={{ objectFit: "cover" }} unoptimized />
        </motion.div>
      </div>
      <div style={{ marginTop: "12px" }}>
        <span style={{ fontSize: "9px", color: "var(--accent)", fontWeight: 'bold' }}>{product.category.toUpperCase()}</span>
        <h2 style={{ fontSize: "15px", margin: "5px 0", color: "var(--foreground)", fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h2>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
          <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--accent)" }}>Rs. {product.price.toLocaleString()}</span>
          <button onClick={() => addToCart(product)} style={{ backgroundColor: "var(--accent)", color: "#000", padding: "8px 16px", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: '11px' }}>+ ADD</button>
        </div>
      </div>
    </motion.div>
  );
});

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params); 
  const slug = resolvedParams.slug;
  const { addToCart } = useCart(); 
  
  const [allProducts, setAllProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    async function fetchProducts() {
      const cached = sessionStorage.getItem("ultra_cache");
      if (cached) setAllProducts(JSON.parse(cached));
      const res = await fetch("/api/products");
      const data = await res.json();
      setAllProducts(data);
      sessionStorage.setItem("ultra_cache", JSON.stringify(data));
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

  const displayProducts = filtered.slice(0, visibleCount);

  return (
    <div style={{ padding: "20px", backgroundColor: "var(--background)", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", fontSize: "28px", fontWeight: "900", color: "var(--accent)", marginBottom: "40px", textTransform: "uppercase" }}>{slug}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "25px", maxWidth: "1400px", margin: "0 auto" }}>
        <AnimatePresence mode="popLayout">
          {displayProducts.map((product: any, index: number) => (
            <ProductCard key={product._id} product={product} index={index} addToCart={addToCart} />
          ))}
        </AnimatePresence>
      </div>
      {filtered.length > visibleCount && (
        <div style={{ textAlign: 'center', marginTop: '50px', paddingBottom: '40px' }}>
          <button onClick={() => setVisibleCount(prev => prev + 10)} className="load-more-btn">EXPLORE MORE</button>
        </div>
      )}
      <style jsx global>{`
        .load-more-btn { padding: 14px 50px; background: var(--accent); color: #000; border: none; cursor: pointer; border-radius: 30px; font-weight: 900; letter-spacing: 2px; transition: 0.3s; }
        .load-more-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2); }
      `}</style>
    </div>
  );
}