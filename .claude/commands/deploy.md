# Deploy Command

Automates the full deployment workflow: GitHub push, README updates, GitHub Pages setup, and security scanning.

## Usage

```
claude deploy [--github-repo URL] [--skip-security] [--dry-run]
```

## Steps Executed

1. **Security Scan** — Detects sensitive data (API keys, tokens, passwords, emails, credentials)
2. **GitHub Push** — Commits and pushes code to the provided GitHub repository
3. **README Update** — Creates/updates README with tech badges, installation, credits
4. **GitHub About** — Sets repository description and tags
5. **GitHub Pages Setup** — Configures GitHub Actions workflow for Pages deployment
6. **Link Update** — Adds live GitHub Pages URL to README and repo about

## Interactive Workflow

If you run `claude deploy` without arguments, you'll be prompted to:
1. Paste your GitHub repository URL (e.g., `https://github.com/username/repo`)
2. Confirm security scan results
3. Review generated README changes
4. Enter repository tags (comma-separated)
5. Confirm final deployment

## Options

- `--github-repo URL` — Provide GitHub URL upfront (skips prompt)
- `--skip-security` — Skip security scan (not recommended)
- `--dry-run` — Preview changes without pushing

## What Gets Checked

### Security Scan

- ❌ Blocks upload if any of these are detected:
  - API keys, tokens, secrets (AWS_*, API_KEY, SECRET, PASSWORD)
  - Email addresses (unless allowed in CLAUDE.md)
  - Private URLs or internal IPs
  - Credential patterns (Bearer, Authorization, etc.)
  - Database connection strings
  - Environment variables with sensitive values

- ⚠️ Warns (requires confirmation) for:
  - Comments with TODO/FIXME (may contain context)
  - Config files with sensitive patterns
  - Unused variables that might leak data

### README Generated With

- Project title and description
- Tech stack badges (HTML, CSS, JavaScript, GitHub Pages)
- Installation instructions
- Usage examples
- Features list
- GitHub Pages link
- Credits and license

### GitHub Pages

- Deploys from `/docs` folder
- Configures GitHub Actions workflow
- Outputs live site URL (e.g., `https://username.github.io/repo/`)

## Example

```bash
claude deploy --github-repo https://github.com/Godwin8888/AgenticAITest
```

Or interactive:

```bash
claude deploy
# Paste GitHub URL: https://github.com/Godwin8888/AgenticAITest
# Security scan: ✓ No issues found
# README ready for review: (y/n) y
# Tags: web, static-site, vanilla-js
# Deploy to GitHub? (y/n) y
# ✓ Deployed to GitHub
# ✓ GitHub Pages live at: https://godwin8888.github.io/AgenticAITest/
```

## Security Notes

- **Before deploy:** Script scans all files in the project
- **No secrets in docs:** If sensitive info is found, deployment is blocked
- **Review before push:** Always review the security scan output
- **Environment files:** Add `.env`, `.env.local` to `.gitignore` (already configured)

## After Deployment

1. ✓ Code is pushed to GitHub
2. ✓ README is created/updated with badges and links
3. ✓ GitHub Pages is live and linked
4. ✓ Repository has description and tags
5. ✓ All sensitive data has been verified as safe

---

*This command is powered by Claude Code. See `.claude/commands/deploy.sh` for implementation details.*
