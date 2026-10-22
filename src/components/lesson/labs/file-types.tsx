'use client'
import { C, type LabProps } from './shared'

type Kind = { file: string; what: string; opens: string; colour: string; careful?: string }

const KINDS: Record<string, Kind> = {
  '.docx': { file: 'report.docx', what: 'A Word document: formatted text, headings, pictures', opens: 'Microsoft Word, LibreOffice Writer, Google Docs, Pages', colour: '#3d5af5' },
  '.pdf': { file: 'ticket.pdf', what: 'A fixed page that looks the same everywhere, for printing and sharing', opens: 'Any web browser, or a PDF reader', colour: '#d9306f' },
  '.jpg': { file: 'beach.jpg', what: 'A photo, squeezed to a small size (compressed)', opens: 'Photos (Windows), Preview (Mac), Gallery or Photos (phones)', colour: '#0a7d5c' },
  '.mp3': { file: 'song.mp3', what: 'A piece of sound or music, compressed', opens: 'Any music or media player', colour: '#6e4cf5' },
  '.mp4': { file: 'party.mp4', what: 'A video, with its sound', opens: 'Any media player, such as VLC, or a web browser', colour: '#0e7490' },
  '.zip': {
    file: 'photos.zip',
    what: 'Several files squeezed into one, to send or download',
    opens: 'Built into Windows and macOS: open it, then Extract All (Windows) or double-click (Mac)',
    colour: '#a85a00',
  },
  '.exe': {
    file: 'setup.exe',
    what: 'A program for Windows: opening it runs it',
    opens: 'Windows runs it itself. Macs and phones can’t',
    colour: '#b42834',
    careful:
      'Only run an .exe you chose to download from a maker you trust. One arriving by email or chat is a classic way to spread malware.',
  },
}

/** A file icon for each common extension, with what it holds and what opens it (Explore lab: value = .pdf). */
export function FileTypes({ value = '.docx' }: LabProps) {
  const ext = KINDS[value] ? value : '.docx'
  const k = KINDS[ext]!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${k.file}: ${k.what}. Opens with ${k.opens}.`}>
      <div className="flex items-center gap-4 rounded-2xl border border-line bg-row p-3">
        <svg viewBox="0 0 64 80" aria-hidden="true" className="h-[80px] w-[64px] shrink-0">
          <path d="M6 4 H42 L58 20 V76 H6 Z" fill={C.sheet} stroke={C.soft} strokeWidth="2" strokeLinejoin="round" />
          <path d="M42 4 V20 H58" fill="none" stroke={C.soft} strokeWidth="2" strokeLinejoin="round" />
          <rect x="2" y="44" width="48" height="20" rx="4" fill={k.colour} />
          <text x="26" y="58" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="var(--font-mono)">
            {ext.slice(1).toUpperCase()}
          </text>
        </svg>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="font-mono text-[15px] font-semibold break-all text-ink">
            {k.file.slice(0, -ext.length)}
            <span className="text-it-text">{ext}</span>
          </p>
          <p className="text-[13px] leading-5 text-ink-soft">{k.what}</p>
        </div>
      </div>
      <dl className="flex flex-col divide-y divide-divider">
        <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 py-2 text-[13px] leading-5">
          <dt className="text-ink-subtle">Extension</dt>
          <dd className="font-mono text-ink">{ext}</dd>
        </div>
        <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 py-2 text-[13px] leading-5">
          <dt className="text-ink-subtle">Opens with</dt>
          <dd className="text-ink">{k.opens}</dd>
        </div>
      </dl>
      {k.careful && <p className="rounded-2xl border border-error bg-row px-4 py-3 text-[13px] leading-5 text-ink">{k.careful}</p>}
    </figure>
  )
}
