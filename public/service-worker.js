/** @format */

// cache storage instances
let assetCache = null;

const assetsCacheName = "mission-cache-v3";

// asset files need to be store
const filesToCache = [
  "/favicon.ico",
  "/manifest.json",
  "/bootstrap/css/bootstrap.css",
  "/css/index.css",
  "/css/animate.css",
  "/css/base.css",
  "/css/about.css",
  "/css/createStory.css",
  "/css/room.css",
  "/css/story.css",
  "/css/storyDetail.css",

  "/",
  "about",
  "/story",
  "/createStory",
  "/room",
  "/offline",
  "/404",

  "/img/icon-64.png",
  "/img/feature3.jpg",
  "/img/feature1.jpg",
  "/img/feature2.jpg",
  "/img/default-img.jpg",

  "/socket.io/socket.io.js",
  "/js/util/util.js",
  "/js/util/http.js",
  "/js/util/loading.js",
  "/js/public/nav.js",
  "/js/public/api.js",
  "/js/public/constant.js",
  "/js/view/index.js",
  "/js/view/createStory.js",
  "/js/view/room.js",
  "/js/view/story.js",
  "/js/view/storyDetail.js",
  "/js/canvas.js",

  "/font/Fredoka-Light.woff",
  "/font/Fredoka-Medium.woff",
  "/font/Fredoka-SemiBold.woff",
  "/font/Fredoka-Regular.woff",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/fonts/bootstrap-icons.woff2?524846017b983fc8ded9325d94ed40f3",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/fonts/bootstrap-icons.woff?524846017b983fc8ded9325d94ed40f3",

  "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
  "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css",
  "https://cdn.skypack.dev/pin/axios@v0.26.1-3c1TUCVdnljWzSKyoXbP/mode=imports,min/optimized/axios.js",
  "https://cdn.skypack.dev/-/axios@v0.26.1-3c1TUCVdnljWzSKyoXbP/dist=es2020,mode=imports,min/optimized/axios.js",
];

const whiteList = [
  "/socket.io/?EIO=",
  "https://www.gstatic.com/knowledge/kgsearch/widget/1.0/widget.min.css",
  "https://www.gstatic.com/knowledge/kgsearch/widget/1.0/widget.min.js",
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(assetsCacheName).then((cacheX) => {
      assetCache = cacheX;
      return assetCache.addAll(filesToCache);
    }),
  );
});

/**
 * activation of service worker: it removes all cashed files if necessary
 */
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== assetsCacheName) {
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
  } else if (
    e.request.method === "GET" &&
    e.request.url.includes("/api") &&
    e.request.destination === ""
  ) {
    // api request, network first strategy
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          assetCache.add(e.request.url);
          return res;
        })
        .catch(() => {
          return caches.match(e.request.url);
        }),
    );
  } else {
    // static resources, cache first strategy
    e.respondWith(
      caches.match(e.request).then(function (response) {
        return (
          response ||
          fetch(e.request)
            .then(function (response) {
              if (
                (response.status !== 200 &&
                  response.status !== 304 &&
                  response.type !== "opaque") ||
                e.request.method === "POST"
              ) {
                return response;
              }
              assetCache.add(e.request);
              return response;
            })
            .catch(function (err) {
              console.log("error: " + err);
              return caches.match("/offline");
            })
        );
      }),
    );
  }
});
