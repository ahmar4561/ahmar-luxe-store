"use client";
import { useState, use, useMemo, memo } from "react"; 
import { useCart } from "@/context/CartContext"; 
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

// --- STABLE IMAGES LOGIC (As it is) ---
const getCorrectImage = (img: string, category: string, index: number) => {
  const cat = (category || "").toLowerCase().trim();
  if (cat.includes('mobile')) {
    const images = ["https://images.unsplash.com/photo-1598327105666-5b89351aff97", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9", "https://images.unsplash.com/photo-1592890288564-76628a30a657", "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37"];
    return `${images[index % images.length]}?q=80&w=600&auto=format`;
  }
  if (cat.includes('watch')) {
    const images = ["https://images.unsplash.com/photo-1523275335684-37898b6baf30", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9", "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6", "https://images.unsplash.com/photo-1508057198894-247b23fe5ade"];
    return `${images[index % images.length]}?q=80&w=600&auto=format`;
  }
  if (cat.includes('laptop')) {
    const images = ["https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600", "https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=600", "https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=600", "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=600"];
    return images[index % images.length];
  }
  return `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&sig=${index}`;
};

const ProductCard = memo(({ product, index, addToCart }: any) => {
  const displayImage = getCorrectImage(product.image, product.category, index);
  return (
    <motion.div 
      layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      whileHover={{ y: -5 }}
      className="main-style-card"
    >
      <div className="image-wrapper">
        <Image src={displayImage} alt={product.name} fill style={{ objectFit: "cover" }} unoptimized />
      </div>
      <div className="card-info">
        <span className="category-tag">{product.category}</span>
        <h2 className="product-name">{product.name}</h2>
        <div className="price-row">
          <span className="price-text">Rs. {product.price.toLocaleString()}</span>
          <button onClick={() => addToCart({ ...product, image: displayImage })} className="bag-button">
            + ADD TO BAG
          </button>
        </div>
      </div>
    </motion.div>
  );
});

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params); 
  const id = resolvedParams.id;
  const { addToCart, globalProducts } = useCart(); 
  const [visibleCount, setVisibleCount] = useState(12);

  const filtered = useMemo(() => {
    const sCat = (id || "").toLowerCase().trim();
    if (sCat === 'all' || sCat === 'collection') return globalProducts;
    return globalProducts.filter((p: any) => {
      const pCat = (p.category || "").toLowerCase().trim();
      return pCat.includes(sCat) || sCat.includes(pCat.replace('s', ''));
    });
  }, [globalProducts, id]);

  const displayProducts = filtered.slice(0, visibleCount);

  return (
    <div className="container">
      <h1 className="page-title">{id}</h1>
      <div className="product-grid">
        <AnimatePresence mode="popLayout">
          {displayProducts.map((product: any, index: number) => (
            <ProductCard key={product._id || index} product={product} index={index} addToCart={addToCart} />
          ))}
        </AnimatePresence>
      </div>
      
      <style jsx global>{`
        .container { padding: 20px; background: var(--background); min-height: 100vh; }
        .page-title { text-align: center; color: var(--accent); text-transform: uppercase; letter-spacing: 3px; margin-bottom: 30px; font-weight: 800; }
        
        .product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          max-width: 1300px;
          margin: 0 auto;
        }

        @media (min-width: 1024px) {
          .product-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; }
        }

        .main-style-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          overflow: hidden;
          transition: 0.3s;
        }

        .image-wrapper { position: relative; height: 160px; width: 100%; background: #111; }
        @media (min-width: 1024px) { .image-wrapper { height: 200px; } }

        .card-info { padding: 12px; }
        .category-tag { font-size: 10px; color: #888; text-transform: uppercase; }
        .product-name { font-size: 14px; color: #fff; margin: 4px 0 10px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .price-row { display: flex; flex-direction: column; gap: 8px; }
        .price-text { font-size: 16px; font-weight: 700; color: var(--accent); }

        .bag-button {
          background: var(--accent);
          color: #000;
          border: none;
          padding: 8px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 10px;
          cursor: pointer;
          transition: 0.2s;
        }
        .bag-button:hover { opacity: 0.9; transform: scale(1.02); }
      `}</style>
    </div>
  );
}