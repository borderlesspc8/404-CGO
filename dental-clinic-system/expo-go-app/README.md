# Expo Go Wrapper para testar o app web

Este app Expo Go apenas encapsula a sua aplicação Next.js em um WebView para testes rápidos no celular.

## Como usar

1. Instale dependências (na pasta expo-go-app):
   ```bash
   pnpm install
   # ou npm install ou yarn
   ```

2. Rode o servidor Next.js na mesma rede (PC e celular no mesmo Wi-Fi):
   ```bash
   pnpm dev
   # ou pnpm start se estiver buildado
   ```

3. Descubra o IP da sua máquina:
   ```powershell
   ipconfig | findstr IPv4
   ```

4. Defina o endereço no Expo (substitua pelo seu IP):
   ```bash
   # Linux/macOS
   export EXPO_PUBLIC_WEB_URL=http://192.168.0.10:3000
   # Windows PowerShell
   $Env:EXPO_PUBLIC_WEB_URL="http://192.168.0.10:3000"
   ```

5. Inicie o Expo Go:
   ```bash
   npx expo start
   # escaneie o QR code no Expo Go
   ```

## Notas
- Certifique-se de que o Next.js está acessível pelo IP na rede local.
- Se usar HTTPS/NGROK/Vercel, coloque a URL pública em `EXPO_PUBLIC_WEB_URL`.
- O Expo Go precisa ter acesso à internet/local para abrir o WebView.

## Personalização
- Ajuste cores e mensagens em `App.tsx`.
- Você pode trocar `FALLBACK_URL` para a URL publicada.
