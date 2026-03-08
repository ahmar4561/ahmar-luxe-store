"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext<any>(null);

// --- STABLE IMAGES LOGIC (ID Based Fix) ---
const getCorrectImage = (product: any) => {
  const cat = (product.category || "").toLowerCase().trim();
  const idStr = product._id || "0";
  // ID se ek number nikalne ke liye (taake image fix rahe)
  const idNum = idStr.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);

  if (cat.includes('mobile')) {
    const images = [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "https://images.unsplash.com/photo-1592890288564-76628a30a657",
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37"
    ];
    return `${images[idNum % images.length]}?q=80&w=600&auto=format`;
  }

  if (cat.includes('watch')) {
    const images = [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6",
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade"
    ];
    return `${images[idNum % images.length]}?q=80&w=600&auto=format`;
  }

  if (cat.includes('laptop')) {
    const images = [
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=600"
    ];
    return images[idNum % images.length];
  }

  if (cat.includes('gaming')) {
    const images = [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420"
    ];
    return `${images[idNum % images.length]}?q=80&w=600&auto=format`;
  }

  return product.image; 
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("ahmar_cart");
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (err) { console.error(err); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ahmar_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    // FIX: Image ko ID ke mutabiq hamesha ke liye lock kar rahe hain
    const fixedProduct = {
      ...product,
      image: getCorrectImage(product)
    };

    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...fixedProduct, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("ahmar_cart");
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, clearCart, 
      cartCount, cartTotal, isCartOpen, setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);