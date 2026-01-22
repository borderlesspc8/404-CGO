# Checklist de Conectividade

## 1️⃣ Verifique a Rede do Celular
- ✅ Celular e PC estão na **mesma rede Wi-Fi**? (not mobile data)
- ✅ IP do PC é `192.168.1.21`?

## 2️⃣ Verifique o Servidor Next.js
- ✅ Terminal Next.js mostra `Ready in XXXms`?
- ✅ Mostra `Network: http://192.168.1.21:3000`?

## 3️⃣ Teste Conectividade (no PC)
```powershell
# Testa se porta 3000 responde
Test-NetConnection -ComputerName 192.168.1.21 -Port 3000 -InformationLevel Detailed

# Ou tenta um ping
ping 192.168.1.21
```

## 4️⃣ No Celular
1. Desabilite VPN/Proxy
2. Abra navegador
3. Digite: `http://192.168.1.21:3000`
4. Se não abrir:
   - Tente `http://localhost:3000` (só funciona localmente)
   - Reinicie o Wi-Fi do celular
   - Reinicie o roteador

## 5️⃣ Abrir Firewall do Windows

Execute como **Administrador**:
```powershell
# PowerShell com privilégios elevados (Admin)
netsh advfirewall firewall add rule name="Allow Next.js" dir=in action=allow protocol=tcp localport=3000

# Ou rode o script fornecido
.\abrir-firewall.bat
```

## 6️⃣ Se Ainda Não Funcionar
- Verifique se há outro firewall ativo (antivírus)
- Tente desabilitar firewall temporariamente:
  ```powershell
  Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled $false
  ```

## 7️⃣ Depois que Funcionar
Após conseguir acessar `http://192.168.1.21:3000` no navegador:
1. Reabra Expo Go (escaneie o QR code atual)
2. Debe carregar a aplicação no WebView

---

**Qual é o IP que seu celular vê quando faz ping no PC?**
```powershell
# No celular, tente ping 192.168.1.21 (ou o IP correto do seu PC)
```
