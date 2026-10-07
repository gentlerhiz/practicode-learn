'use client'

import { useActionState, useEffect, useState, useTransition } from 'react'
import { changeEmail, deleteAccount, renameLearner, savePreference, type PreferenceKey } from '@/app/(app)/settings/actions'
import { Glyph } from '@/components/ui/glyph'
import { inputClasses } from '@/components/ui/field'
import { CURRENCIES, type Currency } from '@/content/pricing'
import { PLAN_TIMES, type PlanTimeId } from '@/lib/onboarding/plan'
import { cn } from '@/lib/cn'
import { Pills, Row, Switch, Value, smallButton, smallPrimary } from './parts'

function Saved({ text = 'Saved.' }: { text?: string }) {
  return (
    <p role="status" className="text-[13px] text-success">
      {text}
    </p>
  )
}

/** Name: shown, then edited in place (PrismSettings, Profile). */
export function NameRow({ name }: { name: string | null }) {
  const [editing, setEditing] = useState(false)
  const [state, action, pending] = useActionState(async (prev: Awaited<ReturnType<typeof renameLearner>>, fd: FormData) => {
    const result = await renameLearner(prev, fd)
    if (result?.saved) setEditing(false)
    return result
  }, undefined)
  return (
    <Row>
      {editing ? (
        <form action={action} className="flex min-w-0 flex-1 flex-col gap-2">
          <label htmlFor="settings-name" className="text-[13px] text-ink-muted">
            Name
          </label>
          <input
            id="settings-name"
            name="name"
            defaultValue={name ?? ''}
            maxLength={80}
            autoComplete="name"
            aria-invalid={Boolean(state?.error)}
            aria-describedby={state?.error ? 'settings-name-error' : undefined}
            className={cn(inputClasses, 'h-11')}
          />
          {state?.error && (
            <p id="settings-name-error" role="alert" className="text-[13px] text-error">
              {state.error}
            </p>
          )}
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className={smallPrimary}>
              {pending ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={() => setEditing(false)} className={smallButton}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex min-w-0 flex-col gap-1">
            <Value label="Name" value={name ?? 'Not set'} />
            {state?.saved && <Saved />}
          </div>
          <button type="button" onClick={() => setEditing(true)} className={smallButton}>
            Edit
          </button>
        </>
      )}
    </Row>
  )
}

/** Email: a change is confirmed by a link sent to the new address. */
export function EmailRow({ email }: { email: string | null }) {
  const [editing, setEditing] = useState(false)
  const [state, action, pending] = useActionState(async (prev: Awaited<ReturnType<typeof changeEmail>>, fd: FormData) => {
    const result = await changeEmail(prev, fd)
    if (result?.saved) setEditing(false)
    return result
  }, undefined)
  return (
    <Row>
      {editing ? (
        <form action={action} className="flex min-w-0 flex-1 flex-col gap-2">
          <label htmlFor="settings-email" className="text-[13px] text-ink-muted">
            Email
          </label>
          <input
            id="settings-email"
            name="email"
            type="email"
            defaultValue={email ?? ''}
            autoComplete="email"
            spellCheck={false}
            aria-invalid={Boolean(state?.error)}
            aria-describedby={state?.error ? 'settings-email-error' : 'settings-email-hint'}
            className={cn(inputClasses, 'h-11')}
          />
          {state?.error ? (
            <p id="settings-email-error" role="alert" className="text-[13px] text-error">
              {state.error}
            </p>
          ) : (
            <p id="settings-email-hint" className="text-[13px] text-ink-subtle">
              We’ll email a link to the new address. It switches once you open it.
            </p>
          )}
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className={smallPrimary}>
              {pending ? 'Sending…' : 'Save'}
            </button>
            <button type="button" onClick={() => setEditing(false)} className={smallButton}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex min-w-0 flex-col gap-1">
            <Value label="Email" value={email ?? 'Not set'} />
            {state?.saved && <Saved text="Check your new inbox for a link to confirm the change." />}
          </div>
          <button type="button" onClick={() => setEditing(true)} className={smallButton}>
            Edit
          </button>
        </>
      )}
    </Row>
  )
}

/** Saves one preference as soon as it changes, and shows a quiet "Saved." */
function usePreference<T>(key: PreferenceKey, initial: T) {
  const [value, setValue] = useState(initial)
  const [pending, start] = useTransition()
  const [note, setNote] = useState<string | null>(null)
  const change = (next: T) => {
    setValue(next)
    start(async () => {
      const result = await savePreference(key, next)
      setNote(result?.error ?? 'Saved.')
    })
  }
  return { value, change, pending, note }
}

export function CountryRow({ country, currency }: { country: string; currency: Currency }) {
  const [editing, setEditing] = useState(false)
  const pref = usePreference<Currency>('currency', currency)
  const c = CURRENCIES[pref.value]
  return (
    <Row>
      {editing ? (
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <label htmlFor="settings-currency" className="text-[13px] text-ink-muted">
            Prices shown in
          </label>
          <select
            id="settings-currency"
            value={pref.value}
            onChange={(e) => pref.change(e.target.value as Currency)}
            className={cn(inputClasses, 'h-11')}
          >
            {(Object.keys(CURRENCIES) as Currency[]).map((k) => (
              <option key={k} value={k}>
                {CURRENCIES[k].label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setEditing(false)} className={smallPrimary}>
              Done
            </button>
            {pref.note && <Saved text={pref.note} />}
          </div>
        </div>
      ) : (
        <>
          <Value label="Country and currency" value={`${country} · ${c.label}`} />
          <button type="button" onClick={() => setEditing(true)} className={smallButton}>
            Change
          </button>
        </>
      )}
    </Row>
  )
}

export function GoalPills({ time }: { time: PlanTimeId }) {
  const pref = usePreference<PlanTimeId>('time', time)
  const labels: Record<PlanTimeId, string> = { t10: '10 min', t20: '20 min', t30: '30 min', tw: 'Weekends only' }
  return (
    <div className="flex flex-col gap-3 border-t border-line-subtle py-4">
      <p id="goal-label" className="text-[15px] font-medium text-ink">
        Daily goal
      </p>
      <Pills labelledBy="goal-label" options={PLAN_TIMES.map((t) => ({ id: t.id, label: labels[t.id] }))} value={pref.value} onChange={pref.change} />
      {pref.note && <Saved text={pref.note} />}
    </div>
  )
}

export function WeeklySwitch({ on }: { on: boolean }) {
  const pref = usePreference<boolean>('weekly_email', on)
  return (
    <div className="flex flex-col items-end gap-1">
      <Switch on={pref.value} labelledBy="weekly-label" onChange={pref.change} disabled={pref.pending} />
      {pref.note && <Saved text={pref.note} />}
    </div>
  )
}

/** Lesson pages the service worker has saved, with their sizes, and a button to remove each one. */
export function OfflineList() {
  const [items, setItems] = useState<{ url: string; title: string; bytes: number }[] | null>(null)
  useEffect(() => {
    const load = async () => {
      if (!('caches' in window)) return setItems([])
      const names = (await caches.keys()).filter((n) => n.startsWith('pc-pages'))
      const found: { url: string; title: string; bytes: number }[] = []
      for (const name of names) {
        const cache = await caches.open(name)
        for (const req of await cache.keys()) {
          const path = new URL(req.url).pathname
          if (!path.startsWith('/learn/')) continue
          const res = await cache.match(req)
          const html = res ? await res.clone().text() : ''
          const title = /<title>([^<|]*)/.exec(html)?.[1]?.trim() ?? path
          found.push({ url: req.url, title, bytes: html.length })
        }
      }
      setItems(found)
    }
    load().catch(() => setItems([]))
  }, [])
  const remove = async (url: string) => {
    for (const name of (await caches.keys()).filter((n) => n.startsWith('pc-pages'))) {
      await (await caches.open(name)).delete(url)
    }
    setItems((list) => list?.filter((i) => i.url !== url) ?? [])
  }
  const total = (items ?? []).reduce((sum, i) => sum + i.bytes, 0)
  const size = (b: number) => (b > 1_000_000 ? `${(b / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1000))} KB`)
  return (
    <div className="flex flex-col gap-3 border-t border-line-subtle py-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[15px] font-medium text-ink">Saved for offline</p>
        <p className="text-[13px] text-ink-muted">{items?.length ? `${size(total)} in total` : ''}</p>
      </div>
      {items === null ? null : items.length ? (
        <ul className="flex flex-col gap-2">
          {items.map((i) => (
            <li key={i.url} className="flex items-center justify-between gap-3 rounded-[14px] border border-line bg-row px-4 py-2.5 text-sm text-ink">
              <span className="flex min-w-0 items-center gap-3">
                <span className="block size-2 shrink-0 rounded-full bg-[#4d6bff]" />
                <span className="truncate">{i.title}</span>
              </span>
              <span className="flex shrink-0 items-center gap-3 text-xs text-ink-muted">
                {size(i.bytes)}
                <button
                  type="button"
                  onClick={() => remove(i.url)}
                  aria-label={`Remove ${i.title}`}
                  className="press flex size-8 cursor-pointer items-center justify-center rounded-full border border-line text-ink-muted hover:border-line-strong hover:text-ink"
                >
                  <Glyph name="x" size={14} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[13px] leading-5 text-ink-muted">Nothing saved for offline yet. Any lesson you open is kept on this device.</p>
      )}
    </div>
  )
}

/** "Delete Account", then the canvas's confirmation: Keep My Account or Delete My Account. */
export function DeleteRow() {
  const [asking, setAsking] = useState(false)
  const [state, action, pending] = useActionState(deleteAccount, undefined)
  return (
    <>
      <Row>
        <div className="min-w-0">
          <p className="text-[15px] font-medium text-ink">Delete your account</p>
          <p className="mt-1 text-[13px] leading-5 text-ink-muted">
            Removes your progress and certificates for good. We’ll ask you to confirm.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAsking(true)}
          className={cn(smallButton, 'border-error/50 text-error hover:border-error hover:bg-error/10')}
        >
          Delete Account
        </button>
      </Row>
      {asking && (
        <div role="alertdialog" aria-labelledby="delete-q" aria-describedby="delete-d" className="mt-2 flex flex-col gap-3 rounded-[18px] border border-error/50 bg-row p-5">
          <p id="delete-q" className="text-[15px] font-semibold text-ink">
            Delete your account for good?
          </p>
          <p id="delete-d" className="text-sm leading-[22px] text-ink-muted">
            This removes your progress, projects and certificates, and it can’t be undone. Any paid plan ends straight away.
          </p>
          {state?.error && (
            <p role="alert" className="text-sm text-error">
              {state.error}
            </p>
          )}
          <form action={action} className="flex flex-wrap gap-2">
            <input type="hidden" name="confirm" value="delete" />
            <button type="button" onClick={() => setAsking(false)} className={smallPrimary}>
              Keep My Account
            </button>
            <button type="submit" disabled={pending} className={cn(smallButton, 'border-error/50 text-error hover:border-error hover:bg-error/10')}>
              {pending ? 'Deleting…' : 'Delete My Account'}
            </button>
          </form>
        </div>
      )}
    </>
  )
}
