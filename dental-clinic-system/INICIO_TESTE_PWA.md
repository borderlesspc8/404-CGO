# 🚀 INÍCIO RÁPIDO - Testar PWA

## Passo 1: Build

```powershell
pnpm build
```

## Passo 2: Rodar

```powershell
pnpm start
```

## Passo 3: Abrir no navegador

```
http://localhost:3000
```

## Passo 4: Instalar como App

### Desktop (Chrome/Edge)
1. Clique no ícone de instalação na barra de endereço
2. Clique em "Instalar"

### Android
1. Descubra seu IP: `ipconfig | findstr IPv4`
2. No celular, acesse: `http://SEU-IP:3000`
3. Menu (⋮) > "Instalar app"

### iOS
1. Descubra seu IP: `ipconfig | findstr IPv4`  
2. No Safari, acesse: `http://SEU-IP:3000`
3. Compartilhar (⬆️) > "Adicionar à Tela Inicial"

---

## 📋 Verificar se funciona

1. **Service Worker ativo:**
   - F12 > Application > Service Workers
   - Deve estar "activated and running"

2. **Testar offline:**
   - F12 > Network > Offline
   - Recarregar página
   - Deve mostrar página offline

3. **PWA Score:**
   - F12 > Lighthouse
   - Run "Progressive Web App"
   - Score deve ser > 80

---

## 🐛 Problemas?

Veja [TESTES_PWA.md](./TESTES_PWA.md) para troubleshooting completo.
