# Single Download Release Flow Design

## Context

The home page currently renders the reusable download component in the navigation bar, hero, and release section. The release section also fetches the same manifest independently, so one page load can request release data four times. The current manifest describes version `0.1.0` as pending while still publishing a download URL, which causes the UI to offer an active link that returns the HTML application shell instead of an installer.

The release manifest also contains Chinese status and note text. These values remain Chinese after the page switches to English. Release metadata is rendered as adjacent inline spans without layout spacing, and the browser document title remains Chinese in English mode.

## Goals

- Keep exactly one download control, in the hero position selected by the user.
- Render the hero control as disabled and label it “暂未发布” or “Coming Soon” when no installer is published.
- Make an active download link possible only for an explicitly published release with a non-empty download URL.
- Fetch release data once per page load and share it with the hero and release-information section.
- Localize release status, release notes, and the browser document title.
- Preserve the bottom release section as an information-only area.
- Present release metadata with readable spacing and wrapping.

## Non-goals

- Uploading or distributing an installer.
- Adding release analytics, update checks, or a release-history page.
- Changing the rest of the homepage information architecture or visual theme.
- Adding additional download mirrors or platform choices.

## Release Manifest

`public/releases/latest.json` will contain language-neutral release state and explicitly localized release notes:

```json
{
  "version": "0.1.0",
  "platform": "windows-x64",
  "filename": "MeristemForge-Setup-0.1.0.exe",
  "status": "pending",
  "size": null,
  "publishedAt": null,
  "downloadUrl": null,
  "notes": {
    "zh": ["首个公开版本", "支持视频、图片、音乐和声音创作"],
    "en": ["First public release", "Create video, images, music, and voice"]
  }
}
```

`status` is limited to `pending` and `published`. A release is downloadable only when `status` is `published` and `downloadUrl` is a non-empty string. Pending releases must use `null` for `downloadUrl`, `size`, and `publishedAt`, which prevents placeholder URLs from becoming active links.

The fallback release returned after a network or parsing failure uses the same pending structure. Malformed response data must not create an active download link.

## Component Architecture and Data Flow

`Home.vue` owns release loading. It fetches the manifest once on mount and retains both the loading state and the typed release result.

The data flows to two consumers:

- `HeroSection.vue` receives the release and loading state. It owns the page's only download control.
- `ReleaseSection.vue` receives the release and uses the current locale to select localized release notes. It displays release information but no download control.

`Navbar.vue` contains only navigation and language switching. It no longer imports or renders release-download UI.

The old self-fetching `DownloadStatus.vue` will be replaced by a focused presentation component named `ReleaseDownload.vue`. It accepts release and loading props and never performs network access. This keeps release-fetching responsibility in one place and makes every state directly testable.

## Download-Control States

The hero control has three visible states:

1. **Loading:** a disabled button labeled with the localized checking message.
2. **Pending or invalid:** a disabled button labeled “暂未发布” or “Coming Soon”.
3. **Published:** an anchor with the localized download label and version. It uses the manifest URL and filename.

Only state 3 is interactive. The page must contain exactly one element identified as the release download control in every state.

## Localization and Document Metadata

The message schema will include localized release status text and localized page titles. Locale files remain the source for static interface copy; the manifest supplies locale-specific release notes because notes change per release.

When the locale changes, the application updates all of the following together:

- visible interface copy;
- release notes selected from the manifest;
- `document.documentElement.lang`;
- `document.title`.

The static HTML title remains a Chinese initial fallback before the application mounts.

## Release Information Layout

The release section continues to show the product heading, description, version, platform, localized status, optional size, optional publication date, and localized notes.

Metadata will be a wrapping flex row with an explicit gap. Each value remains a separate semantic item, so text does not visually concatenate at narrow widths. Null size and date values are omitted instead of showing placeholder text.

The release section will not contain a button or download link.

## Error Handling

- Fetch failures and non-success HTTP responses return the typed pending fallback.
- Invalid or incomplete manifest fields are normalized to the pending fallback.
- A pending release never becomes clickable, even if malformed input includes a stray URL.
- Missing notes fall back to the static localized release notes already defined in the locale files.
- UI rendering remains usable while the manifest is loading or unavailable.

## Testing and Verification

- Unit-test manifest normalization for valid published, valid pending, and malformed responses.
- Unit-test `ReleaseDownload.vue` for loading, pending, malformed pending-with-URL, and published states.
- Verify the homepage renders exactly one release download control.
- Verify the navigation and release-information section render no download control.
- Verify English mode displays English release status and notes.
- Verify locale changes update `document.title` and persist across reload initialization.
- Run the complete Vitest suite and production build.
- Inspect the rendered page in Chinese and English at the current browser width, confirming readable metadata spacing and a disabled pending control.

## Acceptance Criteria

- Exactly one download control exists, in the hero.
- The `0.1.0` pending release shows a disabled “暂未发布” control in Chinese and “Coming Soon” in English.
- No request or click to `/downloads/MeristemForge-Setup-0.1.0.exe` is offered while the release is pending.
- The navigation and release section contain no download controls.
- Release information is fetched once per page load.
- English mode contains no Chinese release status or release-note text.
- Release metadata is visually separated and wraps cleanly.
- The browser document title matches the selected locale.
- All tests and the production build pass.
