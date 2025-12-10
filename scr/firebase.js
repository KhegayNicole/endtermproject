import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyA4nclg7gSO4kGvcTcGj5HBzfcPgxyRFXY',
  authDomain: 'evrthng-store.firebaseapp.com',
  projectId: 'evrthng-store',
  storageBucket: 'evrthng-store.firebasestorage.app',
  messagingSenderId: '516510635542',
  appId: '1:516510635542:web:a4f6b01b78f128bde44737',
  measurementId: 'G-RLV1FGG99P',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
let analyticsInstance = null

// Enable offline persistence for Firestore
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('[Firestore] Multiple tabs open, persistence can only be enabled in one tab at a time.')
    } else if (err.code === 'unimplemented') {
      console.warn('[Firestore] The current browser does not support persistence.')
    } else {
      console.warn('[Firestore] Failed to enable persistence:', err)
    }
  })
}

export async function initAnalytics() {
  if (analyticsInstance !== null) return analyticsInstance
  try {
    const supported = await isSupported()
    analyticsInstance = supported ? getAnalytics(app) : null
  } catch {
    analyticsInstance = null
  }
  return analyticsInstance
}

