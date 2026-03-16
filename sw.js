var CACHE_NAME = 'zakovat-v1';
var CACHE_FILES = [
  '/',
  '/index.html',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Nunito:wght@400;600;700;800;900&display=swap'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(CACHE_FILES).catch(function(){});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){return k!==CACHE_NAME;}).map(function(k){return caches.delete(k);}));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  // Firebase va API so'rovlarini cache qilmaymiz
  if(e.request.url.indexOf('firebase')!==-1||e.request.url.indexOf('anthropic')!==-1){
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached) return cached;
      return fetch(e.request).then(function(response){
        if(response&&response.status===200){
          var clone=response.clone();
          caches.open(CACHE_NAME).then(function(cache){cache.put(e.request,clone);});
        }
        return response;
      }).catch(function(){
        return caches.match('/index.html');
      });
    })
  );
});
