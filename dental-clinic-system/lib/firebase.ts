import { getApps, initializeApp, type FirebaseApp } from "firebase/app"
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

export const isFirebaseConfigured = (): boolean =>
  Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  )

export const getFirebaseApp = (): FirebaseApp | null => {
  if (!isFirebaseConfigured()) return null
  return getApps().length === 0 ? initializeApp(firebaseConfig) : (getApps()[0] as FirebaseApp)
}

let analytics: Analytics | null = null
let db: Firestore | null = null
let auth: Auth | null = null

export const getFirebaseAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === "undefined") return null
  if (analytics) return analytics
  const app = getFirebaseApp()
  if (!app) return null
  const supported = await isSupported()
  if (!supported) return null
  analytics = getAnalytics(app)
  return analytics
}

export const getDb = (): Firestore | null => {
  if (typeof window === "undefined") return null
  const app = getFirebaseApp()
  if (!app) return null
  if (!db) db = getFirestore(app)
  return db
}

export const getFirebaseAuth = (): Auth | null => {
  if (typeof window === "undefined") return null
  const app = getFirebaseApp()
  if (!app) return null
  if (!auth) auth = getAuth(app)
  return auth
}

export default getFirebaseApp
