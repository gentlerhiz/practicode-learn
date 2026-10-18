'use client'

import { useState } from 'react'
import { buttonClasses } from '@/components/ui/button'
import { Glyph } from '@/components/ui/glyph'
import { cn } from '@/lib/cn'

/** Copies a certificate's address, and says so. */
export function CopyLinkButton({ url, className }: { url: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(url).then(
          () => setCopied(true),
          () => setCopied(false),
        )
      }}
      className={buttonClasses(
        { variant: 'secondary' },
        cn('h-11 bg-transparent px-4 font-medium', className),
      )}
    >
      <Glyph name={copied ? 'check' : 'copy'} size={16} />
      <span aria-live="polite">{copied ? 'Link copied' : 'Copy Link'}</span>
    </button>
  )
}
