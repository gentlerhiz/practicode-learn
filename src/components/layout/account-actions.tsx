'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { buttonClasses } from '@/components/ui/button'
import { cn } from '@/lib/cn'

// Supabase keeps the session in sb-<project>-auth-token cookies (split into .0, .1 when long).
const SESSION = /(?:^|;\s*)sb-[a-z0-9]+-auth-token(?:\.\d+)?=/

function subscribe() {
  return () => {}
}

/**
 * Whether this browser holds a session. Public pages are static, so this is read in the browser only;
 * it decides which buttons to show, never what anyone may see (the server checks that).
 */
export function useHasSession() {
  return useSyncExternalStore(subscribe, () => SESSION.test(document.cookie), () => false)
}

/** Log In and Start Free for guests; My Dashboard once signed in. */
export function AccountActions() {
  const signedIn = useHasSession()
  if (signedIn) {
    return (
      <Link href={'/home' as Route} className={buttonClasses({}, 'px-3.5 text-sm ph:px-5 ph:text-[15px]')}>
        My Dashboard
      </Link>
    )
  }
  return (
    <>
      <Link
        href={'/login' as Route}
        className={buttonClasses({ variant: 'secondary' }, 'hidden bg-transparent px-4 font-medium ph:inline-flex')}
      >
        Log In
      </Link>
      <Link href={'/onboarding' as Route} className={buttonClasses({}, 'px-3.5 text-sm ph:px-5 ph:text-[15px]')}>
        Start Free
      </Link>
    </>
  )
}

/** The phone menu's last button: Log In, or My Dashboard once signed in. */
export function MenuAccountButton({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  const signedIn = useHasSession()
  return (
    <Link
      href={(signedIn ? '/home' : '/login') as Route}
      onClick={onNavigate}
      className={cn(buttonClasses({ variant: signedIn ? 'primary' : 'secondary', size: 'form' }, 'w-full'), !signedIn && 'bg-transparent font-medium', className)}
    >
      {signedIn ? 'My Dashboard' : 'Log In'}
    </Link>
  )
}
