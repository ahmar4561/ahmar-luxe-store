"use client";
import { useState, use, useMemo, memo } from "react"; 
import { useCart } from "@/context/CartContext"; 
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

// --- STABLE IMAGES LOGIC (AS PER YOUR ORIGINAL FILE) ---
const getCorrectImage = (img: string, category: string, index: number) => {
  const cat = (category || "").toLowerCase().trim();
  
  if (cat.includes('mobile')) {
    const images = ["https://images.unsplash.com/photo-1598327105666-5b89351aff97", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9", "https://images.unsplash.com/photo-1592890288564-76628a30a657", "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37"];
    return `${images[index % images.length]}?q=80&w=600&auto=format`;
  }
  if (cat.includes('watch')) {
    const images = ["https://images.unsplash.com/photo-1523275335684-37898b6baf30", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9", "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6", "https://images.unsplash.com/photo-1508057198894-247b23fe5ade", "https://images.unsplash.com/photo-1524592094714-0f0654e20314"];
    return `${images[index % images.length]}?q=80&w=600&auto=format`;
  }
  if (cat.includes('fashion') || cat.includes('clothing')) {
    const images = ["https://images.unsplash.com/photo-1445205170230-053b83016050", "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04", "https://images.unsplash.com/photo-1483985988355-763728e1935b", "https://images.unsplash.com/photo-1467043237213-65f2da53396f"];
    return `${images[index % images.length]}?q=80&w=600&auto=format`;
  }
  if (cat.includes('electronic')) {
    const images = ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e", "https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=600", "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf", "https://images.unsplash.com/photo-1491933382434-500287f9b54b"];
    return `${images[index % images.length]}?q=80&w=600&auto=format`;
  }
  if (cat.includes('gaming')) {
    const images = ["https://images.unsplash.com/photo-1542751371-adc38448a05e", "https://images.unsplash.com/photo-1511512578047-dfb367046420", "https://images.unsplash.com/photo-1538481199705-c710c4e965fc", "https://images.unsplash.com/photo-1550745165-9bc0b252726f", "https://images.unsplash.com/photo-1593305841991-05c297ba4575"];
    return `${images[index % images.length]}?q=80&w=600&auto=format`;
  }
  if (cat.includes('laptop')) {
    const images = ["https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600", "https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=600", "https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=600", "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=600", "https://images.pexels.com/photos/2528118/pexels-photo-2528118.jpeg?auto=compress&cs=tinysrgb&w=600"];
    return images[index % images.length];
  }
  return `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&sig=${index}`;
};

// --- PRODUCT CARD (STYLING EXACTLY LIKE ALL PAGE) ---
const ProductCard = memo(({ product, index, addToCart }: any) => {
  const displayImage = getCorrectImage(product.image, product.category, index);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      style={{ 
        border: "1px solid var(--card-border)", 
        borderRadius: "15px", 
        padding: "10px", 
        backgroundColor: "var(--card-bg)", 
        cursor: "pointer", 
        position: "relative", 
        overflow: "hidden" 
      }}
    >
      <div style={{ position: "relative", borderRadius: "12px", height: "160px", overflow: "hidden", backgroundColor: "#000" }}>
        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} style={{ width: "100%", height: "100%", position: "relative" }}>
          <Image 
            src={displayImage} 
            alt={product.name} 
            fill 
            sizes="(max-width: 768px) 50vw, 240px"
            style={{ objectFit: "cover" }} 
            unoptimized 
          />
        </motion.div>
      </div>

      <div style={{ marginTop: "10px" }}>
        <span style={{ fontSize: "8px", color: "var(--accent)", letterSpacing: '1px', fontWeight: 'bold' }}>
          {product.category.toUpperCase()}
        </span>
        <h2 style={{ 
          fontSize: "13px", 
          margin: "4px 0", 
          color: "var(--foreground)", 
          fontWeight: '600', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis' 
        }}>
          {product.name}
        </h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
          <span style={{ fontSize: "16px", fontWeight: "800", color: "var(--accent)" }}>
            Rs. {product.price.toLocaleString()}
          </span>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => addToCart({ ...product, image: displayImage })} 
            style={{ 
              backgroundColor: "var(--accent)", 
              color: "#000", 
              padding: "8px", 
              border: "none", 
              borderRadius: "8px", 
              cursor: "pointer", 
              fontWeight: "bold", 
              fontSize: '10px', 
              width: '100%' 
            }}
          >
            + ADD TO BAG
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params); 
  const slug = resolvedParams.slug;
  const { addToCart, globalProducts } = useCart(); 
  const [visibleCount, setVisibleCount] = useState(12);

  const filtered = useMemo(() => {
    const sCat = slug.toLowerCase().trim();
    if (sCat === 'all' || sCat === 'collection') return globalProducts;
    return globalProducts.filter((p: any) => {
      const pCat = (p.category || "").toLowerCase().trim();
      return pCat.includes(sCat) || sCat.includes(pCat.replace('s', ''));
    });
  }, [globalProducts, slug]);

  const displayProducts = filtered.slice(0, visibleCount);

  return (
    <div style={{ padding: "15px", backgroundColor: "var(--background)", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: "25px", marginTop: "10px" }}>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            style={{ fontSize: "22px", fontWeight: "900", color: "var(--accent)", letterSpacing: "2px", textTransform: "uppercase" }}
          >
            {slug}
          </motion.h1>
      </div>
      
      <div className="product-grid">
        <AnimatePresence mode="popLayout">
          {displayProducts.map((product: any, index: number) => (
            <ProductCard key={product._id || index} product={product} index={index} addToCart={addToCart} />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length > visibleCount && (
        <div style={{ textAlign: 'center', marginTop: '50px', paddingBottom: '40px' }}>
          <button onClick={() => setVisibleCount(prev => prev + 12)} className="load-more-btn">EXPLORE MORE</button>
        </div>
      )}
      
      <style jsx global>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          max-width: 1300px;
          margin: 0 auto;
        }

        @media (min-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 25px;
          }
        }

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