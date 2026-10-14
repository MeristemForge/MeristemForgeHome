# Single Download Release Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep one safe hero download control, centralize release loading, localize release information, and prevent pending releases from linking to nonexistent installers.

**Architecture:** `Home.vue` fetches and normalizes release data once, then passes it to a focused hero download component and an information-only release section. A typed, language-neutral manifest controls availability while Vue I18n owns interface status text and the browser title.

**Tech Stack:** Vue 3 Composition API, TypeScript, Vue I18n, Vitest, Vue Test Utils, Vite

---

## File Structure

- Modify `frontend/src/api/release.ts`: define the release manifest contract, normalize untrusted JSON, and provide a safe pending fallback.
- Create `frontend/src/api/release.spec.ts`: verify published, pending, malformed, and fetch-failure behavior.
- Modify `frontend/public/releases/latest.json`: represent `0.1.0` as explicitly pending with localized notes and no URL.
- Create `frontend/src/components/ReleaseDownload.vue`: render the hero's only download control without fetching data.
- Create `frontend/src/components/ReleaseDownload.spec.ts`: verify loading, pending, stray-URL, and published states.
- Delete `frontend/src/components/DownloadStatus.vue`: remove the self-fetching multi-location control.
- Modify `frontend/src/views/Home.vue`: own the single release request and pass state to child components.
- Modify `frontend/src/components/HeroSection.vue`: host the single `ReleaseDownload` control.
- Modify `frontend/src/components/ReleaseSection.vue`: render localized release information without a download control.
- Modify `frontend/src/components/Navbar.vue`: remove the compact release control.
- Modify `frontend/src/views/Home.spec.ts`, `frontend/src/components/Navbar.spec.ts`: verify one fetch and one control.
- Create `frontend/src/components/ReleaseSection.spec.ts`: verify localized notes and information-only behavior.
- Modify `frontend/src/i18n/schema.ts`, `zh.ts`, `en.ts`, `index.ts`, and `messages.spec.ts`: add status/title copy and synchronize document metadata.
- Modify `frontend/src/assets/main.css`: remove obsolete compact-button rules and add spaced metadata/note layout.

### Task 1: Normalize the Release Manifest

**Files:**
- Modify: `frontend/src/api/release.ts`
- Create: `frontend/src/api/release.spec.ts`
- Modify: `frontend/public/releases/latest.json`

- [ ] **Step 1: Write failing normalization tests**

Create `frontend/src/api/release.spec.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchLatestRelease, normalizeRelease } from './release'

const notes = {
  zh: ['首个公开版本'],
  en: ['First public release'],
}

describe('normalizeRelease', () => {
  it('keeps a complete published release downloadable', () => {
    expect(normalizeRelease({
      version: '0.1.0',
      platform: 'windows-x64',
      filename: 'MeristemForge-Setup-0.1.0.exe',
      status: 'published',
      size: '120 MB',
      publishedAt: '2026-10-14',
      downloadUrl: '/downloads/MeristemForge-Setup-0.1.0.exe',
      notes,
    })).toMatchObject({
      status: 'published',
      size: '120 MB',
      downloadUrl: '/downloads/MeristemForge-Setup-0.1.0.exe',
    })
  })

  it('removes download data from a pending release even when input contains a URL', () => {
    expect(normalizeRelease({
      version: '0.1.0',
      platform: 'windows-x64',
      filename: 'MeristemForge-Setup-0.1.0.exe',
      status: 'pending',
      size: '待发布',
      publishedAt: '2026-10-14',
      downloadUrl: '/downloads/placeholder.exe',
      notes,
    })).toMatchObject({
      status: 'pending',
      size: null,
      publishedAt: null,
      downloadUrl: null,
    })
  })

  it('falls back to a safe pending release for malformed input', () => {
    expect(normalizeRelease({ status: 'published', downloadUrl: '/unsafe.exe' })).toMatchObject({
      status: 'pending',
      downloadUrl: null,
      notes: { zh: [], en: [] },
    })
  })
})

describe('fetchLatestRelease', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('normalizes fetched JSON before returning it', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        version: '0.1.0',
        platform: 'windows-x64',
        filename: 'MeristemForge-Setup-0.1.0.exe',
        status: 'pending',
        size: null,
        publishedAt: null,
        downloadUrl: '/downloads/placeholder.exe',
        notes,
      }),
    }))

    await expect(fetchLatestRelease()).resolves.toMatchObject({
      status: 'pending',
      downloadUrl: null,
    })
  })

  it('returns the safe pending fallback when fetching fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    await expect(fetchLatestRelease()).resolves.toMatchObject({
      status: 'pending',
      downloadUrl: null,
      notes: { zh: [], en: [] },
    })
  })
})
```

