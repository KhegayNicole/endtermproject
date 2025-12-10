import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authService } from '../../services/authService.js'
import { favoritesService } from '../../services/favoritesService.js'
import { mergeFavoritesOnLogin } from '../favorites/favoritesSlice.js'

const initialState = {
  user: null,
  status: 'loading',
  error: null,
  mergeNotice: null,
}

export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({ email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords must match.')
      }
      const user = await authService.signup(email, password)
      return user
    } catch (error) {
      return rejectWithValue(error.message || 'Signup failed')
    }
  },
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const user = await authService.login(email, password)
      return user
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed')
    }
  },
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authService.logout()
})

export const mergeFavoritesAfterAuth = createAsyncThunk(
  'auth/mergeFavoritesAfterAuth',
  async (userId) => {
    if (!userId) return { merged: [], hadLocal: false }
    return favoritesService.mergeLocalWithRemote(userId)
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload
      state.status = 'idle'
      state.error = null
    },
    clearMergeNotice(state) {
      state.mergeNotice = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })

      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })

      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'idle'
        state.user = null
      })

      .addCase(mergeFavoritesAfterAuth.fulfilled, (state, action) => {
        if (action.payload.hadLocal) {
          state.mergeNotice = 'Your local favorites were merged with your account.'
        }
      })
  },
})

export const { setUser, clearMergeNotice } = authSlice.actions
export default authSlice.reducer

export function initAuthListener(store) {
  return authService.onAuthChange((user) => {
    store.dispatch(setUser(user))
    if (user?.uid) {
      store.dispatch(mergeFavoritesOnLogin(user.uid))
    }
  })
}

