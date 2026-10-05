'use client'
import { useEffect } from 'react'

/**
 * Registers the service worker (public/sw.js) in production builds, after the page has loaded, so it
 * never competes with first paint. Development stays worker-free, so code changes are never cached.
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return
    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
    if (document.readyState === 'complete') {
      register()
      return
    }
    window.addEventListener('load', register, { once: true })
    return () => window.removeEventListener('load', register)
  }, [])
  return null
}
