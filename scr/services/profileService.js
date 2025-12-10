import { doc, getDoc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '../firebase'

const PROFILE_COLLECTION = 'profiles'

export const profileService = {
  async getProfile(uid) {
    const snap = await getDoc(doc(db, PROFILE_COLLECTION, uid))
    if (!snap.exists()) return {}
    return snap.data()
  },

  async saveProfile(uid, data) {
    await setDoc(doc(db, PROFILE_COLLECTION, uid), data, { merge: true })
  },

  async uploadProfilePhoto(uid, blob, filename = 'avatar.jpg') {
    const storageRef = ref(storage, `${PROFILE_COLLECTION}/${uid}/${filename}`)
    const uploadResult = await uploadBytes(storageRef, blob, {
      contentType: blob.type || 'image/jpeg',
    })
    const url = await getDownloadURL(uploadResult.ref)
    await this.saveProfile(uid, { photoURL: url, updatedAt: Date.now() })
    return url
  },
}

