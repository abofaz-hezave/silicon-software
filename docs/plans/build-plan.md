# Build Plan — Version 1

## Version 1 scope

Version one ships **one product only**: Intelligent Briefing, demonstrated as a
**mocked preview** (fixed sample content, no real product backend). Everything else
is deferred. Concretely:

- **One product, mocked**: the marketing site presents Intelligent Briefing plus an
  anonymous product preview with fixed sample content. No customer workspaces, no
  real briefing pipeline, no other products.
- **No product database in v1**: the only persisted data is form submissions, stored
  in **DynamoDB** behind a Lambda-backed API (see architecture below).
- **No auth, no application-level rate limiting**: `@repo/auth` and
  `@repo/rate-limit` remain unimported placeholders until v2. API Gateway stage
  throttling still protects the public endpoint from accidental traffic spikes.
- **Standard AWS serverless architecture**: compute is Lambda functions behind API
  Gateway; storage is DynamoDB. No Drizzle ORM, no drizzle-kit, no direct Postgres
  connections from the app.
- **Infrastructure as code**: AWS CDK v2 with TypeScript defines the AWS resources
  and synthesizes them to CloudFormation.

### AWS architecture (v1)

```
Browser ──► Route 53 ──► CloudFront
                            │
                            ├─► S3 (versioned static Next.js assets)
                            │
                            └─► OpenNext server Lambda
                                      └─ qualification Server Action
                                            └─► API Gateway HTTP API
                                                  └─► submissions Lambda
                                                        └─► DynamoDB
```

ACM provides the CloudFront TLS certificate. OpenNext packages the Next.js output
for S3, CloudFront, and Lambda; AWS CDK provisions those resources plus Route 53,
ACM, API Gateway, the submissions Lambda, DynamoDB, IAM, and observability.

