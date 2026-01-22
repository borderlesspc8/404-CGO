# 📱 Guia de Testes - PWA Clínica Odontológica

## 🚀 Como Rodar o Aplicativo

### Método 1: Script Automático (Recomendado)

```powershell
.\test-pwa.ps1
```

### Método 2: Manual

```powershell
# Build
pnpm build

# Rodar em produção
pnpm start
```

O servidor estará em: `http://localhost:3000`

---

## 📱 TESTANDO EM ANDROID

### Pré-requisitos
- Android 5.0+
- Chrome ou Edge

### Passos

1. **Conecte seu PC e celular na mesma rede WiFi**

2. **Descubra seu IP local:**
   ```powershell
   ipconfig | findstr IPv4
   ```
   Exemplo: `192.168.1.100`

3. **No celular, abra o Chrome e acesse:**
   ```
   http://192.168.1.100:3000
   ```

4. **Instalar o App:**
   - Toque no menu (⋮) no canto superior direito
   - Selecione "Instalar app" ou "Adicionar à tela inicial"
   - Confirme a instalação
   - Um ícone aparecerá na tela inicial

5. **Abra o app da tela inicial** - Ele abrirá em tela cheia!

### ✅ O que testar no Android

- [ ] App abre em tela cheia (sem barra do navegador)
- [ ] Ícone aparece na tela inicial
- [ ] Navegação funciona normalmente
- [ ] Modo offline (desligue WiFi e veja se carrega)
- [ ] Notificações (se permitir)
- [ ] Voltar do Android fecha o app

---

## 🍎 TESTANDO EM iOS (iPhone/iPad)

### Pré-requisitos
- iOS 16.4+ (versões anteriores têm suporte limitado)
- Safari

### Passos

1. **Conecte seu PC e iPhone na mesma rede WiFi**

2. **Descubra seu IP local:**
   ```powershell
   ipconfig | findstr IPv4
   ```

3. **No iPhone, abra o Safari e acesse:**
   ```
   http://192.168.1.100:3000
   ```

4. **Instalar o App:**
   - Toque no botão Compartilhar (⬆️) na parte inferior
   - Role para baixo e toque em "Adicionar à Tela Inicial"
   - Edite o nome se quiser
   - Toque em "Adicionar"
   - Um ícone aparecerá na tela inicial

5. **Abra o app da tela inicial**

### ✅ O que testar no iOS

- [ ] App abre em tela cheia
- [ ] Ícone aparece na tela inicial
- [ ] Navegação funciona
- [ ] Modo offline funciona
- [ ] Status bar adapta a cor do app

### ⚠️ Limitações iOS
- Service Worker tem limitações
- Cache pode ser limpo automaticamente
- Notificações push não funcionam no Safari

---

## 💻 TESTANDO EM DESKTOP (Windows/Mac/Linux)

### No Chrome/Edge

1. **Abra o navegador e acesse:**
   ```
   http://localhost:3000
   ```

2. **Instalar:**
   - Olhe na barra de endereço (direita)
   - Clique no ícone de instalação (🔽 ou ➕)
   - Clique em "Instalar"

3. **O app abrirá em janela separada**

### No Firefox
- Não tem instalação nativa
- Mas o PWA funciona normalmente no navegador

### ✅ O que testar no Desktop

- [ ] App abre em janela própria
- [ ] Atalho aparece no menu Iniciar/Aplicativos
- [ ] Funciona offline
- [ ] Fecha como app normal

---

## 🧪 TESTES DE FUNCIONALIDADE PWA

### 1. Teste de Offline

1. Abra o app/site normalmente
2. Navegue por algumas páginas
3. Abra DevTools (F12)
4. Vá em **Network** (Rede)
5. Selecione **Offline** no dropdown
6. Recarregue a página
7. **Resultado esperado:** Deve mostrar a página offline bonita

### 2. Teste de Cache

1. Abra o app
2. Abra DevTools (F12) > **Application** > **Cache Storage**
3. Veja os arquivos em cache
4. **Resultado esperado:** Ver arquivos CSS, JS, imagens

### 3. Teste de Service Worker

1. DevTools (F12) > **Application** > **Service Workers**
2. **Resultado esperado:**
   - Status: **Activated and running**
   - Ver `/sw.js` registrado

### 4. Teste de Manifest

1. DevTools (F12) > **Application** > **Manifest**
2. **Resultado esperado:** Ver todas as informações:
   - Nome: "Clínica Odontológica - Gestão e E-commerce"
   - Ícones: 192x192, 512x512
   - Theme color: #0ea5e9
   - Display: standalone

