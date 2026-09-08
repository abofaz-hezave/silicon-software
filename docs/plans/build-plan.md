# Phase 1: Monorepo Foundation Setup

You are setting up a production-grade Turborepo monorepo for a software agency
platform. This monorepo will host the Silicon Software marketing website, the
Intelligent Briefing AI product, and shared packages. Deployment target is AWS via
SST v3 (Ion).

## OBJECTIVE
Scaffold the monorepo foundation ONLY. Do not create any apps yet — only the 
workspace structure, shared packages, tooling, and configuration files. 
Apps will be added in subsequent prompts.

## REQUIREMENTS

### Package Manager & Workspace
- Use pnpm (v9+) with workspaces
- Use Turborepo (latest stable) for task orchestration
- Node.js 20 LTS as the required version (add to package.json engines and .nvmrc)
- TypeScript 5.5+ with strict mode everywhere

### Directory Structure (create exactly this)
agency-platform/
├── apps/                       (empty, with .gitkeep)
├── packages/
│   ├── ui/                     shared shadcn/ui components
│   ├── config/                 shared eslint, tsconfig, tailwind configs
│   ├── auth/                   shared auth logic (placeholder for now)
│   ├── db/                     Drizzle ORM schemas and client
│   └── rate-limit/             shared abuse protection utilities
├── infra/                      SST v3 (Ion) infrastructure definitions
├── .cursorrules
├── CLAUDE.md
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.json               root base config
├── .gitignore
├── .nvmrc
├── .editorconfig
├── .prettierrc
└── README.md

### Package Specifications

