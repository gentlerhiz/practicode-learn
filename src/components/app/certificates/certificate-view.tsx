'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { Logo } from '@/components/layout/logo'
import { buttonClasses } from '@/components/ui/button'
import { Glyph } from '@/components/ui/glyph'

export type CertificateData = {
  name: string
  track: string
  shortTrack: string
  issued: string
  id: string
  exam: string
  skills: { name: string; map: string }[]
  projects: { label: string; title: string; note: string; href: Route }[]
  url: string
}

/** The canvas's hexagon badge: the logo inside a gradient-edged hexagon. */
export function CertificateBadge({ track, size = 280 }: { track: [string, string]; size?: number }) {
  return (
    <svg viewBox="0 0 240 240" role="img" aria-label={`${track.join(' ')} badge`} style={{ width: size, height: size }}>
      <defs>
        <linearGradient id="cert-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4D6BFF" />
          <stop offset="0.5" stopColor="#7B5CFF" />
          <stop offset="1" stopColor="#F0407F" />
        </linearGradient>
        <linearGradient id="cert-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--pc-cert-top)" />
          <stop offset="1" stopColor="var(--pc-sheet)" />
        </linearGradient>
      </defs>
      <polygon points="120,10 215,65 215,175 120,230 25,175 25,65" fill="url(#cert-fill)" stroke="url(#cert-edge)" strokeWidth="7" strokeLinejoin="round" />
      <polygon points="120,34 194,77 194,163 120,206 46,163 46,77" fill="none" stroke="var(--pc-line)" strokeWidth="1.5" />
      <circle cx="70" cy="62" r="6" fill="#8EA2FF" />
      <circle cx="182" cy="96" r="5" fill="#A9B7FF" />
      <circle cx="64" cy="168" r="5" fill="#6F86FF" />
      <g transform="translate(120 104) scale(3.1)">
        <g style={{ fill: 'var(--pc-logo)', stroke: 'var(--pc-logo)', strokeWidth: 0.32, strokeLinejoin: 'round' }}>
          <polygon points="1.6,8.66 5,8.66 10,0 5,-8.66 -5,-8.66 -10,0 -5,8.66 -1,8.66 -3,5.196 -6,0 -3,-5.196 3,-5.196 6,0 3,5.196 -0.4,5.196" />
          <polygon points="-2.8,0 -1.4,2.425 1.4,2.425 2.8,0 1.4,-2.425 -1.4,-2.425" />
        </g>
      </g>
      <text x="120" y="160" textAnchor="middle" style={{ font: "800 14px 'Bricolage Grotesque', sans-serif", fill: 'var(--pc-text)' }}>
        {track[0]}
      </text>
      <text x="120" y="178" textAnchor="middle" style={{ font: "500 11px 'Poppins', sans-serif", fill: 'var(--pc-text-muted)' }}>
        {track[1]}
      </text>
    </svg>
  )
}

