# I18n Message Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stale hand-written locale key list with one explicit TypeScript schema plus recursive runtime parity and content validation.

**Architecture:** `schema.ts` is the single compile-time contract implemented by both locale objects. `messages.spec.ts` independently validates the runtime structures and message content because Vitest does not perform a complete TypeScript type check.

**Tech Stack:** TypeScript, Vue 3, Vue I18n, Vitest, vue-tsc

---

## File Structure

- Create `frontend/src/i18n/schema.ts`: owns the complete locale contract and reusable message types.
- Modify `frontend/src/i18n/zh.ts`: declares the Chinese locale object against `MessageSchema`.
- Modify `frontend/src/i18n/en.ts`: declares the English locale object against `MessageSchema`.
- Modify `frontend/src/i18n/messages.spec.ts`: replaces duplicated key arrays with schema type assertions, recursive structure comparison, and empty-content checks.

### Task 1: Add the Compile-Time Locale Contract

**Files:**
- Create: `frontend/src/i18n/schema.ts`
- Modify: `frontend/src/i18n/zh.ts`
- Modify: `frontend/src/i18n/en.ts`
- Test: `frontend/src/i18n/messages.spec.ts`

- [ ] **Step 1: Add a type-level test that references the desired contract**

Update the Vitest import and imports at the top of `frontend/src/i18n/messages.spec.ts`:

```ts
import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import type { MessageSchema } from './schema'
import en from './en'
import zh from './zh'
```

Add this test before the locale content suites:

```ts
describe('message schema', () => {
  it('is implemented by every locale', () => {
    expectTypeOf(zh).toMatchTypeOf<MessageSchema>()
    expectTypeOf(en).toMatchTypeOf<MessageSchema>()
  })
})
```

- [ ] **Step 2: Run the build to verify the type-level test is red**

Run: `cd frontend && npm run build`

Expected: FAIL because `./schema` does not exist.

- [ ] **Step 3: Create the explicit message schema**

Create `frontend/src/i18n/schema.ts`:

```ts
export type CapabilityKey = 'video' | 'image' | 'music' | 'voice'

export interface CapabilityMessage {
  label: string
  description: string
}

export interface MessageSchema {
  nav: {
    capabilities: string
    workflow: string
    about: string
    language: string
    ariaLabel: string
  }
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    explore: string
    mascotAlt: string
  }
  capabilities: {
    eyebrow: string
    title: string
    subtitle: string
    items: Record<CapabilityKey, CapabilityMessage>
  }
  workflow: {
    eyebrow: string
    title: string
    description: string
    benefits: [string, string, string, string]
  }
  release: {
    eyebrow: string
    title: string
    description: string
    button: string
    download: string
    checking: string
    unavailable: string
    version: string
    note1: string
    note2: string
    note3: string
  }
  footer: {
    tagline: string
    copyright: string
  }
}
```

- [ ] **Step 4: Apply the schema to both locale objects**

At the top of `frontend/src/i18n/zh.ts`, add the type import and name the object:

```ts
import type { MessageSchema } from './schema'

const zh = {
```

Replace the closing `}` with:

```ts
} satisfies MessageSchema

export default zh
```

Apply the same pattern in `frontend/src/i18n/en.ts`, using `const en` and `export default en`.

- [ ] **Step 5: Run the build to verify the contract is green**

Run: `cd frontend && npm run build`

Expected: PASS; `vue-tsc` accepts both locales and Vite creates the production bundle.

- [ ] **Step 6: Commit the compile-time contract**

```bash
git add frontend/src/i18n/schema.ts frontend/src/i18n/zh.ts frontend/src/i18n/en.ts frontend/src/i18n/messages.spec.ts
git commit -m "test: add typed i18n message contract"
```

### Task 2: Replace the Brittle Runtime Contract Test

**Files:**
- Modify: `frontend/src/i18n/messages.spec.ts`

- [ ] **Step 1: Preserve the existing red regression evidence**

Run: `cd frontend && npm test -- --run src/i18n/messages.spec.ts`

Expected: FAIL in both `defines the complete section contract` cases because the old `release` list omits seven valid keys.

- [ ] **Step 2: Add recursive structure and content helpers**

Delete the `expectedKeys` constant and add these helpers after the imports:

```ts
function messageShape(value: unknown): unknown {
  if (typeof value === 'string') return 'string'
  if (Array.isArray(value)) return value.map(messageShape)

  if (value === null || typeof value !== 'object') return typeof value

  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, messageShape(child)]),
  )
}

function emptyMessagePaths(value: unknown, path = ''): string[] {
  if (typeof value === 'string') return value.trim() ? [] : [path]

  if (Array.isArray(value)) {
    if (value.length === 0) return [path]
    return value.flatMap((child, index) => emptyMessagePaths(child, `${path}[${index}]`))
  }

  if (value === null || typeof value !== 'object') return [path]

  return Object.entries(value).flatMap(([key, child]) =>
    emptyMessagePaths(child, path ? `${path}.${key}` : key),
  )
}
```

- [ ] **Step 3: Replace the duplicated complete-contract assertion**

Add a parity test outside the language-specific suite:

```ts
describe('locale parity', () => {
  it('keeps Chinese and English message structures identical', () => {
    expect(messageShape(en)).toEqual(messageShape(zh))
  })
})
```

In the existing `describe.each`, replace `defines the complete section contract` with:

```ts
it('contains no empty messages', () => {
  expect(emptyMessagePaths(messages)).toEqual([])
})
```

Keep the capability-order, primary-copy, and initial-locale tests unchanged.

- [ ] **Step 4: Run the focused test**

Run: `cd frontend && npm test -- --run src/i18n/messages.spec.ts`

Expected: PASS with all internationalization tests green.

- [ ] **Step 5: Run complete verification**

Run: `cd frontend && npm test -- --run`

Expected: PASS with 5 test files and all tests green.

Run: `cd frontend && npm run build`

Expected: PASS with `vue-tsc` and Vite completing successfully.

Run: `git diff --check && git status --short`

Expected: no whitespace errors; only the planned implementation and plan file are changed.

- [ ] **Step 6: Commit the runtime validation**

```bash
git add frontend/src/i18n/messages.spec.ts docs/superpowers/plans/2026-10-14-i18n-message-contract.md
git commit -m "test: validate locale structure recursively"
```
