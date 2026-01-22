# PWA - Progressive Web App

## Transformação para Aplicativo

Seu site foi transformado em um **Progressive Web App (PWA)**, o que permite que ele funcione como um aplicativo nativo em diferentes plataformas.

## O que foi implementado

### 1. **Manifest.json** (`/public/manifest.json`)
- Define metadados do aplicativo (nome, ícones, cores, shortcuts)
- Permite instalação em dispositivos
- Configura o comportamento standalone do app

### 2. **Service Worker** (`/public/sw.js`)
- Funcionalidade offline
- Cache inteligente de recursos
- Sincronização em background
- Notificações push
- Atualização automática de conteúdo

### 3. **Página Offline** (`/public/offline.html`)
- Experiência visual quando sem conexão
- Verifica automaticamente a reconexão
- Permite navegação entre conteúdo já carregado

### 4. **Componente PWA** (`/components/pwa-installer.tsx`)
- Registra o service worker
- Gerencia permissões de notificação
- Detecta atualizações disponíveis

### 5. **Configurações Next.js** (`next.config.mjs`)
- Integração do next-pwa
- Workbox para gerenciamento de cache
- Otimizações de performance

## Como Instalar o Aplicativo

### Em Dispositivos Android
1. Abra o site no Chrome
2. Toque no menu (⋮) > "Instalar app" ou "Adicionar à tela inicial"
3. O app será instalado com ícone na tela inicial

### Em iPhone/iPad (iOS 16.4+)
1. Abra o site no Safari
2. Toque no ícone de compartilhar (⬆️)
3. Selecione "Adicionar à Tela Inicial"
4. O app funciona com modo standalone

### No Desktop (Windows/Mac)
1. Abra o site no Chrome/Edge
2. Clique no ícone de instalação (🔽) na barra de endereço
3. Selecione "Instalar"
4. O app abrirá em uma janela separada

## Funcionalidades do App

### ✅ Offline
- Acesso aos conteúdos já carregados
- Funcionalidade básica sem conexão
- Sincronização automática ao reconectar

### 📱 Responsivo
- Funciona perfeitamente em mobile, tablet e desktop
- Interface adaptativa
- Experiência nativa

### 🔔 Notificações
- Notificações push quando disponível
- Alertas sobre atualizações
- Lembretes de agendamentos

### 📦 Recursos em Cache
- Carregamento rápido
- Menor uso de dados
- Experiência melhorada

### 🔄 Atualizações Automáticas
- Detecta novas versões
- Sincroniza dados em background
- Notifica quando há atualizações

## Configurações de Cache

O service worker usa diferentes estratégias:

### Network First (HTML)
- Tenta buscar a versão mais recente
- Se falhar, usa versão em cache
- Usado para páginas principais

### Cache First (Assets)
- Usa versão em cache primeiro
- Se não houver, faz download
- Usado para CSS, JS, imagens

## Variáveis de Ambiente

Adicione ao `.env.local` para customizar:

```
NEXT_PUBLIC_APP_NAME=Clínica Dental
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Desenvolvimento

### Em Desenvolvimento
O service worker é desabilitado em `localhost` para evitar problemas.

### Build para Produção
```bash
pnpm build
```

O PWA estará totalmente funcional apenas em produção (HTTPS).

## Testing

### Chrome DevTools
1. Pressione F12
2. Vá para Application → Service Workers
3. Veja o status de registro

### Lighthouse
1. Abra DevTools
2. Vá para Lighthouse
3. Execute auditoria de PWA

## Requisitos HTTPS

O service worker **requer HTTPS** em produção. Em desenvolvimento local (`localhost`), funciona via HTTP.

## Troubleshooting

### Service Worker não funciona
- Verifique se está em HTTPS (em produção)
- Limpe cache do navegador
- Reabra a aba

### App não instala
- Verifique manifest.json
- Certifique-se de que é HTTPS
- Tente em outro navegador

### Offline não funciona
- Service Worker pode precisar ser reativado
- Reabra a aba do app
- Limpe dados do site

## Monitoramento

Os erros do service worker são registrados no console:

```
console.log("Service Worker registrado com sucesso:", registration);
console.error("Erro ao registrar Service Worker:", error);
```

## Próximos Passos

Para melhorar ainda mais:

1. **Notificações Push**
   - Integrar com servidor de push
   - Enviar alertas de agendamentos

2. **Sync em Background**
   - Sincronizar pedidos offline
   - Atualizar dados de agendamentos

3. **Geolocalização**
   - Permitir localização de clínicas
   - Direções no mapa

4. **Câmera**
   - Fotos de verificação
   - Documentação integrada

## Recursos Úteis

- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google - Build a PWA](https://web.dev/progressive-web-apps/)
- [next-pwa Documentation](https://github.com/shadowwalker/next-pwa)
