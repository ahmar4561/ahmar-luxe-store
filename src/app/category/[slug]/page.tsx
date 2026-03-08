"use client";
import { useState, use, useMemo, memo } from "react"; 
import { useCart } from "@/context/CartContext"; 
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

// --- STABLE IMAGES LOGIC (UNTOUCHED) ---
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

const ProductCard = memo(({ product, index, addToCart }: any) => {
  const displayImage = getCorrectImage(product.image, product.category, index);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }} 
      className="professional-card"
    >
      {/* IMAGE CONTAINER - Always fixed ratio */}
      <div className="img-container">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} style={{ width: "100%", height: "100%", position: "relative" }}>
          <Image 
            src={displayImage} 
            alt={product.name} 
            fill 
            style={{ objectFit: "cover" }} 
            unoptimized 
          />
        </motion.div>
      </div>

      {/* CONTENT SECTION - Pushes button to bottom */}
      <div className="card-content">
        <div style={{ marginBottom: "10px" }}>
          <span className="cat-label">{product.category.toUpperCase()}</span>
          <h2 className="product-title">{product.name}</h2>
        </div>
        
        <div className="price-btn-group">
          <span className="price-tag">Rs. {product.price.toLocaleString()}</span>
          <button 
            onClick={() => addToCart({ ...product, image: displayImage })} 
            className="add-btn"
          >
            + ADD TO BAG
          </button>
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
    <div className="page-wrapper">
      <h1 className="category-title">{slug}</h1>
      
      <div className="product-grid">
        <AnimatePresence mode="popLayout">
          {displayProducts.map((product: any, index: number) => (
            <ProductCard key={product._id} product={product} index={index} addToCart={addToCart} />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length > visibleCount && (
        <div style={{ textAlign: 'center', marginTop: '60px', paddingBottom: '40px' }}>
          <button onClick={() => setVisibleCount(prev => prev + 12)} className="load-more-btn">EXPLORE MORE</button>
        </div>
      )}
      
      <style jsx global>{`
        .page-wrapper {
          padding: 20px 15px;
          background-color: var(--background);
          min-height: 100vh;
        }

        .category-title {
          text-align: center;
          font-size: clamp(24px, 5vw, 36px);
          font-weight: 900;
          color: var(--accent);
          margin-bottom: 40px;
          text-transform: uppercase;
          letter-spacing: 4px;
        }

        /* GRID: 2 columns mobile, dynamic laptop */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          max-width: 1400px;
          margin: 0 auto;
          grid-auto-rows: 1fr;
        }

        @media (min-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 30px;
          }
        }

        /* PROFESSIONAL CARD STYLING */
        .professional-card {
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 12px;
          background-color: var(--card-bg);
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.3s ease;
        }

        .img-container {
          position: relative;
          border-radius: 15px;
          height: 180px;
          overflow: hidden;
          background-color: #000;
        }

        @media (min-width: 768px) {
          .img-container { height: 240px; }
        }

        .card-content {
          padding: 12px 4px 4px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .cat-label {
          font-size: 9px;
          color: var(--accent);
          font-weight: 800;
          letter-spacing: 1px;
        }

        .product-title {
          font-size: 14px;
          margin: 6px 0;
          color: var(--foreground);
          font-weight: 600;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .price-btn-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: auto;
        }

        .price-tag {
          font-size: 18px;
          font-weight: 800;
          color: var(--accent);
        }

        .add-btn {
          background-color: var(--accent);
          color: #000;
          padding: 12px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 900;
          font-size: 11px;
          width: 100%;
          transition: 0.2s;
        }

        .add-btn:active { transform: scale(0.95); }

        .load-more-btn { 
          padding: 16px 60px; 
          background: transparent; 
          color: var(--accent); 
          border: 2px solid var(--accent); 
          cursor: pointer; 
          border-radius: 50px; 
          font-weight: 900; 
          letter-spacing: 2px; 
          transition: 0.3s; 
        }

        .load-more-btn:hover { 
          background: var(--accent); 
          color: #000;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
        }
      `}</style>
    </div>
  );
}