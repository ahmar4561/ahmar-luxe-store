"use client";
import { useEffect, useState, use, useMemo, memo } from "react";
import { useCart } from "@/context/CartContext"; 
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

// --- ACCURATE ONLINE IMAGES LOGIC (UNIQUE FOR EACH) ---
const getCorrectImage = (img: string, category: string, index: number) => {
  const cat = (category || "").toLowerCase().trim();
  
  // Unique identifiers taake har product alag dikhe
  if (cat.includes('mobile')) return `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&sig=mob${index}`;
  if (cat.includes('watch')) return `https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&sig=wtch${index}`;
  if (cat.includes('laptop')) return `https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=500&sig=lap${index}`;
  if (cat.includes('fashion') || cat.includes('clothing')) return `https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=500&sig=fas${index}`;
  if (cat.includes('gaming')) return `https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=500&sig=gam${index}`;
  if (cat.includes('electronic')) return `https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=500&sig=ele${index}`;
  
  return `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&sig=def${index}`;
};

const ProductCard = memo(({ product, index, addToCart }: any) => {
  const displayImage = getCorrectImage(product.image, product.category, index);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }} // <--- WAHEE FLOAT EFFECT
      style={{ 
        border: "1px solid var(--card-border)", 
        borderRadius: "20px", 
        padding: "12px", 
        backgroundColor: "var(--card-bg)", 
        cursor: "pointer" 
      }}
    >
      <div style={{ position: "relative", borderRadius: "15px", height: "200px", overflow: "hidden", backgroundColor: "#000" }}>
        <motion.div 
          whileHover={{ scale: 1.1 }} // <--- WAHEE ZOOM EFFECT
          transition={{ duration: 0.5 }} 
          style={{ width: "100%", height: "100%", position: "relative" }}
        >
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