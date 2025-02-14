const CACHE_NAME = "solar-system-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/solarsystem.html",
    "/manifest.json",
    "/service-worker.js",
    "/img/sun.jpg",
    "/img/mercury.jpg",
    "/img/venus2.jpg",
    "/img/earth.jpg",
    "/img/mars.jpg",
    "/img/jupiter.jpg",
    "/img/saturn.jpg",
    "/img/uranus.jpg",
    "/img/neptune.jpg",
    "/img/moon.jpg",
    "/img/phobos.png",
    "/img/deimos.png",
    "/img/io.png",
    "/img/europa.png",
    "/img/ganymede.png",
    "/img/callisto.png",
    "/img/titan.png",
    "/img/enceladus.png",
    "/img/triton.png",
    "/img/jupiter_ring2.png",
    "/img/saturn_ring.png",
    "/img/uranus_ring.png",
    "/img/neptune_ring.png",
    "/img/comet_texture.png",
    "/img/icon-192.png",
    "/img/icon-512.png",
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
    "https://cdn.jsdelivr.net/npm/three@0.128/examples/js/controls/OrbitControls.js"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("✅ Caching assets...");
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("🗑️ Clearing old cache:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
