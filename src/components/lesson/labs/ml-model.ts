// A tiny, real machine-learning model for the machine-learning lab: it learns "ripe" or "not ripe" from
// examples of bananas, each described by colour (0 green, 1 yellow) and softness (0 hard, 1 soft).
// The model is a nearest-centroid classifier: it works out the average ripe and the average unripe
// banana from its examples, and labels a new banana by whichever average it's closer to.

export type Point = { colour: number; soft: number; ripe: boolean }

/** A repeatable random number generator, so every learner sees the same bananas. */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}

/** The real rule the model never sees: colour and softness count equally. */
export const truth = (colour: number, soft: number) => colour * 0.5 + soft * 0.5 > 0.5

function bananas(n: number, seed: number, keep: (p: Point) => boolean = () => true): Point[] {
  const next = rng(seed)
  const out: Point[] = []
  while (out.length < n) {
    const colour = next()
    const soft = next()
    const p = { colour, soft, ripe: truth(colour, soft) }
    if (keep(p)) out.push(p)
  }
  return out
}

/** Bananas the model is tested on, which it never learns from. */
export const TEST = bananas(40, 99)

export const TRAINING: Record<string, Point[]> = {
  '4 examples': bananas(4, 7),
  '20 examples': bananas(20, 11),
  '200 examples': bananas(200, 13),
  // Only hard bananas: the model never sees a soft green one, so it learns that colour is everything.
  'Biased examples': bananas(20, 17, (p) => p.soft < 0.3),
}

export type Model = { ripe: { colour: number; soft: number }; unripe: { colour: number; soft: number } } | null

export function train(examples: Point[]): Model {
  const mean = (ps: Point[]) => ({
    colour: ps.reduce((a, p) => a + p.colour, 0) / ps.length,
    soft: ps.reduce((a, p) => a + p.soft, 0) / ps.length,
  })
  const ripe = examples.filter((p) => p.ripe)
  const unripe = examples.filter((p) => !p.ripe)
  if (!ripe.length || !unripe.length) return null
  return { ripe: mean(ripe), unripe: mean(unripe) }
}

export function predict(model: Model, p: { colour: number; soft: number }): boolean {
  if (!model) return false
  const d = (c: { colour: number; soft: number }) => (p.colour - c.colour) ** 2 + (p.soft - c.soft) ** 2
  return d(model.ripe) < d(model.unripe)
}

/** How many of the test bananas the model gets right, out of 100. */
export function accuracy(model: Model): number {
  const right = TEST.filter((p) => predict(model, p) === p.ripe).length
  return Math.round((right / TEST.length) * 100)
}
