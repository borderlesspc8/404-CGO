# Deploy

## Build

```bash
npm run build
```

O projeto tambem pode ser publicado com `pnpm`:

```bash
pnpm install --frozen-lockfile
pnpm run build
```

## Variaveis de ambiente

Configure estas variaveis no painel da plataforma de deploy:

```env
NEXT_PUBLIC_APP_URL=https://dominio-do-cliente.com
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

As variaveis abaixo sao apenas para rodar o seed localmente e nao devem ser expostas no frontend:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
FIREBASE_SEED_ADMIN_EMAIL=
FIREBASE_SEED_ADMIN_PASSWORD=
FIREBASE_SEED_PROFESSIONAL_EMAIL=
FIREBASE_SEED_PROFESSIONAL_PASSWORD=
```

## Plataforma

- Vercel: configurar o diretório raiz do projeto como `dental-clinic-system`.
- Netlify: o arquivo `netlify.toml` da raiz ja aponta para `dental-clinic-system`.
- Node: usar Node 20.

Nunca versionar `.env.local` ou `firebase-service-account.json`.
