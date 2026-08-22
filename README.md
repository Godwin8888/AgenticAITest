# AgenticAITest

SureWinTotoIT — A static, single-page marketing website for an IT services company, built with vanilla HTML, CSS, and JavaScript (no frameworks, no build step).

## Features

- **Responsive design** — mobile-first, tested at 320px–1280px+
- **Accessible** — semantic HTML5, WCAG AA contrast, keyboard navigation, aria-* attributes
- **Form validation** — client-side email/phone regex, honeypot anti-spam, network-error handling
- **Mobile carousel** — swipeable testimonials on small screens, grid on desktop
- **Smooth interactions** — fade-in-on-scroll, hamburger nav, prefers-reduced-motion support
- **Design tokens** — CSS custom properties for colors, spacing, radii, shadows, typography

## Files

- `index.html` — markup with sticky nav, hero, services, testimonials, enquiry form, footer
- `styles.css` — token-driven styling, mobile-first layout, responsive breakpoints
- `script.js` — behavior: nav toggle, fade-in observer, carousel, form submission
- `CLAUDE.md` — architecture overview and development notes

## Getting Started

1. **Open locally** — double-click `index.html`, or serve via HTTP:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Then open http://localhost:8000
   ```

2. **Connect form submission** — edit `script.js` line 10:
   ```javascript
   const FORM_ENDPOINT = 'https://formspree.io/f/{your_form_id}';
   ```
   Supports Formspree, Getform, or a custom API endpoint (see comment in script.js for examples).

## Design

- **Color palette**: deep navy base, amber CTAs, cyan accents
- **Typography**: Manrope font (Google Fonts), fallback to system stack
- **Spacing & radius**: consistent design tokens throughout
- **Breakpoints**: 480px, 768px, 1024px

See `CLAUDE.md` for full architecture details.
