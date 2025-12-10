import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { favoritesService } from '../../services/favoritesService.js'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  mergeMessage: null,
}

export const loadFavorites = createAsyncThunk(
  'favorites/load',
  async (userId = null, { rejectWithValue }) => {
    try {
      if (userId) {
        const remote = await favoritesService.fetchUserFavorites(userId)
        favoritesService.saveLocalFavorites(remote)
        return remote
      }
      return favoritesService.getLocalFavorites()
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load favorites')
    }
  },
)

export const toggleFavorite = createAsyncThunk(
  'favorites/toggle',
  async ({ itemId }, { getState, rejectWithValue }) => {
    const state = getState()
    const userId = state.auth.user?.uid
    
    // Only allow favorites for authenticated users
    if (!userId) {
      return rejectWithValue('You must be logged in to add favorites')
    }
    
    const current = state.favorites.items
    const exists = current.includes(itemId)
    const next = exists ? current.filter((id) => id !== itemId) : [...current, itemId]

    // Always update local state immediately for better UX
    favoritesService.saveLocalFavorites(next)

    try {
      await favoritesService.saveUserFavorites(userId, next)
      return next
    } catch (error) {
      // If offline or network error, still return success since we saved locally
      if (
        error.code === 'unavailable' ||
        error.code === 'failed-precondition' ||
        error.message?.includes('offline') ||
        error.message?.includes('network')
      ) {
        // State already saved locally, return success
        return next
      }
      // For other errors, still return the updated state but log the error
      console.warn('[favorites] Failed to sync with server:', error)
      return next
    }
  },
)

export const mergeFavoritesOnLogin = createAsyncThunk(
  'favorites/mergeOnLogin',
  async (userId, { rejectWithValue }) => {
    if (!userId) return { merged: [], hadLocal: false }
    try {
      return favoritesService.mergeLocalWithRemote(userId)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to merge favorites')
    }
  },
)

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearMergeMessage(state) {
      state.mergeMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })

      .addCase(toggleFavorite.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        state.error = null
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        // Even if rejected (e.g., not logged in), don't block the UI
        // The error message will be shown but state won't be stuck
        state.status = 'idle'
        state.error = action.payload
      })

      .addCase(mergeFavoritesOnLogin.fulfilled, (state, action) => {
        state.items = action.payload.merged
        state.mergeMessage = action.payload.hadLocal
          ? 'Your local favorites were merged with your account.'
          : null
      })
  },
})

export const { clearMergeMessage } = favoritesSlice.actions
export default favoritesSlice.reducer

