'use client'
import type { LabProps } from './shared'

type Message = { start: string; headers: [string, string][]; body?: string }

// Real requests to the practice café API, and what it answers.
const EXCHANGES: Record<string, { request: Message; response: Message; says: string }> = {
  'GET /menu': {
    request: { start: 'GET /menu HTTP/1.1', headers: [['Host', 'api.cafe.example'], ['Accept', 'application/json']] },
    response: {
      start: 'HTTP/1.1 200 OK',
      headers: [['Content-Type', 'application/json']],
      body: '[\n  { "id": 1, "name": "Espresso", "price": 2.5 },\n  { "id": 2, "name": "Flat white", "price": 3.2 }\n]',
    },
    says: 'GET asks for something. Here the path /menu asks for the whole menu, and nothing needs a body.',
  },
  'GET /menu/2': {
    request: { start: 'GET /menu/2 HTTP/1.1', headers: [['Host', 'api.cafe.example'], ['Accept', 'application/json']] },
    response: {
      start: 'HTTP/1.1 200 OK',
      headers: [['Content-Type', 'application/json']],
      body: '{ "id": 2, "name": "Flat white", "price": 3.2 }',
    },
    says: 'The same method, a more exact path: /menu/2 means item 2 on the menu, and only that item comes back.',
  },
  'POST /orders': {
    request: {
      start: 'POST /orders HTTP/1.1',
      headers: [['Host', 'api.cafe.example'], ['Content-Type', 'application/json'], ['Authorization', 'Bearer 7f3a…']],
      body: '{ "item": 2, "quantity": 2 }',
    },
    response: {
      start: 'HTTP/1.1 201 Created',
      headers: [['Content-Type', 'application/json'], ['Location', '/orders/1042']],
      body: '{ "id": 1042, "item": 2, "quantity": 2, "total": 6.4 }',
    },
    says: 'POST sends something new, so the request carries a body. A header proves who’s ordering, and the reply says it was created.',
  },
  'DELETE /orders/1042': {
    request: {
      start: 'DELETE /orders/1042 HTTP/1.1',
      headers: [['Host', 'api.cafe.example'], ['Authorization', 'Bearer 7f3a…']],
    },
    response: { start: 'HTTP/1.1 204 No Content', headers: [] },
    says: 'DELETE removes the thing at that path. The reply has nothing to send back, and 204 No Content says exactly that.',
  },
}

function Block({ title, m }: { title: string; m: Message }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-2xl border border-line bg-row p-3">
      <span className="text-xs font-semibold text-ink-subtle">{title}</span>
      <pre className="m-0 overflow-x-auto font-mono text-[12.5px] leading-5 whitespace-pre-wrap text-ink">
        <span className="font-bold text-fe-text">{m.start}</span>
        {m.headers.map(([k, v]) => (
          <span key={k}>
            {'\n'}
            <span className="text-ink-soft">{k}:</span> {v}
          </span>
        ))}
        {m.body && `\n\n${m.body}`}
      </pre>
    </div>
  )
}

/** A request to the practice café API, with the full request and response (Explore lab: value = a request). */
export function RequestBuilder({ value = 'GET /menu' }: LabProps) {
  const x = EXCHANGES[value] ?? EXCHANGES['GET /menu']!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div className="flex flex-col gap-2 @min-[540px]:flex-row">
        <Block title="Request" m={x.request} />
        <Block title="Response" m={x.response} />
      </div>
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink-soft">{x.says}</figcaption>
    </figure>
  )
}
