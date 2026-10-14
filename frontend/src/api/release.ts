export interface ReleaseInfo {
  version: string
  platform: string
  filename: string
  size: string
  publishedAt: string
  downloadUrl: string
  notes: string[]
}

const FALLBACK_RELEASE: ReleaseInfo = {
  version: '0.1.0',
  platform: 'windows-x64',
  filename: 'MeristemForge-Setup-0.1.0.exe',
  size: '待发布',
  publishedAt: '2026-10-14',
  downloadUrl: '#',
  notes: [],
}

export async function fetchLatestRelease(): Promise<ReleaseInfo> {
  try {
    const response = await fetch('/releases/latest.json', { cache: 'no-store' })
    if (!response.ok) {
      return FALLBACK_RELEASE
    }

    return await response.json()
  } catch {
    return FALLBACK_RELEASE
  }
}