**packages/config/**
- Export shared configs: `eslint-config`, `tsconfig`, `tailwind-config`
- ESLint: use @typescript-eslint, eslint-config-next, prettier compatibility
- Provide three tsconfig presets: base.json, nextjs.json, react-library.json
- Tailwind: v4 config with shadcn design tokens (CSS variables approach)
- Package name: `@repo/config`

**packages/ui/**
- Framework-agnostic React 19 components (no Next.js-specific imports)
- Set up shadcn/ui CLI compatibility (components.json with correct paths)
- Include only foundational primitives: Button, Card, Input, Label
- Use `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`
- Export via `./components/*` pattern (no barrel file to keep tree-shaking clean)
- Package name: `@repo/ui`

**packages/db/**
- Drizzle ORM + drizzle-kit setup
- Postgres dialect (targeting Aurora Serverless v2 / Neon)
- Include a schema/index.ts placeholder with a sample `users` table
- Include drizzle.config.ts using DATABASE_URL from env
- Export a `createDbClient(connectionString)` factory function
- Package name: `@repo/db`

**packages/auth/**
- Placeholder package with README explaining intent
- Package name: `@repo/auth`
- Empty index.ts exporting a TODO comment

**packages/rate-limit/**
- Placeholder for now, but scaffold with intended interface:
  export async function checkRateLimit(identifier: string, limit: number, windowMs: number)
- Include comment noting this will be backed by DynamoDB or ElastiCache
- Package name: `@repo/rate-limit`

### Root Configuration Files

**turbo.json** must include tasks: build, dev, lint, type-check, test, clean
Configure proper dependsOn graphs and outputs. Use remote caching-ready format.

**pnpm-workspace.yaml** includes apps/*, packages/*, infra

**tsconfig.json (root)** references all packages via project references

**.gitignore** covers Node, Turbo, Next.js, SST, AWS, IDE files, .env variants

**.cursorrules** file with:
- Project overview (Turborepo monorepo, AWS/SST deployment)
- Enforce: pnpm not npm/yarn, workspace protocol for internal deps (workspace:*)
- Enforce: all shared code lives in packages/, no cross-app imports
- Enforce: named exports over default exports for components
- Enforce: server-only code uses "server-only" package marker
- Enforce: Zod for all external data validation
- File naming: kebab-case for files, PascalCase for React components

**CLAUDE.md** file with:
- Same rules as .cursorrules but formatted as Claude Code instructions
- Include a "Common Commands" section (pnpm dev, pnpm build, etc.)
- Include a "When adding a new application" checklist
- Include architecture diagram in ASCII

**README.md** with:
- Project description
- Prerequisites (Node 20, pnpm 9, AWS CLI)
- Getting started (install, dev, build commands)
- Directory structure explanation
- Contribution guide stub

### Quality Requirements
- All package.json files must have consistent version fields, correct main/exports fields
- Use "type": "module" where appropriate
- No circular dependencies between packages
- All TypeScript should compile with zero errors on `pnpm type-check`
- All packages should lint clean on `pnpm lint`

## DELIVERABLES
1. Create every file listed above with complete, working content (no TODOs 
   except where explicitly noted)
2. After creation, output a summary of:
   - Files created (grouped by directory)
   - Commands to run to verify setup (pnpm install, pnpm build, pnpm type-check)
   - Next steps for adding the first app

## CONSTRAINTS
- Do NOT create any apps in apps/ yet
- Do NOT install shadcn components beyond the four listed
- Do NOT configure SST yet (that comes later)
- Do NOT create GitHub Actions yet
- Ask me before installing any dependency not explicitly listed above
- If any decision is ambiguous, pause and ask rather than guessing

Begin by proposing the exact file tree you will create, then wait for my 
approval before writing files.

# Phase 2 (v2): Marketing Site (apps/web) Setup — Next.js 16

You are now building `apps/web` — the main marketing website for our software 
agency, deployed to agency.com. The monorepo foundation is already in place 
(Turborepo, pnpm workspaces, shared packages in @repo/*).

## OBJECTIVE
Create a production-grade Next.js 16 marketing site inside apps/web/ that:
- Presents Silicon Software as a software agency whose first product is Intelligent Briefing
- Leaves room for future products, AI tools, and AI sovereignty services
- Consumes shared packages from @repo/*
- Uses Static Site Generation (SSG) as the DEFAULT rendering strategy
- Is ready for AWS deployment (SST v3 setup comes later)
- Ships with zero unnecessary dependencies

## TECH STACK
- Next.js 16 (App Router, React 19.2, React Compiler enabled)
- Turbopack (now the default bundler in Next.js 16)
- TypeScript strict mode
- Tailwind CSS v4 (via @repo/config)
- shadcn/ui components (via @repo/ui, extend locally as needed)
- next-themes for dark mode
- lucide-react for icons (already in @repo/ui)

## EXPLICITLY NOT USING (and why)
- ❌ react-hook-form — Server Actions + useActionState + useFormStatus is idiomatic Next 16
- ❌ MDX or Contentlayer — the blog is deferred until real content exists
- ❌ Any client-side form libraries

## RENDERING STRATEGY (CRITICAL)

Default to Static Site Generation (SSG) everywhere. This is a marketing site — 
content rarely changes.

**Fully static (build-time SSG):**
- Home, Services, Intelligent Briefing, About, Qualification, Privacy, and Terms pages
- Sitemap, robots

**Cache Components (Next.js 16 "use cache" directive):**
- Use "use cache" on any data-loading functions for content
- Configure cacheLife appropriately for any cached content-loading functions
- Enable cacheComponents in next.config.mjs

**Dynamic (runtime):**
- Qualification form Server Action ONLY (no page needs to be dynamic)
- The qualification page shell remains static; only form submission is dynamic

**Enable in next.config.mjs:**
- cacheComponents: true
- reactCompiler: true
- Turbopack is default; no config needed for it

## DIRECTORY STRUCTURE

apps/web/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── layout.tsx              shared marketing layout w/ nav + footer
│   │   │   ├── page.tsx                homepage (fully static)
│   │   │   ├── services/page.tsx       static, includes engagement pricing
│   │   │   ├── intelligent-briefing/page.tsx  static product preview
│   │   │   ├── about/page.tsx          static
│   │   │   ├── qualification/
│   │   │   │   ├── page.tsx            static shell
│   │   │   │   └── actions.ts          Server Action for qualification submission
│   │   │   ├── privacy/page.tsx        static
│   │   │   └── terms/page.tsx          static
│   │   ├── layout.tsx                  root layout
│   │   ├── globals.css                 tailwind imports + design tokens
│   │   ├── sitemap.ts                  static sitemap generation
│   │   ├── robots.ts                   robots.txt
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── navbar.tsx              server component
│   │   │   ├── footer.tsx              server component
│   │   │   ├── mobile-menu.tsx         client component (interactive)
│   │   │   └── theme-toggle.tsx        client component (next-themes)
│   │   ├── sections/
│   │   │   ├── hero.tsx
│   │   │   ├── services-grid.tsx
│   │   │   ├── product-showcase.tsx    links to Intelligent Briefing
│   │   │   ├── engagement-pricing.tsx
│   │   │   ├── technical-evidence.tsx
│   │   │   ├── process.tsx
│   │   │   ├── founder-background.tsx
│   │   │   ├── cta-section.tsx
│   │   │   └── faq.tsx
│   │   └── forms/
│   │       ├── qualification-form.tsx  client component (useActionState)
│   │       └── submit-button.tsx       client component (useFormStatus)
│   ├── content/
│   │   ├── services.ts                 typed services data
│   │   ├── engagement-pricing.ts       typed engagement pricing
│   │   ├── products.ts                 typed Intelligent Briefing metadata
│   │   ├── technical-evidence.ts       typed capability evidence
│   │   └── faqs.ts
│   └── lib/
│       ├── metadata.ts                 helper for generateMetadata
│       ├── utils.ts                    cn() helper etc.
│       └── env.ts                      Zod-validated environment variables
├── public/
│   ├── favicon.ico
│   └── og-image.png                    placeholder
├── next.config.mjs
├── tsconfig.json                       extends @repo/config/tsconfig/nextjs.json
├── tailwind.config.ts                  extends @repo/config/tailwind
├── postcss.config.mjs
├── .eslintrc.cjs                       extends @repo/config/eslint-config
├── .env.example
├── package.json
└── README.md

## QUALIFICATION FORM IMPLEMENTATION (SPECIFIC GUIDANCE)

Use the Next.js 16 idiomatic pattern:

**src/app/(marketing)/qualification/actions.ts** (Server Action):
- 'use server' at the top
- Export a `submitQualification(prevState, formData)` function
- Extract fields from FormData
- Validate the submission with Zod (name required + minLength 2, email required,
  message required + minLength 10, company optional, budget from enum list)
- IMPORTANT: Import checkRateLimit from @repo/rate-limit and rate-limit by IP 
  (get IP from headers() — use next/headers)
- Return typed FormState: { success, message, errors?: Record<string, string[]> }
- On success, log the submission (email integration comes later)
- Never trust HTML5 validation alone — validate everything server-side

**src/components/forms/qualification-form.tsx** ('use client'):
- Use useActionState(submitQualification, initialState)
- Render form with <form action={formAction}>
- Include HTML5 native validation attributes (required, type="email", minLength)
- Display field-level errors from state.errors
- Display global success/error message from state.message
- Reset form on success

**src/components/forms/submit-button.tsx** ('use client'):
- MUST be a separate component (useFormStatus requires this pattern)
- Use useFormStatus() to get { pending }
- Disable button and show "Sending..." when pending
- Show "Send Message" otherwise

## CONTENT REQUIREMENTS

Fill all pages with realistic content for the agency, Silicon Software.

**Homepage sections:**
1. Hero — headline, subheadline, primary + secondary CTA
2. AI customization services
3. Intelligent Briefing preview
4. Technical evidence
5. Delivery process and founder background
6. CTA section

**Services page:** Present fixed-scope Intelligent Briefing customization and paid
discovery followed by an appropriately scoped build or ongoing product retainer.
Publish starting prices of €2,500 for initial setup and €1,000 per month. Price
complex customization separately. Discovery is a separately priced engagement whose
amount depends on factors still to be defined.

**Intelligent Briefing page:** Explain how the AI product guides a marketing team
through turning client information into a structured briefing. A canonical briefing
model supports customer-configurable, optional templates. Product users may fill
fields directly or work through a Briefing Assistant, which identifies missing
information and asks follow-up questions before creating the briefing. Production
users can edit, save, and export generated briefings; collaboration, approval, and
versioning are deferred. Include an anonymous preview using fixed sample content;
do not accept visitors’ client data or create customer workspaces. The first release
ends at briefing creation; downstream workflow automation and project creation are
future possibilities, not current features.

**Qualification page:** Static shell + qualification form. Fields: name, email,
company (optional), project type (select), budget range (select), message. A Silicon
Software operator reviews submissions stored in Postgres and manually emails
suitable prospects a booking link; there is no email notification, admin portal, or
automated scheduling workflow.

## SEO REQUIREMENTS
- Every page uses generateMetadata or exports static metadata
- Sitemap.ts covers all public static pages
- Robots.ts: allow all in prod, disallow all if process.env.NODE_ENV !== 'production'
- JSON-LD structured data for Organization on homepage
- Proper canonical URLs
- OG images (placeholder allowed)

## PERFORMANCE REQUIREMENTS
- All images use next/image
- All fonts use next/font (Inter for body + Geist for display, both self-hosted)
- Server Components by default; 'use client' ONLY for:
  - mobile-menu.tsx
  - theme-toggle.tsx
  - qualification-form.tsx
  - submit-button.tsx
- Rely on React Compiler for memoization (do NOT manually add useMemo/useCallback)
- Aim for Lighthouse 95+ across all metrics

## DESIGN REQUIREMENTS
- Clean, modern, developer-focused aesthetic (Linear/Vercel/Resend inspired)
- Dark mode via next-themes (default: system)
- Design tokens sourced from @repo/config/tailwind
- Mobile-first responsive
- Subtle CSS-only animations (no framer-motion unless I explicitly approve)

## INTEGRATION WITH SHARED PACKAGES
- Import Button, Card, Input, Label from @repo/ui
- Web-specific components live in src/components/
- If a new primitive is needed in multiple apps, add it to @repo/ui (ask me first)
- Use @repo/rate-limit in the qualification Server Action
- No cross-app imports (never import from apps/*)

## ENVIRONMENT VARIABLES

Define and validate environment variables in src/lib/env.ts using Zod.