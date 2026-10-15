import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'
import type { ReleaseInfo } from '@/api/release'
import en from '@/i18n/en'
import zh from '@/i18n/zh'
import ReleaseDownload from './ReleaseDownload.vue'

const pendingRelease: ReleaseInfo = {
  version: '0.1.0',
  platform: 'windows-x64',
  filename: 'MeristemForge-Setup-0.1.0.exe',
  status: 'pending',
  size: null,
  publishedAt: null,
  downloadUrl: null,
  notes: { zh: [], en: [] },
}

function renderDownload(release: ReleaseInfo | null, loading = false) {
  const i18n = createI18n({ legacy: false, locale: 'zh', messages: { zh, en } })

  return mount(ReleaseDownload, {
    props: { release, loading },
    global: { plugins: [i18n] },
  })
}

describe('ReleaseDownload', () => {
  it('shows a non-interactive status while checking a null release', () => {
    const wrapper = renderDownload(null, true)
    const control = wrapper.get('[data-testid="hero-download"]')

    expect(control.element.tagName).toBe('SPAN')
    expect(control.attributes('role')).toBe('status')
    expect(control.text()).toBe('正在检查发布状态...')
  })

  it('shows a clear pending status without an anchor or button', () => {
    const wrapper = renderDownload(pendingRelease)
    const control = wrapper.get('[data-testid="hero-download"]')

    expect(wrapper.find('a').exists()).toBe(false)
    expect(control.element.tagName).toBe('SPAN')
    expect(control.attributes('role')).toBe('status')
    expect(control.text()).toContain('Windows 安装包即将开放')
  })

  it('does not expose an anchor when a pending release has an unsafe URL', () => {
    const wrapper = renderDownload({ ...pendingRelease, downloadUrl: 'javascript:alert(1)' })
    const control = wrapper.get('[data-testid="hero-download"]')

    expect(wrapper.find('a').exists()).toBe(false)
    expect(control.element.tagName).toBe('SPAN')
    expect(control.text()).toContain('Windows 安装包即将开放')
  })

  it('does not expose an anchor when a published release has an unsafe URL', () => {
    const release: ReleaseInfo = {
      ...pendingRelease,
      status: 'published',
      size: '120 MB',
      publishedAt: '2026-10-14',
      downloadUrl: 'javascript:alert(1)',
    }
    const wrapper = renderDownload(release)
    const control = wrapper.get('[data-testid="hero-download"]')

    expect(wrapper.find('a').exists()).toBe(false)
    expect(control.element.tagName).toBe('SPAN')
    expect(control.attributes('role')).toBe('status')
    expect(control.text()).toContain('Windows 安装包即将开放')
  })

  it('renders a published release as a downloadable anchor', () => {
    const release: ReleaseInfo = {
      ...pendingRelease,
      status: 'published',
      size: '120 MB',
      publishedAt: '2026-10-14',
      downloadUrl: '/downloads/MeristemForge-Setup-0.1.0.exe',
    }
    const wrapper = renderDownload(release)
    const link = wrapper.get('[data-testid="hero-download"]')

    expect(link.element.tagName).toBe('A')
    expect(link.attributes('href')).toBe('/downloads/MeristemForge-Setup-0.1.0.exe')
    expect(link.attributes('download')).toBe('MeristemForge-Setup-0.1.0.exe')
  })

  it('shows a checking status for a published release while loading', () => {
    const release: ReleaseInfo = {
      ...pendingRelease,
      status: 'published',
      size: '120 MB',
      publishedAt: '2026-10-14',
      downloadUrl: '/downloads/MeristemForge-Setup-0.1.0.exe',
    }
    const wrapper = renderDownload(release, true)
    const control = wrapper.get('[data-testid="hero-download"]')

    expect(wrapper.find('a').exists()).toBe(false)
    expect(control.element.tagName).toBe('SPAN')
    expect(control.attributes('role')).toBe('status')
    expect(control.text()).toBe('正在检查发布状态...')
  })
})
