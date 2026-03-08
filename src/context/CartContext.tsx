"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext<any>(null);

// --- STABLE IMAGES LOGIC (Cart mein sahi images dikhane ke liye) ---
const getCorrectImage = (img: string, category: string) => {
  const cat = (category || "").toLowerCase().trim();
  
  if (cat.includes('mobile')) {
    return "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600";
  }
  if (cat.includes('watch')) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600";
  }
  if (cat.includes('laptop')) {
    return "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600";
  }
  if (cat.includes('gaming')) {
    return "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600";
  }
  if (cat.includes('electronic')) {
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600";
  }
  if (cat.includes('fashion') || cat.includes('clothing')) {
    return "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600";
  }
  return img; 
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart ko LocalStorage se uthana
  useEffect(() => {
    const savedCart = localStorage.getItem("ahmar_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Error parsing cart:", err);
      }
    }
  }, []);

  // Cart ko LocalStorage mein save karna
  useEffect(() => {
    localStorage.setItem("ahmar_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    // Yahan hum product ki image ko stable image se replace kar rahe hain
    const fixedProduct = {
      ...product,
      image: getCorrectImage(product.image, product.category)
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
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      cartCount, 
      cartTotal, 
      isCartOpen, 
      setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);