- [ ] **Step 2: Run the focused test and verify it is red**

Run: `cd frontend && npm test -- --run src/api/release.spec.ts`

Expected: FAIL because `normalizeRelease` and the new manifest fields do not exist.

- [ ] **Step 3: Implement the typed normalizer and safe fallback**

Replace `frontend/src/api/release.ts` with:

```ts
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

function fallbackRelease(): ReleaseInfo {
  return {
    version: '0.1.0',
    platform: 'windows-x64',
    filename: 'MeristemForge-Setup-0.1.0.exe',
    status: 'pending',
    size: null,
    publishedAt: null,
    downloadUrl: null,
    notes: { zh: [], en: [] },
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString)
}

export function normalizeRelease(value: unknown): ReleaseInfo {
  if (!value || typeof value !== 'object') return fallbackRelease()

  const input = value as Record<string, unknown>
  const rawNotes = input.notes
  if (
    !isNonEmptyString(input.version)
    || !isNonEmptyString(input.platform)
    || !isNonEmptyString(input.filename)
    || (input.status !== 'pending' && input.status !== 'published')
    || !rawNotes
    || typeof rawNotes !== 'object'
  ) {
    return fallbackRelease()
  }

  const notes = rawNotes as Record<string, unknown>
  if (!isStringArray(notes.zh) || !isStringArray(notes.en)) return fallbackRelease()

  const base = {
    version: input.version,
    platform: input.platform,
    filename: input.filename,
    notes: { zh: notes.zh, en: notes.en },
  }

  if (input.status === 'pending') {
    return { ...base, status: 'pending', size: null, publishedAt: null, downloadUrl: null }
  }

  if (
    !isNonEmptyString(input.size)
    || !isNonEmptyString(input.publishedAt)
    || !isNonEmptyString(input.downloadUrl)
  ) {
    return fallbackRelease()
  }

  return {
    ...base,
    status: 'published',
    size: input.size,
    publishedAt: input.publishedAt,
    downloadUrl: input.downloadUrl,
  }
}

export async function fetchLatestRelease(): Promise<ReleaseInfo> {
  try {
    const response = await fetch('/releases/latest.json', { cache: 'no-store' })
    if (!response.ok) return fallbackRelease()
    return normalizeRelease(await response.json())
  } catch {
    return fallbackRelease()
  }
}
```

- [ ] **Step 4: Replace the pending manifest**

Replace `frontend/public/releases/latest.json` with the JSON from the approved design: `status` is `pending`; `size`, `publishedAt`, and `downloadUrl` are `null`; `notes` contains Chinese and English arrays.

- [ ] **Step 5: Verify the focused test passes**

Run: `cd frontend && npm test -- --run src/api/release.spec.ts`

Expected: PASS with 5 tests.

- [ ] **Step 6: Commit manifest normalization**

```bash
git add frontend/src/api/release.ts frontend/src/api/release.spec.ts frontend/public/releases/latest.json
git commit -m "fix: normalize release availability"
```

### Task 2: Build the Only Download Control

**Files:**
- Create: `frontend/src/components/ReleaseDownload.vue`
- Create: `frontend/src/components/ReleaseDownload.spec.ts`
- Modify: `frontend/src/i18n/schema.ts`
- Modify: `frontend/src/i18n/zh.ts`
- Modify: `frontend/src/i18n/en.ts`

- [ ] **Step 1: Add pending-status messages to the locale contract**

Add this nested object to the existing `release` interface and both locale objects:

```ts
status: {
  pending: string,
  published: string,
}
```

Chinese values are `暂未发布` and `已发布`; English values are `Coming Soon` and `Published`.

- [ ] **Step 2: Write failing control-state tests**

Create `frontend/src/components/ReleaseDownload.spec.ts`:

