# I18n Message Contract Design

## Context

The Chinese and English locale objects gained download-status and release-metadata messages, but `messages.spec.ts` still duplicates the earlier list of release keys. The application uses the new keys correctly, while the stale test rejects them as unexpected. This makes a valid product change break `npm test` and requires developers to synchronize three independent representations of the same structure.

## Goals

- Make the complete locale structure explicit and type checked.
- Require Chinese and English to implement the same message contract.
- Keep `npm test` capable of detecting missing, extra, or empty translations.
- Remove the test-local field list that became stale.
- Preserve the existing product copy and runtime behavior.

## Non-goals

- Rewriting product copy or changing the supported locales.
- Adding runtime translation loading or a translation service.
- Typing every `vue-i18n` key used by Vue templates.
- Refactoring unrelated components or release-download behavior.

## Design

Add `frontend/src/i18n/schema.ts` as the single explicit definition of the locale contract. It will describe every top-level section and nested message, including the full release message set. Capability identifiers will be represented as a fixed record, and the workflow benefits will retain their four-item requirement.

Both `zh.ts` and `en.ts` will declare that their exported objects satisfy this schema. TypeScript will therefore report missing, misspelled, incorrectly shaped, and unexpected fields during `npm run build`, close to the locale file where the error originates.

Replace the duplicated `expectedKeys` object in `messages.spec.ts` with reusable runtime validation that:

- recursively compares the key structure of Chinese and English messages;
- verifies that every string is non-empty;
- verifies that message arrays contain only non-empty strings;
- preserves focused semantic assertions for capability order, navigation, calls to action, and workflow benefit count.

The runtime structure comparison is still necessary because Vitest transpiles TypeScript without performing a complete type check. The schema and test therefore protect different execution paths: the schema protects builds and editor feedback, while the test protects `npm test` and translation content quality.

## Data Flow and Error Handling

Locale objects remain statically imported by `src/i18n/index.ts` and passed unchanged to `vue-i18n`. No runtime data flow changes are introduced.

Contract errors fail early in one of two places:

- Type errors during `vue-tsc` identify a locale object that violates `MessageSchema`.
- Vitest assertions report the locale and nested path for structural or empty-content failures.

There is no production fallback or error recovery change because this work only strengthens authoring-time validation.

## Testing

The existing failing internationalization test is the regression reproduction. Implementation will follow this sequence:

1. Replace the brittle field-list assertion with recursive parity and content tests.
2. Add the explicit schema and apply it to both locale objects.
3. Run `npm test -- --run src/i18n/messages.spec.ts`.
4. Run the complete `npm test -- --run` suite.
5. Run `npm run build` so `vue-tsc` validates the compile-time contract.
6. Confirm that tracked files outside the internationalization contract remain unchanged.

## Acceptance Criteria

- Chinese and English locale objects satisfy one explicit `MessageSchema`.
- The complete release message set is represented in that schema.
- Tests compare locale structures recursively instead of maintaining a second hand-written field list.
- Empty strings and empty translation-array entries fail with a useful nested path.
- The internationalization test, complete test suite, and production build exit successfully.
- No product copy or production runtime behavior changes.
