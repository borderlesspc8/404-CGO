import admin from "firebase-admin"
import fs from "fs"
import path from "path"

function resolveServiceAccountPath(): string | null {
  const configured =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(process.cwd(), "firebase-service-account.json")

  const resolved = path.isAbsolute(configured)
    ? configured
    : path.resolve(process.cwd(), configured)

  return fs.existsSync(resolved) ? resolved : null
}

export function getFirebaseAdminApp(): admin.app.App | null {
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App
  }

  const serviceAccountPath = resolveServiceAccountPath()
  if (!serviceAccountPath) return null

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"))
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

export function getAdminAuth(): admin.auth.Auth | null {
  const app = getFirebaseAdminApp()
  return app ? admin.auth(app) : null
}

export function getAdminDb(): admin.firestore.Firestore | null {
  const app = getFirebaseAdminApp()
  return app ? admin.firestore(app) : null
}
