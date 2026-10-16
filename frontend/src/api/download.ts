export const WINDOWS_INSTALLER_FILENAME = 'MeristemForge-Setup.exe'
export const WINDOWS_INSTALLER_URL = `/downloads/${WINDOWS_INSTALLER_FILENAME}`

export async function checkInstallerAvailability(): Promise<boolean> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  try {
    // Check only headers so opening the page never downloads the installer.
    const response = await fetch(WINDOWS_INSTALLER_URL, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
    })
    if (!response.ok) return false

    // SPA hosts can return index.html with HTTP 200 for a missing file.
    const contentType = (response.headers.get('content-type') ?? '')
      .split(';', 1)[0]?.trim().toLowerCase() ?? ''
    return !contentType.startsWith('text/') &&
      contentType !== 'application/xhtml+xml' &&
      contentType !== 'application/json' &&
      response.headers.get('content-length') !== '0'
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}
