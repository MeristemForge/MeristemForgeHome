import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(process.cwd(), 'src/assets/main.css'), 'utf8')

function baseDeclarations(selector: string) {
  const start = css.indexOf(`${selector} {`)
  if (start < 0) throw new Error(`Missing CSS rule: ${selector}`)
  const opening = css.indexOf('{', start)
  const closing = css.indexOf('}', opening)
  return css.slice(opening + 1, closing)
}

const panelProperties = /(?:^|;)\s*(?:background|border|border-radius|box-shadow|backdrop-filter)\s*:/

describe('transparent first-screen layout', () => {
  it('keeps the top navigation fixed without a filled panel', () => {
    expect(baseDeclarations('.navbar')).toMatch(/position:\s*fixed/)
    expect(baseDeclarations('.navbar__inner')).not.toMatch(panelProperties)
    expect(baseDeclarations('.navbar__inner')).toMatch(/text-shadow\s*:/)
  })

  it('places the hero copy on the page gradient without a filled panel', () => {
    expect(baseDeclarations('.hero__copy')).not.toMatch(panelProperties)
    expect(baseDeclarations('.hero__copy')).toMatch(/text-shadow\s*:/)
  })
})
