# Configuração do Firebase - Consultas e Agenda

## 1. Login na conta correta (Firebase CLI)

Se o Firebase estiver em outra conta Google, faça login no terminal:

```bash
# Instale o Firebase CLI (se ainda não tiver)
npm install -g firebase-tools

# Faça logout da conta atual (se houver)
firebase logout

# Login na conta correta - abrirá o navegador para selecionar a conta Google
firebase login
```

Selecione a conta Google que tem acesso ao projeto Firebase do sistema.

## 2. Vincular o projeto

```bash
# Liste os projetos disponíveis
firebase projects:list

# Selecione o projeto (se não estiver vinculado)
firebase use <project-id>
```

## 3. Chave de conta de serviço (para scripts de seed)

O script `seed:appointments` usa **firebase-admin** com uma chave JSON. Não usa o login do CLI.

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto
3. Configurações (engrenagem) > **Contas de serviço**
4. Clique em **Gerar nova chave privada**
5. Salve o arquivo como `firebase-service-account.json` na raiz do projeto
6. Adicione ao `.gitignore` (não commitar a chave!)

## 4. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com as credenciais do projeto:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

## 5. Subir as consultas mocadas para o Firestore

```bash
npm run seed:appointments
```

Isso envia as 7 consultas de exemplo para a collection `appointments`.

## 6. Deploy das regras e índices (opcional)

```bash
firebase deploy --only firestore
```

## 7. Estrutura das consultas no Firestore

Collection: `appointments`

Cada documento tem:
- `patientId`, `professionalId`, `date` (YYYY-MM-DD), `startTime`, `endTime`
- `status`, `type`, `notes`, `createdBy`, `createdAt`
- `financialStatus` (opcional)

Novos agendamentos criados pelo formulário são gravados automaticamente no Firestore.
