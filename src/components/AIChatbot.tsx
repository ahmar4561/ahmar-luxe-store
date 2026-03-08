"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Welcome to AHMAR LUXE! I am your personal luxury assistant. How can I help you discover our elite collection today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState([]); // Products store karne ke liye
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sirf ye ek naya logic: Website ke products fetch karna
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setInventory(data);
      } catch (err) {
        console.log("Context loading failed, but chat will still work.");
      }
    };
    loadProducts();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, loading]);

  const renderText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: "var(--accent)", textDecoration: "underline", fontWeight: "bold", wordBreak: "break-all" }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Ab hum AI ko sath mein inventory (products) bhi bhej rahe hain
        body: JSON.stringify({ 
          prompt: currentInput,
          inventory: inventory 
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.text }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: "Our luxury servers are momentarily offline. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "25px", right: "25px", zIndex: 9999 }}>
      {/* Floating Toggle Button */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)} 
        style={{ 
          width: "60px", height: "60px", borderRadius: "50%", 
          backgroundColor: "var(--background)", color: "var(--accent)", 
          border: "2px solid var(--accent)", cursor: "pointer", 
          fontSize: "26px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)", 
          display: "flex", alignItems: "center", justifyContent: "center", 
          transition: "0.3s", position: "relative", zIndex: 10001
        }}
      >
        {isOpen ? "×" : "💎"}
      </motion.button>

      {/* Chat Window - Optimized for Premium Floating Look */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{ 
              position: "fixed", 
              bottom: "100px", 
              right: "25px", 
              width: "calc(100vw - 50px)", // Responsive width for mobile
              maxWidth: "380px", // Fixed width for laptop
              height: "70vh", 
              maxHeight: "600px",
              backgroundColor: "var(--background)", 
              borderRadius: "24px", 
              border: "1px solid var(--card-border)", 
              display: "flex", 
              flexDirection: "column", 
              overflow: "hidden", 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              zIndex: 10000
            }}
          >
            {/* Header */}
            <div style={{ 
              padding: "18px", backgroundColor: "var(--card-bg)", 
              borderBottom: "1px solid var(--accent)", color: "var(--accent)", 
              fontWeight: "900", textAlign: "center", 
              fontSize: "13px", letterSpacing: "2px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}>
              AHMAR LUXE AI
            </div>
            
            {/* Messages Area */}
            <div 
              ref={scrollRef} 
              className="chat-scroll"
              style={{ 
                flex: 1, padding: "20px", overflowY: "auto", 
                display: "flex", flexDirection: "column", 
                gap: "15px", backgroundColor: "var(--background)"
              }}
            >
              {messages.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: m.role === "user" ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ 
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start", 
                    backgroundColor: m.role === "user" ? "var(--accent)" : "var(--card-bg)", 
                    color: m.role === "user" ? "#000" : "var(--foreground)", 
                    padding: "12px 16px", borderRadius: "18px", 
                    borderBottomRightRadius: m.role === "user" ? "4px" : "18px",
                    borderBottomLeftRadius: m.role === "ai" ? "4px" : "18px",
                    maxWidth: "85%", fontSize: "13px", 
                    lineHeight: "1.5", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    whiteSpace: "pre-wrap",
                    border: m.role === "ai" ? "1px solid var(--card-border)" : "none"
                  }}
                >
                  {renderText(m.text)}
                </motion.div>
              ))}

              {loading && (
                <div style={{ 
                  alignSelf: "flex-start", backgroundColor: "var(--card-bg)", 
                  padding: "12px 18px", borderRadius: "18px", 
                  border: "1px solid var(--card-border)",
                  display: "flex", alignItems: "center", gap: "5px"
                }}>
                   <div className="dot-container">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div style={{ 
              padding: "15px", display: "flex", gap: "10px", 
              backgroundColor: "var(--card-bg)", borderTop: "1px solid var(--card-border)" 
            }}>
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyPress={(e) => e.key === "Enter" && sendMessage()} 
                placeholder="Message AHMAR LUXE..." 
                style={{ 
                  flex: 1, padding: "12px 15px", borderRadius: "12px", 
                  border: "1px solid var(--card-border)", 
                  backgroundColor: "var(--background)", 
                  color: "var(--foreground)", outline: "none", fontSize: "13px" 
                }} 
              />
              <button 
                onClick={sendMessage} 
                disabled={loading}
                style={{ 
                  padding: "10px 15px", backgroundColor: "var(--accent)", 
                  color: "#000", border: "none", borderRadius: "12px", 
                  cursor: loading ? "not-allowed" : "pointer", 
                  fontWeight: "900", fontSize: "11px", opacity: loading ? 0.6 : 1
                }}
              >
                SEND
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .chat-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background: var(--accent);
          border-radius: 10px;
        }
        .dot-container {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 5px 0;
        }
        .dot {
          width: 6px;
          height: 6px;
          background-color: var(--accent);
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}