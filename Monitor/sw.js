// Scope: la carpeta Monitor. Sólo se almacena la pantalla pública sin conexión.
const CACHE_PREFIX='lw-monitor-pwa-';
const CACHE_NAME=CACHE_PREFIX+'offline-v1';
const BASE=new URL('./',self.registration.scope);
const OFFLINE_URL=new URL('offline.html',BASE).href;
const PUBLIC_FILES=[OFFLINE_URL,new URL('offline.css',BASE).href];
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{const cache=await caches.open(CACHE_NAME);for(const url of PUBLIC_FILES){const response=await fetch(url,{cache:'reload'});if(!response.ok)throw Error('Offline resource unavailable');await cache.put(url,response);}})());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith(CACHE_PREFIX)&&name!==CACHE_NAME)await caches.delete(name);await self.clients.claim();})());
});
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const req=event.request,u=new URL(req.url);
 // No intercepta Supabase, POST, tokens, APIs ni activos del aplicativo.
 if(req.method!=='GET'||u.origin!==BASE.origin||!u.pathname.startsWith(BASE.pathname))return;
 if(req.mode==='navigate'){
  event.respondWith(fetch(req,{cache:'no-store'}).catch(async()=>{
   const response=await (await caches.open(CACHE_NAME)).match(OFFLINE_URL);
   return response||new Response('Sin conexión. Recupera Internet y vuelve a abrir LinkWich.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8','Cache-Control':'no-store'}});
  }));return;
 }
 if(PUBLIC_FILES.includes(u.href))event.respondWith(fetch(req).catch(async()=>{
  const response=await (await caches.open(CACHE_NAME)).match(u.href);return response||new Response('',{status:503});
 }));
});