### 5. Teste de Lighthouse (Auditoria PWA)

1. DevTools (F12) > **Lighthouse**
2. Selecione **Progressive Web App**
3. Clique em **Analyze page load**
4. **Resultado esperado:** Score acima de 80

### 6. Teste de Instalação

**Desktop:**
- [ ] Ícone de instalação aparece na barra
- [ ] Instalação funciona
- [ ] App aparece na lista de apps do sistema

**Mobile:**
- [ ] Opção de instalação aparece
- [ ] Instalação funciona
- [ ] Ícone aparece na tela inicial

### 7. Teste de Notificações (Opcional)

1. Permita notificações quando solicitado
2. Console do DevTools:
   ```javascript
   new Notification("Teste", {
     body: "Notificação funcionando!",
     icon: "/icon-192x192.png"
   });
   ```
3. **Resultado esperado:** Notificação aparece

---

## 🔍 INSPEÇÃO TÉCNICA

### Verificar Service Worker no Console

```javascript
// Ver se está registrado
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs);
});

// Ver estado
navigator.serviceWorker.ready.then(reg => {
  console.log('SW Status:', reg.active.state);
});
```

### Verificar se está em modo Standalone

```javascript
// No app instalado, deve retornar true
const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
console.log('Modo Standalone:', isStandalone);
```

### Forçar Atualização do Service Worker

```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.update());
});
```

---

## 🐛 TROUBLESHOOTING

### App não instala

**Possíveis causas:**
- Não está em HTTPS (use localhost em dev)
- Manifest.json com erro
- Ícones não encontrados

**Solução:**
```powershell
# Verificar se manifest está acessível
curl http://localhost:3000/manifest.json

# Verificar ícones
curl http://localhost:3000/icon-192x192.png
curl http://localhost:3000/icon-512x512.png
```

### Service Worker não registra

**Solução:**
1. Limpe cache do navegador
2. DevTools > Application > Clear Storage > Clear
3. Recarregue a página

### Modo offline não funciona

**Solução:**
1. Carregue o site pelo menos uma vez online
2. Verifique se o Service Worker está ativo
3. Tente novamente

### Build falha

**Solução:**
```powershell
# Limpar cache
Remove-Item -Path ".next" -Recurse -Force
Remove-Item -Path "node_modules" -Recurse -Force

# Reinstalar
pnpm install

# Build novamente
pnpm build
```

---

## 📊 CHECKLIST COMPLETO DE TESTES

### Funcionalidades Básicas
- [ ] App abre corretamente
- [ ] Todas as páginas carregam
- [ ] Navegação funciona
- [ ] Carrinho funciona
- [ ] E-commerce funciona
- [ ] Dashboard carrega

### PWA
- [ ] Instala no Android
- [ ] Instala no iOS
- [ ] Instala no Desktop
- [ ] Ícone correto aparece
- [ ] Abre em modo standalone
- [ ] Funciona offline
- [ ] Cache funciona
- [ ] Service Worker ativo

### Performance
- [ ] Carregamento rápido
- [ ] Imagens otimizadas
- [ ] Sem erros no console
- [ ] Lighthouse score > 80

### UX
- [ ] Interface responsiva
- [ ] Botões clicáveis
- [ ] Formulários funcionam
- [ ] Feedback visual

---

## 🎯 PRÓXIMOS PASSOS

Após testar localmente:

1. **Deploy em produção:**
   - Vercel (recomendado para Next.js)
   - Netlify
   - AWS Amplify

2. **HTTPS obrigatório em produção**
   - Service Worker só funciona com HTTPS

3. **Melhorias futuras:**
   - Notificações push reais
   - Background sync
   - Share API
   - Geolocalização

---

## 📞 COMANDOS ÚTEIS

```powershell
# Rodar testes
.\test-pwa.ps1

# Build
pnpm build

# Rodar produção
pnpm start

# Ver IP local
ipconfig | findstr IPv4

# Limpar cache
Remove-Item -Path ".next" -Recurse -Force

# Ver porta em uso
netstat -ano | findstr :3000
```

---

## ✅ Teste realizado com sucesso quando:

- ✅ App instala em pelo menos 1 plataforma
- ✅ Abre em modo standalone (tela cheia)
- ✅ Funciona offline
- ✅ Service Worker está ativo
- ✅ Lighthouse PWA > 80
