# 04: Serve the marketing site on its production domain

**What to build:** Prospects can reach the OpenNext-packaged marketing site at its configured HTTPS domain, with static assets served efficiently and dynamic qualification behavior handled by the server Lambda. The web runtime can call the internal submissions API through server-only configuration but cannot access DynamoDB directly.

**Blocked by:** 03 (Accept and store qualified inquiries)

**Status:** ready-for-agent

- [ ] A dedicated certificate stack in `us-east-1` issues the CloudFront viewer certificate and validates it through the configured Route 53 hosted zone
- [ ] The application stack runs in the configured application region, and cross-region references between the stacks are explicit and synthesizable
- [ ] The workflow documents and verifies CDK bootstrap requirements for both regions without committing account or domain values
- [ ] The verified OpenNext construct uploads immutable, versioned Next.js assets to private S3 storage and serves the application through CloudFront
- [ ] CloudFront redirects viewers to HTTPS, enables compression, and applies appropriate policies to immutable static assets and dynamic application requests
- [ ] The ACM certificate is attached to CloudFront, and Route 53 `A` and `AAAA` alias records target the distribution
- [ ] The HTTP API URL is injected into the OpenNext server Lambda as `SUBMISSIONS_API_URL` and is not included in public environment configuration or browser assets
- [ ] The OpenNext server Lambda has no DynamoDB permissions and calls persistence only through the submissions API
- [ ] The generated CloudFront distribution, asset storage, and application Lambda remain accessible to CDK for narrow configuration and observability
- [ ] Application Lambda logs use finite retention, and error and throttle alarms cover every application Lambda
- [ ] Alarm actions remain optional and are attached only when a notification destination is configured
- [ ] Application, stage, owner, and cost-allocation tags apply consistently across both stacks
- [ ] CloudFormation outputs expose the configured domain or CloudFront URL and relevant application Lambda log-group names alongside the submissions outputs
- [ ] CDK assertions cover the CloudFront distribution, HTTPS and compression behavior, cache policies, certificate, DNS aliases, server-only API configuration, absence of web-runtime DynamoDB grants, retention policies, alarms, tags, and outputs
- [ ] Synthesis produces valid cross-region CloudFormation without unresolved tokens or unbundled handlers
