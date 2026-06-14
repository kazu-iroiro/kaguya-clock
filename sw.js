var CACHE_NAME = "sw-cache-v1-1";

var urlsToCache = [
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
    var online = navigator.onLine;

    if (online) {
        console.log("ONLINE");
        event.respondWith(
            caches.match(event.request)
                .then(
                    function (response) {
                        if (response) {
                            return response;
                        }
                        //request streem 1
                        return fetch(event.request)
                            .then(function (response) {

                                cloneResponse = response.clone();

                                if (response) {
                                    if (response || response.status == 200) {
                                        caches.open(CACHE_NAME)
                                            .then(function (cache) {
                                                console.log("キャッシュへ保存");
                                                cache.put(event.request, cloneResponse)
                                                    .then(function () {
                                                        console.log("保存完了");
                                                    });
                                            });
                                    } else {
                                        return event.respondWith(new Response('Error Handling'));
                                    }
                                    return response;
                                }
                            }).catch(function (error) {
                                return console.log(error);
                            });
                    })
        );
    } else {
        console.log("OFFLINE");
        event.respondWith(
            caches.match(event.request)
                .then(function (response) {
                    if (response) {
                        return response;
                    }
                    return caches.match("offline.html")
                        .then(function (responseNodata) {
                            return responseNodata;
                        });
                }
                )
        );
    }
});