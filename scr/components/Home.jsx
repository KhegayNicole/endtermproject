import { Link } from 'react-router-dom'
import './Home.css'

export function Home() {
  return (
    <div className="home-container">
      <div className="home-hero">
        <h1 className="home-title">Welcomel to EVRTHG store
        </h1>
        <p className="home-description">
          Discover amazing products from our curated collection. Browse through hundreds of items,
          search for what you need, and explore detailed information about each product.
        </p>
        <div className="home-actions">
          <Link to="/items" className="home-btn primary">
            Browse Products
          </Link>
          <Link to="/about" className="home-btn secondary">
            Learn More
          </Link>
        </div>
      </div>

      <div className="home-image-section">
        <img 
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop" 
          alt="Shopping experience" 
          className="home-image"
        />
        <div className="home-features">
          <div className="feature">
            <h3>🔍 Smart Search</h3>
            <p>Find products quickly with our powerful search</p>
          </div>
          <div className="feature">
            <h3>📦 Wide Selection</h3>
            <p>Browse through hundreds of quality products</p>
          </div>
          <div className="feature">
            <h3>ℹ️ Detailed Info</h3>
            <p>Get comprehensive details about each item</p>
          </div>
        </div>
      </div>
    </div>
  )
}

