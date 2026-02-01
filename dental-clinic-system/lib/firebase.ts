import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAnalytics, type Analytics, isSupported } from "firebase/analytics"

// Configuração do Firebase (variáveis em .env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Inicializa o Firebase (evita múltiplas inicializações)
const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : (getApps()[0] as FirebaseApp)

// Analytics só funciona no browser (Next.js SSR)
let analytics: Analytics | null = null

export const getFirebaseAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === "undefined") return null
  if (analytics) return analytics
  const supported = await isSupported()
  if (supported) {
    analytics = getAnalytics(app)
    return analytics
  }
  return null
}

export { app }
export default app
