# Credenciais de Acesso

Usuários disponíveis para login no sistema via Firebase Auth.

| Usuário | Email | Perfil |
|---------|-------|--------|
| Administrador Borderless | admin@borderless.local | Admin |
| Alaor Pasian Júnior | alaor@borderless.local | Profissional |

As senhas não ficam mais versionadas no código. Configure-as em `.env.local`:

```env
FIREBASE_SEED_ADMIN_PASSWORD=
FIREBASE_SEED_PROFESSIONAL_PASSWORD=
```

Depois execute `npm run seed:users` para criar ou atualizar os usuários no Firebase Auth.
