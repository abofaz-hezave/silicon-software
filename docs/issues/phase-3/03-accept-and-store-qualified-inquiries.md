# 03: Accept and store qualified inquiries

**What to build:** The internal submissions endpoint accepts a valid qualified inquiry, validates it at the AWS boundary, and stores it durably in DynamoDB. Invalid or failed requests receive controlled responses, personal data stays out of operational logs, and only the submissions runtime can write to the table.

**Blocked by:** 02 (Pass the Next.js compatibility gate in AWS)

**Status:** ready-for-agent

- [ ] A bundled Lambda on the current AWS-supported Node.js runtime handles only `POST /submissions` through an API Gateway HTTP API
- [ ] Missing, malformed, and oversized request bodies are rejected before persistence, and all parsed external values are validated with the shared Zod submission schema
- [ ] Valid input is passed to `saveSubmission(...)` through `@repo/data` and returns a JSON `201` response only after DynamoDB confirms the write
- [ ] Validation failures return controlled `400` responses, and unexpected failures return a non-sensitive JSON `500` response
- [ ] Structured Lambda logs include operational identifiers and outcomes without recording the request body, qualified-inquiry fields, or other personal data
- [ ] The DynamoDB table uses on-demand billing, a string partition key named `id`, AWS-managed encryption, and point-in-time recovery; `createdAt` is not declared as a key
- [ ] Production table data is retained, while non-production resources use a stage-aware policy that permits intentional disposal
- [ ] The submissions Lambda receives the table name through `SUBMISSIONS_TABLE_NAME` and has only the DynamoDB write action required by `saveSubmission(...)` against that table
- [ ] The OpenNext server Lambda receives no DynamoDB permission, and no database identifier or permission is exposed to a browser bundle
- [ ] The API default stage has finite-retention access logs and conservative throttling, with no CORS configuration and no `GET /submissions` route
- [ ] Finite log retention and alarms cover submissions Lambda errors and throttles, API 5xx responses, and DynamoDB throttling
- [ ] Alarm actions are attached only when a notification destination is supplied through context
- [ ] Consistent application, stage, owner, and cost-allocation tags apply to the created resources
- [ ] CloudFormation outputs expose the HTTP API URL, table name, submissions Lambda log-group name, and API access log-group name
- [ ] Automated handler tests cover successful persistence, missing and oversized bodies, malformed JSON, Zod failures, unexpected storage failures, and log redaction
- [ ] CDK assertions cover the table key and billing mode, API route and Lambda integration, scoped IAM write grant, retention policies, logging, alarms, tags, and outputs