```ts
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
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

const publishedRelease: ReleaseInfo = {
  ...pendingRelease,
  status: 'published',
  size: '120 MB',
  publishedAt: '2026-10-14',
  downloadUrl: '/downloads/MeristemForge-Setup-0.1.0.exe',
}

function render(props: { release: ReleaseInfo | null; loading: boolean }, locale = 'zh') {
  const i18n = createI18n({ legacy: false, locale, messages: { zh, en } })
  return mount(ReleaseDownload, { props, global: { plugins: [i18n] } })
}

describe('ReleaseDownload', () => {
  it('shows a disabled checking state while loading', () => {
    const wrapper = render({ release: null, loading: true })
    expect(wrapper.get('button').text()).toBe('检查最新版本...')
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('shows a disabled pending state', () => {
    const wrapper = render({ release: pendingRelease, loading: false })
    expect(wrapper.get('button').text()).toBe('暂未发布')
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('does not trust a URL on a pending release', () => {
    const wrapper = render({
      release: { ...pendingRelease, downloadUrl: '/downloads/unsafe.exe' },
      loading: false,
    })
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('links only a published release', () => {
    const wrapper = render({ release: publishedRelease, loading: false })
    expect(wrapper.get('a').attributes('href'))
      .toBe('/downloads/MeristemForge-Setup-0.1.0.exe')
    expect(wrapper.get('a').attributes('download')).toBe(publishedRelease.filename)
  })
})
```

Every rendered control must use `data-testid="hero-download"`.

- [ ] **Step 3: Run the focused component test and verify it is red**

Run: `cd frontend && npm test -- --run src/components/ReleaseDownload.spec.ts`

Expected: FAIL because `ReleaseDownload.vue` does not exist.

- [ ] **Step 4: Implement the presentation-only component**

Create `frontend/src/components/ReleaseDownload.vue`:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { ReleaseInfo } from '@/api/release'

const props = defineProps<{
  release: ReleaseInfo | null
  loading: boolean
}>()

const canDownload = computed(() =>
  props.release?.status === 'published' && Boolean(props.release.downloadUrl),
)
</script>

<template>
  <a
    v-if="canDownload && release"
    class="download-status"
    :href="release.downloadUrl ?? undefined"
    :download="release.filename"
    data-testid="hero-download"
  >
    {{ $t('release.download') }} {{ release.version }}
  </a>
  <button
    v-else
    type="button"
    class="download-status"
    data-testid="hero-download"
    disabled
  >
    {{ loading ? $t('release.checking') : $t('release.status.pending') }}
  </button>
</template>
```

- [ ] **Step 5: Run locale and component tests**

Run: `cd frontend && npm test -- --run src/i18n/messages.spec.ts src/components/ReleaseDownload.spec.ts`

Expected: PASS.

- [ ] **Step 6: Commit the single control**

```bash
git add frontend/src/components/ReleaseDownload.vue frontend/src/components/ReleaseDownload.spec.ts frontend/src/i18n/schema.ts frontend/src/i18n/zh.ts frontend/src/i18n/en.ts
git commit -m "feat: add safe hero download control"
```

### Task 3: Centralize Release Loading and Remove Duplicate Controls

**Files:**
- Modify: `frontend/src/views/Home.vue`
- Modify: `frontend/src/components/HeroSection.vue`
- Modify: `frontend/src/components/ReleaseSection.vue`
- Modify: `frontend/src/components/Navbar.vue`
- Delete: `frontend/src/components/DownloadStatus.vue`
- Modify: `frontend/src/views/Home.spec.ts`
- Modify: `frontend/src/components/Navbar.spec.ts`
- Create: `frontend/src/components/ReleaseSection.spec.ts`

- [ ] **Step 1: Write failing page-ownership and localization tests**

In `Home.spec.ts`, import `flushPromises`, `vi`, `ReleaseInfo`, and the release API module. Add this test using a complete pending fixture:

```ts
it('loads release data once and renders one hero download control', async () => {
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
  const fetchLatestReleaseSpy = vi
    .spyOn(releaseApi, 'fetchLatestRelease')
    .mockResolvedValue(pendingRelease)

  const wrapper = renderHome()
  await flushPromises()

expect(fetchLatestReleaseSpy).toHaveBeenCalledTimes(1)
expect(wrapper.findAll('[data-testid="hero-download"]')).toHaveLength(1)
expect(wrapper.find('#release [data-testid="hero-download"]').exists()).toBe(false)
  fetchLatestReleaseSpy.mockRestore()
})
```

In `Navbar.spec.ts`, remove tests that require `DownloadStatus` and add:

```ts
expect(wrapper.find('.download-status').exists()).toBe(false)
```

Create `ReleaseSection.spec.ts` with this behavior test:

```ts
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
```

- [ ] **Step 2: Run the focused integration tests and verify they are red**

Run: `cd frontend && npm test -- --run src/views/Home.spec.ts src/components/Navbar.spec.ts src/components/ReleaseSection.spec.ts`

Expected: FAIL because release loading is still duplicated and duplicate controls remain.

- [ ] **Step 3: Move release ownership to `Home.vue`**

Replace `Home.vue` with:

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchLatestRelease, type ReleaseInfo } from '@/api/release'
import CapabilityCards from '@/components/CapabilityCards.vue'
import HeroSection from '@/components/HeroSection.vue'
import ReleaseSection from '@/components/ReleaseSection.vue'
import WorkflowSection from '@/components/WorkflowSection.vue'

const release = ref<ReleaseInfo | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    release.value = await fetchLatestRelease()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <HeroSection :release="release" :loading="loading" />
  <CapabilityCards />
  <WorkflowSection />
  <ReleaseSection :release="release" />
</template>
```

