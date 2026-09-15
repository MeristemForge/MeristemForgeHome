# MeristemForge Product Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the SDK catalog and mock admin application with a bilingual, static, single-page MeristemForge product website featuring the transparent duck mascot and four playing-card-style creative modules.

**Architecture:** Keep Vue 3, Vite, and Vue I18n, but remove Vue Router, Pinia, API clients, and administration state. `App.vue` renders a static marketing shell; `Home.vue` composes focused section components; one reusable download-status component owns the unavailable Windows release state. Global CSS supplies the continuous duck-gradient background, glass surfaces, responsive card carousel, accessibility states, and reduced-motion behavior.

**Tech Stack:** Vue 3 Composition API, TypeScript, Vite 5, Vue I18n 9, Vitest 2, Vue Test Utils 2, jsdom 25, CSS

---

## File Map

**Create**

- `frontend/src/test/setup.ts` — browser API setup and test cleanup.
- `frontend/src/i18n/messages.spec.ts` — bilingual content contract.
- `frontend/src/components/Navbar.spec.ts` — navigation and language behavior.
- `frontend/src/views/Home.spec.ts` — hero, mascot, capability, workflow, and release behavior.
- `frontend/src/components/DownloadStatus.vue` — the single source of truth for unavailable Windows downloads.
- `frontend/src/components/HeroSection.vue` — product promise and mascot.
- `frontend/src/components/CapabilityCards.vue` — four playing-card-style modules.
- `frontend/src/components/WorkflowSection.vue` — unified local workflow explanation.
- `frontend/src/components/ReleaseSection.vue` — Windows release preview.
- `frontend/public/meristemforge-duck.png` — transparent mascot cutout.
- `frontend/public/meristemforge-icon.svg` — product favicon and brand mark.

**Modify**

- `frontend/package.json` and `frontend/package-lock.json` — test tooling and removal of unused runtime packages.
- `frontend/vite.config.ts` — Vitest configuration and removal of the unused API proxy.
- `frontend/src/i18n/zh.ts`, `frontend/src/i18n/en.ts`, `frontend/src/i18n/index.ts` — complete bilingual marketing content with Chinese as default.
- `frontend/src/components/Navbar.vue` — anchor navigation, locale switch, and download status.
- `frontend/src/views/Home.vue` — static section composition.
- `frontend/src/App.vue` — direct single-page rendering and footer.
- `frontend/src/main.ts` — remove Router and Pinia registration.
- `frontend/src/assets/main.css` — full visual system and responsive behavior.
- `frontend/index.html` — Chinese document language, favicon, title, and metadata.
- `README.md`, `README.zh.md` — product-site purpose and development commands.

**Delete**

- `frontend/public/vite.svg`
- `frontend/src/api/auth.ts`
- `frontend/src/api/client.ts`
- `frontend/src/api/mock.ts`
- `frontend/src/api/projects.ts`
- `frontend/src/components/ParticleCanvas.vue`
- `frontend/src/components/ProjectCard.vue`
- `frontend/src/components/ThemeToggle.vue`
- `frontend/src/components/Toast.vue`
- `frontend/src/composables/useTheme.ts`
- `frontend/src/router/index.ts`
- `frontend/src/stores/auth.ts`
- `frontend/src/types/index.ts`
- `frontend/src/views/NotFound.vue`
- `frontend/src/views/ProjectDetail.vue`
- `frontend/src/views/Projects.vue`
- `frontend/src/views/admin/Login.vue`
- `frontend/src/views/admin/ProjectList.vue`
- `frontend/src/views/admin/VersionManager.vue`

---

### Task 1: Install and Configure Component Tests

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/package-lock.json`
- Modify: `frontend/vite.config.ts`
- Create: `frontend/src/test/setup.ts`

- [ ] **Step 1: Install the test dependencies**

Run:

```powershell
cd frontend
npm install --save-dev vitest@^2.1.9 @vue/test-utils@^2.4.6 jsdom@^25.0.1
```

Expected: `package.json` and `package-lock.json` add the three development dependencies without changing Vue's major version.

- [ ] **Step 2: Add the test script**

Add this script to `frontend/package.json`:

```json
"test": "vitest"
```

- [ ] **Step 3: Configure Vitest**

Replace `frontend/vite.config.ts` with:

```ts
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

- [ ] **Step 4: Add deterministic browser setup**

Create `frontend/src/test/setup.ts`:

```ts
import { afterEach, beforeEach, vi } from 'vitest'

beforeEach(() => {
  localStorage.clear()
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})
```

- [ ] **Step 5: Verify the runner starts cleanly**

Run:

```powershell
npm run test -- --run --passWithNoTests
```

Expected: Vitest exits successfully with no tests collected.

- [ ] **Step 6: Commit the test harness**

```powershell
git add frontend/package.json frontend/package-lock.json frontend/vite.config.ts frontend/src/test/setup.ts
git commit -m "test: add Vue component test harness"
```

---

### Task 2: Replace SDK Copy with a Bilingual Product Content Contract

**Files:**
- Create: `frontend/src/i18n/messages.spec.ts`
- Modify: `frontend/src/i18n/zh.ts`
- Modify: `frontend/src/i18n/en.ts`
- Modify: `frontend/src/i18n/index.ts`

- [ ] **Step 1: Write the failing locale contract test**

