import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItemById, clearSelectedItem } from '../features/items/itemsSlice.js'
import { useFavorites } from '../hooks/useFavorites.js'
import { useAuth } from '../hooks/useAuth.js'
import { Spinner } from './Spinner.jsx'
import { ErrorBox } from './ErrorBox.jsx'
import './SomethingDetails.css'

export function SomethingDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { selectedItem, loadingItem, errorItem } = useSelector((state) => state.items)
  const { user } = useAuth()
  const { isFavorite, toggle } = useFavorites()

  useEffect(() => {
    if (id) {
      dispatch(fetchItemById(id))
    }
    
    return () => {
      dispatch(clearSelectedItem())
    }
  }, [dispatch, id])

  if (loadingItem) {
    return <Spinner />
  }

  if (errorItem) {
    return (
      <div className="details-container">
        <ErrorBox error={errorItem} onRetry={() => dispatch(fetchItemById(id))} />
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    )
  }

  if (!selectedItem) {
    return (
      <div className="details-container">
        <div className="not-found">
          <h2>Item not found</h2>
          <p>The item you're looking for doesn't exist.</p>
        </div>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    )
  }

  return (
    <div className="details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <article className="item-details">
        <div className="details-header">
          <h1 className="item-title">{selectedItem.title}</h1>
          {user && (
            <button
              type="button"
              className={isFavorite(selectedItem.id) ? 'fav-btn active' : 'fav-btn'}
              onClick={() => {
                console.log('[favorites] Toggling favorite for item:', selectedItem.id, 'user:', user.uid)
                toggle(selectedItem.id)
              }}
            >
              {isFavorite(selectedItem.id) ? '♥' : '♡'}
            </button>
          )}
        </div>
        {selectedItem.images && selectedItem.images.length > 0 && (
          <div className="item-images">
            <img src={selectedItem.images[0]} alt={selectedItem.title} className="item-main-image" />
            {selectedItem.images.length > 1 && (
              <div className="item-thumbnails">
                {selectedItem.images.slice(1, 4).map((img, idx) => (
                  <img key={idx} src={img} alt={`${selectedItem.title} ${idx + 2}`} className="item-thumbnail" />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="item-info">
          <h1 className="item-title">{selectedItem.title}</h1>
          
          <div className="item-details-grid">
            <div className="detail-item">
              <span className="detail-label">Brand:</span>
              <span className="detail-value">{selectedItem.brand || 'N/A'}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Category:</span>
              <span className="detail-value">{selectedItem.category || 'N/A'}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Price:</span>
              <span className="detail-value price">${selectedItem.price || 'N/A'}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Discount:</span>
              <span className="detail-value">{selectedItem.discountPercentage ? `${selectedItem.discountPercentage}%` : 'N/A'}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Rating:</span>
              <span className="detail-value rating">
                {selectedItem.rating ? `⭐ ${selectedItem.rating}` : 'N/A'}
              </span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Stock:</span>
              <span className="detail-value">{selectedItem.stock !== undefined ? selectedItem.stock : 'N/A'}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">SKU:</span>
              <span className="detail-value">{selectedItem.sku || 'N/A'}</span>
            </div>
          </div>

          <div className="item-description-section">
            <h2>Description</h2>
            <p className="item-description">{selectedItem.description || 'No description available.'}</p>
          </div>
        </div>
      </article>
    </div>
  )
}