- [ ] **Step 4: Make hero and release sections presentation-only**

Replace the `HeroSection.vue` script with:

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ReleaseInfo } from '@/api/release'
import ReleaseDownload from './ReleaseDownload.vue'

defineProps<{ release: ReleaseInfo | null; loading: boolean }>()
const { t } = useI18n()
</script>
```

Keep the existing hero markup and replace `DownloadStatus` with:

```vue
<ReleaseDownload :release="release" :loading="loading" />
```

Replace the `ReleaseSection.vue` script with:

```ts
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ReleaseInfo } from '@/api/release'

const props = defineProps<{ release: ReleaseInfo | null }>()
const { locale, t } = useI18n()

const localizedNotes = computed(() => {
  const fallback = [t('release.note1'), t('release.note2'), t('release.note3')]
  if (!props.release) return fallback
  const key = locale.value === 'en' ? 'en' : 'zh'
  return props.release.notes[key].length ? props.release.notes[key] : fallback
})

const statusLabel = computed(() =>
  t(`release.status.${props.release?.status ?? 'pending'}`),
)
```

Use this information-only content inside the existing release panel and render no download component:

```vue
<div v-if="release" class="release-meta">
  <span>{{ t('release.version') }} {{ release.version }}</span>
  <span>{{ release.platform }}</span>
  <span>{{ statusLabel }}</span>
  <span v-if="release.size">{{ release.size }}</span>
  <span v-if="release.publishedAt">{{ release.publishedAt }}</span>
</div>

<ul class="release-notes">
  <li v-for="note in localizedNotes" :key="note">{{ note }}</li>
</ul>
```

- [ ] **Step 5: Remove the navigation control and obsolete component**

Delete the `DownloadStatus` import and element from `Navbar.vue`. The final action container is:

```vue
<div class="nav-actions">
  <button
    data-testid="language-switch"
    class="language-switch"
    type="button"
    :aria-label="t('nav.language')"
    @click="toggleLocale"
  >
    {{ locale === 'zh' ? 'EN' : '中文' }}
  </button>
</div>
```

Delete `frontend/src/components/DownloadStatus.vue` after confirming `rg "DownloadStatus" frontend/src` returns only tests being updated, then remove those imports/tests too.

- [ ] **Step 6: Run focused and full tests**

Run: `cd frontend && npm test -- --run src/views/Home.spec.ts src/components/Navbar.spec.ts src/components/ReleaseSection.spec.ts src/components/ReleaseDownload.spec.ts`

Expected: PASS.

Run: `cd frontend && npm test -- --run`

Expected: PASS with no failing test files.

- [ ] **Step 7: Commit centralized loading**

```bash
git add frontend/src/views/Home.vue frontend/src/views/Home.spec.ts frontend/src/components/HeroSection.vue frontend/src/components/ReleaseSection.vue frontend/src/components/ReleaseSection.spec.ts frontend/src/components/Navbar.vue frontend/src/components/Navbar.spec.ts frontend/src/components/DownloadStatus.vue
git commit -m "refactor: centralize homepage release state"
```

### Task 4: Synchronize Document Metadata and Polish Release Layout

**Files:**
- Modify: `frontend/src/i18n/schema.ts`
- Modify: `frontend/src/i18n/zh.ts`
- Modify: `frontend/src/i18n/en.ts`
- Modify: `frontend/src/i18n/index.ts`
- Modify: `frontend/src/i18n/messages.spec.ts`
- Modify: `frontend/src/components/Navbar.spec.ts`
- Modify: `frontend/src/assets/main.css`

- [ ] **Step 1: Write failing document-title tests**

Extend the existing initial-locale table in `messages.spec.ts` with the expected title. Add a second test that imports a fresh Chinese i18n instance, assigns `i18n.global.locale.value = 'en'`, awaits `nextTick()`, and expects:

```ts
expect(document.documentElement.lang).toBe('en')
expect(document.title).toBe('MeristemForge · All-in-One AI Creative Workspace')
```

Update `Navbar.spec.ts` so its isolated language-switch test asserts only the i18n locale and local-storage persistence; global document metadata belongs to `i18n/index.ts`.

- [ ] **Step 2: Run the i18n tests and verify they are red**

Run: `cd frontend && npm test -- --run src/i18n/messages.spec.ts`

Expected: FAIL because locale-specific document titles do not exist or update.

- [ ] **Step 3: Add localized page titles and reactive synchronization**

Add `meta: { title: string }` to `MessageSchema` and both locale objects. Use these values:

```ts
// zh
meta: { title: 'MeristemForge · 一体化 AI 创作工作台' }

