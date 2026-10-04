import type { LucideIcon, LucideProps } from 'lucide-react'

export {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Code,
  Copy,
  Globe,
  Link as LinkIcon,
  Lock,
  Mail,
  Menu,
  Monitor,
  Moon,
  Play,
  Plus,
  Share2,
  Smartphone,
  Sparkles,
  Sun,
  WifiOff,
  X,
} from 'lucide-react'

/**
 * Renders a lucide icon with the site's stroke width. Decorative by default (aria-hidden);
 * pass `label` when the icon is the only thing that tells the user what it means.
 */
export function Icon({
  as: Glyph,
  label,
  size = 18,
  ...props
}: { as: LucideIcon; label?: string } & LucideProps) {
  return label ? (
    <Glyph role="img" aria-label={label} size={size} strokeWidth={1.85} {...props} />
  ) : (
    <Glyph aria-hidden="true" focusable="false" size={size} strokeWidth={1.85} {...props} />
  )
}
