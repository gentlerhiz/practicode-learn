import { expect, it } from 'vitest'
import { evaluate, expandRange, formula, show } from './sheet-engine'

const cells = { A1: 'Item', B1: 'Cost', B2: '120', B3: '45', B4: '300', B5: '35', C2: '2', D1: '=B2*C2', D2: '=D1+1', E1: '=E1', F1: 'hello' }
const f = (src: string) => formula(cells, src)

it('expands ranges row by row', () => {
  expect(expandRange('B2', 'B4')).toEqual(['B2', 'B3', 'B4'])
  expect(expandRange('B2', 'C3')).toEqual(['B2', 'C2', 'B3', 'C3'])
})

it('works out arithmetic with the usual order, brackets and cell references', () => {
  expect(f('B2+B3').value).toBe(165)
  expect(f('2+3*4').value).toBe(14)
  expect(f('(2+3)*4').value).toBe(20)
  expect(f('B4/C2').value).toBe(150)
  expect(f('-B5+5').value).toBe(-30)
  expect(f('b2 + b3').value).toBe(165)
})

it('has SUM, AVERAGE, MIN, MAX and COUNT, over ranges and lists', () => {
  expect(f('SUM(B2:B5)')).toMatchObject({ value: 500, refs: ['B2', 'B3', 'B4', 'B5'] })
  expect(f('AVERAGE(B2:B5)').value).toBe(125)
  expect(f('MIN(B2:B5)').value).toBe(35)
  expect(f('MAX(B2:B5)').value).toBe(300)
  expect(f('COUNT(A1:B5)').value).toBe(4)
  expect(f('SUM(B2,B3,10)').value).toBe(175)
  expect(f('sum(b2:b3)').value).toBe(165)
})

it('follows formulas that use other formulas', () => {
  expect(evaluate(cells, 'D1').value).toBe(240)
  expect(evaluate(cells, 'D2').value).toBe(241)
})

it('gives the real error codes', () => {
  expect(f('B2/0').error).toBe('#DIV/0!')
  expect(f('SUMM(B2:B5)').error).toBe('#NAME?')
  expect(f('F1+1').error).toBe('#VALUE!')
  expect(evaluate(cells, 'E1').error).toBe('#REF!')
  expect(f('B2+').error).toBe('#ERROR!')
  expect(f('AVERAGE(A1:A1)').error).toBe('#DIV/0!')
})

it('shows numbers as a spreadsheet would', () => {
  expect(show(1234.5)).toBe('1,234.5')
  expect(show(10 / 3)).toBe('3.33')
  expect(show('Item')).toBe('Item')
})
