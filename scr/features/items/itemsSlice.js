import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { itemsService } from '../../services/itemsService.js'

// Async thunk for list with search + pagination + category filter
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async ({ query = '', page = 1, pageSize = 10, category = '' } = {}, { rejectWithValue, signal }) => {
    try {
      const skip = (page - 1) * pageSize
      const data = await itemsService.getAll({ query, limit: pageSize, skip, category, signal })
      return {
        products: data.products || [],
        query,
        page,
        pageSize,
        total: data.total || 0,
        category,
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch items')
    }
  }
)

// Async thunk для загрузки одного товара по ID
export const fetchItemById = createAsyncThunk(
  'items/fetchItemById',
  async (id, { rejectWithValue, signal }) => {
    try {
      const data = await itemsService.getById(id, signal)
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch item')
    }
  }
)

export const fetchCategories = createAsyncThunk('items/fetchCategories', async (_, { rejectWithValue, signal }) => {
  try {
    const categories = await itemsService.getCategories(signal)
    return categories
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch categories')
  }
})

const initialState = {
  list: [],
  selectedItem: null,
  loadingList: false,
  loadingItem: false,
  errorList: null,
  errorItem: null,
  query: '',
  page: 1,
  pageSize: 10,
  total: 0,
  category: '',
  categories: [],
}

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    clearSelectedItem: (state) => {
      state.selectedItem = null
      state.errorItem = null
    },
    setPage(state, action) {
      state.page = action.payload
    },
    setPageSize(state, action) {
      state.pageSize = action.payload
    },
    setCategory(state, action) {
      state.category = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loadingList = true
        state.errorList = null
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loadingList = false
        state.list = action.payload.products
        state.query = action.payload.query
        state.page = action.payload.page
        state.pageSize = action.payload.pageSize
        state.total = action.payload.total
        state.category = action.payload.category
        state.errorList = null
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loadingList = false
        state.errorList = action.payload
        state.list = []
      })

      .addCase(fetchItemById.pending, (state) => {
        state.loadingItem = true
        state.errorItem = null
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.loadingItem = false
        state.selectedItem = action.payload
        state.errorItem = null
      })
      .addCase(fetchItemById.rejected, (state, action) => {
        state.loadingItem = false
        state.errorItem = action.payload
        state.selectedItem = null
      })

      .addCase(fetchCategories.fulfilled, (state, action) => {
        const raw = action.payload || []
        state.categories = raw.map((cat) => {
          if (typeof cat === 'string') return cat
          if (cat && typeof cat === 'object') {
            return String(cat.slug ?? cat.name ?? cat.url ?? '')
          }
          return ''
        }).filter(Boolean)
      })
  },
})

export const { clearSelectedItem, setPage, setPageSize, setCategory } = itemsSlice.actions
export default itemsSlice.reducer

