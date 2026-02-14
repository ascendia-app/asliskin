'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Masterclass() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
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
      {/* --- FORCED 2-COLUMN WRAPPER --- */}
      <div className="mc-at-split-flex-container">
        
        {/* LEFT COLUMN */}
        <div className="mc-at-col-left">
           <div className="mc-at-grain-texture"></div>
           <div className="mc-at-content-inner">
              <p className="mc-at-small-caps font-clicker">The Crochet Chapter</p>
              <h1 className="mc-at-hero-heading font-clicker">Lahore<br/>Masterclass</h1>
              
              <div className="mc-at-polaroid">
                 <div className="mc-at-photo-box">
                    <img src="images/masterclass.jpg" alt="Workshop" />
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="mc-at-col-right">
           <div className="mc-at-info-wrapper">
              <h2 className="mc-at-sec-title">The Art of the Hook</h2>
              <p className="mc-at-para">
                A creative sanctuary in Lahore. Learn the basic, intermediate and advanced 
                mechanics of crochet in a cosy setting.
              </p>

              <div className="mc-at-list">
                 <div className="mc-at-item">
                    <span className="mc-at-num">♡</span>
                    <div>
                       <h4 className="mc-at-label">Materials</h4>
                       <p className="mc-at-subtext">Premimum quality yarn, curated hooks, buttons, and more!</p>
                    </div>
                 </div>
                 <div className="mc-at-item">
                    <span className="mc-at-num">♡</span>
                    <div>
                       <h4 className="mc-at-label">Technique</h4>
                       <p className="mc-at-subtext">Tailored methods to suit your learning style with guided direction.</p>
                    </div>
                 </div>
              </div>

              <div className="mc-at-card">
                 <div className="mc-at-card-top">
                    <span>Enrollment</span>
                    <span className="mc-at-tag">June 2026</span>
                 </div>
                 <a href="https://wa.me/923370009993" className="mc-at-btn">Reserve Seat</a>
              </div>
           </div>
        </div>

      </div>

      {/* --- UNIQUE CSS WITHOUT CONFLICTS --- */}
      <style jsx global>{`
        .font-clicker { font-family: 'Clicker Script', cursive !important; }

        /* The core fix: forcing side-by-side regardless of tailwind settings */
        .mc-at-split-flex-container {
           display: flex;
           flex-direction: row; /* FORCES COLUMNS */
           min-height: 100vh;
           width: 100%;
        }

        .mc-at-col-left {
           width: 50%;
           background-color: #fdf2f2;
           display: flex;
           align-items: center;
           justify-content: center;
           position: relative;
           padding: 40px;
        }

        .mc-at-col-right {
           width: 50%;
           background-color: white;
           display: flex;
           align-items: center;
           justify-content: center;
           padding: 40px;
        }

        /* Mobile fallback for very small screens if desired */
        @media (max-width: 768px) {
           .mc-at-split-flex-container { flex-direction: column; }
           .mc-at-col-left, .mc-at-col-right { width: 100%; }
        }

        .mc-at-grain-texture {
           position: absolute;
           inset: 0;
           opacity: 0.2;
           background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .mc-at-small-caps { font-size: 40px; color: #ff85a2; margin-left:15px; }
        .mc-at-hero-heading { font-size: 6rem; color: #5c4d4d; line-height: 0.8; margin-bottom: 40px; }
        
        .mc-at-polaroid {
           background: white;
           padding: 15px 15px 40px 15px;
           box-shadow: 0 20px 50px rgba(0,0,0,0.05);
           transform: rotate(-3deg);
           width: 320px;
        }

        .mc-at-photo-box { aspect-ratio: 1; background: #eee; margin-bottom: 20px; overflow: hidden; }
        .mc-at-photo-box img { width: 100%; height: 100%; object-cover: cover; }

        .mc-at-info-wrapper { max-w-md: 400px; width: 100%; }
        .mc-at-sec-title { font-size: 3rem; font-weight: bold; color: #5c4d4d; margin-bottom: 20px; letter-spacing: -0.02em; }
        .mc-at-para { color: rgba(92, 77, 77, 0.6); line-height: 1.6; margin-bottom: 40px; }

        .mc-at-list { margin-bottom: 50px; }
        .mc-at-item { display: flex; gap: 20px; margin-bottom: 30px; }
        .mc-at-num { color: #ff85a2; font-weight: bold; font-size: 1.2rem; }
        .mc-at-label { font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.2em; color: #5c4d4d; }
        .mc-at-subtext { font-size: 14px; color: rgba(92, 77, 77, 0.4); }

        .mc-at-card {
           padding: 40px;
           background: #fffafa;
           border-radius: 40px;
           background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='40' ry='40' stroke='%23FF85A2' stroke-width='2' stroke-dasharray='10%2c 15'/%3e%3c/svg%3e");
        }
        .mc-at-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(92, 77, 77, 0.3); }
        .mc-at-tag { background: white; color: #ff85a2; padding: 5px 15px; border-radius: 20px; }
        
        .mc-at-btn {
           display: block; width: 100%; padding: 10px; background: #5c4d4d; color: white; 
           text-align: center; border-radius: 50px; font-weight: bold; font-size: 11px; 
           text-transform: uppercase; letter-spacing: 0.3em; transition: 0.4s;
        }
        .mc-at-btn:hover { background: #ff85a2; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,133,162,0.2); }
      `}</style>
    </main>
  );
}