**Storing form data: DynamoDB.** It is the best fit for a serverless form in v1:
schema-less (no migrations — this removes the need for drizzle-kit), pay-per-use
(fine for low traffic), no connection-pooling issues inside Lambda (Postgres needs
pooling we don't want to manage), and fast per-record reads for the operator's later
triage view. Write path: the Server Action POSTs to the API Gateway URL injected into
the OpenNext server Lambda as a server-only environment variable; the submissions
Lambda validates with Zod and writes the item. Not chosen: S3 (archival, no
per-record querying) and Aurora Serverless v2 (overkill for one form, reintroduces
connection management).

# Phase 1: Monorepo Foundation Setup

You are setting up a production-grade Turborepo monorepo for a software agency
platform. This monorepo will host the Silicon Software marketing website, the
Intelligent Briefing AI product, and shared packages. Deployment target is AWS via
AWS CDK v2 and CloudFormation.

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
├── apps/ (empty, with .gitkeep)
├── packages/
│ ├── ui/ shared shadcn/ui components
│ ├── config/ shared eslint, tsconfig, tailwind configs
│ ├── auth/ shared auth logic (placeholder, deferred to v2)
│ ├── data/ DynamoDB client + repositories (replaces db/)
│ └── rate-limit/ shared abuse protection utilities (deferred to v2)
├── infra/ AWS CDK v2 TypeScript application and Lambda handlers
├── CLAUDE.md
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.json root base config
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

**packages/data/**

- AWS SDK v3 `DynamoDBDocumentClient` for all storage access
- Export `createDataClient()` (document client factory) plus client-injected typed
  repository functions: `saveSubmission(dataClient, input)` and
  `listSubmissions(dataClient, limit?)`
- DynamoDB is schema-less: the record shape lives as a TypeScript type, with a
  single `submissions` table (primary key: submission id)
- The Lambda handler in infra/ imports this package
- Package name: `@repo/data`

**packages/auth/**

- Placeholder package with README explaining intent
- Package name: `@repo/auth`
- Empty index.ts exporting a TODO comment
- Not imported by any app in v1 (deferred to v2)

**packages/rate-limit/**

- Placeholder for now, but scaffold with intended interface:
  export async function checkRateLimit(identifier: string, limit: number, windowMs: number)
- Include comment noting this will be backed by DynamoDB or ElastiCache
- Package name: `@repo/rate-limit`
- Not imported by any app in v1 (deferred to v2)

### Root Configuration Files

**turbo.json** must include tasks: build, dev, lint, type-check, test, clean
Configure proper dependsOn graphs and outputs. Use remote caching-ready format.

**pnpm-workspace.yaml** includes apps/_, packages/_, infra

**tsconfig.json (root)** references all packages via project references

**.gitignore** covers Node, Turbo, Next.js, AWS CDK, OpenNext, AWS, IDE files, .env variants

**CLAUDE.md** file with:

- Project overview (Turborepo monorepo, AWS CDK/CloudFormation deployment)
- Enforce: pnpm not npm/yarn, workspace protocol for internal deps (workspace:*)
- Enforce: all shared code lives in packages/, no cross-app imports
- Enforce: named exports over default exports for components
- Enforce: server-only code uses "server-only" package marker
- Enforce: Zod for all external data validation
- File naming: kebab-case for files, PascalCase for React components
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
- Do NOT configure AWS CDK or OpenNext yet (that comes in Phase 3)
- Do NOT create GitHub Actions yet
- Ask me before installing any dependency not explicitly listed above
- If any decision is ambiguous, pause and ask rather than guessing

Begin by proposing the exact file tree you will create, then wait for my
approval before writing files.

# Phase 2 (v1): Marketing Site (apps/web) — Next.js 16

You are now building `apps/web` — the main marketing website for our software
agency, deployed to agency.com. The monorepo foundation is already in place
(Turborepo, pnpm workspaces, shared packages in @repo/*).

## OBJECTIVE

Create a production-grade Next.js 16 marketing site inside apps/web/ that:

- Presents Silicon Software as a software agency whose product is Intelligent Briefing, shown as a mocked preview
- Future products, AI tools, and AI sovereignty services are vision only — nothing beyond Intelligent Briefing is built in v1
- Consumes shared packages from @repo/*
- Uses Static Site Generation (SSG) as the DEFAULT rendering strategy
- Is ready for AWS deployment (AWS CDK and OpenNext setup comes in Phase 3)
- Ships with zero unnecessary dependencies

## TECH STACK

- Next.js 16 (App Router, React 19.2, React Compiler enabled)
- Turbopack (now the default bundler in Next.js 16)
- TypeScript strict mode
- Tailwind CSS v4 (via @repo/config)
- shadcn/ui components (via @repo/ui, extend locally as needed)
- next-themes for dark mode
- lucide-react for icons (already in @repo/ui)
- AWS SDK v3 (DynamoDB) — used inside the submissions Lambda via @repo/data

## EXPLICITLY NOT USING (and why)

- ❌ react-hook-form — Server Actions + useActionState + useFormStatus is idiomatic Next 16
- ❌ MDX or Contentlayer — the blog is deferred until real content exists
- ❌ Any client-side form libraries
- ❌ Drizzle ORM / drizzle-kit / direct DB access — all storage goes through the Lambda-backed API to DynamoDB

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
│ ├── app/
│ │ ├── (marketing)/
│ │ │ ├── layout.tsx shared marketing layout w/ nav + footer
│ │ │ ├── page.tsx homepage (fully static)
│ │ │ ├── services/page.tsx static, includes engagement pricing
│ │ │ ├── intelligent-briefing/page.tsx static product preview
│ │ │ ├── about/page.tsx static
│ │ │ ├── qualification/
│ │ │ │ ├── page.tsx static shell
│ │ │ │ └── actions.ts Server Action for qualification submission
│ │ │ ├── privacy/page.tsx static
│ │ │ └── terms/page.tsx static
│ │ ├── layout.tsx root layout
│ │ ├── globals.css tailwind imports + design tokens
│ │ ├── sitemap.ts static sitemap generation
│ │ ├── robots.ts robots.txt
│ │ ├── not-found.tsx
│ │ └── error.tsx
│ ├── components/
│ │ ├── layout/
│ │ │ ├── navbar.tsx server component
│ │ │ ├── footer.tsx server component
│ │ │ ├── mobile-menu.tsx client component (interactive)
│ │ │ └── theme-toggle.tsx client component (next-themes)
│ │ ├── sections/
│ │ │ ├── hero.tsx
│ │ │ ├── services-grid.tsx
│ │ │ ├── product-showcase.tsx links to Intelligent Briefing
│ │ │ ├── engagement-pricing.tsx
│ │ │ ├── technical-evidence.tsx
│ │ │ ├── process.tsx
│ │ │ ├── founder-background.tsx
│ │ │ ├── cta-section.tsx
│ │ │ └── faq.tsx
│ │ └── forms/
│ │ ├── qualification-form.tsx client component (useActionState)
│ │ └── submit-button.tsx client component (useFormStatus)
│ ├── content/
│ │ ├── services.ts typed services data
│ │ ├── engagement-pricing.ts typed engagement pricing
│ │ ├── products.ts typed Intelligent Briefing metadata
│ │ ├── technical-evidence.ts typed capability evidence
│ │ └── faqs.ts
│ └── lib/
│ ├── metadata.ts helper for generateMetadata
│ ├── utils.ts cn() helper etc.
│ └── env.ts Zod-validated environment variables
├── public/
│ ├── favicon.ico
│ └── og-image.png placeholder
├── next.config.mjs
├── tsconfig.json extends @repo/config/tsconfig/nextjs.json
├── tailwind.config.ts extends @repo/config/tailwind
├── postcss.config.mjs
├── .eslintrc.cjs extends @repo/config/eslint-config
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
- IMPORTANT: No rate limiting in v1 — @repo/rate-limit is deferred and must NOT be
  imported here
- Persist the submission by POSTing to the submissions API; read its URL from the
  server-only `SUBMISSIONS_API_URL` environment variable injected by the CDK stack,
  never from a public `NEXT_PUBLIC_*` variable or a hardcoded value
- Return typed FormState: { success, message, errors?: Record<string, string[]> }
- On success, log the submission and confirm the API write (email integration comes later)
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
Software operator reviews submissions stored in DynamoDB and manually emails
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
- Use @repo/data (DynamoDB client + repositories) inside the submissions Lambda in infra/
- @repo/auth and @repo/rate-limit are NOT imported anywhere in v1 (deferred to v2)
- No cross-app imports (never import from apps/*)

## ENVIRONMENT VARIABLES

Define and validate environment variables in src/lib/env.ts using Zod.

Infrastructure values are injected by CDK into the runtimes that need them:

- `SUBMISSIONS_API_URL` is available only to the OpenNext server Lambda and is read
  by the qualification Server Action.
- `SUBMISSIONS_TABLE_NAME` is available only to the submissions Lambda.
- Neither value uses a `NEXT_PUBLIC_*` name; there is no `DATABASE_URL` in v1.

# Phase 3 (v1): AWS Serverless Infrastructure (infra/)

Provision the v1 architecture with **AWS CDK v2 in TypeScript**. CDK is the
infrastructure interface and CloudFormation performs deployments. OpenNext packages
the Next.js application for Lambda, S3, and CloudFront; the OpenNext-to-CDK
integration is community-maintained rather than an AWS CDK native construct.

## Compatibility gate

Complete this gate before implementing the full stack:

1. Pin exact versions of AWS CDK, the selected OpenNext CDK construct, and OpenNext.
   Start with `open-next-cdk`; do not copy OpenNext's non-production reference
   construct into this repository.
2. Build `apps/web` with its current Next.js 16 configuration.
3. Synthesize and deploy a disposable development stack.
4. Verify static routes, the qualification Server Action, `cacheComponents`,
   `next/image`, static asset caching, and a second deployment with cache invalidation.
5. Record the verified version combination in `infra/package.json`.

The gate is complete only when those behaviors pass in AWS. If Next.js 16 is not
supported by the pinned OpenNext integration, stop and present the concrete failure
before choosing between a compatible version combination and CDK-managed ECS
Fargate. Do not silently downgrade Next.js or switch compute models.

## CDK application structure

Use one CDK app with explicit stacks and constructs:

```
infra/
├── bin/infra.ts
├── lib/application-stack.ts
├── lib/edge-certificate-stack.ts
├── functions/submissions.ts
├── test/application-stack.test.ts
├── cdk.json
├── package.json
└── tsconfig.json
```

- `EdgeCertificateStack` runs in `us-east-1` because CloudFront viewer certificates
  must be issued there. It validates the certificate through the Route 53 hosted zone.
- `ApplicationStack` runs in the selected application region and owns the web
  deployment, HTTP API, submissions Lambda, DynamoDB table, DNS aliases, logs, and
  alarms.
- Configure CDK cross-region references deliberately and bootstrap both regions.
- Read account, application region, stage, hosted-zone name, and domain name from
  typed CDK context. Keep account IDs and domain configuration out of source defaults.

## Next.js delivery

Use the verified OpenNext CDK construct to deploy `apps/web`:

- Upload immutable, versioned Next.js assets to a private S3 bucket.
- Serve the application through CloudFront with HTTPS-only viewer behavior,
  compression, and appropriate cache policies for static and dynamic routes.
- Run dynamic Next.js behavior, including the qualification Server Action, in the
  OpenNext server Lambda.
- Inject `SUBMISSIONS_API_URL` into that server Lambda as a server-only environment
  variable.
- Attach the ACM certificate and create Route 53 `A` and `AAAA` alias records for the
  CloudFront distribution.
- Retain access to the generated CloudFront, S3, and Lambda constructs so CDK can add
  observability and narrowly scoped configuration without granting database access to
  the web runtime.

## Submissions API and storage

Create these resources with AWS CDK L2 constructs:

- A DynamoDB on-demand table with string partition key `id`, AWS-managed encryption,
  point-in-time recovery, and a production retention policy. `createdAt` is an item
  attribute, not a key declaration.
- A bundled Node.js Lambda for `infra/functions/submissions.ts`, using the current
  supported Lambda Node.js runtime and importing `@repo/data`.
- An API Gateway HTTP API with `POST /submissions` integrated with the Lambda.
- Default-stage access logging and conservative stage throttling. CORS is unnecessary
  in v1 because only the server-side action calls this API.

**infra/functions/submissions.ts**:

- Parse the API Gateway HTTP API event and reject missing or oversized bodies.
- Zod-validate the JSON body, call `saveSubmission(...)` through `@repo/data`, and
  return a JSON `201` response.
- Return controlled `400` responses for validation failures and a non-sensitive `500`
  response for unexpected failures.
- Emit structured logs without logging the submission body or other personal data.
- Do not expose `GET /submissions` in v1. Add listing only with the authenticated
  operator triage feature.

IAM must be least-privilege:

- Inject `SUBMISSIONS_TABLE_NAME` into the submissions Lambda.
- Grant that Lambda only the DynamoDB write operations required by
  `saveSubmission` against this table.
- Grant no DynamoDB permissions to the OpenNext server Lambda or browser bundle.

## Operations and outputs

- Set finite CloudWatch log retention for application Lambdas and API access logs.
- Add CloudWatch alarms for Lambda errors/throttles, API 5xx responses, and DynamoDB
  throttling; route alarm actions only when a notification destination is configured.
- Output the CloudFront/domain URL, HTTP API URL, table name, and relevant log-group
  names from CloudFormation.
- Apply consistent tags for application, stage, owner, and cost allocation.
- Use stage-aware removal policies: retain production data and allow disposable
  development resources to be removed intentionally.

## Scripts and verification

Add `@repo/infra` scripts for `build`, `type-check`, `test`, `synth`, `diff`, and
`deploy`. Use pnpm only. The expected workflow is:

```bash
pnpm --filter @repo/infra test
pnpm --filter @repo/infra synth
pnpm --filter @repo/infra diff
pnpm --filter @repo/infra deploy
```

Before Phase 3 is complete:

- CDK assertion tests cover the DynamoDB key and billing mode, API route, Lambda
  integration, scoped IAM grant, CloudFront distribution, TLS certificate, DNS
  aliases, retention policies, logging, and alarms.
- `pnpm build`, `pnpm type-check`, `pnpm lint`, and the CDK tests pass.
- `cdk synth` produces valid CloudFormation without unresolved tokens or unbundled
  handlers.
- A development deployment passes the compatibility-gate checks and a real form
  submission is confirmed in DynamoDB without exposing submission data in logs.
