# 01: Launch the marketing shell and homepage hero

**What to build:** A prospect can open a production-ready Silicon Software marketing site, understand the agency’s Intelligent Briefing offer from a static homepage hero, use the primary qualification and secondary product-preview calls to action, and navigate the shared site chrome. The site uses the monorepo design system, self-hosted fonts, strict configuration, static rendering by default, and styled not-found and error experiences.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] The Next.js 16 marketing app builds and renders a static homepage with a realistic headline, supporting copy, and working qualification and product-preview calls to action
- [ ] The shared marketing layout provides an accessible desktop navbar with every main public route and a footer on the homepage
- [ ] Tailwind design tokens and shared UI primitives come from the monorepo packages rather than being duplicated locally
- [ ] Inter body text and Geist display text are self-hosted through the framework font integration
- [ ] Cache Components and React Compiler are enabled while static generation remains the default rendering strategy
- [ ] Styled not-found and error experiences use the same visual system
- [ ] Public environment variables are validated with Zod, while infrastructure values are reserved for SST resource bindings
- [ ] The app passes its build, type-check, and lint tasks
