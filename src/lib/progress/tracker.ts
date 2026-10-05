/**
 * Measures active learning time: seconds while the page is visible, with any gap between interactions
 * capped at `idleAfterMs`, so a tab left open overnight doesn't count as study.
 */
export function createActiveTimer({ now, idleAfterMs }: { now: () => number; idleAfterMs: number }) {
  let last = now()
  let visible = true
  let bank = 0
  const settle = () => {
    const t = now()
    if (visible) bank += Math.min(t - last, idleAfterMs)
    last = t
  }
  return {
    touch: settle,
    visible(v: boolean) {
      settle()
      visible = v
    },
    /** Whole seconds since the last take; the remainder carries over. */
    take() {
      settle()
      const seconds = Math.floor(bank / 1000)
      bank -= seconds * 1000
      return seconds
    },
  }
}
