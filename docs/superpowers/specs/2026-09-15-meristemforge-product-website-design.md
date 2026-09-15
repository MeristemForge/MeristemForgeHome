# MeristemForge Product Website Design

## Context

The existing `canopy` application presents MeristemForge as an SDK project catalog with project detail pages and a mock administration area. It will be replaced by the official marketing website for the MeristemForge desktop product.

MeristemForge is an all-in-one local AI creation workspace. The public website must present four available creative modules:

- Video creation
- Image creation
- Music creation
- AI dubbing and voice cloning

The website's primary goal is product awareness and future Windows downloads. No installer will be published in this version.

## Goals

- Present MeristemForge as one unified AI creation product rather than a code or SDK catalog.
- Make the four creative modules equally visible and describe them as available capabilities.
- Establish the white duck from the desktop application's engine-loading artwork as the product mascot.
- Use the loading artwork's cyan, blue, violet, and pink gradient across the entire website.
- Support Chinese as the primary language and retain an English translation.
- Produce a responsive, accessible, static website that does not require a backend.

## Non-goals

- Hosting an installer or implementing download analytics in this release.
- Providing documentation, tutorials, account management, or a product administration console.
- Reusing the engine-loading screen as a rectangular hero image.
- Representing MeristemForge as a source-code creation tool or SDK catalog.

## Information Architecture

The website is a single scrolling page with these sections:

1. **Navigation** — MeristemForge brand, links to creative capabilities, workflow, and about content, a language switch, and a disabled download-status button.
2. **Hero** — the product positioning, a short benefit statement, a Windows release-status button, a link to the capabilities section, and the standalone duck mascot.
3. **Four creative modules** — four large portrait cards arranged like a hand of playing cards: Video, Image, Music, and AI Dubbing and Voice Cloning.
4. **Unified workflow** — explains shared projects, local models, shared assets, and movement between creative modules.
5. **Local-first value** — highlights local files, user-controlled models, privacy, and project ownership without making unsupported security claims.
6. **Download preview** — clearly states that the Windows release is being prepared. The button is visibly disabled and does not point to a file.
7. **Footer** — brand, copyright, language access, and concise product positioning.

The existing project catalog, project detail, login, administration, and version-management routes are removed.

## Visual Design

### Palette

The entire page uses a continuous gradient derived from `engine-boot-duck.png`:

- Cyan: approximately `#43DCE4`
- Sky blue: approximately `#35B8EE`
- Electric blue: approximately `#4E91F5`
- Violet: approximately `#896AF2`
- Purple-pink: approximately `#BD5DEC`
- Pink: approximately `#EF53DD`
- Duck orange: approximately `#FF902F`, used only for small highlights

Sections do not switch to black or unrelated solid backgrounds. Depth comes from translucent white glass panels, restrained blur, white borders, soft shadows, and low-opacity radial light effects.

### Typography

Use a restrained modern Chinese sans-serif stack: `HarmonyOS Sans SC`, `PingFang SC`, `Microsoft YaHei`, and system sans-serif fallbacks. Chinese headings use moderate weight and size rather than oversized extra-bold type. English labels are secondary and do not use excessive tracking or all-caps decoration.

### Mascot

The duck is extracted from the engine-loading artwork into a true transparent PNG. The website asset contains only the complete duck:

- no gradient rectangle
- no loading text or progress bar
- no MeristemForge wordmark
- no question marks or motion lines

The duck appears on the right side of the desktop hero and below the copy on narrow screens. A soft radial glow, ground shadow, and subtle floating animation integrate it into the page. Motion is disabled when `prefers-reduced-motion` is active.

### Creative Module Cards

The four modules appear as four large portrait cards in one row on desktop. Each card has:

- a two-digit number (`01` through `04`)
- a small English category label
- a distinct card-suit-inspired mark
- a large central visual field
- a Chinese module title and concise description
- a translucent surface with module-specific tint while staying within the shared palette

Cards may use slight alternating rotation and vertical offset to resemble a laid-out hand of cards. Hover and keyboard focus straighten and lift the active card. On tablets and phones, cards become a horizontally scrollable snap carousel so they remain portrait cards rather than collapsing into narrow columns.

## Components and Responsibilities

- `App.vue` owns the single-page shell and global section order.
- `Navbar.vue` owns anchor navigation, mobile navigation, and language switching.
- `Home.vue` composes the marketing sections and contains no API or authentication behavior.
- A focused mascot asset in `frontend/public/` supplies the transparent duck artwork.
- The four capability descriptions are stored in the locale files so Chinese and English stay structurally identical.
- Shared visual tokens, responsive rules, focus states, reduced-motion rules, and glass-card primitives live in the global stylesheet.

Project catalog components, API clients, stores, admin views, project types, and obsolete routes are deleted once no remaining imports reference them.

## Interaction and Data Flow

The page is static. There are no network requests or persistent application records.

- Navigation items scroll to section anchors.
- The language switch updates the existing Vue I18n locale.
- The primary download control displays an unavailable state and cannot navigate or trigger a download.
- The secondary hero action scrolls to the creative-module cards.
- Module cards provide hover, focus, and scroll-snap presentation only; they do not route to unfinished product pages.

When an installer becomes available, the download control can be converted to a real link by replacing one centralized release-status value or URL rather than editing multiple templates.

## Responsive Behavior

- **Desktop:** two-column hero with the duck on the right; all four portrait cards in one row.
- **Tablet:** the hero remains two columns when space allows; the card row becomes horizontally scrollable before cards become too narrow.
- **Mobile:** navigation collapses; hero content stacks with the duck after the text; cards use horizontal snap scrolling with part of the next card visible as a gesture cue.
- Section padding, heading sizes, and decorative glows scale down without changing the continuous full-page gradient.

## Accessibility and Error States

- All navigation remains usable by keyboard.
- Visible focus styles use high-contrast white and deep-violet outlines.
- Text and glass surfaces maintain readable contrast over every part of the gradient.
- Decorative elements are hidden from assistive technology; the mascot has concise localized alternative text.
- The disabled download control communicates the unavailable state in text and with native disabled semantics.
- Missing mascot artwork must not hide the hero copy or actions; layout remains usable if the image fails to load.
- Animations respect `prefers-reduced-motion`.

## Testing and Verification

- Build the Vue application with `npm run build`.
- Verify that no removed route, API, store, or administration import remains.
- Check Chinese and English copy at every section.
- Test anchor navigation, language switching, disabled download behavior, keyboard focus, and reduced-motion behavior.
- Inspect desktop, tablet, and mobile widths in a real browser.
- Confirm that the mascot has a transparent alpha channel and no rectangular loading-screen background.
- Confirm that the four cards remain a single horizontal row on desktop and a scroll-snap card row on narrow screens.

## Acceptance Criteria

- The home page describes MeristemForge as an all-in-one AI creation workspace.
- Video, Image, Music, and AI Dubbing and Voice Cloning are presented as available modules in four large playing-card-style cards.
- The full page uses the duck artwork's cyan-to-pink gradient palette.
- The standalone duck blends into the hero without loading-screen text, borders, or a rectangular image background.
- Chinese is the default language and English can be selected.
- All catalog and administration pages are removed.
- No installer file or misleading active download link is present.
- The production build succeeds and the page is visually verified at desktop and mobile sizes.
