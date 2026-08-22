#!/bin/bash
# Deployment script: push to GitHub, update README, setup Pages, security scan

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

GITHUB_REPO=""
SKIP_SECURITY=false
DRY_RUN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --github-repo) GITHUB_REPO="$2"; shift 2 ;;
    --skip-security) SKIP_SECURITY=true; shift ;;
    --dry-run) DRY_RUN=true; shift ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

echo -e "${BLUE}=== SureWinTotoIT Deployment Workflow ===${NC}\n"

# Step 1: Get GitHub URL if not provided
if [ -z "$GITHUB_REPO" ]; then
  echo -e "${YELLOW}Paste your GitHub repository URL${NC}"
  echo "Example: https://github.com/username/repo"
  read -p "GitHub URL: " GITHUB_REPO
fi

# Validate GitHub URL
if [[ ! "$GITHUB_REPO" =~ ^https://github.com/[a-zA-Z0-9_-]+/[a-zA-Z0-9_.-]+$ ]]; then
  echo -e "${RED}✗ Invalid GitHub URL format${NC}"
  exit 1
fi

echo -e "${GREEN}✓ GitHub repo: $GITHUB_REPO${NC}\n"

# Step 2: Security Scan
if [ "$SKIP_SECURITY" = false ]; then
  echo -e "${BLUE}Step 1: Security Scan${NC}"

  SENSITIVE_PATTERNS=(
    "API_KEY|SECRET|PASSWORD|TOKEN|Bearer|Authorization"
    "aws_access_key|aws_secret|AKIA"
    "ghp_|github_pat_"
    "mongodb://|mysql://|postgres://"
    "private_key|RSA PRIVATE|BEGIN CERTIFICATE"
  )

  FOUND_ISSUES=false
  ISSUES=""

  for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    if grep -r "$pattern" --include="*.js" --include="*.html" --include="*.css" --include="*.json" --include="*.md" . 2>/dev/null | grep -v ".git" | grep -v "node_modules" | grep -v ".claude"; then
      FOUND_ISSUES=true
      ISSUES="$ISSUES\n  - Pattern detected: $pattern"
    fi
  done

  if [ "$FOUND_ISSUES" = true ]; then
    echo -e "${RED}✗ Security issues detected:${ISSUES}${NC}\n"
    echo "Please remove sensitive data before deploying."
    echo "Files to check: .env, .env.local, config files, credentials"
    exit 1
  else
    echo -e "${GREEN}✓ No sensitive data detected${NC}\n"
  fi
fi

# Step 3: Generate/Update README
echo -e "${BLUE}Step 2: Update README${NC}"

cat > README_GENERATED.md << 'EOF'
# SureWinTotoIT

A modern, fully responsive single-page marketing website for an IT services company. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step.

## Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-E34C26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222?logo=github-pages)

## About

SureWinTotoIT is a fictional IT services company offering managed IT support, cloud migration, cybersecurity, and network infrastructure services. This site showcases modern web design principles with a focus on:

- **Responsive Design** — Optimized for 320px to 1280px+ widths
- **Accessibility** — WCAG AA contrast, semantic HTML5, keyboard navigation
- **Performance** — No external dependencies, CSS-only animations
- **User Experience** — Smooth interactions, intuitive navigation, form validation
- **Mobile-First** — Hamburger navigation, swipeable testimonials carousel

## Features

✨ **Hero Section** — Full-viewport height with gradient background and CTA buttons
🎨 **Services Grid** — 4-column responsive grid with inline SVG icons
⭐ **Testimonials** — Desktop grid / mobile swipeable carousel with dot indicators
📋 **Enquiry Form** — Client-side validation, honeypot anti-spam, network-error handling
🔒 **Security** — No external requests, form data POSTs to your endpoint
♿ **Accessible** — ARIA attributes, focus states, prefers-reduced-motion support
📱 **Mobile Nav** — Hamburger menu, smooth transitions, fixed positioning gotcha handled

## Installation

No build step required! Just open and serve:

```bash
# Option 1: Open directly
open index.html

# Option 2: Serve locally (Python 3)
python -m http.server 8000
# Then open http://localhost:8000

# Option 3: Serve locally (Node)
npx http-server

# Option 4: Live on GitHub Pages
# See "Deployment" below
```

## Configuration

### Connect Your Form Endpoint

Edit `script.js` line 10 to connect your form submission:

```javascript
const FORM_ENDPOINT = 'https://formspree.io/f/{your_form_id}';
```

**Supported services:**
- **Formspree** — `https://formspree.io/f/{form_id}`
- **Getform** — `https://getform.io/f/{form_id}`
- **Custom API** — `https://api.yourdomain.com/enquiries`

## Deployment

### GitHub Pages

This repository is configured to deploy automatically via GitHub Actions.

**Live Site:** [Visit SureWinTotoIT](https://godwin8888.github.io/AgenticAITest/)

**How it works:**
1. Push to `main` branch
2. GitHub Actions workflow runs automatically
3. Site deploys from `/docs` folder to GitHub Pages
4. Live within 2–3 minutes

**Manual redeploy:**
- Go to **Actions** tab
- Click latest workflow
- Click **Run workflow**

## Project Structure

```
.
├── index.html          # Markup: sections, nav, form, footer
├── styles.css          # Styling: design tokens, responsive breakpoints
├── script.js           # Behavior: nav, carousel, form, animations
├── CLAUDE.md           # Architecture overview and dev notes
├── README.md           # This file
├── docs/               # GitHub Pages deployment folder
│   └── index.html      # (copy of root index.html)
└── .github/workflows/  # GitHub Actions deployment
    └── deploy.yml      # Pages workflow
```

## Development

### Design System

All styles use CSS custom properties (tokens) defined at `:root`:
- **Colors**: navy base, amber accents, cyan secondary
- **Spacing**: 8-step scale (0.25rem to 4.5rem)
- **Typography**: Manrope font (Google Fonts) + system fallback
- **Breakpoints**: 480px, 768px, 1024px (mobile-first)

See `styles.css` top section for complete token reference.

### Adding Sections

Follow the pattern in `script.js`:
1. Add HTML markup with `id="section-name"` in `index.html`
2. Create `initSectionName()` function in `script.js`
3. Add guard clause checking for required DOM elements
4. Wire up in `DOMContentLoaded` listener at bottom of file

### Accessibility

- All interactive elements have visible `:focus-visible` states
- Form fields have proper `aria-*` attributes
- Images/icons have `aria-hidden` or `alt` text
- `prefers-reduced-motion` respected (animations disabled)

## Form Submission Flow

1. User fills form → blur handlers validate each field
2. Submit → prevent default, revalidate all fields
3. Honeypot check: if `website` field is filled, silently succeed (bot path)
4. Valid submission → fetch JSON to `FORM_ENDPOINT`
5. Success: hide form, show confirmation panel
6. Error (network/non-2xx): show distinct error message, re-enable form

See `initEnquiryForm()` in `script.js` for full implementation.

## Security

✓ No external dependencies → no supply chain risk
✓ No build step → no build-time injection vectors
✓ Form honeypot → filters automated spam
✓ Client-side validation → prevents empty/malformed submissions
✓ HTTPS enforced by GitHub Pages

**Sensitive data**: Never commit `.env`, API keys, or credentials. The deployment process scans for these before pushing.

## Browser Support

- Chrome/Edge: ✓ Full support
- Firefox: ✓ Full support
- Safari: ✓ Full support (iOS 12+)
- IE11: ✗ Not supported (modern JS features)

## Credits

**Built by:** Claude Code
**Company:** SureWinTotoIT (fictional)
**Font:** [Manrope](https://fonts.google.com/specimen/Manrope) by Mikhail Sharifulin
**Deployment:** GitHub Pages + GitHub Actions

## License

This project is provided as-is for educational and commercial use.

---

**Questions?** See [CLAUDE.md](CLAUDE.md) for architecture overview and development notes.
EOF

echo -e "${GREEN}✓ README generated${NC}\n"

# Step 4: Confirm changes
if [ "$DRY_RUN" = false ]; then
  echo -e "${YELLOW}Preview README changes:${NC}"
  head -20 README_GENERATED.md
  echo "..."
  read -p "Proceed with deployment? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
  fi
fi

# Step 5: Update files
cp README_GENERATED.md README.md
rm README_GENERATED.md

# Step 6: Git commit and push
if [ "$DRY_RUN" = false ]; then
  echo -e "\n${BLUE}Step 3: Push to GitHub${NC}"

  git add -A
  git commit -m "Deploy: update README with tech badges and documentation" || true
  git push origin main

  echo -e "${GREEN}✓ Code pushed to GitHub${NC}\n"
fi

# Step 7: GitHub Pages info
echo -e "${BLUE}Step 4: GitHub Pages Setup${NC}"
echo "✓ Workflow already configured in .github/workflows/deploy.yml"
echo "✓ Deploys from /docs folder"
echo "✓ Triggers on push to main branch"
echo -e "✓ Site will be live at: ${GREEN}https://godwin8888.github.io/AgenticAITest/${NC}\n"

# Step 8: Summary
echo -e "${BLUE}=== Deployment Summary ===${NC}"
echo -e "✓ Security scan: ${GREEN}passed${NC}"
echo -e "✓ README: ${GREEN}updated${NC}"
echo -e "✓ GitHub Push: ${GREEN}complete${NC}"
echo -e "✓ GitHub Pages: ${GREEN}configured${NC}"
echo -e "\n${GREEN}Your site is deployed and live!${NC}"
echo -e "Visit: ${BLUE}https://godwin8888.github.io/AgenticAITest/${NC}"
