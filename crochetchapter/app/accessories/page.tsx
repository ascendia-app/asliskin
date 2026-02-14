'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Added for toggle

  useEffect(() => {
    async function getProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) console.error('Error:', error);
      if (data) setProducts(data);
    }
    getProducts();
  }, []);

  useEffect(() => {
  if (isSidebarOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }

  // Cleanup to ensure scroll is restored if the component unmounts
  return () => {
    document.body.style.overflow = 'unset';
  };
}, [isSidebarOpen]);
  return (
    <main className="relative min-h-screen overflow-x-hidden">

      {/* --- FLOATING TOGGLE BUTTON --- */}
     {/* --- SIDEBAR TOGGLE (ADD THIS) --- */}
{/* --- SIDEBAR TOGGLE BUTTON --- */}
<button 
  onClick={() => setIsSidebarOpen(true)}
  style={{
    position: 'fixed',
    top: '30px',
    left: '30px',
    zIndex: 9999,
    width: '56px',
    height: '56px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    border: '1px solid rgba(255, 133, 162, 0.2)', // Light pink border
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    cursor: 'pointer',
  }}
  aria-label="Open Menu"
>
  <span style={{ display: 'block', width: '24px', height: '2px', backgroundColor: '#5c4d4d', borderRadius: '2px' }}></span>
  <span style={{ display: 'block', width: '16px', height: '2px', backgroundColor: '#5c4d4d', borderRadius: '2px' }}></span>
  <span style={{ display: 'block', width: '24px', height: '2px', backgroundColor: '#5c4d4d', borderRadius: '2px' }}></span>
</button>

      {/* --- SIDEBAR DRAWER --- */}

      <div className={`sidebar-overlay ${isSidebarOpen ? 'overlay-visible' : ''}`} onClick={() => setIsSidebarOpen(false)} />
      <div className={`sidebar-drawer ${isSidebarOpen ? 'sidebar-visible' : 'sidebar-hidden'}`}>
        <div className="p-10 h-full flex flex-col">
          <div className="flex justify-between items-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30"></span>
            <button onClick={() => setIsSidebarOpen(false)} className="close-btn-sidebar text-2xl font-light">
              
      ✕</button>
          </div>
          <nav className="space-y-10">
            <div className="group">
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-30 mb-6">Store</p>
              <ul className="space-y-6">
                <li><a href="/allcreations" className="sidebar-link">All Creations</a></li>
                <li><a href="/plushies" className="sidebar-link">Plushies</a></li>
                <li><a href="/essentials" className="sidebar-link">Essentials</a></li>
                 <li><a href="/accessories" className="sidebar-link">Accessories</a></li>
              </ul>
            </div>
            <div className="group pt-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#ff85a2] font-bold mb-6">Learning</p>
              <ul className="space-y-6">
                <li><a href="/masterclass" className="sidebar-link font-clicker text-2xl !text-[#ff85a2]">Lahore Masterclass</a></li>
              </ul>
            </div>
          </nav>
          <div className="mt-auto border-t border-gray-100 pt-8">
            <p className="text-[10px] leading-relaxed opacity-30">Hand-stitched in Lahore.<br/>© 2026 The Crochet Chapter</p>
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
          <h1><span>Accessories</span></h1>
          <div className="hero-divider"></div>
          <p className="hero-description">
            Add some extra flair to your already beautiful existence with<br></br>The Crochet Chapter's cute accessories.
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
                  <img src={product.image_url} alt={product.name} className="product-image" />
                  <div className="image-overlay">View Details</div>
                </div>
              )}
              
              <div className="card-content">
                <div className="flex justify-between items-start mb-2">
                  <p className="brand">{product.category || 'Handmade'}</p>
                  <span className="price-tag">Rs. {product.price}</span>
                </div>
                
                <h3 className="product-name">{product.name}</h3>
                
                <div className="tags">
                  <span className={product.in_stock ? "tag-stock" : "tag-order"}>
                    {product.in_stock ? "Ready to Ship" : "Made to Order"}
                  </span>
                  {product.material && <span className="tag-material">{product.material}</span>}
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
          <div className="modal-content-modern" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn-modern" onClick={() => setSelectedProduct(null)}>✕</button>
            <div className="modal-body">
              <div className="modal-image-wrapper">
                <img src={selectedProduct.image_url} alt={selectedProduct.name} />
              </div>
              <div className="modal-text-wrapper">
                <p className="brand-muted">{selectedProduct.category}</p>
                <h2 className="modal-title-swirly">{selectedProduct.name}</h2>
                <div className="modal-tags">
                  <span className={selectedProduct.in_stock ? "tag-stock" : "tag-order"}>
                    {selectedProduct.in_stock ? "Ready to Ship" : "Made to Order"}
                  </span>
                </div>
                <div className="details-box">
                  <div className="detail-item">
                    <span>Material:</span>
                    <strong>{selectedProduct.material || "Milk Cotton"}</strong>
                  </div>
                  <div className="detail-item">
                    <span>Size:</span>
                    <strong>{selectedProduct.size || "Standard"}</strong>
                  </div>
                </div>
                <p className="description-text">{selectedProduct.description}</p>
                <div className="care-instructions-card">
                  <p><strong>Care:</strong> {selectedProduct.care_instructions || "Hand wash gently with cold water and air dry."}</p>
                </div>
                <div className="modal-action">
                  <div className="price-stack">
                    <span className="label">Investment</span>
                    <span className="amount">Rs. {selectedProduct.price}</span>
                  </div>
                  <a href={`https://wa.me/YOURNUMBER?text=Hi! I am interested in ${selectedProduct.name}`} target="_blank" className="whatsapp-button">
                    Secure via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}