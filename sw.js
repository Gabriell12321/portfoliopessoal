// Service Worker para PWA
const CACHE_NAME = 'gabriel-portfolio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/sobre.html',
  '/projetos.html',
  '/skills.html',
  '/blog.html',
  '/certificacoes.html',
  '/dashboard.html',
  '/galeria.html',
  '/contato.html',
  '/styles/main.css',
  '/ts/main.ts',
  '/manifest.json',
  '/img/foto.jfif'
];

// Instalar Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retorna resposta
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Sistema de notificações removido
