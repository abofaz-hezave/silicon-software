# 12: Complete search, sharing, and production checks

**What to build:** The completed marketing site can be crawled and shared correctly in production, remains hidden from crawlers outside production, and passes a final production-quality verification. Every public journey has consistent canonical metadata and social presentation, and the static-versus-dynamic boundary matches the version-one architecture.

**Blocked by:** 02 (Add responsive navigation and theme switching), 03 (Present services and Intelligent Briefing on the homepage), 04 (Complete the homepage trust journey), 05 (Publish services and engagement pricing), 06 (Publish the Intelligent Briefing product preview), 07 (Publish the About page), 08 (Reject invalid qualification inquiries), 09 (Persist valid qualification inquiries), 10 (Publish the Privacy page), and 11 (Publish the Terms page)

**Status:** ready-for-agent

- [ ] The sitemap lists every public static route, including qualification, Privacy, and Terms
- [ ] Robots rules allow crawling only in production and disallow crawling in every other environment
- [ ] Every public route has a unique title and description, an absolute canonical URL, and social metadata using the approved placeholder image
- [ ] The homepage exposes valid Organization structured data
- [ ] All content pages are statically generated; only qualification submission executes dynamically
- [ ] All images and fonts use framework optimization, and no manual memoization or unapproved animation dependency is introduced
- [ ] Client component boundaries are limited to mobile navigation, theme switching, qualification form state, and form submission status
- [ ] Production build, type-check, lint, and formatting checks pass, and the primary pages meet the stated Lighthouse target
