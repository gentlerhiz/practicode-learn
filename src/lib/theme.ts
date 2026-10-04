export type ThemePreference = 'dark' | 'light' | 'system'
export type Theme = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'pc-theme'

export const parsePreference = (raw: string | null): ThemePreference =>
  raw === 'dark' || raw === 'light' ? raw : 'system'

export const resolveTheme = (pref: ThemePreference, prefersLight: boolean): Theme =>
  pref === 'system' ? (prefersLight ? 'light' : 'dark') : pref

// Runs in <head> before first paint. Kept tiny and dependency-free; its hash is allowed by the CSP (Task 5).
export const THEME_BOOT_SCRIPT = `(function(){try{var p=localStorage.getItem('${THEME_STORAGE_KEY}');p=p==='dark'||p==='light'?p:'system';var t=p==='system'?(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):p;var d=document.documentElement;d.dataset.theme=t;d.dataset.themePref=p}catch(e){}})()`
