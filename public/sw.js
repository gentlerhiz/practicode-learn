// PractiCode Learn service worker: lessons a learner has opened keep working without a connection.
//   pc-static-v1  hashed build files, fonts, icons and the runner: cache first (they never change)
//   pc-pages-v1   lesson and track pages: network first, then the saved copy, then /offline.html (plain HTML, so it needs nothing else)
// Lesson packs arrive inside the lesson page's HTML (rendered at build time), so saving the page saves
// the lesson. GET and same-origin only; signed-in, sign-in and API routes are never saved.
const VERSION = 'v1'
const STATIC = `pc-static-${VERSION}`
const PAGES = `pc-pages-${VERSION}`
const CURRENT = [STATIC, PAGES]
const LIMITS = { [STATIC]: 250, [PAGES]: 40 }
const PRECACHE = [
  '/offline.html',
  '/runner.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/favicon.ico',
]

const NEVER = /^\/(api|auth|home|settings|admin|login|signup|verify|fixtures|_vercel)(\/|$)/
const STATIC_PATH =
  /^\/(_next\/static\/|icons\/|brand\/|favicon\.ico$|apple-icon\.png$|icon\.svg$|manifest\.webmanifest$|runner\.html$)/
const SAVED_PAGE = /^\/(learn|tracks)\//

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names.filter((n) => n.startsWith('pc-') && !CURRENT.includes(n)).map((n) => caches.delete(n)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

// Oldest entries go first, so a phone's storage never fills up with old builds.
async function save(name, request, response) {
  const cache = await caches.open(name)
  await cache.put(request, response)
  const keys = await cache.keys()
  for (const key of keys.slice(0, Math.max(0, keys.length - LIMITS[name]))) await cache.delete(key)
}

async function cacheFirst(request) {
  const runner = new URL(request.url).pathname === '/runner.html'
  const hit = await caches.match(request, { ignoreSearch: runner })
  if (hit) return hit
  const response = await fetch(request)
  if (response.ok && response.type === 'basic') save(STATIC, request, response.clone())
  return response
}

async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok && response.type === 'basic') await save(PAGES, request, response.clone())
    return response
  } catch {
    return (
      (await caches.match(request, { cacheName: PAGES })) ||
      (await caches.match('/offline.html')) ||
      Response.error()
    )
  }
}

async function offlineFallback(request) {
  try {
    return await fetch(request)
  } catch {
    return (await caches.match('/offline.html')) || Response.error()
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin || url.pathname === '/sw.js' || NEVER.test(url.pathname)) return
  // In-app navigations and prefetches fetch React data, not pages: leave them to the network.
  if (
    request.headers.get('RSC') ||
    request.headers.get('Next-Router-Prefetch') ||
    url.searchParams.has('_rsc')
  )
    return
  if (STATIC_PATH.test(url.pathname)) {
    event.respondWith(cacheFirst(request))
  } else if (request.mode === 'navigate') {
    event.respondWith(SAVED_PAGE.test(url.pathname) ? networkFirst(request) : offlineFallback(request))
  }
})