/** PrismCertificate: the public page anyone can open to check a credential. */
export function CertificateView({ data }: { data: CertificateData }) {
  const [copied, setCopied] = useState(false)
  const linkedIn = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(data.track)}&organizationName=PractiCode&certId=${encodeURIComponent(data.id)}&certUrl=${encodeURIComponent(data.url)}`
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[260px] -left-[260px] h-[900px] w-[1300px] opacity-(--pc-glow-opacity)"
        style={{
          background:
            'radial-gradient(closest-side at 30% 45%, rgba(77,107,255,0.34), rgba(77,107,255,0) 72%), radial-gradient(closest-side at 75% 50%, rgba(240,64,127,0.20), rgba(240,64,127,0) 72%), radial-gradient(closest-side at 55% 80%, rgba(123,92,255,0.24), rgba(123,92,255,0) 72%)',
        }}
      />
      <header className="relative border-b border-line-subtle">
        <div className="mx-auto flex h-[72px] max-w-[1100px] items-center justify-between gap-4 px-4 ph:px-6">
          <Logo />
          <p className="text-[13px] text-ink-muted">Credential check</p>
        </div>
      </header>
      <main id="main" className="relative mx-auto box-border flex max-w-[1100px] flex-col gap-12 px-4 pt-8 pb-16 ph:px-6 ph:pt-12 ph:pb-20">
        <section className="grid grid-cols-1 items-center gap-12 tab:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <p className="inline-flex items-center gap-2 self-start rounded-full bg-success-fill px-4 py-1.5 text-[13px] font-bold text-on-success">
              <Glyph name="shield" size={16} />
              Verified credential
            </p>
            <h1 className="font-display text-[44px] leading-[48px] font-extrabold tracking-[-0.045em] text-ink ph:text-[68px] ph:leading-[70px]">
              {data.name}
            </h1>
            <p className="text-lg leading-7 text-ink-muted">has shown the skills of a junior front-end developer and earned</p>
            <h2 className="-rotate-1 self-start rounded-xl bg-fe px-4 pt-1 pb-1.5 font-display text-[24px] leading-8 font-extrabold tracking-[-0.02em] text-white ph:text-[30px] ph:leading-9">
              {data.track}
            </h2>
            <dl className="mt-1.5 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {[
                ['Issued', data.issued],
                ['Issued by', 'PractiCode Learn'],
                ['Credential ID', data.id],
                ['Final exam', data.exam],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-ink-subtle">{k}</dt>
                  <dd className={k === 'Credential ID' ? 'mt-0.5 font-mono text-[13px] text-ink' : 'mt-0.5 text-ink'}>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-1.5 flex flex-wrap gap-3">
              <a href={linkedIn} target="_blank" rel="noopener noreferrer" className={buttonClasses({}, 'h-12 px-6')}>
                Add to LinkedIn
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(data.url).then(() => setCopied(true), () => setCopied(false))
                }}
                className={buttonClasses({ variant: 'secondary' }, 'h-12 bg-transparent px-5 font-medium')}
              >
                <Glyph name={copied ? 'check' : 'copy'} size={16} />
                {copied ? 'Link copied' : 'Copy Link'}
              </button>
              <button type="button" onClick={() => window.print()} className={buttonClasses({ variant: 'secondary' }, 'h-12 bg-transparent px-5 font-medium')}>
                <Glyph name="download" size={16} />
                PDF
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <CertificateBadge track={[data.shortTrack, 'Web Development']} />
          </div>
        </section>

        <section aria-labelledby="skills-title" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="skills-title" className="font-display text-[28px] font-extrabold tracking-[-0.03em] text-ink ph:text-[32px]">
              Skills shown
            </h2>
            <p className="text-[13px] text-ink-subtle">Each one passed a mastery check of 80% or more</p>
          </div>
          <ul className="grid grid-cols-1 gap-3 ph:grid-cols-2 tab:grid-cols-3">
            {data.skills.map((s) => (
              <li key={s.name} className="surface flex items-start gap-3 rounded-[18px] border border-line p-4">
                <span className="mt-px flex size-6 shrink-0 items-center justify-center rounded-lg bg-fe text-white">
                  <Glyph name="check" size={13} strokeWidth={2.6} />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-ink">{s.name}</span>
                  <span className="text-xs text-ink-subtle">{s.map}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="projects-title" className="flex flex-col gap-4">
          <h2 id="projects-title" className="font-display text-[28px] font-extrabold tracking-[-0.03em] text-ink ph:text-[32px]">
            Projects
          </h2>
          <div className="grid grid-cols-1 gap-4 tab:grid-cols-3">
            {data.projects.map((p) => (
              <article
                key={p.title}
                className="flex flex-col gap-3 rounded-[22px] border border-[rgba(77,107,255,0.4)] p-5"
                style={{ background: 'linear-gradient(170deg, rgba(77,107,255,0.16), var(--pc-sheet) 65%)' }}
              >
                <p className="text-xs font-semibold text-fe-text">{p.label}</p>
                <h3 className="font-display text-[19px] font-bold text-ink">{p.title}</h3>
                <p className="text-[13px] leading-5 text-ink-muted">{p.note}</p>
                <Link href={p.href} className="mt-auto text-[13px] font-semibold text-fe-text underline underline-offset-2 hover:no-underline">
                  View project →
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="verify-title" className="surface grid grid-cols-1 gap-8 rounded-[26px] border border-line p-6 ph:p-8 tab:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h2 id="verify-title" className="font-display text-2xl font-extrabold text-ink">
              How to check this is real
            </h2>
            <p className="text-sm leading-[23px] text-ink-muted">
              This certificate is an Open Badges 3.0 credential, signed by PractiCode. Anyone can check the signature. Nobody can
              edit the details, not even the person who earned it.
            </p>
            <p className="text-[13px] leading-[21px] text-ink-subtle">
              It shows skills aligned to the MDN Curriculum and SFIA 9. It isn’t a degree or a vendor certification.
            </p>
          </div>
          <dl className="flex flex-col gap-3 text-sm">
            {[
              ['Signature', 'Valid'],
              ['Standard', 'Open Badges 3.0 (W3C Verifiable Credential)'],
              ['Issuer', 'learn.practicode.tech'],
              ['Status', 'Active, not revoked'],
            ].map(([k, v], i, all) => (
              <div key={k} className={i < all.length - 1 ? 'flex justify-between gap-3 border-b border-divider pb-3' : 'flex justify-between gap-3'}>
                <dt className="text-ink-subtle">{k}</dt>
                <dd className={k === 'Signature' ? 'flex items-center gap-1.5 text-success' : 'text-right text-ink'}>
                  {k === 'Signature' && <Glyph name="check" size={15} strokeWidth={2.4} />}
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </div>
  )
}
