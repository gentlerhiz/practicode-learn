'use client'
import { AlertTriangle, Check, Cloud, KeyRound, Laptop, Lock, LockOpen, Smartphone, Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

type View = { open: boolean; address?: string; fake?: boolean; filled?: string; generated?: boolean; sync?: boolean; caption: string }

const VIEWS: View[] = [
  { open: false, caption: 'Every password lives in an encrypted vault. One master passphrase opens it, and it’s the only one you remember.' },
  { open: true, address: 'shop.example/sign-up', generated: true, filled: 'wQ4#tLz9-vR2!pXe8mKs', caption: 'Signing up somewhere new? It makes a long, random password and saves it. You never see it or type it.' },
  { open: true, address: 'bank.example/sign-in', filled: '••••••••••••••••••••', caption: 'On the real bank’s page, the address matches the one saved, so it fills your details in.' },
  { open: true, address: 'bank-example.co/sign-in', fake: true, caption: 'A fake page from a phishing message. It looks the same, but the address is different, so the manager fills nothing. That silence is a warning sign.' },
  { open: true, sync: true, caption: 'The vault is encrypted before it syncs to your phone. Even the company that runs it can’t read it, which is why forgetting the master passphrase locks you out: keep its recovery kit safe.' },
]

/** How a password manager works: one master passphrase, generated passwords, filling only on the right site (Diagram lab, 5 states). */
export function Vault({ state }: LabProps) {
  const v = VIEWS[clampState(state, VIEWS.length)]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={v.caption} className="grid grid-cols-1 gap-2.5 @min-[460px]:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className={cn('flex flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] p-4 text-center motion-safe:transition-colors', v.open ? 'border-cy bg-cy/10' : 'border-line bg-row')}>
          {v.open ? <LockOpen size={28} aria-hidden="true" className="text-cy-text" /> : <Lock size={28} aria-hidden="true" className="text-ink-muted" />}
          <span className="text-[13px] font-semibold text-ink">Password vault</span>
          <span className="flex items-center gap-1 rounded-md bg-sheet px-2 py-0.5 font-mono text-[11px] text-ink-muted">
            <KeyRound size={11} aria-hidden="true" />
            {v.open ? 'unlocked' : 'master passphrase?'}
          </span>
        </div>
        {v.sync ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-line bg-row p-4">
            <Laptop size={24} aria-hidden="true" className="text-ink" />
            <span className="flex flex-col items-center gap-1 text-[11px] text-ink-muted">
              <Cloud size={22} aria-hidden="true" className="text-cy-text" />
              encrypted
            </span>
            <Smartphone size={24} aria-hidden="true" className="text-ink" />
          </div>
        ) : v.address ? (
          <div className={cn('flex flex-col gap-2 rounded-2xl border-[1.5px] bg-row p-3', v.fake ? 'border-error' : 'border-line')}>
            <span className={cn('rounded-lg bg-sheet px-2.5 py-1.5 font-mono text-[12px] [overflow-wrap:anywhere]', v.fake ? 'text-error' : 'text-ink')}>{v.address}</span>
            <span className="text-[12px] text-ink-muted">Password</span>
            <span className={cn('flex min-h-9 items-center gap-1.5 rounded-lg border px-2.5 font-mono text-[12px] [overflow-wrap:anywhere]', v.filled ? 'border-success-fill text-ink' : 'border-dashed border-line-strong text-ink-subtle')}>
              {v.generated && <Sparkles size={13} aria-hidden="true" className="shrink-0 text-cy-text" />}
              {v.filled ?? 'Nothing filled in'}
            </span>
            <span className={cn('flex items-center gap-1.5 text-[12px] font-semibold', v.fake ? 'text-error' : 'text-success')}>
              {v.fake ? <AlertTriangle size={14} aria-hidden="true" /> : <Check size={14} aria-hidden="true" />}
              {v.fake ? 'Address doesn’t match: not filled' : v.generated ? 'New password made and saved' : 'Address matches: filled in'}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-line-strong p-4 text-[13px] text-ink-subtle">Locked: nothing can be read</div>
        )}
      </div>
    </figure>
  )
}
