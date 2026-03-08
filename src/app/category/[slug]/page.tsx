"use client";
import { useState, use, useMemo, memo } from "react"; 
import { useCart } from "@/context/CartContext"; 
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

// --- STABLE IMAGES LOGIC (RESTORED: Har category ke apne products dikhenge) ---
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

// --- PRODUCT CARD (STYLED EXACTLY LIKE 'ALL' PAGE) ---
const ProductCard = memo(({ product, index, addToCart }: any) => {
  const displayImage = getCorrectImage(product.image, product.category, index);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }} 
      className="styled-card"
    >
      <div className="img-holder">
        <Image src={displayImage} alt={product.name} fill style={{ objectFit: "cover" }} unoptimized />
      </div>

      <div className="info-area">
        <span className="cat-text">{product.category.toUpperCase()}</span>
        <h2 className="title-text">{product.name}</h2>
        <span className="price-text">Rs. {product.price.toLocaleString()}</span>
        <button 
          onClick={() => addToCart({ ...product, image: displayImage })} 
          className="bag-btn"
        >
          + ADD TO BAG
        </button>
      </div>
    </motion.div>
  );
});

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params); 
  const categoryId = resolvedParams.id; 
  const { addToCart, globalProducts } = useCart(); 
  const [visibleCount, setVisibleCount] = useState(12);

  const filtered = useMemo(() => {
    const sCat = (categoryId || "").toLowerCase().trim();
    if (sCat === 'all' || sCat === 'collection') return globalProducts;
    return globalProducts.filter((p: any) => {
      const pCat = (p.category || "").toLowerCase().trim();
      return pCat.includes(sCat) || sCat.includes(pCat.replace('s', ''));
    });
  }, [globalProducts, categoryId]);

  const displayProducts = filtered.slice(0, visibleCount);

  return (
    <div className="wrapper">
      <h1 className="main-title">{categoryId}</h1>
      
      <div className="grid-container">
        <AnimatePresence mode="popLayout">
          {displayProducts.map((product: any, index: number) => (
            <ProductCard key={product._id || index} product={product} index={index} addToCart={addToCart} />
          ))}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .wrapper { padding: 20px 15px; background: var(--background); min-height: 100vh; }
        .main-title { text-align: center; font-size: 28px; font-weight: 900; color: var(--accent); margin-bottom: 35px; text-transform: uppercase; letter-spacing: 3px; }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (min-width: 1024px) {
          .grid-container { 
            grid-template-columns: repeat(4, 1fr) !important; 
            gap: 25px; 
          }
        }

        .styled-card {
          border: 1px solid var(--card-border);
          border-radius: 18px;
          padding: 10px;
          background: var(--card-bg);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .img-holder { position: relative; border-radius: 12px; height: 160px; overflow: hidden; background: #000; }
        @media (min-width: 768px) { .img-holder { height: 220px; } }

        .info-area { padding: 12px 2px 5px; flex-grow: 1; display: flex; flex-direction: column; }
        .cat-text { font-size: 8px; color: var(--accent); font-weight: 800; letter-spacing: 1px; }
        .title-text { font-size: 13px; margin: 5px 0; color: var(--foreground); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .price-text { font-size: 16px; font-weight: 800; color: var(--accent); margin-bottom: 12px; }

        .bag-btn {
          background: var(--accent);
          color: #000;
          padding: 10px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 900;
          font-size: 10px;
          width: 100%;
          transition: 0.2s;
        }
        .bag-btn:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}