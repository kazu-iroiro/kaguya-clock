var CACHE_NAME = "sw-cache-v1-3";

var urlsToCache = [
    "/",
    "index.html",
    "apple-touch-icon.png",
    "favicon.ico",
    "manifest.json",
    "styles.css",
    "main.js",
    "images/resources/icon-128.png",
    "images/resources/icon-192.png",
    "images/resources/icon-512.png"
];


const CACHE_KEYS = [
    CACHE_NAME
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(
                function (cache) {
                    return cache.addAll(urlsToCache);
                })
    );
});

//新しいバージョンのServiceWorkerが有効化されたとき
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => {
                    return !CACHE_KEYS.includes(key);
                }).map(key => {
                    return caches.delete(key);
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                }
                
                return fetch(event.request)
                    .then(function (response) {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        let responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(function () {
                        return caches.match('index.html');
                    });
            })
    );
});