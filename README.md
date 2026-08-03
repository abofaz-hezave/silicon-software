# Agency Platform

A production-grade Turborepo monorepo for a software agency platform. Hosts a marketing website, multiple portfolio demo applications, and shared packages. Deployed to AWS via SST v3 (Ion).

## Prerequisites

- **Node.js** 20 LTS (`nvm use` will pick up `.nvmrc`)
- **pnpm** 9+ (`corepack enable && corepack prepare pnpm@latest --activate`)
- **AWS CLI** v2 (configured with appropriate credentials)

## Getting Started

```bash
# Clone the repository
git clone <repo-url> && cd agency-platform

# Install dependencies
pnpm install

# Start all apps and packages in development mode
pnpm dev

# Build everything
pnpm build

# Type-check all packages
pnpm type-check

# Lint all packages
pnpm lint

# Format code
pnpm format
```

## Directory Structure

```
agency-platform/
├── apps/              # Individual applications
├── packages/
│   ├── ui/            # Shared shadcn/ui React components
│   ├── config/        # Shared ESLint, TypeScript, and Tailwind configs
│   ├── auth/          # Shared authentication logic
│   ├── db/            # Drizzle ORM schemas and database client
│   └── rate-limit/    # Shared rate limiting / abuse protection
├── infra/             # SST v3 (Ion) infrastructure definitions
├── turbo.json         # Turborepo task configuration
└── pnpm-workspace.yaml
```

### Packages

| Package | Name | Description |
|---------|------|-------------|
| `packages/ui` | `@repo/ui` | Framework-agnostic React 19 components built with shadcn/ui |
| `packages/config` | `@repo/config` | Shared ESLint, TypeScript, and Tailwind CSS configurations |
| `packages/db` | `@repo/db` | Drizzle ORM schemas and typed database client (Postgres) |
| `packages/auth` | `@repo/auth` | Shared authentication logic (placeholder) |
| `packages/rate-limit` | `@repo/rate-limit` | Rate limiting utilities for abuse protection (placeholder) |

## Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Language**: TypeScript 5.5+ (strict mode)
- **UI**: React 19, shadcn/ui, Tailwind CSS v4
- **Database**: Drizzle ORM, PostgreSQL (Neon / Aurora Serverless v2)
- **Infrastructure**: SST v3 (Ion) on AWS
- **Linting**: ESLint 9 (flat config), Prettier
- **Testing**: Vitest (unit), Playwright (E2E)

## Scripts Reference

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps and packages |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format all files with Prettier |
| `pnpm clean` | Remove all build artifacts |
| `pnpm skills:validate` | Validate skill metadata frontmatter |
| `pnpm skills:links` | Validate relative markdown links in skills |

## Available Skills

A curated catalog of agent skills is available in the `skills/` directory:

### Development & Workflow
- [code-review](file:///Users/paul/Desktop/project/silicon-software/skills/code-review) — Evidence-bound generic and plan-backed reviews.
- [create-plan](file:///Users/paul/Desktop/project/silicon-software/skills/create-plan) — Research, plan, review, and construct execution plans.
- [decomplex](file:///Users/paul/Desktop/project/silicon-software/skills/decomplex) — Audit, prevention, and triage of unnecessary complexity.
- [implement-plan](file:///Users/paul/Desktop/project/silicon-software/skills/implement-plan) — Bounded checklist execution loop with verification.
- [web-research](file:///Users/paul/Desktop/project/silicon-software/skills/web-research) — Perform research with search, retrieval, and document context.

### Agency Client Tools
- [create-slides](file:///Users/paul/Desktop/project/silicon-software/skills/create-slides) — Build and style HTML slides from structural templates.
- [explain](file:///Users/paul/Desktop/project/silicon-software/skills/explain) — Generate explanations in Markdown and standalone offline HTML.

### Custom Skill Authoring
- [create-skill](file:///Users/paul/Desktop/project/silicon-software/skills/create-skill) — Author, refine, and validate custom Agent Skills.

## Contributing

1. Create a feature branch from `main`.
2. Make your changes following the conventions in `.cursorrules`.
3. Ensure `pnpm build && pnpm type-check && pnpm lint` pass.
4. Open a pull request with a clear description.

### Conventions

- Use **pnpm** exclusively (never npm or yarn).
- Reference internal packages with `workspace:*` protocol.
- Use **named exports** (no default exports for components).
- Follow **kebab-case** for file names, **PascalCase** for components.
- Validate all external data with **Zod**.
- Keep shared logic in `packages/`, never import across apps.

## License

Private — All rights reserved.
