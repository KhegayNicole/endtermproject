import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites.js'
import { itemsService } from '../services/itemsService.js'
import { Spinner } from './Spinner.jsx'
import { ErrorBox } from './ErrorBox.jsx'
import './Favorites.css'

export function Favorites() {
  const { favorites, status, error, toggle } = useFavorites()
  const [details, setDetails] = useState([])
  const [detailsError, setDetailsError] = useState(null)

  useEffect(() => {
    if (!favorites.length) {
      setDetails([])
      return
    }
    let cancelled = false
    setDetailsError(null)

    Promise.all(favorites.map((id) => itemsService.getById(id)))
      .then((items) => {
        if (!cancelled) setDetails(items)
      })
      .catch((err) => !cancelled && setDetailsError(err.message))

    return () => {
      cancelled = true
    }
  }, [favorites])

  const hasFavorites = favorites.length > 0
  const uniqueDetails = useMemo(
    () => Array.from(new Map(details.map((item) => [item.id, item])).values()),
    [details],
  )

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1>Favorites</h1>
        <p>Saved locally for guests, synced to Firestore when logged in.</p>
      </div>

      {status === 'loading' && <Spinner />}
      {error && <ErrorBox error={error} />}
      {detailsError && <ErrorBox error={detailsError} />}

      {!hasFavorites && status !== 'loading' && <p>No favorites yet. Add some from the products list.</p>}

      {hasFavorites && (
        <ul className="favorites-grid">
          {uniqueDetails.map((item) => (
            <li key={item.id} className="favorites-card">
              <Link to={`/items/${item.id}`} className="favorites-link">
                <div className="favorites-thumb">
                  <img src={item.thumbnail} alt={item.title} />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>${item.price}</p>
                </div>
              </Link>
              <button type="button" className="remove-fav" onClick={() => toggle(item.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

