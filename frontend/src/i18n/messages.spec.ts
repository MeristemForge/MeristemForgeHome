import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import type { MessageSchema } from './schema'
import en from './en'
import zh from './zh'

describe('message schema', () => {
  it('matches the compile-time locale contract', () => {
    expectTypeOf(zh).toMatchTypeOf<MessageSchema>()
    expectTypeOf(en).toMatchTypeOf<MessageSchema>()
  })
})

function messageShape(value: unknown): unknown {
  if (typeof value === 'string') return 'string'
  if (Array.isArray(value)) return value.map(messageShape)
  if (value === null || typeof value !== 'object') return typeof value

  return Object.fromEntries(
    Object.keys(value)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => [key, messageShape(value[key as keyof typeof value])]),
  )
}

function emptyMessagePaths(value: unknown, path = ''): string[] {
  if (typeof value === 'string') return value.trim() ? [] : [path]
  if (Array.isArray(value)) {
    if (value.length === 0) return [path]
    return value.flatMap((item, index) => emptyMessagePaths(item, `${path}[${index}]`))
  }
  if (value === null || typeof value !== 'object') return [path]
  if (Object.keys(value).length === 0) return [path]

  return Object.entries(value).flatMap(([key, item]) =>
    emptyMessagePaths(item, path ? `${path}.${key}` : key),
  )
}

describe('empty message paths', () => {
  it('reports empty objects at their current path', () => {
    expect(emptyMessagePaths({ section: {} })).toEqual(['section'])
  })
})

describe('locale parity', () => {
  it('has matching recursive message shapes', () => {
    expect(messageShape(en)).toEqual(messageShape(zh))
  })
})

describe.each([
  ['Chinese', zh],
  ['English', en],
])('%s product website messages', (_, messages) => {
  it('contains no empty messages', () => {
    expect(emptyMessagePaths(messages)).toEqual([])
  })

  it('lists video, image, music, and voice capabilities in order', () => {
    expect(Object.keys(messages.capabilities.items)).toEqual([
      'video',
      'image',
      'music',
      'voice',
    ])
    for (const item of Object.values(messages.capabilities.items)) {
      expect(Object.keys(item)).toEqual(['label', 'description'])
      expect(item.label.trim()).not.toBe('')
      expect(item.description.trim()).not.toBe('')
    }
  })

  it('provides copy for the main navigation and calls to action', () => {
    expect(messages.nav.capabilities.trim()).not.toBe('')
    expect(messages.hero.title.trim()).not.toBe('')
    expect(messages.workflow.title.trim()).not.toBe('')
    expect(messages.release.button.trim()).not.toBe('')
    expect(messages.footer.tagline.trim()).not.toBe('')
    expect(messages.workflow.benefits).toHaveLength(4)
    expect(messages.workflow.benefits.every((benefit) => benefit.trim())).toBe(true)
  })

  it('does not keep the obsolete unavailable release message', () => {
    expect('unavailable' in messages.release).toBe(false)
  })
})

describe('initial locale', () => {
  it.each([
    ['en', 'en', 'en'],
    ['zh', 'zh', 'zh-CN'],
    ['unknown', 'zh', 'zh-CN'],
    [null, 'zh', 'zh-CN'],
  ])('uses saved locale %s as %s', async (saved, expected, lang) => {
    vi.resetModules()
    document.documentElement.lang = ''
    if (saved) localStorage.setItem('locale', saved)

    const { default: i18n } = await import('./index')

    expect(i18n.global.locale.value).toBe(expected)
    expect(document.documentElement.lang).toBe(lang)
    expect(i18n.global.fallbackLocale.value).toBe('zh')
  })
})
