import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

const LOCAL_KEY = 'evrthng_favorites'

function getLocalFavorites() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.warn('[favorites] Failed to read local favorites', err)
    return []
  }
}

function saveLocalFavorites(ids) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(ids))
  } catch (err) {
    console.warn('[favorites] Failed to save local favorites', err)
  }
}

export const favoritesService = {
  getLocalFavorites,
  saveLocalFavorites,

  async fetchUserFavorites(uid) {
    try {
      const snap = await getDoc(doc(db, 'favorites', uid))
      if (!snap.exists()) return []
      const data = snap.data()
      return Array.isArray(data.items) ? data.items : []
    } catch (error) {
      // If offline, return local favorites as fallback
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        console.warn('[favorites] Offline, using local favorites', error)
        return getLocalFavorites()
      }
      throw error
    }
  },

  async saveUserFavorites(uid, ids) {
    try {
      await setDoc(
        doc(db, 'favorites', uid),
        { items: Array.from(new Set(ids)) },
        { merge: true },
      )
    } catch (error) {
      // If offline, still save locally but throw error to notify user
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        saveLocalFavorites(ids)
        throw new Error('Offline: Changes saved locally and will sync when online')
      }
      throw error
    }
  },

  async mergeLocalWithRemote(uid) {
    const local = getLocalFavorites()
    const remote = await this.fetchUserFavorites(uid)
    const merged = Array.from(new Set([...remote, ...local]))
    await this.saveUserFavorites(uid, merged)
    // keep local in sync for offline visitors
    saveLocalFavorites(merged)
    return { merged, hadLocal: local.length > 0 }
  },
}

