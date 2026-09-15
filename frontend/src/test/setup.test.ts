import { afterAll, expect, it, vi } from 'vitest'

const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia')
const originalScrollIntoView = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollIntoView')
let mutatedMatchMedia: ReturnType<typeof vi.fn>
let mutatedScrollIntoView: ReturnType<typeof vi.fn>

afterAll(() => {
  expect(Object.getOwnPropertyDescriptor(window, 'matchMedia')).toEqual(originalMatchMedia)
  expect(Object.getOwnPropertyDescriptor(Element.prototype, 'scrollIntoView')).toEqual(originalScrollIntoView)
})

it('restores browser API shims after each test', () => {
  expect(window.matchMedia).toBeTypeOf('function')
  expect(Element.prototype.scrollIntoView).toBeTypeOf('function')

  mutatedMatchMedia = vi.fn().mockReturnValue({ matches: true })
  mutatedScrollIntoView = vi.fn()
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: mutatedMatchMedia })
  Element.prototype.scrollIntoView = mutatedScrollIntoView
})

it('resets shims after a prior test deliberately mutates them', () => {
  expect(window.matchMedia).not.toBe(mutatedMatchMedia)
  expect(window.matchMedia('(min-width: 100px)').matches).toBe(false)
  expect(Element.prototype.scrollIntoView).not.toBe(mutatedScrollIntoView)
})
