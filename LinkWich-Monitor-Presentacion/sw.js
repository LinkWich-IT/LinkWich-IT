"use strict";

// Separate cache per installation directory; never remove other site caches.
const CACHE_PREFIX = "linkwich-monitor-presentacion:" + self.registration.scope + ":";
const CACHE_NAME = CACHE_PREFIX + "v1-8fb241622ad9";
const BASE = self.registration.scope;
const PRECACHE = [
  "./index.html",
  "./styles.css?v=metricas-paquetes",
  "./app.js?v=metricas-paquetes",
  "./manifest.webmanifest",
  "./pwa.js",
  "./favicon.ico",
  "./assets/brands/allied.webp",
  "./assets/brands/apc.webp",
  "./assets/brands/aruba.webp",
  "./assets/brands/axis.webp",
  "./assets/brands/cisco.webp",
  "./assets/brands/cyberpower.webp",
  "./assets/brands/fortinet.webp",
  "./assets/brands/huawei.webp",
  "./assets/brands/linux.webp",
  "./assets/brands/ruckus.webp",
  "./assets/brands/ruijie.webp",
  "./assets/brands/whatsapp.webp",
  "./assets/brands/windows.webp",
  "./assets/datacenter.webp",
  "./assets/engineers.webp",
  "./assets/linkwich-it.webp",
  "./assets/mapa-sitios.webp",
  "./assets/network-rack.webp",
  "./assets/operations.webp",
  "./assets/pwa/apple-touch-icon.png",
  "./assets/pwa/favicon-16.png",
  "./assets/pwa/favicon-32.png",
  "./assets/pwa/favicon-48.png",
  "./assets/pwa/icon-192.png",
  "./assets/pwa/icon-512.png",
  "./assets/pwa/icon-maskable-512.png",
  "./assets/qr-contacto.webp",
  "./assets/qr-presentacion.webp",
  "./assets/resort.webp",
  "./assets/switch.webp"
];
const ASSETS = new Set(PRECACHE.map(path => new URL(path, BASE).href));
const INDEX = new URL("index.html", BASE).href;

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PRECACHE.map(path => new Request(new URL(path, BASE), {cache: "reload"})));
    // Allow the current presentation to finish before activating an update.
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || !request.url.startsWith(BASE)) return;
  const url = new URL(request.url);
  const isPresentation = request.mode === "navigate" &&
    (url.pathname === new URL(BASE).pathname || url.pathname === new URL(INDEX).pathname);
  if (!isPresentation && !ASSETS.has(url.href)) return;

  // Prefer live resources; the local copy is used only if the network fails.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const key = isPresentation ? INDEX : request;
    try {
      const response = await fetch(request);
      if (response.ok && response.type === "basic") {
        try { await cache.put(key, response.clone()); } catch (error) { /* Storage may be unavailable. */ }
      }
      return response;
    } catch (error) {
      const saved = await cache.match(key);
      if (saved) return saved;
      return new Response("Recurso no disponible sin conexión.", {
        status: 503, headers: {"Content-Type": "text/plain; charset=utf-8"}
      });
    }
  })());
});
