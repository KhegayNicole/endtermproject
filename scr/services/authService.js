import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_\-+=\[{\]};:'",.<>/?]).{8,}$/

function validateEmail(email) {
  if (!emailRegex.test(email)) {
    throw new Error('Please enter a valid email address.')
  }
}

function validatePassword(password) {
  if (!passwordRegex.test(password)) {
    throw new Error('Password must be 8+ chars, include a number and a special character.')
  }
}

function serializeUser(user) {
  if (!user) return null
  return {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    photoURL: user.photoURL ?? null,
    metadata: {
      creationTime: user.metadata?.creationTime ?? null,
      lastSignInTime: user.metadata?.lastSignInTime ?? null,
    },
  }
}

export const authService = {
  validateEmail,
  validatePassword,

  async signup(email, password) {
    validateEmail(email)
    validatePassword(password)
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    return serializeUser(credential.user)
  },

  async login(email, password) {
    validateEmail(email)
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return serializeUser(credential.user)
  },

  async logout() {
    await signOut(auth)
  },

  onAuthChange(callback) {
    return onAuthStateChanged(auth, (firebaseUser) => {
      callback(serializeUser(firebaseUser))
    })
  },
}

