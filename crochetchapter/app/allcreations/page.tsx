"use client";
import { supabase } from "@/lib/supabase";
import React, { useState, useEffect, useRef } from "react"; // Fixed: Added useRef and formal React import
import Link from "next/link";

export default function Home() {
  // --- State & Refs ---
  const [cart, setCart] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColour, setSelectedColour] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Track if we've finished the initial load to prevent wiping localStorage

  // --- Helper: Get Price (Example) ---

  // --- 2. Load cart from storage ONLY on mount ---
  useEffect(() => {
    setIsClient(true);
    const savedCart = localStorage.getItem("crochet-cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      } catch (e) {
        console.error("Cart parse error:", e);
      }
    }
    // MARK AS LOADED: This "opens the gate" for saving
    setIsCartLoaded(true);
  }, []);
useEffect(() => {
    if (isClient && isCartLoaded) {
      localStorage.setItem("crochet-cart", JSON.stringify(cart));
    }
  }, [cart, isCartLoaded, isClient]);
  // --- 3. Save cart ONLY if it's already been loaded from disk ---
  // --- Actions ---
 const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };
const addToCart = () => {
    if (!selectedProduct) return;

    const cartId = `${selectedProduct.id}-${selectedSize}-${selectedColour}`;
    const cartItem = {
      cartId,
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: getCurrentPrice(),
      image: activeImage,
      size: selectedSize,
      colour: selectedColour,
      quantity: quantity,
    };

setCart((prev) => {
      const existing = prev.find((item) => item.cartId === cartId);
      if (existing) {
        return prev.map((item) =>
          item.cartId === cartId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, cartItem];
    });
    // --- UI Feedback & Cleanup ---
  setQuantity(1);
    setIsCartOpen(true);
    setSelectedProduct(null);
  };
  const [zoomStyle, setZoomStyle] = useState({
    display: "none",
    top: 0,
    left: 0,
    backgroundPosition: "0% 0%",
  });
  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    // Calculate percentage position of mouse inside the image
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setZoomStyle({
      display: "block",
      top: e.pageY - top - window.scrollY - 75, // Centers the 150px circle
      left: e.pageX - left - window.scrollX - 75,
      backgroundPosition: `${x}% ${y}%`,
    });
  };
  const handleMouseLeave = () => {
    setZoomStyle({ ...zoomStyle, display: "none" });
  };

  useEffect(() => {
    if (selectedProduct) {
      // 1. Initial Defaults
      setActiveImage(selectedProduct.image_url);

      // 2. Automatically select the first SIZE
      if (
        selectedProduct.size_variants &&
        selectedProduct.size_variants.length > 0
      ) {
        // Set state to the first size string (e.g., "Small")
        setSelectedSize(selectedProduct.size_variants[0].size);

        // OPTIONAL: If sizes have different prices, you might want
        // to trigger your price calculation here, though getCurrentPrice()
        // will handle it on render.
      } else {
        setSelectedSize(""); // Fallback if no sizes exist
      }

      // 3. Automatically select the first COLOUR
      if (
        selectedProduct.colour_variants &&
        selectedProduct.colour_variants.length > 0
      ) {
        const firstVariant = selectedProduct.colour_variants[0];
        setSelectedColour(firstVariant.colour);

        // Swap the image to the first color's image (if it exists)
        if (firstVariant.image_url) {
          setActiveImage(firstVariant.image_url);
        }
      } else {
        setSelectedColour("");
      }
    }
  }, [selectedProduct]);

  const handleColourChange = (variant: any) => {
    setSelectedColour(variant.colour);

    // 1. Reset quantity to 1 so they don't accidentally add too many of the new colour
    setQuantity(1);

    // 2. Update the image
    if (variant.image_url) {
      setActiveImage(variant.image_url);
    }
  };
  const getCurrentPrice = () => {
    if (!selectedProduct?.size_variants) return selectedProduct?.price || 0;

    // Look through the array for the object matching the size
    const variant = selectedProduct.size_variants.find(
      (v: any) => v.size === selectedSize,
    );

    return variant ? variant.price : selectedProduct.price;
  };

  useEffect(() => {
    async function getProducts() {
      const { data, error } = await supabase.from("products").select("*");
      if (error) console.error("Error:", error);
      if (data) setProducts(data);
    }
    getProducts();
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Reset quantity to 1 whenever the color OR the product changes
    // Reset quantity to 1 whenever the color OR the product changes

    // Cleanup to ensure scroll is restored if the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* FLOATING CART TROLLEY */}
      <Link href="/basket">
        {/* The Parent Container */}
        <div className="fixed top-[30px] right-[30px] z-[9999] cursor-pointer group">
          {/* The Trolley Button */}
          <div className="relative flex items-center justify-center bg-white border border-[rgba(255,133,162,0.2)] w-[56px] h-[56px] rounded-full shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
            {/* The Icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5c4d4d"
              strokeWidth="2"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>

            {/* THE BADGE (Must be absolute) */}
            {cart.length > 0 && (
              <span key={cart.length} className="cart-badge-sticky">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* --- FLOATING TOGGLE BUTTON --- */}
      {/* --- SIDEBAR TOGGLE (ADD THIS) --- */}
      {/* --- SIDEBAR TOGGLE BUTTON --- */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        style={{
          position: "fixed",
          top: "30px",
          left: "30px",
          zIndex: 9999,
          width: "56px",
          height: "56px",
          backgroundColor: "white",
          borderRadius: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "5px",
          border: "1px solid rgba(255, 133, 162, 0.2)", // Light pink border
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          cursor: "pointer",
        }}
        aria-label="Open Menu"
      >
        <span
          style={{
            display: "block",
            width: "24px",
            height: "2px",
            backgroundColor: "#5c4d4d",
            borderRadius: "2px",
          }}
        ></span>
        <span
          style={{
            display: "block",
            width: "16px",
            height: "2px",
            backgroundColor: "#5c4d4d",
            borderRadius: "2px",
          }}
        ></span>
        <span
          style={{
            display: "block",
            width: "24px",
            height: "2px",
            backgroundColor: "#5c4d4d",
            borderRadius: "2px",
          }}
        ></span>
      </button>

      {/* --- SIDEBAR DRAWER --- */}

      <div
        className={`sidebar-overlay ${isSidebarOpen ? "overlay-visible" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <div
        className={`sidebar-drawer ${isSidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}
      >
        <div className="p-10 h-full flex flex-col">
          <div className="flex justify-between items-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30"></span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="close-btn-sidebar text-2xl font-light"
            >
              ✕
            </button>
          </div>
          <nav className="space-y-10">
            <div className="group">
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-30 mb-6">
                Store
              </p>
              <ul className="space-y-6">
                <li>
                  <a href="/allcreations" className="sidebar-link">
                    All Creations
                  </a>
                </li>
                <li>
                  <a href="/plushies" className="sidebar-link">
                    Plushies
                  </a>
                </li>
                <li>
                  <a href="/essentials" className="sidebar-link">
                    Essentials
                  </a>
                </li>
                <li>
                  <a href="/accessories" className="sidebar-link">
                    Accessories
                  </a>
                </li>
              </ul>
            </div>
            <div className="group pt-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#ff85a2] font-bold mb-6">
                Learning
              </p>
              <ul className="space-y-6">
                <li>
                  <a
                    href="/masterclass"
                    className="sidebar-link font-clicker text-2xl !text-[#ff85a2]"
                  >
                    Lahore Masterclass
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <div className="mt-auto border-t border-gray-100 pt-8">
            <p className="text-[10px] leading-relaxed opacity-30">
              Hand-stitched in Lahore.
              <br />© 2026 The Crochet Chapter
            </p>
          </div>
        </div>
      </div>

      {/* YOUR ORIGINAL CODE STARTS HERE - UNCHANGED */}
      <div className="bubble-1"></div>
      <div className="bubble-2"></div>
      <div className="bubble-3"></div>

      <nav className="navbar pt-20 flex justify-center"></nav>

      <header className="hero">
        <div className="hero-content">
          <p className="subtitle">Est. 2026 — Boutique Crochet Studio</p>
          <div className="logo-container">
            {/* Wrap the logo in a Link to go back home */}
            <Link href="/" className="logo-link group">
              <div className="logo transition-transform duration-500 group-hover:scale-105">
                The Crochet Chapter
              </div>
            </Link>
          </div>
          <h1>
            All <span className="italic">Creations</span>
          </h1>
          <div className="hero-divider"></div>
          <p className="hero-description">
            Discover our collection of crafted creations, designed to bring a
            little magic into your everyday life.
          </p>
        </div>
      </header>

      <div className="container relative z-10">
        <section className="product-grid">
          {products?.map((product) => (
            <div
              className="card"
              key={product.id}
              onClick={() => setSelectedProduct(product)}
            >
              {product.image_url && (
                <div className="product-image-container">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="image-overlay">View Details</div>
                </div>
              )}

              <div className="card-content">
                <div className="flex justify-between items-start mb-2">
                  <p className="days">Creation Time: {product.days}</p>
                  <span className="price-tag">Rs. {product.price}</span>
                </div>

                <h3 className="product-name">{product.name}</h3>

                <div className="tags">
                  <span
                    className={product.in_stock ? "tag-stock" : "tag-order"}
                  >
                    {product.in_stock ? "Ready to Ship" : "Made to Order"}
                  </span>
                  {product.material && (
                    <span className="tag-material">{product.material}</span>
                  )}
                </div>

                <div className="price-row-modern">
                  <span className="learn-more">Tap to explore →</span>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div
            className="modal-content-modern"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn-modern"
              onClick={() => setSelectedProduct(null)}
            >
              ✕
            </button>
            <div className="modal-body">
              {/* IMAGE SIDE */}
              <div
                className="modal-image-wrapper relative overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={activeImage}
                  alt={selectedProduct.name}
                  className="transition-all duration-500"
                />
              </div>
              {/* TEXT SIDE */}
              <div className="modal-text-wrapper">
                <p className="brand-muted">{selectedProduct.category}</p>
                <h2 className="modal-title-swirly">{selectedProduct.name}</h2>
                <p className="description-text">
                  {selectedProduct.description}
                </p>

                {/* SIZE SELECTOR */}
                {selectedProduct.size_variants && (
                  <div className="size-selector-container mt-6">
                    <p className="label text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 mb-3">
                      Select Size
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {selectedProduct.size_variants.map((variant: any) => (
                        <button
                          key={variant.size}
                          onClick={() => {
                            setSelectedSize(variant.size);
                            setQuantity(1); // <--- Add this line here!
                          }}
                          className={`size-pill-aesthetic ${selectedSize === variant.size ? "active" : ""}`}
                        >
                          {variant.size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* COLOUR SELECTOR */}
                {selectedProduct.colour_variants && (
                  <div className="colour-selector-container mt-6">
                    <p className="label text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 mb-3">
                      Select Colour
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {selectedProduct.colour_variants.map((variant: any) => (
                        <button
                          key={variant.colour}
                          /* Changed this line to use handleColourChange */
                          onClick={() => handleColourChange(variant)}
                          className={`colour-pill-aesthetic ${selectedColour === variant.colour ? "active" : ""}`}
                        >
                          {variant.colour}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="quantity-wrapper">
                  <p className="label text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 mb-3">
                    Quantity
                  </p>
                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      type="button"
                    >
                      <span className="minus-icon"></span>
                    </button>

                    <span className="qty-number">{quantity}</span>

                    <button
                      className="qty-btn"
                      onClick={() => setQuantity(quantity + 1)}
                      type="button"
                    >
                      <span className="plus-icon"></span>
                    </button>
                  </div>
                </div>
                {/* ACTION AREA */}
                <div className="modal-action">
                  <div className="price-stack">
                    <div className="label">Total Investment</div>
                    <span className="amount">Rs. {getCurrentPrice()}</span>
                  </div>

                  <button className="add-to-cart-premium" onClick={addToCart}>
                    <div className="btn-content">
                      <span className="btn-text">Add to Basket</span>
                    </div>
                    <div className="btn-hover-effect"></div>
                  </button>
                </div>
              </div>{" "}
              {/* End modal-text-wrapper */}
            </div>{" "}
            {/* End modal-body */}
          </div>{" "}
          {/* End modal-content-modern */}
        </div>
      )}
      {/* CART SIDEBAR */}
      <div
        className={`sidebar-overlay ${isCartOpen ? "overlay-visible" : ""}`}
        onClick={() => setIsCartOpen(false)}
      />
      <div
        className={`sidebar-drawer ${isCartOpen ? "sidebar-right-visible" : "sidebar-right-hidden"}`}
      >
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-clicker text-[#ff85a2]">Your Basket</h2>
            <button onClick={() => setIsCartOpen(false)}>✕</button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 invisible-scrollbar">
            {cart.length === 0 ? (
              <p className="text-center opacity-40 mt-20">
                Your basket is empty...
              </p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartId}
                  className="flex gap-4 border-b border-gray-50 pb-6 items-center"
                >
                  {/* The specific color image will show here! */}
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover rounded-2xl shadow-sm"
                    />
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-gray-300 hover:text-red-400 transition-colors text-lg"
                  >
                    ×
                  </button>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#5c4d4d] text-sm mb-1">
                      {item.name}
                    </h4>

                    {/* Visual Badge for Color and Size */}
                    <div className="flex gap-2">
                      <span className="text-[9px] bg-[#fdf2f2] px-2 py-1 rounded-md text-[#ff85a2] font-bold uppercase tracking-wider">
                        {item.colour}
                      </span>
                      <span className="text-[9px] bg-gray-100 px-2 py-1 rounded-md text-gray-500 font-bold uppercase tracking-wider">
                        {item.size}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <p className="text-xs font-bold text-[#5c4d4d]">
                        Rs. {item.price * item.quantity}
                      </p>

                      {/* Simple quantity display for the specific variant */}
                      <div className="text-[10px] font-medium text-gray-400">
                        Qty:{" "}
                        <span className="text-[#5c4d4d]">{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="mt-auto pt-6 border-t border-gray-100">
              <div className="flex justify-between mb-4">
                <span className="font-bold">Total</span>
                <span className="font-bold">
                  Rs.{" "}
                  {cart.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0,
                  )}
                </span>
              </div>
              <button className="addtocart w-full">
                Checkout via WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