// en
meta: { title: 'MeristemForge · All-in-One AI Creative Workspace' }
```

In `i18n/index.ts`, import `watch`, create the i18n instance, then synchronize title and language:

```ts
function syncDocumentLocale(value: string) {
  document.documentElement.lang = value === 'zh' ? 'zh-CN' : 'en'
  document.title = i18n.global.t('meta.title')
}

syncDocumentLocale(locale)
watch(i18n.global.locale, syncDocumentLocale)
```

Remove direct `document.documentElement.lang` assignment from `Navbar.vue`; changing the global locale triggers the watcher.

- [ ] **Step 4: Remove obsolete release messages**

After confirming no references remain, remove `release.button` and `release.unavailable` from `MessageSchema`, `zh.ts`, and `en.ts`. Keep `download`, `checking`, `status`, `version`, and fallback notes.

- [ ] **Step 5: Add metadata and note layout styles**

Remove `.download-status--compact`, `.release__panel .download-status`, and the mobile `.nav-actions .download-status` rule. Replace the download rule and add the release rules:

```css
.download-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 11px;
  padding: 10px 16px;
  background: #fff;
  color: #58429a;
  font-weight: 650;
  box-shadow: 0 12px 34px rgba(73,56,164,.18);
}
.download-status:disabled { cursor: not-allowed; opacity: .78; }

.release-meta {
  margin: 24px auto 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 18px;
}
.release-meta span {
  padding: 7px 11px;
  border: 1px solid rgba(255,255,255,.28);
  border-radius: 999px;
  background: rgba(52,42,139,.18);
}
.release-notes {
  width: fit-content;
  margin: 24px auto 0;
  padding-left: 1.25rem;
  display: grid;
  gap: 10px;
  text-align: left;
}
```

- [ ] **Step 6: Run focused tests, complete tests, and build**

Run: `cd frontend && npm test -- --run src/i18n/messages.spec.ts src/components/Navbar.spec.ts`

Expected: PASS.

Run: `cd frontend && npm test -- --run`

Expected: PASS.

Run: `cd frontend && npm run build`

Expected: PASS with `vue-tsc` and Vite completing successfully.

Run: `git diff --check && git status --short`

Expected: no whitespace errors and only planned files changed.

- [ ] **Step 7: Commit localization and layout**

```bash
git add frontend/src/i18n/schema.ts frontend/src/i18n/zh.ts frontend/src/i18n/en.ts frontend/src/i18n/index.ts frontend/src/i18n/messages.spec.ts frontend/src/components/Navbar.vue frontend/src/components/Navbar.spec.ts frontend/src/assets/main.css
git commit -m "fix: localize release state and metadata"
```

### Task 5: Browser Acceptance Verification

**Files:**
- No source changes expected.

- [ ] **Step 1: Start the isolated development server**

Run: `cd frontend && npm run dev -- --host 127.0.0.1 --port 3001`

Expected: Vite reports `http://127.0.0.1:3001/` ready.

- [ ] **Step 2: Verify the Chinese page in a real browser**

Confirm the hero has exactly one disabled control labeled `暂未发布`; navigation and the release section contain no download controls; release metadata has visible spacing; Chinese release notes are present.

- [ ] **Step 3: Verify the English page and persistence**

Switch to English and confirm the hero control reads `Coming Soon`; release status and notes are English; the browser title is `MeristemForge · All-in-One AI Creative Workspace`. Reload and confirm English remains selected.

- [ ] **Step 4: Verify no installer link is exposed**

Inspect the rendered DOM and confirm no anchor targets `/downloads/MeristemForge-Setup-0.1.0.exe` while the manifest is pending.

- [ ] **Step 5: Stop the isolated server and record evidence**

Stop only the server started on port 3001. Record the full test count, build result, browser findings, and final commit range in the handoff.
