import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites.js'
import { useAuth } from '../hooks/useAuth.js'
import './SomethingCard.css'

export function SomethingCard({ item }) {
  const { user } = useAuth()
  const { isFavorite, toggle } = useFavorites()
  const fav = isFavorite(item.id)

  const handleToggle = (event) => {
    event.preventDefault()
    if (!user) {
      console.warn('[favorites] User not authenticated')
      return
    }
    console.log('[favorites] Toggling favorite for item:', item.id, 'user:', user.uid)
    toggle(item.id)
  }

  return (
    <Link to={`/items/${item.id}`} className="item-card-link">
      <article className="item-card">
        {user && (
          <button
            type="button"
            className={fav ? 'fav-btn active' : 'fav-btn'}
            onClick={handleToggle}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          >
            {fav ? '♥' : '♡'}
          </button>
        )}
        {item.thumbnail && (
          <img src={item.thumbnail} alt={item.title} className="item-thumbnail" />
        )}
        <h3 className="item-title">{item.title}</h3>
        <div className="item-meta">
          {item.brand && <span className="item-brand">{item.brand}</span>}
          {item.price && <span className="item-price">${item.price}</span>}
        </div>
        <p className="item-description">{item.description || 'No description available'}</p>
      </article>
    </Link>
  )
}



