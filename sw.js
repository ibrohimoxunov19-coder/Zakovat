var CACHE_NAME = 'zakovat-v3';
var CACHE_FILES = ['/index.html'];

self.addEventListener('install', function(e){
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){return caches.delete(k);}));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  // Don't cache anything - always fetch fresh
  if(e.request.method !== 'GET') return;
  if(e.request.url.indexOf('firebase') !== -1) return;
  if(e.request.url.indexOf('googleapis') !== -1) return;
  e.respondWith(fetch(e.request).catch(function(){
    return caches.match(e.request);
  }));
});
