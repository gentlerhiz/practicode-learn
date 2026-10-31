'use client'
import { AlertTriangle, Check, Fingerprint, KeyRound, Server, Smartphone } from 'lucide-react'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

type View = {
  site: string
  fake?: boolean
  phone: string[]
  server: string[]
  between?: { text: string; to: 'site' | 'phone' }
  result?: { ok: boolean; text: string }
}

const VIEWS: View[] = [
  { site: 'bank.example', phone: ['Private key: never leaves the phone'], server: ['Public key: safe to share'], between: { text: 'public key', to: 'site' }, result: { ok: true, text: 'Passkey made for bank.example' } },
  { site: 'bank.example', phone: ['Private key'], server: ['Public key'], between: { text: 'challenge: 9f2c…a71', to: 'phone' } },
  { site: 'bank.example', phone: ['Private key', 'Unlocked with your fingerprint'], server: ['Public key'], between: { text: 'signed challenge', to: 'site' } },
  { site: 'bank.example', phone: ['Private key'], server: ['Public key', 'Signature checked'], result: { ok: true, text: 'Signed in. No secret crossed the internet' } },
  { site: 'bank-example.co', fake: true, phone: ['Private key, for bank.example only'], server: ['A copy of the bank’s page'], result: { ok: false, text: 'Wrong address: the phone offers no passkey at all' } },
]

/** How a passkey signs you in, and why a fake site gets nothing (Diagram lab, 5 states). */
export function PasskeyHandshake({ state }: LabProps) {
  const v = VIEWS[clampState(state, VIEWS.length)]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`Your phone holds: ${v.phone.join(', ')}. ${v.site} holds: ${v.server.join(', ')}.${v.between ? ` Sent ${v.between.to === 'site' ? 'to the site' : 'to the phone'}: ${v.between.text}.` : ''}${v.result ? ` ${v.result.text}.` : ''}`} className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <div className="flex min-w-0 flex-col items-center gap-1.5 rounded-2xl border-[1.5px] border-cy bg-cy/10 p-3 text-center">
          <Smartphone size={26} aria-hidden="true" className="text-cy-text" />
          <span className="text-[12px] font-semibold text-ink">Your phone</span>
          {v.phone.map((p) => (
            <span key={p} className="flex max-w-full min-w-0 items-center gap-1 rounded-md bg-sheet px-1.5 py-0.5 text-left text-[11px] leading-4 [overflow-wrap:anywhere] text-ink">
              {p.startsWith('Unlocked') ? <Fingerprint size={11} aria-hidden="true" className="shrink-0" /> : <KeyRound size={11} aria-hidden="true" className="shrink-0" />}
              {p}
            </span>
          ))}
        </div>
        <div className="flex w-[78px] flex-col items-center gap-1 text-center @min-[420px]:w-[110px]">
          {v.between && (
            <>
              <span className="pop-in rounded-md bg-row px-1.5 py-0.5 font-mono text-[10.5px] leading-4 [overflow-wrap:anywhere] text-ink">{v.between.text}</span>
              <span aria-hidden="true" className="text-lg text-cy-text">{v.between.to === 'site' ? '→' : '←'}</span>
            </>
          )}
        </div>
        <div className={cn('flex min-w-0 flex-col items-center gap-1.5 rounded-2xl border-[1.5px] p-3 text-center', v.fake ? 'border-error bg-error/10' : 'border-line bg-row')}>
          <Server size={26} aria-hidden="true" className={v.fake ? 'text-error' : 'text-ink-muted'} />
          <span className={cn('font-mono text-[12px] font-semibold [overflow-wrap:anywhere]', v.fake ? 'text-error' : 'text-ink')}>{v.site}</span>
          {v.server.map((s) => (
            <span key={s} className="max-w-full rounded-md bg-sheet px-1.5 py-0.5 text-[11px] leading-4 [overflow-wrap:anywhere] text-ink">
              {s}
            </span>
          ))}
        </div>
      </div>
      {v.result && (
        <p className={cn('m-0 flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-semibold', v.result.ok ? 'bg-success/12 text-success' : 'bg-error/10 text-error')}>
          {v.result.ok ? <Check size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
          {v.result.text}
        </p>
      )}
    </figure>
  )
}
