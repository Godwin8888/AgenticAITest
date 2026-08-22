# Browser Testing with Claude in Chrome

Automate browser testing and verification of your SureWinTotoIT website using Claude in Chrome MCP.

## What You Can Do

✅ **Navigate** — Open URLs, click links, scroll pages
✅ **Read** — Extract page content, verify text is present
✅ **Interact** — Fill forms, submit, test interactions
✅ **Screenshot** — Capture visual state
✅ **Test** — Verify responsive design at different breakpoints
✅ **Debug** — Read console errors, network requests

## Getting Started

### 1. Install Claude in Chrome Extension

1. Go to: https://chromewebstore.google.com/detail/fcoeoabgfenejglbffodgkkbkcdhcgfn
2. Click **Add to Chrome**
3. Open Claude side panel in Chrome
4. Sign in with your Claude account

### 2. Verify Connection

In Claude Code, you should now have access to:
- `mcp__claude-in-chrome__navigate`
- `mcp__claude-in-chrome__computer`
- `mcp__claude-in-chrome__read_page`
- `mcp__claude-in-chrome__find`
- `mcp__claude-in-chrome__form_input`
- `mcp__claude-in-chrome__javascript_tool`

## Example Tests

### Test 1: Verify Hero Section

```
claude: Test the hero section of my website
- Navigate to https://godwin8888.github.io/AgenticAITest/
- Screenshot the hero
- Verify headline says "Reliable IT, without the guesswork."
- Test both CTAs click correctly
```

### Test 2: Form Validation

```
claude: Test form validation
- Navigate to https://godwin8888.github.io/AgenticAITest/#enquiry
- Try submitting empty form
- Verify error messages appear
- Fill valid data
- Test submit button works
```

### Test 3: Mobile Responsiveness

```
claude: Test mobile view
- Resize browser to 375x812 (mobile)
- Verify hamburger menu appears
- Click menu to open
- Verify nav links are clickable
- Check no horizontal scroll
```

### Test 4: Testimonial Carousel

```
claude: Test testimonial carousel on mobile
- Resize to 375x812
- Navigate to testimonials section
- Click next button
- Verify carousel advances
- Check dot indicators update
```

## Common Tasks

**Take a screenshot:**
```
Take a screenshot of the current page
```

**Extract all text:**
```
Read the page and show me all visible text
```

**Fill a form:**
```
Fill the enquiry form with:
- Name: John Doe
- Email: john@example.com
- Phone: +1 555 123 4567
- Service: Cloud Migration
- Message: Test message
```

**Test link navigation:**
```
Click the "Services" link and verify it scrolls to the services section
```

**Check for errors:**
```
Read console messages to see if there are any JavaScript errors
```

## Automated Test Script

To run comprehensive tests, ask Claude:

```
Run these tests on my website and report results:
1. Hero section - verify CTA buttons work
2. Services grid - verify all 4 cards display (desktop)
3. Testimonial carousel - test navigation (mobile)
4. Form validation - test required fields
5. Mobile responsiveness - test no horizontal scroll at 320px
6. Accessibility - verify focus states visible
7. Links - verify all anchor links work

Test at: https://godwin8888.github.io/AgenticAITest/
```

## Troubleshooting

**If Claude in Chrome isn't connected:**
1. Make sure extension is installed
2. Open Claude side panel in Chrome
3. Sign in with your Claude account
4. Retry in Claude Code

**If tests fail:**
1. Check the website is actually deployed
2. Verify URL is correct
3. Check browser console for errors
4. Take screenshots to diagnose issues

## Tips

- Always start by taking a screenshot to see current state
- Use `read_page` to get page structure before interacting
- Test at multiple widths: 320px, 375px, 768px, 1024px
- Verify both desktop and mobile experiences
- Check form validation thoroughly
- Test keyboard navigation (Tab, Enter)

---

**Next:** Ask me to test your website! Example:
```
Test my website at https://godwin8888.github.io/AgenticAITest/ and verify:
1. Home page loads correctly
2. Form fields validate properly
3. Mobile menu works
```
