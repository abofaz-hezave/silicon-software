# CLAUDE.md — Agency Platform

## Project Overview

Turborepo monorepo for a software agency platform deployed to AWS via SST v3 (Ion).
Contains a marketing website, portfolio demo apps, and shared packages.

## Architecture

```
agency-platform/
├── apps/              ← Individual applications (Next.js, Vite, etc.)
│   ├── web/           ← Marketing website (coming soon)
│   └── demo-*/        ← Portfolio demo applications
│
├── packages/          ← Shared libraries
│   ├── ui/            ← shadcn/ui components (React 19, framework-agnostic)
│   ├── config/        ← Shared ESLint, TypeScript, Tailwind configs
│   ├── auth/          ← Authentication logic (placeholder)
│   ├── data/          ← DynamoDB client + submission repositories
│   └── rate-limit/    ← Abuse protection utilities (placeholder)
│
├── infra/             ← SST v3 (Ion) infrastructure definitions
│
├── turbo.json         ← Turborepo task pipeline
├── pnpm-workspace.yaml
└── package.json       ← Root scripts and shared dev deps
```

## Common Commands

```bash
# Install all dependencies
pnpm install

# Run all apps and packages in dev mode
pnpm dev

# Build everything
pnpm build

# Type-check all packages
pnpm type-check

# Lint all packages
pnpm lint

# Format all files
pnpm format

# Check formatting
pnpm format:check

# Clean all build artifacts
pnpm clean


# Skill Validation
pnpm skills:validate                 # Validate skill metadata frontmatter
pnpm skills:links                    # Validate relative markdown links in skills
```

## When Adding a New Demo App

1. Create the app in `apps/<app-name>/` using the appropriate framework CLI.
2. Add the app to `pnpm-workspace.yaml` (already covered by `apps/*` glob).
3. Set the package name to `@repo/<app-name>` in its `package.json`.
4. Add internal dependencies using `workspace:*` protocol:
   ```json
   {
     "dependencies": {
       "@repo/ui": "workspace:*",
       "@repo/data": "workspace:*"
     }
   }
   ```
5. Extend the shared tsconfig:
   ```json
   { "extends": "@repo/config/typescript/nextjs" }
   ```
6. Import the shared ESLint config in `eslint.config.js`.
7. Add SST resource definitions in `infra/` for the new app.
8. Run `pnpm install` to link everything.
9. Verify: `pnpm build && pnpm type-check && pnpm lint`.

## Enforced Rules

- **pnpm only** — never use npm or yarn.
- **workspace:\*** protocol for all internal deps.
- **Named exports** for components; use default exports only for framework-required entrypoints.
- **No cross-app imports** — shared code goes in `packages/`.
- **Server-only code** must import `"server-only"` package.
- **Zod** for all external data validation.
- **kebab-case** for file names, **PascalCase** for React components.
- **Strict TypeScript** — no `any`, prefer `unknown`.
- **Type imports** — use `import type { ... }` where applicable.

## Agent skills

### Issue tracker

No tracker decided yet — issues stay in-repo for now. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
