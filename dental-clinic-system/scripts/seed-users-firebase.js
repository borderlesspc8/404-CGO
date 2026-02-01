#!/usr/bin/env node

/**
 * Script para enviar os 2 usuários mocados para o Firebase
 * - Firebase Auth: cria conta com email/senha
 * - Firestore: armazena perfil (id, name, role, avatar)
 *
 * Pré-requisito: Baixe a chave de conta de serviço no Firebase Console:
 *   Projeto > Configurações > Contas de serviço > Gerar nova chave privada
 *   Salve como: firebase-service-account.json (na raiz do projeto ou em ./scripts/)
 *
 * Configure no .env.local:
 *   FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
 *
 * Execute: npm run seed:users
 */

const admin = require("firebase-admin")
const path = require("path")
const fs = require("fs")

// Carrega .env.local se existir
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

const USERS = [
  {
    id: "1",
    name: "Rafael Correia",
    email: "admin@laperle.com",
    password: "admin123",
    role: "admin",
    avatar: "/admin-user-interface.png",
  },
  {
    id: "2",
    name: "Alaor Pasian Júnior",
    email: "alaor@laperle.com",
    password: "prof123",
    role: "professional",
    avatar: "/dentist-visit.png",
  },
]

async function main() {
  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(__dirname, "..", "firebase-service-account.json")

  const resolvedPath = path.isAbsolute(serviceAccountPath)
    ? serviceAccountPath
    : path.resolve(__dirname, "..", serviceAccountPath)

  if (!fs.existsSync(resolvedPath)) {
    console.error(`
❌ Arquivo de conta de serviço não encontrado: ${resolvedPath}

Para obter a chave:
1. Acesse https://console.firebase.google.com
2. Selecione o projeto cgo-f1669
3. Configurações (engrenagem) > Contas de serviço
4. Clique em "Gerar nova chave privada"
5. Salve o JSON como firebase-service-account.json na raiz do projeto
6. Ou defina FIREBASE_SERVICE_ACCOUNT_PATH no .env.local
`)
    process.exit(1)
  }

  const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, "utf8"))

  if (admin.apps.length === 0) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  }

  const auth = admin.auth()
  const db = admin.firestore()

  console.log("🔥 Enviando usuários para o Firebase...\n")

  for (const user of USERS) {
    try {
      let firebaseUid = null

      // Verifica se usuário já existe no Auth
      try {
        const existing = await auth.getUserByEmail(user.email)
        firebaseUid = existing.uid
        console.log(`  ✓ ${user.email} já existe no Auth (${firebaseUid})`)
      } catch {
        // Cria usuário no Firebase Auth
        const created = await auth.createUser({
          email: user.email,
          password: user.password,
          displayName: user.name,
        })
        firebaseUid = created.uid
        console.log(`  ✓ ${user.email} criado no Auth (${firebaseUid})`)
      }

      // Salva perfil no Firestore (collection: users)
      const userProfile = {
        id: user.id,
        firebaseUid,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }

      await db.collection("users").doc(firebaseUid).set(userProfile, { merge: true })
      console.log(`  ✓ Perfil salvo no Firestore (users/${firebaseUid})\n`)
    } catch (err) {
      console.error(`  ✗ Erro em ${user.email}:`, err.message)
      process.exit(1)
    }
  }

  console.log("✅ Concluído! 2 usuários enviados para o Firebase.")
}

main()
