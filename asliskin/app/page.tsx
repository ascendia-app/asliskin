'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    async function getProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) console.error('Error:', error);
      if (data) setProducts(data);
    }
    getProducts();
  }, []);

  return (
    <main>
      <nav className="navbar">
        <div className="logo">AsliSkin</div>
      </nav>

      <header className="hero">
        <h1>Your skin is a <span className="italic">science</span>.</h1>
        <p>Expert-vetted skincare directory for Pakistan.</p>
      </header>

      <div className="container">
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
                </div>
              )}
              
              <div className="card-content">
                <p className="brand">{product.brand}</p>
                <h3 className="product-name">{product.name}</h3>
                
                {/* Fixed: Use 'product' here for the grid cards */}
     <div className="tags">
  {/* Safety Tag */}
  <span className={product.is_safe ? "tag-safe" : "tag-warning"}>
    {product.is_safe ? "Verified Safe" : "Caution"}
  </span>

  {/* Steroid Tag - Shows exactly what is in the 'steroid_status' column */}
  {product.is_steroid_free && (
    <span className="tag-steroid">
      {product.is_steroid_free}
    </span>
  )}

  {/* Halal Tag - Shows exactly what is in the 'halal_status' column */}
  {product.halal_status && (
    <span className="tag-halal">
      {product.halal_status}
    </span>
  )}
</div>

                <div className="product-details">
                  <p><strong>Skin Type:</strong> {product.skin_type}</p>
                  <p className="actives"><strong>Actives:</strong> {product.key_actives}</p>
                </div>

                <div className="price-row">
                  <span className="price">Rs. {product.price}</span>
                  {product.buy_link && (
                    <a 
                      href={product.buy_link} 
                      target="_blank" 
                      className="btn-buy" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      Buy Now
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* --- THE POPUP (MODAL) --- */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedProduct(null)}>×</button>
            
            <div className="modal-grid">
              <div className="modal-image-side">
                <img src={selectedProduct.image_url} alt={selectedProduct.name} />
              </div>
              
              <div className="modal-info-side">
                <p className="brand-muted">{selectedProduct.brand}</p>
                <h2>{selectedProduct.name}</h2>
                
                {/* Fixed: Use 'selectedProduct' here for the Modal */}
                <div className="modal-tags">
                  <span className={selectedProduct.is_safe ? "tag-safe" : "tag-warning"}>
                    {selectedProduct.is_safe ? "Verified Safe" : "Caution"}
                  </span>
                  {selectedProduct.is_steroid_free && (
                    <span className="tag-safe">Steroid Free</span>
                  )}
                  {selectedProduct.halal_status && (
                    <span className="tag-halal">Halal: {selectedProduct.halal_status}</span>
                  )}
                </div>

                <div className="full-details">
                  <p><strong>Skin Type:</strong> {selectedProduct.skin_type}</p>
                  <hr />
                  <p><strong>Key Actives:</strong> {selectedProduct.key_actives}</p>
                  <div className="ingredients-text">
                    <strong>Ingredients:</strong> {selectedProduct.ingredients}
                  </div>
                  <hr />
                  <div className="safety-notes-box">
                    <strong>Safety Notes:</strong>
                    <p>{selectedProduct.safety_notes || "No specific warnings."}</p>
                  </div>
                </div>

                <div className="modal-footer">
                  <span className="modal-price">Rs. {selectedProduct.price}</span>
                  <a href={selectedProduct.buy_link} target="_blank" className="btn-buy-large">
                    Purchase Online
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