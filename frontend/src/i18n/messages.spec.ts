import { describe, expect, it, vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import en from './en'
import zh from './zh'

const expectedKeys = {
  nav: ['capabilities', 'workflow', 'about', 'language'],
  hero: ['eyebrow', 'title', 'subtitle', 'explore', 'mascotAlt'],
  capabilities: ['eyebrow', 'title', 'subtitle', 'items'],
  workflow: ['eyebrow', 'title', 'description', 'benefits'],
  release: ['eyebrow', 'title', 'description', 'button'],
  footer: ['tagline', 'copyright'],
}

describe.each([
  ['Chinese', zh],
  ['English', en],
])('%s product website messages', (_, messages) => {
  it('defines the complete section contract', () => {
    expect(Object.keys(messages).slice(0, 5)).toEqual(Object.keys(expectedKeys).slice(0, 5))
    for (const [section, keys] of Object.entries(expectedKeys)) {
      expect(Object.keys(messages[section as keyof typeof messages]).slice(0, keys.length)).toEqual(keys)
    }
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
})

const legacyKeys = [
  'nav.projects', 'nav.admin', 'hero.cta',
  'projects.title', 'projects.subtitle', 'projects.download',
  'projects.version', 'projects.platforms', 'projects.changelog',
  'projects.noVersions',
  'admin.login', 'admin.username', 'admin.password', 'admin.submit',
  'admin.logout', 'admin.createProject', 'admin.editProject',
  'admin.deleteProject', 'admin.createVersion', 'admin.uploadFiles',
  'admin.projectName', 'admin.icon', 'admin.descriptionEn',
  'admin.descriptionZh', 'admin.save', 'admin.cancel',
  'admin.confirmDelete', 'admin.versionNumber', 'admin.changelogEn',
  'admin.changelogZh', 'admin.manageVersions', 'admin.fileType',
  'admin.platform', 'admin.selectFile', 'admin.upload',
  'admin.backToProjects',
]

describe.each([
  ['Chinese', zh],
  ['English', en],
])('%s legacy-page compatibility', (_, messages) => {
  it('still resolves every translation used by the old pages', () => {
    const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: messages } })
    for (const key of legacyKeys) {
      expect(i18n.global.te(key), key).toBe(true)
      expect(i18n.global.t(key), key).not.toBe(key)
    }
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
