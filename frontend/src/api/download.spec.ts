import { afterEach, describe, expect, it, vi } from 'vitest'
import { checkInstallerAvailability, WINDOWS_INSTALLER_URL } from './download'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('installer availability', () => {
  it('checks the installer directly with an uncached HEAD request', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, {
      headers: { 'content-type': 'application/octet-stream', 'content-length': '123456' },
    }))
    vi.stubGlobal('fetch', fetchMock)

    expect(await checkInstallerAvailability()).toBe(true)
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(WINDOWS_INSTALLER_URL, {
      method: 'HEAD', cache: 'no-store', signal: expect.any(AbortSignal),
    })
  })

  it('accepts executable content types without requiring optional size headers', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, {
      headers: { 'content-type': 'application/x-msdownload' },
    })))
    expect(await checkInstallerAvailability()).toBe(true)
  })

  it.each([404, 403, 500])('keeps downloads unavailable for HTTP %s', async (status) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status })))
    expect(await checkInstallerAvailability()).toBe(false)
  })

  it.each(['text/html; charset=utf-8', 'application/xhtml+xml', 'application/json', 'text/plain'])
    ('rejects a successful response containing %s instead of an installer', async (contentType) => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, {
        headers: { 'content-type': contentType },
      })))
      expect(await checkInstallerAvailability()).toBe(false)
    })

  it('does not offer an empty placeholder file', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, {
      headers: { 'content-type': 'application/octet-stream', 'content-length': '0' },
    })))
    expect(await checkInstallerAvailability()).toBe(false)
  })

  it('keeps downloads unavailable on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    expect(await checkInstallerAvailability()).toBe(false)
  })

  it('ends a stalled check after ten seconds', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn().mockImplementation((_url, { signal }: RequestInit) =>
      new Promise((_resolve, reject) => {
        signal?.addEventListener('abort', () => reject(new Error('aborted')), { once: true })
      }),
    ))
    const result = checkInstallerAvailability()
    await vi.advanceTimersByTimeAsync(10_000)
    expect(await result).toBe(false)
    expect(vi.getTimerCount()).toBe(0)
  })
})
