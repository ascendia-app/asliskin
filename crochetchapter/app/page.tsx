'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  return (
    <main className="relative min-h-screen overflow-x-hidden flex flex-col items-center">
      
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
          border: '1px solid rgba(255, 133, 162, 0.2)',
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
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">Menu</span>
            <button onClick={() => setIsSidebarOpen(false)} className="close-btn-sidebar text-2xl font-light">✕</button>
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

      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="bubble-1"></div>
      <div className="bubble-2"></div>
      <div className="bubble-3"></div>

      {/* --- TOP BRANDING --- */}
      <div className="fixed top-12 left-0 w-full z-40 flex justify-center pointer-events-none">
        <div className="logo pointer-events-auto cursor-default text-3xl md:text-4xl text-[#ff85a2] font-clicker">
          The Crochet Chapter
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6 relative z-10">
        <p className="subtitle mb-4">A Boutique Crochet Studio</p>
        
        <h1 className="flex flex-col">
          <span className="text-mocha opacity-90 text-4xl md:text-6xl font-bold tracking-tight">Made with</span>
          <span className="font-clicker text-7xl md:text-9xl leading-[0.6] text-[#ff85a2] mt-4">
            Love & Yarn
          </span>
        </h1>

        <p className="max-w-md mt-12 opacity-60 leading-relaxed font-medium text-sm tracking-wide">
          Discover handcrafted creations and whimsical <br/>
          designs to bring magic into your everyday life.
        </p>
        
 <button 
  onClick={() => window.location.href = '/allcreations'}
  className="boutique-btn group"
>
  <span className="btn-text">Explore All Creations</span>
  <span className="btn-line"></span>
  <span className="btn-arrow">→</span>
</button>
      </section>
    </main>
  );
}