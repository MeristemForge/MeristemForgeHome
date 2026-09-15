import { afterAll, expect, it } from 'vitest'

const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia')
const originalScrollIntoView = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollIntoView')

afterAll(() => {
  expect(Object.getOwnPropertyDescriptor(window, 'matchMedia')).toEqual(originalMatchMedia)
  expect(Object.getOwnPropertyDescriptor(Element.prototype, 'scrollIntoView')).toEqual(originalScrollIntoView)
})

it('restores browser API shims after each test', () => {
  expect(window.matchMedia).toBeTypeOf('function')
  expect(Element.prototype.scrollIntoView).toBeTypeOf('function')
})
