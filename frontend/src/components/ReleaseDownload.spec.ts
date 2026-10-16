import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'
import en from '@/i18n/en'
import zh from '@/i18n/zh'
import ReleaseDownload from './ReleaseDownload.vue'

function renderDownload(available: boolean, loading = false) {
  const i18n = createI18n({ legacy: false, locale: 'zh', messages: { zh, en } })
  return mount(ReleaseDownload, {
    props: { available, loading },
    global: { plugins: [i18n] },
  })
}

describe('ReleaseDownload', () => {
  it('shows a non-interactive checking status', () => {
    const wrapper = renderDownload(false, true)
    const control = wrapper.get('[data-testid="hero-download"]')
    expect(control.element.tagName).toBe('SPAN')
    expect(control.attributes('role')).toBe('status')
    expect(control.text()).toBe('正在检查安装包...')
  })

  it('does not offer a download before the installer is uploaded', () => {
    const wrapper = renderDownload(false)
    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.get('[role="status"]').text()).toContain('Windows 安装包暂不可用')
  })

  it('links directly to the fixed installer filename when available', () => {
    const wrapper = renderDownload(true)
    const link = wrapper.get('[data-testid="hero-download"]')
    expect(link.element.tagName).toBe('A')
    expect(link.text()).toBe('下载 Windows 版')
    expect(link.attributes('href')).toBe('/downloads/MeristemForge-Setup.exe')
    expect(link.attributes('download')).toBe('MeristemForge-Setup.exe')
  })

  it('keeps a download non-interactive while checking', () => {
    const wrapper = renderDownload(true, true)
    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.get('[role="status"]').text()).toBe('正在检查安装包...')
  })
})
