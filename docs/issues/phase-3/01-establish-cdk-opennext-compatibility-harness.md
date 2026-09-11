# 01: Establish the CDK and OpenNext compatibility harness

**What to build:** A maintainer can build the current Next.js 16 marketing site and synthesize a disposable OpenNext deployment through a typed AWS CDK application. The repository has one consistent CDK-based infrastructure path, exact candidate dependency versions, and repeatable package scripts ready for the required AWS compatibility check.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Exact candidate versions of AWS CDK v2, the selected `open-next-cdk` construct, and OpenNext are pinned without version ranges
- [ ] The current Next.js 16 application builds successfully with `cacheComponents`, React Compiler, and monorepo package transpilation unchanged
- [ ] Typed CDK context requires account, application region, stage, hosted-zone name, domain name, owner, and any optional alarm notification destination without committing account or domain defaults
- [ ] A minimal disposable application stack packages the marketing site with the selected OpenNext construct and retains access to its generated CloudFront, S3, and Lambda resources
- [ ] Package scripts support build, type-check, test, synth, diff, and deploy through pnpm
- [ ] CDK assertion coverage proves that the disposable synthesis includes the OpenNext CloudFront distribution and server Lambda
- [ ] Local synthesis produces valid CloudFormation without unresolved context, unresolved tokens, or unbundled handlers
- [ ] Stale SST scaffolding and repository guidance are replaced with the CDK deployment model, including the dependent qualification-inquiry requirement to use a server-only API URL rather than an SST resource binding
- [ ] No OpenNext non-production reference construct is copied into the repository
