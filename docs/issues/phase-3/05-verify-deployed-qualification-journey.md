# 05: Verify the deployed qualification journey

**What to build:** A prospect can submit a valid qualification form through the production-shaped development deployment and receive confirmation only after the inquiry is stored. Maintainers have a repeatable, passing CDK workflow and evidence that the deployed journey persists correctly without leaking personal data into logs.

**Blocked by:** 04 (Serve the marketing site on its production domain) and Phase 2 ticket 09 (Persist valid qualification inquiries)

**Status:** ready-for-agent

- [ ] The qualification Server Action reads only the server-side `SUBMISSIONS_API_URL`, posts validated inquiry data to `POST /submissions`, and reports success only after a confirmed `201` response
- [ ] API rejection or transport failure preserves a useful retry path and never reports false success
- [ ] The infrastructure test, synth, diff, and deploy scripts all run through the documented pnpm filter workflow
- [ ] CDK assertion tests collectively cover the DynamoDB key and billing mode, API route and integration, scoped IAM, CloudFront, TLS certificate, DNS aliases, lifecycle policies, logging, alarms, tags, and outputs
- [ ] Synthesis produces valid CloudFormation without unresolved tokens or unbundled handlers
- [ ] Repository build, type-check, and lint checks pass together with the infrastructure tests
- [ ] A development deployment succeeds using externally supplied account, region, stage, hosted-zone, domain, owner, and optional notification context
- [ ] Static routes, dynamic qualification behavior, framework image optimization, cache behavior, and deployment invalidation remain operational in the completed stack
- [ ] A real valid qualification submission produces an accessible success state and is confirmed in the configured DynamoDB table
- [ ] Invalid form data cannot trigger an API write, and failed API persistence cannot produce a success state
- [ ] CloudWatch application and access logs are inspected and contain no qualification body, personal fields, or other submission data
- [ ] No unauthenticated listing route, CORS policy, browser database access, authentication workflow, rate-limiting package, notification workflow, or operator interface is introduced in version one
