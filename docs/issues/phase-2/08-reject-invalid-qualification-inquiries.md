# 08: Reject invalid qualification inquiries

**What to build:** A prospect can complete the qualification form and receives accessible, field-specific feedback when submitted information is invalid. Native browser constraints provide immediate guidance, and the server independently validates every external value before any persistence boundary can be reached.

**Blocked by:** 01 (Launch the marketing shell and homepage hero)

**Status:** ready-for-agent

- [ ] The static qualification page asks for name, email, optional company, project type, budget range, and message
- [ ] Native constraints cover required values, email format, and minimum lengths where applicable
- [ ] The Server Action validates external form data with Zod, including controlled project-type and budget values
- [ ] Invalid submissions return a typed state containing a global message and field-level errors and never call the persistence boundary
- [ ] Errors are associated with their fields and announced accessibly without discarding the prospect’s correct entries
- [ ] The separate submit control reports a disabled “Sending...” pending state through the framework form-status API
- [ ] The page shell remains static and only form interaction introduces a client boundary
