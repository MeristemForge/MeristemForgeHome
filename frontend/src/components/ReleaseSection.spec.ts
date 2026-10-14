import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import type { ReleaseInfo } from '@/api/release'
import en from '@/i18n/en'
import zh from '@/i18n/zh'
import ReleaseSection from './ReleaseSection.vue'

describe('ReleaseSection', () => {
  it('shows localized release information without a download control', () => {
    const release: ReleaseInfo = {
      version: '0.1.0',
      platform: 'windows-x64',
      filename: 'MeristemForge-Setup-0.1.0.exe',
      status: 'pending',
      size: null,
      publishedAt: null,
      downloadUrl: null,
      notes: { zh: ['首个公开版本'], en: ['First public release'] },
    }
    const i18n = createI18n({ legacy: false, locale: 'en', messages: { zh, en } })
    const wrapper = mount(ReleaseSection, {
      props: { release },
      global: { plugins: [i18n] },
    })

    expect(wrapper.text()).toContain('First public release')
    expect(wrapper.text()).toContain('Coming Soon')
    expect(wrapper.text()).not.toContain('首个公开版本')
    expect(wrapper.find('.download-status').exists()).toBe(false)
  })
})
