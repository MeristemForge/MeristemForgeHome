import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import en from '@/i18n/en'
import zh from '@/i18n/zh'
import DownloadStatus from './DownloadStatus.vue'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function renderDownloadStatus(release: Record<string, unknown>) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(release),
    }),
  )

  const i18n = createI18n({ legacy: false, locale: 'en', messages: { zh, en } })
  return mount(DownloadStatus, { global: { plugins: [i18n] } })
}

describe('DownloadStatus', () => {
  it('shows a disabled status instead of a link for a pending release with no URL', async () => {
    const wrapper = renderDownloadStatus({
      version: '0.1.0',
      platform: 'windows-x64',
      filename: 'MeristemForge-Setup-0.1.0.exe',
      status: 'pending',
      size: null,
      publishedAt: null,
      downloadUrl: null,
      notes: { zh: [], en: [] },
    })

    await flushPromises()

    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.get('button.download-status').attributes('disabled')).toBeDefined()
  })

  it('keeps a published release with a URL as a downloadable link', async () => {
    const wrapper = renderDownloadStatus({
      version: '0.1.0',
      platform: 'windows-x64',
      filename: 'MeristemForge-Setup-0.1.0.exe',
      status: 'published',
      size: '120 MB',
      publishedAt: '2026-10-14',
      downloadUrl: '/downloads/MeristemForge-Setup-0.1.0.exe',
      notes: { zh: [], en: [] },
    })

    await flushPromises()

    const link = wrapper.get('a.download-status')
    expect(link.attributes('href')).toBe('/downloads/MeristemForge-Setup-0.1.0.exe')
    expect(link.attributes('download')).toBe('MeristemForge-Setup-0.1.0.exe')
  })
})
