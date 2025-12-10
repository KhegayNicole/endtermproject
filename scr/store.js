import { configureStore } from '@reduxjs/toolkit'
import itemsReducer from './features/items/itemsSlice.js'
import authReducer from './features/auth/authSlice.js'
import favoritesReducer from './features/favorites/favoritesSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    favorites: favoritesReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})

