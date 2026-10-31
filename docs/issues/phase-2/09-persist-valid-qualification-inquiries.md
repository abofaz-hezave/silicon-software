# 09: Persist valid qualification inquiries

**What to build:** When a prospect submits valid qualification details, the marketing site sends the validated inquiry to the internal submissions API through the server-only `SUBMISSIONS_API_URL` environment variable injected by SST. The prospect receives confirmation and a reset form only after the API confirms persistence; operational follow-up remains a manual email from Silicon Software.

**Blocked by:** 08 (Reject invalid qualification inquiries) and the Phase 3 submissions API described in the build plan

**Status:** completed

- [x] A valid Server Action submission posts the validated inquiry to the internal submissions API using the server-only `SUBMISSIONS_API_URL` environment variable
- [x] No API URL, table name, or database credential is read from a public environment variable or hardcoded in the app
- [x] Confirmed persistence returns a typed success state, presents an accessible confirmation, and resets the form
- [x] API rejection or transport failure preserves a useful retry path and does not report a false success
- [x] Automated coverage demonstrates that invalid data cannot trigger an API request and success requires a confirmed API write
- [x] The version-one flow imports no authentication or rate-limiting package and adds no notification, booking, scheduling, or administration workflow
