import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(process.cwd(), 'src/assets/main.css'), 'utf8')

function declarations(selector: string, from = 0) {
  const start = css.indexOf(`${selector} {`, from)
  if (start < 0) throw new Error(`Missing CSS rule: ${selector}`)
  const opening = css.indexOf('{', start)
  const closing = css.indexOf('}', opening)
  return css.slice(opening + 1, closing)
}

const panelProperties = /(?:^|;)\s*(?:background|border|border-radius|box-shadow|backdrop-filter)\s*:/

describe('transparent first-screen layout', () => {
  it('shows the top navigation only at the start of the page', () => {
    expect(declarations('.navbar')).toMatch(/position:\s*relative/)
    expect(declarations('.navbar__inner')).not.toMatch(panelProperties)
    expect(declarations('.navbar__inner')).toMatch(/text-shadow\s*:/)
  })

  it('places mobile navigation links at the top instead of floating at the bottom', () => {
    const mobile = declarations('.nav-links', css.indexOf('@media (max-width: 640px)'))
    expect(mobile).not.toMatch(/position:\s*fixed|bottom\s*:/)
    expect(mobile).not.toMatch(panelProperties)
    expect(mobile).toMatch(/grid-column:\s*1\s*\/\s*-1/)
    expect(mobile).toMatch(/grid-row:\s*2/)
    const mobileActions = declarations('.nav-actions', css.indexOf('@media (max-width: 640px)'))
    expect(mobileActions).toMatch(/grid-column:\s*2/)
    expect(mobileActions).toMatch(/grid-row:\s*1/)
  })

  it('places the hero copy on the page gradient without a filled panel', () => {
    expect(declarations('.hero__copy')).not.toMatch(panelProperties)
    expect(declarations('.hero__copy')).toMatch(/text-shadow\s*:/)
  })
})
