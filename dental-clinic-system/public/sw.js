// Service Worker para Progressive Web App
const CACHE_NAME = 'clinica-dental-v1';
const urlsToCache = [
  '/',
  '/offline.html',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia de cache: Network First, Fall back to Cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições do Chrome Extensions e do servidor de desenvolvimento
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Para requisições GET
  if (request.method === 'GET') {
    // Se for HTML, usar Network First
    const acceptHeader = request.headers.get('accept') || '';
    if (acceptHeader.includes('text/html')) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Cache a resposta bem-sucedida
            if (response.ok) {
              const cache = caches.open(CACHE_NAME);
              cache.then((c) => c.put(request, response.clone()));
            }
            return response;
          })
          .catch(() => {
            return caches
              .match(request)
              .then(
                (response) =>
                  response || caches.match('/offline.html')
              );
          })
      );
    } else {
      // Para outros recursos (CSS, JS, imagens), usar Cache First
      event.respondWith(
        caches
          .match(request)
          .then((response) => {
            if (response) {
              return response;
            }
            return fetch(request).then((response) => {
              if (!response || response.status !== 200) {
                return response;
              }
              const cache = caches.open(CACHE_NAME);
              cache.then((c) => c.put(request, response.clone()));
              return response;
            });
          })
          .catch(() => {
            // Se falhar, retornar um recurso padrão
            const acceptHeader = request.headers.get('accept') || '';
            if (acceptHeader.includes('image')) {
              // Retornar imagem padrão
              return caches.match('/icon-192x192.png');
            }
          })
      );
    }
  }
});

// Tratamento de mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notificações Push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    actions: [
      {
        action: 'open',
        title: 'Abrir',
      },
      {
        action: 'close',
        title: 'Fechar',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification('Clínica Odontológica', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then((clientList) => {
        // Se a janela já está aberta, focar nela
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (
            client.url === '/' &&
            'focus' in client
          ) {
            return client.focus();
          }
        }
        // Se não estiver aberta, abrir nova janela
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Background Sync para sincronizar dados offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pedidos') {
    event.waitUntil(syncPedidos());
  }
});

async function syncPedidos() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        await fetch(request.clone());
      } catch (error) {
        console.error('Erro ao sincronizar:', error);
      }
    }
  } catch (error) {
    console.error('Erro na sincronização de fundo:', error);
  }
}
