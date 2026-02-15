'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Home() {
  
     const [zoomStyle, setZoomStyle] = useState({ display: 'none', top: 0, left: 0, backgroundPosition: '0% 0%' });
const handleMouseMove = (e: React.MouseEvent) => {
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
  
  // Calculate percentage position of mouse inside the image
  const x = ((e.pageX - left - window.scrollX) / width) * 100;
  const y = ((e.pageY - top - window.scrollY) / height) * 100;

  setZoomStyle({
    display: 'block',
    top: e.pageY - top - window.scrollY - 75, // Centers the 150px circle
    left: e.pageX - left - window.scrollX - 75,
    backgroundPosition: `${x}% ${y}%`
  });
};

const handleMouseLeave = () => {
  setZoomStyle({ ...zoomStyle, display: 'none' });
};   
  const [essentials, setEssentials] = useState<any[]>([]);
  const [selectedEssential, setSelectedEssential] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Added for toggle
// Temporary debug line
if (selectedEssential) console.log("MODAL SHOULD BE OPEN FOR:", selectedEssential.name);
  useEffect(() => {
    async function getEssentials() {
      const { data, error } = await supabase.from('essentials').select('*');
      if (error) console.error('Error:', error);
      if (data) setEssentials(data);
    }
    getEssentials();
  }, []);
// Inside your Home() function
const [selectedSize, setSelectedSize] = useState('Small');
const [selectedColour, setSelectedColour] = useState('');

// Add an effect to reset size to Medium whenever a new plushie is opened
useEffect(() => {
  if (selectedEssential) {
    setSelectedSize('Medium');
  }
}, [selectedEssential]);
// 1. Add this state for the active image
const [activeImage, setActiveImage] = useState('');

// 2. Update the useEffect that runs when a plushie is selected
useEffect(() => {
  if (selectedEssential) {
    // 1. Default to the main image first
    setActiveImage(selectedEssential.image_url);
    setSelectedSize('Small');

    // 2. Check if colour_variants exists and has at least one item
    if (selectedEssential.colour_variants && selectedEssential.colour_variants.length > 0) {
      
      // Grab the very first color in the list
      const firstVariant = selectedEssential.colour_variants[0];

      // Set the button to 'active' for the first color
      setSelectedColour(firstVariant.colour);

      // Swap the image to the first color's image (if it exists)
      if (firstVariant.image_url) {
        setActiveImage(firstVariant.image_url);
      }
    } else {
      // Clear color if the plushie doesn't have any variants
      setSelectedColour('');
    }
  }
}, [selectedEssential]);

// 3. Create a handler for when a color is clicked
const handleColourChange = (variant: any) => {
  setSelectedColour(variant.colour);
  if (variant.image_url) {
    setActiveImage(variant.image_url);
  }
};
// Helper to get the price from the database object
const getCurrentPrice = () => {
  if (!selectedEssential?.size_variants) return selectedEssential?.price || 0;
  
  // Look through the array for the object matching the size
  const variant = selectedEssential.size_variants.find(
    (v: any) => v.size === selectedSize
  );
  
  return variant ? variant.price : selectedEssential.price;
};

// 3. Reset to Medium when opening a new plushie
useEffect(() => {
  if (selectedEssential) {
    setSelectedSize('Small');
  }
}, [selectedEssential]);
useEffect(() => {
  // If either sidebar is open OR a plushie is selected, lock scroll
  if (isSidebarOpen || selectedEssential) {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = 'var(--scrollbar-width, 0px)'; // Prevents "layout shift"
  } else {
    document.body.style.overflow = 'unset';
    document.body.style.paddingRight = '0px';
  }

  return () => {
    document.body.style.overflow = 'unset';
    document.body.style.paddingRight = '0px';
  };
}, [isSidebarOpen, selectedEssential]); // Re-run when either state changes
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
          <h1><span>Essentials</span></h1>
          <div className="hero-divider"></div>
           <p className="hero-description">
            Pick and choose from our curated essentials to sparkle up your
             <br></br>
             daily dose of life!
          </p>
        </div>
      </header>

      <div className="container relative z-30">
        <section className="product-grid">
          {essentials?.map((essential) => (
       <div 
  className="card cursor-pointer group" 
  key={essential.id} 
  onClick={(e) => {
    e.stopPropagation(); // Stops the click from getting "lost" in parent layers
    console.log("Card Clicked:", essential.name); // Check your F12 console for this!
    setSelectedEssential(essential);
  }} 
>
              {essential.image_url && (
                <div className="product-image-container">
                  <img src={essential.image_url} alt={essential.name} className="product-image" />
                  <div className="image-overlay">View Details</div>
                </div>
              )}
              
              <div className="card-content">
                <div className="flex justify-between items-start mb-2">
                  <p className="brand">{essential.category || 'Handmade'}</p>
                  <span className="price-tag">Rs. {essential.price}</span>
                </div>
                
                <h3 className="product-name">{essential.name}</h3>
                
                <div className="tags">
                  <span className={essential.in_stock ? "tag-stock" : "tag-order"}>
                    {essential.in_stock ? "Ready to Ship" : "Made to Order"}
                  </span>
                </div>

                <div className="price-row-modern">
                   <span className="learn-more">Tap to explore →</span>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
{selectedEssential && (
  <div className="modal-overlay" onClick={() => setSelectedEssential(null)}>
    <div className="modal-content-modern" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn-modern" onClick={() => setSelectedEssential(null)}>✕</button>
      
      <div className="modal-body">
        {/* IMAGE SIDE */}
        <div 
          className="modal-image-wrapper relative overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
       <img src={activeImage} alt={selectedEssential.name} className="transition-all duration-500" />
        
        </div>

        {/* TEXT SIDE */}
        <div className="modal-text-wrapper">
          <p className="brand-muted">{selectedEssential.category}</p>
          <h2 className="modal-title-swirly">{selectedEssential.name}</h2>
          <p className="description-text">{selectedEssential.description}</p>

          {/* SIZE SELECTOR */}
          {selectedEssential.size_variants && (
            <div className="size-selector-container mt-6">
              <p className="label text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 mb-3">Select Size</p>
              <div className="flex flex-wrap gap-3">
                {selectedEssential.size_variants.map((variant: any) => (
                  <button
                    key={variant.size}
                    onClick={() => setSelectedSize(variant.size)}
                    className={`size-pill-aesthetic ${selectedSize === variant.size ? 'active' : ''}`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* COLOUR SELECTOR */}
          {selectedEssential.colour_variants && (
            <div className="colour-selector-container mt-6">
              <p className="label text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 mb-3">Select Colour</p>
              <div className="flex flex-wrap gap-3">
                {selectedEssential.colour_variants.map((variant: any) => (
        <button
          key={variant.colour}
          /* Changed this line to use handleColourChange */
          onClick={() => handleColourChange(variant)}
          className={`colour-pill-aesthetic ${selectedColour === variant.colour ? 'active' : ''}`}
        >
          {variant.colour}
        </button>
                ))}
              </div>
            </div>
          )}

          {/* ACTION AREA */}
          <div className="modal-action">
            <div className="price-stack">
              <div className="label">Total Investment</div>
              <span className="amount">Rs. {getCurrentPrice()}</span>
            </div>
<button>
              Add to Cart
            </button>
          </div>
        </div> {/* End modal-text-wrapper */}
      </div> {/* End modal-body */}
    </div> {/* End modal-content-modern */}
  </div>
)}


</main>)}