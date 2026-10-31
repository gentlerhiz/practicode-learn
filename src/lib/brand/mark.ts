// Read by the app and directly by the content tools, so: no imports, erasable syntax only.

/**
 * The PractiCode mark (brand/logo) as two polygons, in its own units: 20.8 wide and 18.12 tall, centred
 * on 0, 0. Used wherever the mark is drawn rather than placed as a file: certificates and module notes.
 */
export const MARK: [number, number][][] = [
  [
    [1.6, 8.66],
    [5, 8.66],
    [10, 0],
    [5, -8.66],
    [-5, -8.66],
    [-10, 0],
    [-5, 8.66],
    [-1, 8.66],
    [-3, 5.196],
    [-6, 0],
    [-3, -5.196],
    [3, -5.196],
    [6, 0],
    [3, 5.196],
    [-0.4, 5.196],
  ],
  [
    [-2.8, 0],
    [-1.4, 2.425],
    [1.4, 2.425],
    [2.8, 0],
    [1.4, -2.425],
    [-1.4, -2.425],
  ],
]
