#!/usr/bin/env node

/**
 * Script para enviar as consultas mocadas para o Firestore
 *
 * Pré-requisito: Chave de conta de serviço no Firebase Console
 *   Salve como: firebase-service-account.json (ou configure FIREBASE_SERVICE_ACCOUNT_PATH)
 *
 * Execute: npm run seed:appointments
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

const APPOINTMENTS = [
  {
    id: "1",
    patientId: "5083",
    professionalId: "1",
    date: "2025-11-17",
    startTime: "10:00",
    endTime: "11:00",
    status: "confirmed",
    type: "Avaliação",
    notes:
      "ELE USA APARELHO A 6 MESES MAS NÃO ESTA VENDO RESULTADO, ELE QUERIA FAZER AVALIAÇÃO PARA TROCAR O APARELHO E VER SE PRECISA DE ALGUM OUTRO TRATAMENTO",
    financialStatus: "approved",
    createdBy: "Secretária",
    createdAt: "2025-11-14T13:56:00",
  },
  {
    id: "2",
    patientId: "5083",
    professionalId: "4",
    date: "2025-11-17",
    startTime: "12:00",
    endTime: "13:00",
    status: "scheduled",
    type: "Consulta Saúde",
    createdBy: "Admin",
    createdAt: "2025-11-14T14:00:00",
  },
  {
    id: "3",
    patientId: "5084",
    professionalId: "2",
    date: "2025-11-17",
    startTime: "10:30",
    endTime: "12:00",
    status: "completed",
    type: "Consulta Saúde",
    createdBy: "Admin",
    createdAt: "2025-11-14T09:00:00",
  },
  {
    id: "4",
    patientId: "5084",
    professionalId: "6",
    date: "2025-11-17",
    startTime: "13:00",
    endTime: "14:00",
    status: "confirmed",
    type: "Avaliação",
    notes: "Paciente com dor no dente",
    createdBy: "Secretária",
    createdAt: "2025-11-15T10:30:00",
  },
  {
    id: "5",
    patientId: "5083",
    professionalId: "1",
    date: "2025-11-18",
    startTime: "10:00",
    endTime: "11:00",
    status: "scheduled",
    type: "Consulta",
    createdBy: "Admin",
    createdAt: "2025-11-14T10:00:00",
  },
  {
    id: "6",
    patientId: "5084",
    professionalId: "2",
    date: "2025-11-19",
    startTime: "11:00",
    endTime: "12:00",
    status: "scheduled",
    type: "Avaliação",
    createdBy: "Admin",
    createdAt: "2025-11-14T10:00:00",
  },
  {
    id: "7",
    patientId: "5083",
    professionalId: "4",
    date: "2025-11-20",
    startTime: "14:00",
    endTime: "15:00",
    status: "scheduled",
    type: "Consulta Saúde",
    createdBy: "Admin",
    createdAt: "2025-11-14T10:00:00",
  },
]

async function main() {
  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(__dirname, "..", "firebase-service-account.json")

  const resolvedPath = path.isAbsolute(serviceAccountPath)
    ? serviceAccountPath
    : path.resolve(__dirname, "..", serviceAccountPath.replace(/^\.\//, ""))

  if (!fs.existsSync(resolvedPath)) {
    console.error(`
❌ Arquivo de conta de serviço não encontrado: ${resolvedPath}

Para obter a chave:
1. Acesse https://console.firebase.google.com
2. Selecione o projeto
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

  const db = admin.firestore()

  console.log("🔥 Enviando consultas para o Firestore (appointments)...\n")

  for (const apt of APPOINTMENTS) {
    try {
      const { id, ...data } = apt
      await db.collection("appointments").doc(id).set(data, { merge: true })
      console.log(`  ✓ Consulta ${id} (${apt.date} ${apt.startTime}) salva`)
    } catch (err) {
      console.error(`  ✗ Erro na consulta ${apt.id}:`, err.message)
      process.exit(1)
    }
  }

  console.log(`\n✅ Concluído! ${APPOINTMENTS.length} consultas enviadas para o Firebase.`)
}

main()
