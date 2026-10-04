import Link from 'next/link'
import { buttonClasses, type ButtonStyle } from './button'

/** A link that looks like a button. Use it for navigation; use Button for actions. */
export function LinkButton<T extends string>({
  variant,
  size,
  className,
  ...props
}: ButtonStyle & React.ComponentProps<typeof Link<T>>) {
  return <Link className={buttonClasses({ variant, size }, className)} {...props} />
}
