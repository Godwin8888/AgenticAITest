# Security Checklist

This checklist is run before every deployment to ensure no sensitive information is uploaded to GitHub.

## ❌ Blocked (Deployment will fail)

These patterns will **block deployment** if detected:

### API Keys & Tokens
- `API_KEY`, `API_KEY=`, `apiKey`
- `SECRET`, `SECRET_*`
- GitHub tokens: `ghp_*`, `github_pat_*`
- AWS keys: `AKIA*`, `aws_access_key_id`, `aws_secret_access_key`
- Bearer tokens: `Bearer `, `Authorization: Bearer`
- Private keys: `BEGIN CERTIFICATE`, `RSA PRIVATE`, `-----BEGIN`

### Passwords & Credentials
- `PASSWORD=`, `password:`
- `credentials`, `secret`
- Connection strings: `mongodb://`, `mysql://`, `postgres://`, `mongodb+srv://`
- Database URLs with credentials

### Email & Personal Info
- Email addresses (if not explicitly allowed in CLAUDE.md)
- Phone numbers in code
- Social security numbers, credit card patterns

### Other Secrets
- OAuth tokens, API secrets
- Private URLs or internal IPs (192.168.*, 10.*)
- Slack/Discord webhooks
- Firebase config with API keys

## ⚠️ Warnings (Require manual review)

These will **warn but not block**:

- `TODO`, `FIXME` comments (may contain context about secrets)
- `.env` file references without `.gitignore`
- Config files with potential sensitive values
- Unused variables that might leak data

## ✓ Safe To Commit

### Files that are fine to upload:
- `index.html` — markup, no secrets
- `styles.css` — styling, no secrets
- `script.js` — form submission to placeholder endpoint (no actual key)
- `.github/workflows/` — GitHub Actions workflows
- `README.md` — documentation
- `CLAUDE.md` — architecture notes
- `.gitignore` — file exclusion rules

### Example of safe form endpoint:
```javascript
const FORM_ENDPOINT = 'https://example.com/api/enquiry';
// Safe because it's a placeholder. User will replace with real URL after clone.
```

### Example of UNsafe form endpoint:
```javascript
const FORM_ENDPOINT = 'https://api.example.com/enquiries?key=sk_live_123456abcdef';
// UNSAFE! Real API key in code. Should use environment variable instead.
```

## Before You Deploy

### 1. Check for `.env` files
```bash
ls -la | grep env
# If .env exists, it should be in .gitignore
cat .gitignore | grep env
```

### 2. Check for credentials in code
```bash
# Search for common patterns
grep -r "password" --include="*.js" --include="*.html" .
grep -r "api.*key" --include="*.js" .
grep -r "secret" --include="*.js" .
```

### 3. Check git history
```bash
# See what files have been committed
git log --name-only --pretty=format: | sort | uniq | grep -E "\.(env|key|pem|p12)$"
```

### 4. Remove if found
```bash
# If you accidentally committed a secret:
git rm --cached .env
git commit -m "Remove .env from git history"
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"
git push
```

## During Deployment

The security scan will:

1. ✓ Search all files for sensitive patterns
2. ✓ Check `.gitignore` for proper exclusions
3. ✓ Verify no credentials in git history
4. ✓ Flag suspicious patterns
5. ✓ Block if high-risk issues found
6. ✓ Proceed only if safe

## If Blocked

If deployment is blocked, the output will show:

```
✗ Security issues detected:
  - Pattern detected: API_KEY|SECRET|PASSWORD
  
Please remove sensitive data before deploying.
Files to check: .env, .env.local, config files, credentials
```

**To fix:**
1. Identify the file(s) with sensitive data
2. Remove or move the data
3. Add to `.gitignore`
4. Commit the fix
5. Retry deployment

## After Deployment

Even after deployment, remember:

- ⚠️ GitHub stores git history — deleted files can be recovered by others
- ⚠️ If a real secret was ever committed, assume it's compromised
- ⚠️ Rotate any exposed credentials immediately
- ✓ Use environment variables or GitHub Secrets for real credentials

## GitHub Secrets (for real credentials)

For the form endpoint with a real API key:

```bash
# 1. Go to repo Settings → Secrets and variables → Actions
# 2. Click "New repository secret"
# 3. Name: FORM_ENDPOINT
# 4. Value: https://api.example.com/enquiries?key=sk_live_123456abcdef
```

Then in `script.js`:
```javascript
// Use in GitHub Actions or environment, NOT in code
// const FORM_ENDPOINT = process.env.FORM_ENDPOINT;
```

---

**Never commit secrets to public repositories.**