Create `frontend/src/i18n/messages.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'
import en from './en'
import zh from './zh'

describe.each([
  ['zh', zh],
  ['en', en],
] as const)('%s marketing copy', (_locale, messages) => {
  it('defines the four creative modules in the same order', () => {
    expect(Object.keys(messages.capabilities.items)).toEqual([
      'video',
      'image',
      'music',
      'voice',
    ])
  })

  it('defines navigation, hero, workflow, release, and footer copy', () => {
    expect(messages.nav.capabilities).toBeTruthy()
    expect(messages.hero.title).toBeTruthy()
    expect(messages.workflow.title).toBeTruthy()
    expect(messages.release.button).toBeTruthy()
    expect(messages.footer.tagline).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run the locale test and verify RED**

Run:

```powershell
npm run test -- --run src/i18n/messages.spec.ts
```

Expected: FAIL because the current SDK messages do not contain `capabilities`, `workflow`, `release`, or the structured footer.

- [ ] **Step 3: Replace the Chinese messages**

Replace `frontend/src/i18n/zh.ts` with:

```ts
export default {
  nav: {
    capabilities: '创作能力',
    workflow: '工作方式',
    about: '关于',
    language: '切换到英文',
  },
  hero: {
    eyebrow: '一体化 AI 创作工作台',
    title: '让每一种灵感，都有创作的形状',
    subtitle: '在一个本地工作台里完成视频、图片、音乐与声音创作。统一管理模型、素材和项目，让复杂工作流变得简单自然。',
    explore: '查看创作能力',
    mascotAlt: 'MeristemForge 白色小鸭子吉祥物',
  },
  capabilities: {
    eyebrow: '四种创作，一套体验',
    title: '选择你的创作空间',
    subtitle: '像展开一手牌，每张都通往一种创作能力。',
    items: {
      video: { label: '视频创作', description: '从提示词、参考素材到镜头编排，在完整项目结构中驱动高质量视频生成。' },
      image: { label: '图片创作', description: '生成、编辑并整理视觉素材，让角色、场景与风格成为可持续复用的资产。' },
      music: { label: '音乐创作', description: '从旋律灵感到完整配乐，为影片、短内容和独立作品塑造专属听觉氛围。' },
      voice: { label: 'AI 配音与音色克隆', description: '创建自然、有表现力的语音，并管理可复用音色，为角色建立稳定的声音身份。' },
    },
  },
  workflow: {
    eyebrow: '本地创作，始终可控',
    title: '复杂能力，简单地放在一起',
    description: '统一的项目、素材库和本地模型管理贯穿四种创作模块。你掌控工作流、文件和创作节奏。',
    benefits: ['本地模型与素材', '统一项目管理', '模块间资产复用', '面向创作者的界面'],
  },
  release: {
    eyebrow: 'MeristemForge Windows 版',
    title: '你的下一段创作旅程，即将开始',
    description: '首个公开版本正在准备中。',
    button: 'Windows 版即将发布',
  },
  footer: {
    tagline: '创造，不止一种形状。',
    copyright: '© 2026 MeristemForge',
  },
}
```

- [ ] **Step 4: Replace the English messages**

Replace `frontend/src/i18n/en.ts` with the same object shape and these translations:

```ts
export default {
  nav: { capabilities: 'Creative Spaces', workflow: 'How It Works', about: 'About', language: '切换到中文' },
  hero: {
    eyebrow: 'All-in-one AI creative workspace',
    title: 'Give every idea a form of its own',
    subtitle: 'Create video, images, music, and voices in one local workspace. Keep models, assets, and projects together while complex workflows stay approachable.',
    explore: 'Explore creative spaces',
    mascotAlt: 'MeristemForge white duck mascot',
  },
  capabilities: {
    eyebrow: 'Four creative spaces, one experience',
    title: 'Choose your creative space',
    subtitle: 'Like laying out a hand of cards, each one opens a different way to create.',
    items: {
      video: { label: 'Video Creation', description: 'Move from prompts and references to directed shots and high-quality video generation inside a complete project.' },
      image: { label: 'Image Creation', description: 'Generate, edit, and organize visual material into reusable characters, scenes, and styles.' },
      music: { label: 'Music Creation', description: 'Develop melodic ideas into soundtracks and complete music for films, short content, and independent work.' },
      voice: { label: 'AI Dubbing & Voice Cloning', description: 'Create natural expressive speech and manage reusable voices with a consistent identity.' },
    },
  },
  workflow: {
    eyebrow: 'Create locally. Stay in control.',
    title: 'Complex capabilities, brought together simply',
    description: 'Shared projects, asset libraries, and local model management connect every creative space. You control the workflow, files, and pace.',
    benefits: ['Local models and assets', 'Unified project management', 'Reusable assets across modules', 'An interface made for creators'],
  },
  release: {
    eyebrow: 'MeristemForge for Windows',
    title: 'Your next creative journey starts soon',
    description: 'The first public release is being prepared.',
    button: 'Windows release coming soon',
  },
  footer: { tagline: 'Creation takes more than one form.', copyright: '© 2026 MeristemForge' },
}
```

- [ ] **Step 5: Make Chinese the default locale**

In `frontend/src/i18n/index.ts`, set the initial locale and fallback explicitly:

```ts
const savedLocale = localStorage.getItem('locale')
const locale = savedLocale === 'en' ? 'en' : 'zh'
document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'zh',
  messages: { en, zh },
})
```

- [ ] **Step 6: Run the locale test and verify GREEN**

Run:

```powershell
npm run test -- --run src/i18n/messages.spec.ts
```

Expected: 4 tests pass across the two locales.

- [ ] **Step 7: Commit the content contract**

```powershell
git add frontend/src/i18n
git commit -m "feat: define bilingual product website copy"
```

---

### Task 3: Replace Routed Application Chrome with Static Navigation

**Files:**
- Create: `frontend/src/components/Navbar.spec.ts`
- Create: `frontend/src/components/DownloadStatus.vue`
- Modify: `frontend/src/components/Navbar.vue`

- [ ] **Step 1: Write the failing navigation tests**

Create `frontend/src/components/Navbar.spec.ts`:

```ts
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi } from 'vitest'
import en from '@/i18n/en'
import zh from '@/i18n/zh'
import Navbar from './Navbar.vue'

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({ isAuthenticated: false }),
}))

