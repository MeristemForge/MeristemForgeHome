import { afterEach, beforeEach, vi } from 'vitest'

let originalMatchMedia: PropertyDescriptor | undefined
let originalScrollIntoView: PropertyDescriptor | undefined

beforeEach(() => {
  localStorage.clear()
  originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia')
  originalScrollIntoView = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollIntoView')
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  if (originalMatchMedia) {
    Object.defineProperty(window, 'matchMedia', originalMatchMedia)
  } else {
    Reflect.deleteProperty(window, 'matchMedia')
  }
  if (originalScrollIntoView) {
    Object.defineProperty(Element.prototype, 'scrollIntoView', originalScrollIntoView)
  } else {
    Reflect.deleteProperty(Element.prototype, 'scrollIntoView')
  }
})
