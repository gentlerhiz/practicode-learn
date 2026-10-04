'use client'

import { useEffect, useState } from 'react'
import { Copy, Icon, Share2 } from '@/components/ui/icon'
import { buttonClasses } from '@/components/ui/button'
import { cn } from '@/lib/cn'

export function shareUrls({ url, text }: { url: string; text: string }) {
  const u = encodeURIComponent(url)
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    x: `https://x.com/intent/post?${new URLSearchParams({ text, url })}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
  }
}

// Simple brand marks drawn here, because the icon set doesn't include company logos.
const marks = {
  whatsapp:
    'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z',
  x: 'M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.9L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z',
  linkedin:
    'M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1a3.8 3.8 0 0 1 3.4-1.9c3.6 0 4.3 2.4 4.3 5.5v6.3ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Zm1.8 13.1H3.5V9h3.6v11.5Z',
  facebook:
    'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z',
} as const

const labels = { whatsapp: 'WhatsApp', x: 'X', linkedin: 'LinkedIn', facebook: 'Facebook' } as const

/**
 * Sharing for a page. Phones get the system share sheet; everywhere else gets links to each network
 * and a Copy Link button that announces success to screen readers.
 */
export function ShareButtons({
  url,
  text,
  title,
  className,
}: {
  url: string
  text: string
  title: string
  className?: string
}) {
  const [canShare, setCanShare] = useState(false)
  const [status, setStatus] = useState('')
  const links = shareUrls({ url, text })

  useEffect(() => {
    // navigator.share only exists in the browser, so this has to wait until after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanShare(typeof navigator.share === 'function')
  }, [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setStatus('Link copied')
    } catch {
      setStatus('Copying was blocked. Copy the address from your browser instead.')
    }
  }

  async function share() {
    try {
      await navigator.share({ title, text, url })
    } catch {
      // The learner closed the share sheet; nothing to do.
    }
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {canShare ? (
        <button type="button" onClick={share} className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
          <Icon as={Share2} size={16} />
          Share
        </button>
      ) : (
        <>
          {(Object.keys(links) as (keyof typeof links)[]).map((network) => (
            <a
              key={network}
              href={links[network]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${labels[network]} (opens in a new tab)`}
              className="inline-flex size-9 items-center justify-center rounded-full border border-line-control text-ink hover:bg-row"
            >
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                <path d={marks[network]} />
              </svg>
            </a>
          ))}
          <button
            type="button"
            onClick={copy}
            className={buttonClasses({ variant: 'secondary', size: 'sm' })}
          >
            <Icon as={Copy} size={16} />
            Copy Link
          </button>
        </>
      )}
      <span role="status" aria-live="polite" className="text-sm text-ink-subtle">
        {status}
      </span>
    </div>
  )
}
