# 02: Pass the Next.js compatibility gate in AWS

**What to build:** A disposable development deployment demonstrates that the pinned CDK and OpenNext combination supports the current Next.js 16 marketing application in AWS. The result is an evidence-based go or stop decision before any production infrastructure is implemented.

**Blocked by:** 01 (Establish the CDK and OpenNext compatibility harness) and Phase 2 ticket 08 (Reject invalid qualification inquiries)

**Status:** ready-for-agent

- [ ] The target AWS account and application region are supplied outside source control, and the target region is bootstrapped for CDK
- [ ] The disposable stack synthesizes and deploys successfully through the documented pnpm workflow
- [ ] Public static routes load successfully through the generated CloudFront URL
- [ ] The qualification Server Action executes in the OpenNext server Lambda and preserves its typed validation behavior without requiring the Phase 3 persistence API
- [ ] Routes using `cacheComponents` render successfully in the deployed application
- [ ] Framework image optimization works through the deployed CloudFront distribution
- [ ] Immutable static assets receive appropriate cache behavior while dynamic qualification behavior is not incorrectly cached
- [ ] A changed deployment is delivered successfully and CloudFront serves the new version without stale application content
- [ ] The exact AWS CDK, `open-next-cdk`, OpenNext, and Next.js versions proven in AWS are recorded together in the infrastructure package metadata
- [ ] If the combination fails, the concrete synthesis, deployment, or runtime failure is recorded and implementation stops before choosing a different Next.js version or ECS Fargate
- [ ] No Next.js downgrade or compute-model change is made without an explicit follow-up decision
- [ ] The disposable resources can be intentionally removed after the evidence has been captured
