import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchLatestRelease, normalizeRelease } from './release'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('normalizeRelease', () => {
  it('keeps a complete published release downloadable', () => {
    const release = normalizeRelease({
      version: '0.1.0',
      platform: 'windows-x64',
      filename: 'MeristemForge-Setup-0.1.0.exe',
      status: 'published',
      size: '120 MB',
      publishedAt: '2026-10-14',
      downloadUrl: '/downloads/MeristemForge-Setup-0.1.0.exe',
      notes: {
        zh: ['首个公开版本'],
        en: ['First public release'],
      },
    })

    expect(release.status).toBe('published')
    expect(release.size).toBe('120 MB')
    expect(release.downloadUrl).toBe('/downloads/MeristemForge-Setup-0.1.0.exe')
  })

  it('strips download metadata from pending releases', () => {
    const release = normalizeRelease({
      version: '0.1.0',
      platform: 'windows-x64',
      filename: 'MeristemForge-Setup-0.1.0.exe',
      status: 'pending',
      size: '120 MB',
      publishedAt: '2026-10-14',
      downloadUrl: '/downloads/placeholder.exe',
      notes: { zh: ['即将发布'], en: ['Coming soon'] },
    })

    expect(release.status).toBe('pending')
    expect(release.size).toBeNull()
    expect(release.publishedAt).toBeNull()
    expect(release.downloadUrl).toBeNull()
  })

  it('falls back safely for malformed published data', () => {
    const release = normalizeRelease({ status: 'published', downloadUrl: '/unsafe.exe' })

    expect(release.status).toBe('pending')
    expect(release.size).toBeNull()
    expect(release.publishedAt).toBeNull()
    expect(release.downloadUrl).toBeNull()
    expect(release.notes).toEqual({ zh: [], en: [] })
  })

  it.each([
    'javascript:alert(1)',
    'data:text/plain,unsafe',
    'https://example.com/download.exe',
    '//example.com/download.exe',
    '/downloads/../evil.exe',
    '/downloads/%2e%2e/evil.exe',
    '/downloads/%2e/ok.exe',
    '/downloads/file.exe\\evil',
    '/downloads/file.exe ',
    '/downloads/file.exe\t',
    '/downloads/file.exe\0',
    '/downloads/file.exe\u2028',
    '/downloads/file.exe\n',
  ])('falls back safely for a published release with unsafe download URL %s', (downloadUrl) => {
    const release = normalizeRelease({
      version: '0.1.0',
      platform: 'windows-x64',
      filename: 'MeristemForge-Setup-0.1.0.exe',
      status: 'published',
      size: '120 MB',
      publishedAt: '2026-10-14',
      downloadUrl,
      notes: {
        zh: ['首个公开版本'],
        en: ['First public release'],
      },
    })

    expect(release.status).toBe('pending')
    expect(release.size).toBeNull()
    expect(release.publishedAt).toBeNull()
    expect(release.downloadUrl).toBeNull()
    expect(release.notes).toEqual({ zh: [], en: [] })
  })
})

describe('fetchLatestRelease', () => {
  it('normalizes fetched pending data and strips its placeholder URL', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          version: '0.1.0',
          platform: 'windows-x64',
          filename: 'MeristemForge-Setup-0.1.0.exe',
          status: 'pending',
          size: '待发布',
          publishedAt: '2026-10-14',
          downloadUrl: '#',
          notes: { zh: ['首个公开版本'], en: ['First public release'] },
        }),
      }),
    )

    const release = await fetchLatestRelease()

    expect(release.status).toBe('pending')
    expect(release.size).toBeNull()
    expect(release.publishedAt).toBeNull()
    expect(release.downloadUrl).toBeNull()
  })

  it('returns a safe pending fallback when fetching fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))

    const release = await fetchLatestRelease()

    expect(release.status).toBe('pending')
    expect(release.size).toBeNull()
    expect(release.publishedAt).toBeNull()
    expect(release.downloadUrl).toBeNull()
    expect(release.notes).toEqual({ zh: [], en: [] })
  })
})
