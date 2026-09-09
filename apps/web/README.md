# @repo/web — Silicon Software marketing site

Next.js 16 marketing site for Silicon Software. Presents the agency and its first
product, Intelligent Briefing, as a mocked preview. Static Site Generation is the
default rendering strategy; the site is deployed to AWS via SST (Phase 3).

## Commands

```bash
pnpm dev          # start the dev server (Turbopack)
pnpm build        # production build
pnpm type-check   # TypeScript, strict mode
pnpm lint         # ESLint
```

## Notes

- Design tokens and UI primitives come from `@repo/config` and `@repo/ui`.
- Fonts (Inter body, Geist display) are self-hosted via `next/font`.
- Public environment variables are validated with Zod in `src/lib/env.ts`;
  see `.env.example`. Infrastructure values arrive via SST `Resource` bindings,
  never environment variables.
