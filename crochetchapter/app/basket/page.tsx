"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function BasketPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  // Guard to prevent saving an empty state over your real data on load
  const hasLoaded = useRef(false);

  // 1. Initial Mount & Load
  useEffect(() => {
    setIsClient(true);
    const savedCart = localStorage.getItem('crochet-cart');
    
    if (savedCart) {
      try {
        const parsedData = JSON.parse(savedCart);
        if (Array.isArray(parsedData)) {
          setCart(parsedData);
        }
      } catch (error) {
        console.error("Failed to parse cart:", error);
      }
    }
    
    // IMPORTANT: We set this to true AFTER checking localStorage
    hasLoaded.current = true;
  }, []);

  // 2. Persistent Save
  useEffect(() => {
    // Only save if the client is ready AND we've finished the initial loading step
    if (isClient && hasLoaded.current) {
      localStorage.setItem('crochet-cart', JSON.stringify(cart));
    }
  }, [cart, isClient]);

  // 3. Logic Handlers (Updated to use functional state updates for safety)
  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.cartId === cartId 
          ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
          : item
      )
    );
  };

  const removeItem = (cartId: string) => {
    setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Prevent hydration mismatch
  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#fffafa] py-10 px-4">
      <div className="max-w-3xl mx-auto"> {/* Shrank total page width */}
        
        <h1 className="text-3xl font-clicker text-[#ff85a2] text-center mb-2">Your Basket</h1>
        <div className="text-center mb-10">
            <Link href="/allcreations" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#ff85a2]">
                ← Back to Shop
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* ITEM LIST */}
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.cartId} className="basket-item-compact">
                <div className="basket-img-mini">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
  <h3 className="text-sm font-bold text-[#5c4d4d] truncate">{item.name}</h3>
  
  <button 
    onClick={() => removeItem(item.cartId)} 
    className="aesthetic-remove-btn"
    aria-label="Remove item"
  >
    ×
  </button>
</div>
                  <p className="text-[9px] font-bold text-[#ff85a2] uppercase">{item.size} | {item.colour}</p>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="qty-pill-mini">
                      <button onClick={() => updateQuantity(item.cartId, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartId, 1)}>+</button>
                    </div>
                    <p className="text-sm font-bold text-[#5c4d4d]">Rs. {item.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="summary-card-mini">
            <h2 className="text-sm font-bold text-[#5c4d4d] mb-4 uppercase tracking-widest">Order Summary</h2>
            <div className="flex justify-between text-sm mb-2 opacity-60">
              <span>Subtotal</span>
              <span>Rs. {total}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-[#5c4d4d] border-t border-pink-50 pt-3 mt-3">
              <span>Total</span>
              <span>Rs. {total}</span>
            </div>
            <button className="checkout-btn-mini mt-6">Checkout via WhatsApp</button>
          </div>

        </div>
      </div>
    </div>
  );
}