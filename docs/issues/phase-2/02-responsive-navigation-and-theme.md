# 02: Add responsive navigation and theme switching

**What to build:** A prospect can navigate the marketing site on a small screen and choose light, dark, or system-driven presentation. The choice persists between visits, while the shared page shell remains server-rendered apart from the controls that require browser interaction.

**Blocked by:** 01 (Launch the marketing shell and homepage hero)

**Status:** ready-for-agent

- [ ] A keyboard-accessible mobile menu exposes the same destinations as the desktop navigation and closes predictably after navigation
- [ ] The theme control supports light, dark, and system preference, defaults to system, and persists the visitor’s choice
- [ ] Theme hydration does not produce visible mismatch warnings or an incorrect initial theme flash
- [ ] Only the mobile menu and theme control introduce client-side component boundaries for this behavior
- [ ] Navigation and theme controls remain usable at mobile and desktop breakpoints
