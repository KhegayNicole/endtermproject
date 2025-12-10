import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  loadFavorites,
  toggleFavorite,
  mergeFavoritesOnLogin,
} from '../features/favorites/favoritesSlice.js'

export function useFavorites() {
  const dispatch = useDispatch()
  const favorites = useSelector((state) => state.favorites.items)
  const mergeMessage = useSelector((state) => state.favorites.mergeMessage)
  const status = useSelector((state) => state.favorites.status)
  const error = useSelector((state) => state.favorites.error)

  const initialize = useCallback(
    (userId) => {
      dispatch(loadFavorites(userId ?? null))
    },
    [dispatch],
  )

  const toggle = useCallback(
    (itemId, meta) => {
      dispatch(toggleFavorite({ itemId, meta }))
    },
    [dispatch],
  )

  const mergeOnLogin = useCallback(
    (userId) => {
      dispatch(mergeFavoritesOnLogin(userId))
    },
    [dispatch],
  )

  return {
    favorites,
    status,
    error,
    mergeMessage,
    initialize,
    toggle,
    mergeOnLogin,
    isFavorite: (id) => favorites.includes(id),
  }
}