function renderNavbar() {
  const i18n = createI18n({ legacy: false, locale: 'zh', messages: { zh, en } })
  return {
    wrapper: mount(Navbar, {
      global: {
        plugins: [i18n],
        stubs: { RouterLink: { template: '<a><slot /></a>' } },
      },
    }),
    i18n,
  }
}

describe('Navbar', () => {
  it('uses section anchors and exposes an unavailable download status', () => {
    const { wrapper } = renderNavbar()
    expect(wrapper.get('a[href="#capabilities"]').text()).toBe('创作能力')
    expect(wrapper.get('a[href="#workflow"]').text()).toBe('工作方式')
    expect(wrapper.get('a[href="#about"]').text()).toBe('关于')
    expect(wrapper.get('[data-testid="nav-download"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('a[href="/projects"]').exists()).toBe(false)
  })

  it('switches language and updates the document language', async () => {
    const { wrapper, i18n } = renderNavbar()
    await wrapper.get('[data-testid="language-switch"]').trigger('click')
    expect(i18n.global.locale.value).toBe('en')
    expect(document.documentElement.lang).toBe('en')
    expect(localStorage.getItem('locale')).toBe('en')
  })
})
```

- [ ] **Step 2: Run the navigation test and verify RED**

Run:

```powershell
npm run test -- --run src/components/Navbar.spec.ts
```

Expected: FAIL because the current navigation renders project/admin controls instead of section anchors and download status.

- [ ] **Step 3: Add the reusable download status control**

Create `frontend/src/components/DownloadStatus.vue`:

```vue
<script setup lang="ts">
withDefaults(defineProps<{ testId?: string; compact?: boolean }>(), {
  testId: 'download-status',
  compact: false,
})
</script>

<template>
  <button
    type="button"
    class="download-status"
    :class="{ 'download-status--compact': compact }"
    :data-testid="testId"
    disabled
  >
    {{ $t('release.button') }}
  </button>
</template>
```

- [ ] **Step 4: Replace the navigation**

Replace `frontend/src/components/Navbar.vue` with a fixed glass navigation containing:

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DownloadStatus from './DownloadStatus.vue'

const { locale, t } = useI18n()

function toggleLocale() {
  const next = locale.value === 'zh' ? 'en' : 'zh'
  locale.value = next
  localStorage.setItem('locale', next)
  document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en'
}
</script>

<template>
  <nav class="navbar" aria-label="Primary navigation">
    <div class="navbar__inner">
      <a class="brand" href="#top"><img src="/meristemforge-icon.svg" alt="" />MeristemForge</a>
      <div class="nav-links">
        <a href="#capabilities">{{ t('nav.capabilities') }}</a>
        <a href="#workflow">{{ t('nav.workflow') }}</a>
        <a href="#about">{{ t('nav.about') }}</a>
      </div>
      <div class="nav-actions">
        <button data-testid="language-switch" class="language-switch" type="button" :aria-label="t('nav.language')" @click="toggleLocale">
          {{ locale === 'zh' ? 'EN' : '中文' }}
        </button>
        <DownloadStatus test-id="nav-download" compact />
      </div>
    </div>
  </nav>
</template>
```

- [ ] **Step 5: Run the navigation test and verify GREEN**

Run:

```powershell
npm run test -- --run src/components/Navbar.spec.ts
```

Expected: 2 tests pass.

- [ ] **Step 6: Commit the product navigation**

```powershell
git add frontend/src/components/DownloadStatus.vue frontend/src/components/Navbar.vue frontend/src/components/Navbar.spec.ts
git commit -m "feat: replace app chrome with product navigation"
```

---

### Task 4: Build the Hero with a True Transparent Mascot

**Files:**
- Create: `frontend/src/views/Home.spec.ts`
- Create: `frontend/src/components/HeroSection.vue`
- Create: `frontend/public/meristemforge-duck.png`
- Create: `frontend/public/meristemforge-icon.svg`
- Modify: `frontend/src/views/Home.vue`

- [ ] **Step 1: Write the failing hero test**

Create `frontend/src/views/Home.spec.ts` with a shared renderer and the first behavior:

```ts
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import en from '@/i18n/en'
import zh from '@/i18n/zh'
import Home from './Home.vue'

function renderHome() {
  const i18n = createI18n({ legacy: false, locale: 'zh', messages: { zh, en } })
  return mount(Home, { global: { plugins: [i18n] } })
}

describe('Home', () => {
  it('presents the product and a standalone duck mascot', () => {
    const wrapper = renderHome()
    expect(wrapper.get('h1').text()).toContain('让每一种灵感')
    expect(wrapper.get('[data-testid="hero-mascot"]').attributes('src')).toBe('/meristemforge-duck.png')
    expect(wrapper.get('[data-testid="hero-download"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('a[href="#capabilities"]').text()).toBe('查看创作能力')
  })
})
```

- [ ] **Step 2: Run the hero test and verify RED**

Run:

```powershell
npm run test -- --run src/views/Home.spec.ts
```

Expected: FAIL because the current home page still renders the SDK hero and has no mascot.

- [ ] **Step 3: Copy the approved transparent assets**

Run:

```powershell
Copy-Item -LiteralPath 'C:\Users\wujin\.codex\generated_images\01a09fc6-fd0f-73b3-b9db-346cb7553d39\exec-1f468857-a401-4ba5-aa5b-589a88134760.png' -Destination 'frontend\public\meristemforge-duck.png'
Copy-Item -LiteralPath 'C:\Users\wujin\Desktop\workspace\comfyui-director\public\meristemforge-icon.svg' -Destination 'frontend\public\meristemforge-icon.svg'
```

Verify the mascot contains transparent pixels:

```powershell
python -c "from PIL import Image; im=Image.open(r'frontend/public/meristemforge-duck.png'); assert im.mode == 'RGBA' and im.getextrema()[3][0] == 0; print(im.size)"
```

Expected: prints `(1374, 1145)` and exits successfully.

- [ ] **Step 4: Add the hero component**

Create `frontend/src/components/HeroSection.vue`:

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DownloadStatus from './DownloadStatus.vue'

const { t } = useI18n()
</script>

<template>
  <section id="top" class="hero section-shell">
    <div class="hero__copy">
      <p class="eyebrow">{{ t('hero.eyebrow') }}</p>
      <h1>{{ t('hero.title') }}</h1>
      <p class="hero__description">{{ t('hero.subtitle') }}</p>
      <div class="hero__actions">
        <DownloadStatus test-id="hero-download" />
        <a class="secondary-action" href="#capabilities">{{ t('hero.explore') }}</a>
      </div>
    </div>
    <div class="duck-stage">
      <span class="duck-glow" aria-hidden="true"></span>
      <span class="duck-shadow" aria-hidden="true"></span>
      <img data-testid="hero-mascot" class="duck-mascot" src="/meristemforge-duck.png" :alt="t('hero.mascotAlt')" />
    </div>
  </section>
</template>
```

- [ ] **Step 5: Reduce Home to the tested hero**

Replace `frontend/src/views/Home.vue` temporarily with:

```vue
<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'
</script>

<template>
  <HeroSection />
</template>
```

- [ ] **Step 6: Run the hero test and verify GREEN**

Run:

```powershell
npm run test -- --run src/views/Home.spec.ts
```

Expected: 1 test passes.

- [ ] **Step 7: Commit the hero**

```powershell
git add frontend/public/meristemforge-duck.png frontend/public/meristemforge-icon.svg frontend/src/components/HeroSection.vue frontend/src/views/Home.vue frontend/src/views/Home.spec.ts
git commit -m "feat: add transparent duck product hero"
```

---

### Task 5: Add Four Horizontal Playing Cards

**Files:**
- Create: `frontend/src/components/CapabilityCards.vue`
- Modify: `frontend/src/views/Home.vue`
- Modify: `frontend/src/views/Home.spec.ts`

- [ ] **Step 1: Add the failing four-card behavior**

Append this test inside the existing `describe` block in `frontend/src/views/Home.spec.ts`:

```ts
it('renders four ordered playing-card creative modules', () => {
  const wrapper = renderHome()
  const cards = wrapper.findAll('[data-testid="capability-card"]')
  expect(cards).toHaveLength(4)
  expect(cards.map((card) => card.attributes('data-capability'))).toEqual([
    'video',
    'image',
    'music',
    'voice',
  ])
  expect(cards.map((card) => card.get('.capability-card__number').text())).toEqual([
    '01',
    '02',
    '03',
    '04',
  ])
})
```

- [ ] **Step 2: Run the home test and verify RED**

Run:

```powershell
npm run test -- --run src/views/Home.spec.ts
```

Expected: the hero test passes and the four-card test fails with zero cards found.

- [ ] **Step 3: Add the card component**

Create `frontend/src/components/CapabilityCards.vue`:

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const capabilities = [
  { id: 'video', number: '01', english: 'VIDEO', suit: '◆', symbol: '▶' },
  { id: 'image', number: '02', english: 'IMAGE', suit: '●', symbol: '✦' },
  { id: 'music', number: '03', english: 'MUSIC', suit: '▲', symbol: '♫' },
  { id: 'voice', number: '04', english: 'VOICE', suit: '♥', symbol: '◉' },
] as const
</script>

<template>
  <section id="capabilities" class="capabilities section-shell">
    <header class="section-heading">
      <p class="eyebrow">{{ t('capabilities.eyebrow') }}</p>
      <h2>{{ t('capabilities.title') }}</h2>
      <p>{{ t('capabilities.subtitle') }}</p>
    </header>
    <div class="capability-row" role="list">
      <article
        v-for="capability in capabilities"
        :key="capability.id"
        class="capability-card"
        :class="`capability-card--${capability.id}`"
        data-testid="capability-card"
        :data-capability="capability.id"
        role="listitem"
        tabindex="0"
      >
        <header class="capability-card__top">
          <span><strong class="capability-card__number">{{ capability.number }}</strong><small>{{ capability.english }}</small></span>
          <span aria-hidden="true">{{ capability.suit }}</span>
        </header>
        <div class="capability-card__visual" aria-hidden="true">{{ capability.symbol }}</div>
        <h3>{{ t(`capabilities.items.${capability.id}.label`) }}</h3>
        <p>{{ t(`capabilities.items.${capability.id}.description`) }}</p>
        <span class="capability-card__corner" aria-hidden="true">{{ capability.suit }}</span>
      </article>
    </div>
  </section>
</template>
```

- [ ] **Step 4: Compose the cards in Home**

Update `frontend/src/views/Home.vue`:

```vue
<script setup lang="ts">
import CapabilityCards from '@/components/CapabilityCards.vue'
import HeroSection from '@/components/HeroSection.vue'
</script>

<template>
  <HeroSection />
  <CapabilityCards />
</template>
```

- [ ] **Step 5: Run the home test and verify GREEN**

Run:

```powershell
npm run test -- --run src/views/Home.spec.ts
```

Expected: 2 tests pass.

- [ ] **Step 6: Commit the capability cards**

```powershell
git add frontend/src/components/CapabilityCards.vue frontend/src/views/Home.vue frontend/src/views/Home.spec.ts
git commit -m "feat: add four creative playing cards"
```

---

### Task 6: Complete the Product Story and Full-Page Visual System

**Files:**
- Create: `frontend/src/components/WorkflowSection.vue`
- Create: `frontend/src/components/ReleaseSection.vue`
- Modify: `frontend/src/views/Home.vue`
- Modify: `frontend/src/views/Home.spec.ts`
- Modify: `frontend/src/App.vue`
- Modify: `frontend/src/main.ts`
- Modify: `frontend/src/assets/main.css`

- [ ] **Step 1: Add the failing workflow and release tests**

Append to `frontend/src/views/Home.spec.ts`:

```ts
it('explains the unified local workflow and keeps downloads unavailable', () => {
  const wrapper = renderHome()
  expect(wrapper.get('#workflow').text()).toContain('复杂能力，简单地放在一起')
  expect(wrapper.findAll('[data-testid="workflow-benefit"]')).toHaveLength(4)
  expect(wrapper.get('#release [data-testid="release-download"]').attributes('disabled')).toBeDefined()
})
```

- [ ] **Step 2: Run the home test and verify RED**

Run:

```powershell
npm run test -- --run src/views/Home.spec.ts
```

Expected: the first two tests pass and the new workflow test fails because `#workflow` is absent.

- [ ] **Step 3: Add the workflow section**

Create `frontend/src/components/WorkflowSection.vue`:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()
const benefits = computed(() => tm('workflow.benefits') as string[])
</script>

<template>
  <section id="workflow" class="workflow section-shell">
    <div class="workflow__panel glass-panel">
      <div class="workflow__preview" aria-hidden="true">
        <span class="preview-line"></span>
        <div class="preview-columns"><i></i><i></i><i></i></div>
      </div>
      <div class="workflow__copy">
        <p class="eyebrow">{{ t('workflow.eyebrow') }}</p>
        <h2>{{ t('workflow.title') }}</h2>
        <p>{{ t('workflow.description') }}</p>
        <ul class="benefit-grid">
          <li v-for="benefit in benefits" :key="benefit" data-testid="workflow-benefit">✓ {{ benefit }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 4: Add the release section**

Create `frontend/src/components/ReleaseSection.vue`:

```vue
<script setup lang="ts">
import DownloadStatus from './DownloadStatus.vue'
</script>

<template>
  <section id="release" class="release section-shell">
    <div class="release__panel glass-panel">
      <p class="eyebrow">{{ $t('release.eyebrow') }}</p>
      <h2>{{ $t('release.title') }}</h2>
      <p>{{ $t('release.description') }}</p>
      <DownloadStatus test-id="release-download" />
    </div>
  </section>
</template>
```

- [ ] **Step 5: Compose the complete home page**

Replace `frontend/src/views/Home.vue` with:

```vue
<script setup lang="ts">
import CapabilityCards from '@/components/CapabilityCards.vue'
import HeroSection from '@/components/HeroSection.vue'
import ReleaseSection from '@/components/ReleaseSection.vue'
import WorkflowSection from '@/components/WorkflowSection.vue'
</script>

<template>
  <HeroSection />
  <CapabilityCards />
  <WorkflowSection />
  <ReleaseSection />
</template>
```

- [ ] **Step 6: Switch the application shell from routing to the single page**

Replace `frontend/src/App.vue` with:

```vue
<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Home from '@/views/Home.vue'
</script>

<template>
  <div class="site-shell">
    <Navbar />
    <main><Home /></main>
    <footer id="about" class="site-footer">
      <span>{{ $t('footer.copyright') }}</span>
      <span>{{ $t('footer.tagline') }}</span>
    </footer>
  </div>
</template>
```

Replace `frontend/src/main.ts` with:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import './assets/main.css'

createApp(App).use(i18n).mount('#app')
```

- [ ] **Step 7: Replace the global stylesheet**

Replace `frontend/src/assets/main.css` with a complete visual system using these exact structural rules:

```css
:root {
  font-family: 'HarmonyOS Sans SC', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
  color: #fff;
  background: #5c87f3;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; min-width: 320px; min-height: 100vh; overflow-x: hidden; }
button, a { font: inherit; }
a { color: inherit; text-decoration: none; }
button { color: inherit; }

.site-shell {
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at 10% 22%, rgba(255,255,255,.23), transparent 28%),
    radial-gradient(circle at 88% 72%, rgba(255,255,255,.14), transparent 30%),
    linear-gradient(140deg, #43dce4 0%, #35b8ee 23%, #4e91f5 45%, #896af2 67%, #bd5dec 83%, #ef53dd 100%);
}

.section-shell { width: min(1180px, calc(100% - 64px)); margin-inline: auto; }
.glass-panel { background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.4); box-shadow: 0 24px 64px rgba(54,52,153,.15); backdrop-filter: blur(24px); }
.eyebrow { margin: 0 0 12px; color: rgba(255,255,255,.75); font-size: .78rem; }

.navbar { position: fixed; inset: 0 0 auto; z-index: 20; padding: 16px 0; }
.navbar__inner { width: min(1180px, calc(100% - 40px)); margin: auto; padding: 10px 14px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 20px; border: 1px solid rgba(255,255,255,.28); border-radius: 18px; background: rgba(94,118,222,.22); backdrop-filter: blur(20px); }
.brand, .nav-actions, .nav-links { display: flex; align-items: center; }
.brand { gap: 9px; font-weight: 650; }
.brand img { width: 30px; height: 30px; }
.nav-links { gap: 24px; font-size: .85rem; }
.nav-actions { justify-content: flex-end; gap: 10px; }
.language-switch, .secondary-action, .download-status { border-radius: 11px; padding: 10px 16px; }
.language-switch, .secondary-action { border: 1px solid rgba(255,255,255,.5); background: rgba(255,255,255,.1); }
.download-status { border: 0; background: #fff; color: #7050bf; font-weight: 650; box-shadow: 0 12px 34px rgba(73,56,164,.18); }
.download-status:disabled { cursor: not-allowed; opacity: .9; }
.download-status--compact { padding: 8px 13px; font-size: .8rem; }
a:focus-visible, button:focus-visible { outline: 2px solid #fff; outline-offset: 4px; }

.hero { min-height: 760px; padding: 150px 0 100px; display: grid; grid-template-columns: 1.08fr .92fr; align-items: center; gap: 28px; }
.hero h1 { max-width: 680px; margin: 0 0 18px; font-size: clamp(2.6rem, 5vw, 4.7rem); font-weight: 620; line-height: 1.13; letter-spacing: -.045em; text-wrap: balance; }
.hero__description { max-width: 630px; color: rgba(255,255,255,.86); font-size: clamp(1rem, 1.4vw, 1.16rem); line-height: 1.9; }
.hero__actions { display: flex; flex-wrap: wrap; gap: 11px; margin-top: 28px; }
.duck-stage { position: relative; min-height: 430px; display: grid; place-items: center; }
.duck-glow { position: absolute; width: 78%; aspect-ratio: 1; border-radius: 50%; background: rgba(255,255,255,.18); box-shadow: 0 0 110px rgba(255,255,255,.25); }
.duck-shadow { position: absolute; bottom: 28px; width: 58%; height: 52px; border-radius: 50%; background: rgba(67,43,152,.2); filter: blur(18px); }
.duck-mascot { position: relative; width: min(100%, 470px); filter: drop-shadow(0 26px 38px rgba(52,42,141,.26)); animation: duck-float 4.8s ease-in-out infinite; }

.section-heading { max-width: 720px; margin: 0 auto 42px; text-align: center; }
.section-heading h2, .workflow h2, .release h2 { margin: 0 0 12px; font-size: clamp(2rem, 3.4vw, 3.2rem); font-weight: 600; letter-spacing: -.035em; }
.section-heading > p:last-child, .workflow__copy > p, .release__panel > p { color: rgba(255,255,255,.76); line-height: 1.8; }
.capabilities { padding: 40px 0 110px; }
.capability-row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; align-items: center; }
.capability-card { --card-a: rgba(48,188,229,.5); --card-b: rgba(74,94,213,.45); position: relative; min-width: 0; aspect-ratio: .69; padding: 22px; overflow: hidden; border: 1px solid rgba(255,255,255,.55); border-radius: 28px; background: linear-gradient(165deg, rgba(255,255,255,.28), rgba(255,255,255,.1)); box-shadow: 0 25px 55px rgba(54,52,153,.16); backdrop-filter: blur(25px); transition: transform .3s ease, box-shadow .3s ease; }
.capability-card:nth-child(1) { transform: rotate(-2.2deg); }
.capability-card:nth-child(2) { transform: translateY(-10px) rotate(.8deg); }
.capability-card:nth-child(3) { transform: translateY(-4px) rotate(-.7deg); }
.capability-card:nth-child(4) { transform: rotate(2deg); }
.capability-card:hover, .capability-card:focus-visible { transform: translateY(-14px) rotate(0); box-shadow: 0 34px 74px rgba(48,43,145,.25); outline: 2px solid rgba(255,255,255,.9); outline-offset: 4px; }
.capability-card--image { --card-a: rgba(55,143,235,.5); --card-b: rgba(109,82,220,.48); }
.capability-card--music { --card-a: rgba(119,87,224,.5); --card-b: rgba(184,67,211,.46); }
.capability-card--voice { --card-a: rgba(176,67,209,.5); --card-b: rgba(234,76,193,.48); }
.capability-card__top { display: flex; justify-content: space-between; align-items: flex-start; }
.capability-card__top strong { display: block; font-size: 2rem; font-weight: 560; line-height: 1; }
.capability-card__top small { display: block; margin-top: 5px; font-size: .62rem; opacity: .7; }
.capability-card__visual { height: 34%; margin: 12% 0 11%; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.25); border-radius: 20px; background: linear-gradient(140deg, var(--card-a), var(--card-b)); font-size: 2.4rem; }
.capability-card h3 { margin: 0 0 9px; font-size: clamp(1.12rem, 1.6vw, 1.45rem); font-weight: 600; }
.capability-card p { margin: 0; color: rgba(255,255,255,.75); font-size: .75rem; line-height: 1.7; }
.capability-card__corner { position: absolute; right: 21px; bottom: 17px; opacity: .62; }

.workflow { padding: 0 0 100px; }
.workflow__panel { padding: clamp(28px, 4vw, 48px); display: grid; grid-template-columns: .95fr 1.05fr; gap: 48px; align-items: center; border-radius: 30px; }
.workflow__preview { height: 310px; padding: 18px; border: 1px solid rgba(255,255,255,.3); border-radius: 22px; background: rgba(40,44,125,.3); }
.preview-line { display: block; width: 44%; height: 7px; margin-bottom: 15px; border-radius: 99px; background: linear-gradient(90deg,#6bf3ef,#fff,#ff8ddf); }
.preview-columns { height: calc(100% - 22px); display: grid; grid-template-columns: 22% 1fr 28%; gap: 10px; }
.preview-columns i { border-radius: 12px; background: rgba(28,31,94,.4); }
.preview-columns i:nth-child(2) { background: linear-gradient(145deg,rgba(52,190,229,.48),rgba(169,72,211,.55)); }
.benefit-grid { margin: 24px 0 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; list-style: none; }

.release { padding-bottom: 92px; }
.release__panel { padding: clamp(42px, 6vw, 72px) 24px; border-radius: 30px; text-align: center; }
.release__panel .download-status { margin-top: 12px; }
.site-footer { width: min(1180px, calc(100% - 64px)); margin: auto; padding: 0 0 36px; display: flex; justify-content: space-between; color: rgba(255,255,255,.72); font-size: .8rem; }

@keyframes duck-float { 0%,100% { transform: translateY(0) rotate(1deg); } 50% { transform: translateY(-12px) rotate(-1deg); } }

@media (max-width: 920px) {
  .navbar__inner { grid-template-columns: 1fr auto auto; }
  .nav-links { gap: 14px; font-size: .76rem; }
  .hero { grid-template-columns: 1fr; padding-top: 140px; text-align: center; }
  .hero__description { margin-inline: auto; }
  .hero__actions { justify-content: center; }
  .duck-stage { min-height: 370px; }
  .capability-row { grid-auto-flow: column; grid-auto-columns: minmax(250px, 42vw); grid-template-columns: none; overflow-x: auto; padding: 22px 20px 34px; margin-inline: -20px; scroll-snap-type: x mandatory; }
  .capability-card { scroll-snap-align: center; }
  .workflow__panel { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .section-shell { width: min(100% - 32px, 1180px); }
  .navbar__inner { width: calc(100% - 24px); grid-template-columns: 1fr auto; }
  .brand { font-size: 0; }
  .nav-links { position: fixed; left: 12px; right: 12px; bottom: 12px; z-index: 30; justify-content: space-around; padding: 12px; border: 1px solid rgba(255,255,255,.32); border-radius: 16px; background: rgba(92,96,201,.38); backdrop-filter: blur(22px); }
  .nav-actions .download-status { display: none; }
  .hero { min-height: auto; padding: 126px 0 74px; }
  .hero h1 { font-size: clamp(2.35rem, 12vw, 3.5rem); }
  .duck-stage { min-height: 320px; }
  .duck-mascot { width: min(92%, 390px); }
  .capability-row { grid-auto-columns: minmax(248px, 82vw); }
  .benefit-grid { grid-template-columns: 1fr; }
  .site-footer { width: calc(100% - 32px); flex-direction: column; gap: 8px; text-align: center; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
```

- [ ] **Step 8: Run the complete component tests and verify GREEN**

Run:

```powershell
npm run test -- --run
```

Expected: all locale, navigation, and home tests pass.

- [ ] **Step 9: Commit the completed product story**

```powershell
git add frontend/src/components/WorkflowSection.vue frontend/src/components/ReleaseSection.vue frontend/src/views/Home.vue frontend/src/views/Home.spec.ts frontend/src/App.vue frontend/src/main.ts frontend/src/assets/main.css
git commit -m "feat: complete product landing page"
```

---

### Task 7: Remove the Catalog Application and Finish Website Metadata

**Files:**
- Delete: all legacy files listed in the File Map
- Modify: `frontend/package.json`
- Modify: `frontend/package-lock.json`
- Modify: `frontend/index.html`
- Modify: `README.md`
- Modify: `README.zh.md`

- [ ] **Step 1: Prove legacy code still exists before cleanup**

Run:

```powershell
rg -n "vue-router|pinia|/admin|/projects|Cultivating Code|培育代码" frontend/src frontend/package.json frontend/index.html
```

Expected: matches are reported in the router, store, old views, dependencies, and old marketing copy.

- [ ] **Step 2: Remove obsolete runtime dependencies**

Run:

```powershell
cd frontend
npm uninstall pinia vue-router
```

Expected: both packages are removed from `dependencies` and the lockfile is updated.

- [ ] **Step 3: Remove the legacy test shim**

Update `frontend/src/components/Navbar.spec.ts` so it no longer references the store or router that will be deleted. Its imports and renderer become:

```ts
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import en from '@/i18n/en'
import zh from '@/i18n/zh'
import Navbar from './Navbar.vue'

function renderNavbar() {
  const i18n = createI18n({ legacy: false, locale: 'zh', messages: { zh, en } })
  return { wrapper: mount(Navbar, { global: { plugins: [i18n] } }), i18n }
}
```

Keep the two existing test cases unchanged.

- [ ] **Step 4: Delete the obsolete catalog and admin files**

Delete exactly the files under the **Delete** heading in the File Map. Keep `Navbar.vue`, the i18n directory, `Home.vue`, and all newly created website components and tests.

- [ ] **Step 5: Replace document metadata**

Replace `frontend/index.html` with:

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/meristemforge-icon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#5c87f3" />
    <meta name="description" content="MeristemForge 一体化本地 AI 创作工作台，集视频、图片、音乐、AI 配音与音色克隆于一体。" />
    <title>MeristemForge · 一体化 AI 创作工作台</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 6: Rewrite the README introductions**

Replace `README.zh.md` with:

````markdown
# MeristemForge 官网

[English](README.md)

MeristemForge 是一体化本地 AI 创作工作台，覆盖视频创作、图片创作、音乐创作，以及 AI 配音与音色克隆。本仓库包含其官方产品网站。

Windows 公开版本正在准备中，当前网站不提供安装包下载。

## 本地开发

```powershell
cd frontend
npm install
npm run dev
```

打开 http://localhost:3000。

## 验证

```powershell
npm run test -- --run
npm run build
```

## 技术栈

- Vue 3
- TypeScript
- Vite
- Vue I18n

## 许可证

[MIT](LICENSE)
````

Replace `README.md` with:

````markdown
# MeristemForge Website

[中文](README.zh.md)

MeristemForge is an all-in-one local AI creative workspace for video creation, image creation, music creation, and AI dubbing with voice cloning. This repository contains its official product website.

The public Windows release is being prepared. The website does not currently provide an installer download.

## Local development

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:3000.

## Verification

```powershell
npm run test -- --run
npm run build
```

## Stack

- Vue 3
- TypeScript
- Vite
- Vue I18n

## License

[MIT](LICENSE)
````

- [ ] **Step 7: Verify legacy references are gone**

Run:

```powershell
rg -n "vue-router|pinia|/admin|/projects|Cultivating Code|培育代码|Mock credentials" frontend/src frontend/package.json frontend/index.html README.md README.zh.md
```

Expected: no matches.

- [ ] **Step 8: Run automated verification**

Run:

```powershell
cd frontend
npm run test -- --run
npm run build
```

Expected: all tests pass and the Vite production build exits with code 0.

- [ ] **Step 9: Inspect responsive behavior in a browser**

Run:

```powershell
npm run dev -- --host 127.0.0.1
```

Verify at 1440 px, 900 px, and 390 px widths:

- the transparent duck has no rectangular background;
- desktop shows four portrait cards in one row;
- narrow screens use horizontal scroll snapping with part of the next card visible;
- Chinese loads by default and the language button switches all copy to English;
- navigation anchors reach the correct sections;
- all three download-status controls are disabled;
- keyboard focus is visible on links, buttons, and cards;
- reduced-motion mode disables the floating duck and transition movement.

- [ ] **Step 10: Commit the cleanup and metadata**

```powershell
git add -A frontend README.md README.zh.md
git commit -m "chore: remove legacy catalog website"
```

---

### Task 8: Final Diff and Requirement Verification

**Files:**
- Review: `docs/superpowers/specs/2026-09-15-meristemforge-product-website-design.md`
- Review: all changed files

- [ ] **Step 1: Check the final working tree and diff**

Run:

```powershell
git status --short --branch
git diff HEAD~7 --stat
git diff HEAD~7 --check
```

Expected: only intentional website, test, documentation, and asset changes are present; `git diff --check` reports no whitespace errors.

- [ ] **Step 2: Re-run final verification from a clean terminal**

Run:

```powershell
cd frontend
npm run test -- --run
npm run build
```

Expected: all tests pass and build exits with code 0.

- [ ] **Step 3: Check every acceptance criterion**

Confirm directly against the rendered page and source:

- MeristemForge is described as an all-in-one AI creative workspace.
- Video, Image, Music, and AI Dubbing and Voice Cloning appear as four large playing cards.
- The entire page uses the cyan-to-pink duck palette.
- The mascot asset is transparent and visually integrated into the hero.
- Chinese is default and English is available.
- Catalog and administration code is absent.
- No installer file or active download URL exists.
- Desktop and mobile layouts match the approved design.

- [ ] **Step 4: Request code review before integration**

Provide the reviewer with the design spec, this plan, the base commit, the final commit, and the verification output. Resolve all critical and important findings, then repeat Task 8 Steps 1–3.
