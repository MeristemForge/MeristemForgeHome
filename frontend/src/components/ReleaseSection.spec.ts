import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import en from '@/i18n/en'
import zh from '@/i18n/zh'
import ReleaseSection from './ReleaseSection.vue'

describe('ReleaseSection', () => {
  it('shows localized release information without a download control', () => {
    const i18n = createI18n({ legacy: false, locale: 'en', messages: { zh, en } })
    const wrapper = mount(ReleaseSection, {
      props: { available: false, loading: false },
      global: { plugins: [i18n] },
    })

    expect(wrapper.text()).toContain('Run locally with your files under your control')
    expect(wrapper.text()).toContain('Unavailable')
    expect(wrapper.text()).not.toContain('本地运行')
    expect(wrapper.find('.download-status').exists()).toBe(false)
  })
})
