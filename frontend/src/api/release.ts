export type ReleaseStatus = 'pending' | 'published'
export type ReleaseLocale = 'zh' | 'en'

export interface ReleaseInfo {
  version: string
  platform: string
  filename: string
  status: ReleaseStatus
  size: string | null
  publishedAt: string | null
  downloadUrl: string | null
  notes: Record<ReleaseLocale, string[]>
}

const FALLBACK_RELEASE: ReleaseInfo = {
  version: '0.1.0',
  platform: 'windows-x64',
  filename: 'MeristemForge-Setup-0.1.0.exe',
  status: 'pending',
  size: null,
  publishedAt: null,
  downloadUrl: null,
  notes: { zh: [], en: [] },
}

function fallbackRelease(): ReleaseInfo {
  return {
    ...FALLBACK_RELEASE,
    notes: { zh: [], en: [] },
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isSafeDownloadUrl(value: unknown): value is string {
  return (
    isNonEmptyString(value) &&
    value.startsWith('/downloads/') &&
    value.length > '/downloads/'.length &&
    !/[\s\u0000-\u001F\u007F-\u009F]/u.test(value)
  )
}

function isLocalizedNotes(value: unknown): value is Record<ReleaseLocale, string[]> {
  if (!isRecord(value) || !Array.isArray(value.zh) || !Array.isArray(value.en)) {
    return false
  }

  return [...value.zh, ...value.en].every(isNonEmptyString)
}

export function normalizeRelease(value: unknown): ReleaseInfo {
  if (!isRecord(value)) {
    return fallbackRelease()
  }

  const { version, platform, filename, status, size, publishedAt, downloadUrl, notes } = value

  if (
    !isNonEmptyString(version) ||
    !isNonEmptyString(platform) ||
    !isNonEmptyString(filename) ||
    (status !== 'pending' && status !== 'published') ||
    !isLocalizedNotes(notes)
  ) {
    return fallbackRelease()
  }

  if (status === 'pending') {
    return {
      version,
      platform,
      filename,
      status,
      size: null,
      publishedAt: null,
      downloadUrl: null,
      notes: { zh: notes.zh, en: notes.en },
    }
  }

  if (!isNonEmptyString(size) || !isNonEmptyString(publishedAt) || !isSafeDownloadUrl(downloadUrl)) {
    return fallbackRelease()
  }

  return {
    version,
    platform,
    filename,
    status,
    size,
    publishedAt,
    downloadUrl,
    notes: { zh: notes.zh, en: notes.en },
  }
}

export async function fetchLatestRelease(): Promise<ReleaseInfo> {
  try {
    const response = await fetch('/releases/latest.json', { cache: 'no-store' })
    if (!response.ok) {
      return fallbackRelease()
    }

    return normalizeRelease(await response.json())
  } catch {
    return fallbackRelease()
  }
}
