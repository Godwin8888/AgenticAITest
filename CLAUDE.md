# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A static, single-page marketing/enquiry site for a fictional IT services company
("SureWinTotoIT"). Three files, no framework, no build step, no dependencies:

- [index.html](index.html) — all markup, sections anchor-linked from a sticky nav
  (`#hero`, `#services`, `#testimonials`, `#enquiry`, footer)
- [styles.css](styles.css) — all styling
- [script.js](script.js) — all behavior

## Running locally

Opening `index.html` directly via `file://` renders the page and applies CSS/JS fine,
but the enquiry form's `fetch()` call and any CORS-sensitive behavior need an actual
HTTP origin to test realistically. This machine has neither Python nor Node on PATH, so
there is no `python -m http.server` / `npx serve` shortcut available — spin up a minimal
local server another way (e.g. a small PowerShell `HttpListener` script) if you need to
verify network requests, or test the network-error path by simply leaving
`FORM_ENDPOINT` unset/unreachable (it fails fast with a CORS/network error either way).

There is no lint, build, or test command — there's nothing to compile and no test
runner configured.

## Architecture

**styles.css** is token-driven: every color, spacing value, radius, shadow, and font
size is defined once under `:root` and referenced everywhere else — there should be no
hardcoded hex/px values in component rules. The color direction is deep navy
(`--color-bg`/`--color-surface`) with amber (`--color-primary`) as the CTA/accent color
and cyan (`--color-accent`) as a secondary accent. Layout is mobile-first with
`min-width` breakpoints at 480 / 768 / 1024px.

**script.js** is a set of independent `init*()` functions, each wired up once from a
single `DOMContentLoaded` listener at the bottom of the file: `initNavToggle`,
`initFadeInObserver`, `initTestimonialCarousel`, `initEnquiryForm`, `setFooterYear`.
When adding new interactive behavior, follow this pattern (a self-contained `init`
function, guarded with early-`return` null checks on its DOM elements) rather than
adding ad-hoc top-level listeners.

Two behaviors are gated behind `prefers-reduced-motion` (checked once into the
module-level `prefersReducedMotion` const): the IntersectionObserver fade-in
(`.fade-in`/`.visible` classes) is skipped entirely — elements are shown immediately —
and the testimonial carousel's `scrollIntoView` calls use `'auto'` instead of
`'smooth'`.

**Testimonial carousel** (`initTestimonialCarousel`): on desktop the `.testimonial-track`
is a 3-column CSS grid and the JS-built prev/next/dot controls are hidden via CSS
(`.carousel-controls { display: none }` above the 768px breakpoint). On mobile it's a
horizontally-scrolling flex track with `scroll-snap`; JS builds one dot button per slide,
and a scroll listener re-syncs the active dot when the user swipes manually (distinguished
from programmatic scrolls via the `syncFromScroll` flag, since `goToSlide()` triggers
`scrollIntoView` which also fires `scroll` events).

**Enquiry form** (`initEnquiryForm`): validation rules live in one `rules` map (field
name → validator function returning an error string or `''`), shared between the
per-field `blur` handlers and the `submit` handler, so add new fields by extending
`fields` and `rules` together. The hidden `website` input is a honeypot — if it's
non-empty, submission fake-succeeds without calling `fetch`. Real submits POST JSON to
`FORM_ENDPOINT` ([script.js:10](script.js:10)), a placeholder — swap it for a real
Formspree/Getform/custom API URL (see the comment above the const for examples). The
`fetch` success/non-2xx/network-error cases each show a distinct message via
`setStatus()`.

**Known layout gotcha**: the mobile nav (`#navMenu`) is `position: fixed` and slid
off-screen with `transform: translateX(100%)` when closed. Because Chrome includes a
fixed element's *untransformed* box when computing the document's scrollable area,
`html` (not just `body`) needs `overflow-x: hidden` or the page gains real horizontal
scroll on narrow viewports even though nothing is visually overflowing. If you touch the
nav's positioning, re-check for horizontal scroll at 320–767px widths.
