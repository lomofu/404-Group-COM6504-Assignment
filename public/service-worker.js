/** @format */

// cache storage instances
let assetCache = null;

const assetsCacheName = "mission-cache-v1";

// asset files need to be store
const filesToCache = [
  "/offline",
  "/bootstrap/css/bootstrap.css",
  "/css/animate.css",
  "/css/base.css",
  "/img/icon-64.png",
  "/manifest.json",
  "/favicon.ico",
  "/404",
  "/",
  "about",
  "/story",
  "/createStory",
  "/room",
  "/css/about.css",
  "/img/feature3.jpg",
  "/img/feature1.jpg",
  "/img/feature2.jpg",
  "/socket.io/socket.io.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
  "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css",
  "https://cdn.skypack.dev/pin/axios@v0.26.1-3c1TUCVdnljWzSKyoXbP/mode=imports,min/optimized/axios.js",
];

const whiteList = [
  "/socket.io/?EIO=",
  "https://www.gstatic.com/knowledge/kgsearch/widget/1.0/widget.min.css",
  "https://www.gstatic.com/knowledge/kgsearch/widget/1.0/widget.min.js",
];

self.addEventListener("install", (e) => {
  console.log("[ServiceWorker] Install");

  e.waitUntil(
    caches
      .open(assetsCacheName)
      .then((cacheX) => {
        assetCache = cacheX;
        console.log("[ServiceWorker] Assets Cache open successfully");
        return assetCache.addAll(filesToCache);
      })
      .then(() => self.skipWaiting()),
  );
});

/**
 * activation of service worker: it removes all cashed files if necessary
 */
self.addEventListener("activate", (e) => {
  console.log("[ServiceWorker] Activate");

  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== assetsCacheName) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        }),
      );
    }),
  );
  return self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (whiteList.filter((v) => e.request.url.includes(v)).length > 0) {
    e.respondWith(fetch(e.request));
  } else if (e.request.url.includes("/api") && e.request.destination === "") {
    // api request, network first strategy
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          assetCache.add(e.request.url);
          return res;
        })
        .catch(() => {
          return caches.match(e.request);
        }),
    );
  } else {
    // static resources, cache first strategy
    e.respondWith(
      caches
        .match(e.request)
        .then(function (response) {
          return (
            response ||
            fetch(e.request)
              .then(function (response) {
                assetCache.add(e.request);
                return response;
              })
              .catch(function (err) {
                console.log("error: " + err);
                return caches.match("/offline");
              })
          );
        })
        .catch(() => {
          return fetch(e.request)
            .then(function (response) {
              assetCache.add(e.request);
              return response;
            })
            .catch(function (err) {
              console.log("error: " + err);
              return caches.match("/offline");
            });
        }),
    );
  }
});
