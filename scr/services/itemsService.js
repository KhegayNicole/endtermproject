const API_BASE = 'https://dummyjson.com/products'

function buildListUrl({ query, limit, skip, category }) {
  if (query) {
    return `${API_BASE}/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
  }
  if (category) {
    return `${API_BASE}/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
  }
  return `${API_BASE}?limit=${limit}&skip=${skip}`
}

export const itemsService = {
  /**
   * @param {{query?: string, limit?: number, skip?: number, category?: string, signal?: AbortSignal}} params
   */
  async getAll({ query = '', limit = 10, skip = 0, category, signal } = {}) {
    const url = buildListUrl({ query, limit, skip, category })
    const res = await fetch(url, { signal })
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`)
    }
    return res.json()
  },

  /**
   *
   * @param {string|number} id 
   * @returns {Promise<Object>}
   */
  async getById(id, signal) {
    const res = await fetch(`${API_BASE}/${id}`, { signal })
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Product not found')
      }
      throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`)
    }
    return res.json()
  },

  async getCategories(signal) {
    const res = await fetch(`${API_BASE}/categories`, { signal })
    if (!res.ok) {
      throw new Error('Failed to fetch categories')
    }
    return res.json()
  },
}

