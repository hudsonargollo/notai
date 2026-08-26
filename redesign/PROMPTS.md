# NotAI — Prompt library

Prompts for regenerating screens with a coding agent (Claude Code, Cursor). Always include the **base context** block, then the screen prompt.

## Base context (prepend to every prompt)
```
Read redesign/AGENTS.md, redesign/DESIGN_SPEC.md and redesign/UX_COPY.md first and follow them strictly.
Hard rules: token colors only (no slate/white-alpha/glass-panel), Caprasimo display + Figtree body,
no mascot/avatar/chat UI, no gradients or glows, sentence-case labels ≥11px, both themes via
semantic tokens, all copy through utils/i18n.ts in pt+en, touch targets ≥44px, minimal motion.
```

## Screen prompts
**Splash + Login** — `Rebuild SplashScreen.tsx and LoginScreen.tsx per redesign/screens/01-splash-login.md: static wordmark splash (no animation loop), login with email + Google, no mascot.`

**Onboarding** — `Rebuild Onboarding.tsx per redesign/screens/02-onboarding.md: exactly 2 steps (name, monthly target with quick-pick chips). Remove Neo dialogue, category step and celebration step. Move category management to Settings.`

**Home** — `Rebuild Dashboard.tsx per redesign/screens/03-home.md: greeting header, hero spend card with target progress, one Insight card, inline budget rows (tap amount to edit with stepper), recent entries list, bottom nav with center Capture button. Delete NeoCore, SpeechBubble, bento grid and crown button.`

**Capture** — `Merge Scanner.tsx + ReviewForm.tsx into one Capture flow per redesign/screens/04-capture.md: full-screen viewfinder → single processing state → editable result on the same screen (amount, merchant, date, category chips, collapapsed line items) → save. Remove FloatingActionButton and the confirm BottomSheet.`

**Budgets** — `Implement inline budget editing on Home per redesign/screens/05-budgets.md. Delete BudgetModal.tsx.`

**Insights** — `Replace AIAssistant.tsx with an Insights tab per redesign/screens/07-insights.md: read-only generated cards (monthly summary, category trend with mini bars, recurring detection), each signed "Gerado a partir dos seus lançamentos". No chat, no mic, no TTS, no typewriter.`

**Settings** — `Replace SettingsModal.tsx with a Settings screen per redesign/screens/06-settings.md: profile, preferences (language, currency, theme), categories management, data export/delete, plan usage meter, sign out.`

**Paywall** — `Rebuild PaywallModal.tsx per redesign/screens/09-paywall.md: bottom sheet triggered only at capture/insight limits, trial-first CTA, visible free-tier path, no countdown, no crown, no mascot.`

## Review checklist (run after any screen regen)
- [ ] Zero occurrences of: `glass-panel`, `slate-`, `white/`, `energy-`, `trust-`, `AVATAR_URL`, `animate-pulse`, gradient classes
- [ ] Renders in light and dark
- [ ] All new strings exist in i18n (pt + en), sentence case
- [ ] Text ≥11px, targets ≥44px
- [ ] Paywall unreachable except via limit events
