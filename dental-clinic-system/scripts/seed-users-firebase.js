#!/usr/bin/env node

/**
 * Cria usuários iniciais no Firebase Auth e salva perfis em Firestore.
 *
 * Configure no .env.local:
 *   FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
 *   FIREBASE_SEED_ADMIN_EMAIL=admin@borderless.local
 *   FIREBASE_SEED_ADMIN_PASSWORD=<senha forte>
 *   FIREBASE_SEED_PROFESSIONAL_EMAIL=alaor@borderless.local
 *   FIREBASE_SEED_PROFESSIONAL_PASSWORD=<senha forte>
 *
 * Execute: npm run seed:users
 */

const admin = require("firebase-admin")
const path = require("path")
const fs = require("fs")

const envPath = path.join(__dirname, "..", ".env.local")
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8")
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim()
      if (!process.env[key]) process.env[key] = value
    }
  })
}

function requiredEnv(key) {
  const value = process.env[key]
  if (!value) {
    console.error(`Variável obrigatória ausente: ${key}`)
    process.exit(1)
  }
  return value
}

const USERS = [
  {
    id: "admin-borderless",
    name: "Administrador Borderless",
    email: requiredEnv("FIREBASE_SEED_ADMIN_EMAIL"),
    password: requiredEnv("FIREBASE_SEED_ADMIN_PASSWORD"),
    role: "admin",
    avatar: "/admin-user-interface.png",
  },
  {
    id: "prof-alaor-borderless",
    name: "Alaor Pasian Júnior",
    email: requiredEnv("FIREBASE_SEED_PROFESSIONAL_EMAIL"),
    password: requiredEnv("FIREBASE_SEED_PROFESSIONAL_PASSWORD"),
    role: "professional",
    avatar: "/dentist-visit.png",
  },
]

async function upsertAuthUser(auth, user) {
  try {
    const existing = await auth.getUserByEmail(user.email)
    await auth.updateUser(existing.uid, {
      displayName: user.name,
      password: user.password,
      disabled: false,
    })
    return existing.uid
  } catch {
    const created = await auth.createUser({
      email: user.email,
      password: user.password,
      displayName: user.name,
      disabled: false,
    })
    return created.uid
  }
}

async function main() {
  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(__dirname, "..", "firebase-service-account.json")

  const resolvedPath = path.isAbsolute(serviceAccountPath)
    ? serviceAccountPath
    : path.resolve(__dirname, "..", serviceAccountPath)

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Conta de serviço não encontrada: ${resolvedPath}`)
    process.exit(1)
  }

  const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, "utf8"))

  if (admin.apps.length === 0) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  }

  const auth = admin.auth()
  const db = admin.firestore()

  console.log("Enviando usuários para Firebase Auth e Firestore...\n")

  for (const user of USERS) {
    const firebaseUid = await upsertAuthUser(auth, user)
    await db.collection("users").doc(firebaseUid).set(
      {
        id: user.id,
        firebaseUid,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    )

    console.log(`✓ ${user.email} (${user.role}) -> users/${firebaseUid}`)
  }

  console.log("\nConcluído.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
