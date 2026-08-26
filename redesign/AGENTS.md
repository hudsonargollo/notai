# NotAI — Agent guide

Context-as-Code for the NotAI redesign. Read `redesign/DESIGN_SPEC.md` before touching any UI. Reference mockups: `NotAI Redesign.dc.html` at project root of the design workspace.

## Commands
- `npm install` — deps
- `npm run dev` — Vite dev server
- `npm run build` — production build
- No test suite yet; do not add test frameworks without approval.

## Structure
- `App.tsx` — view state machine (splash → login → onboarding → dashboard | scan | review)
- `components/` — screen-level components
- `src/components/ui/` — shadcn primitives (keep; restyle via tokens)
- `services/` — geminiService (OCR + chat), expenseService (localStorage store)
- `utils/i18n.ts` — all user-facing strings live here (pt + en). Never hard-code copy in components.

## Design guardrails (non-negotiable)
1. **Tokens only.** All color, radius, spacing and type come from the token set in `redesign/DESIGN_SPEC.md` (Tailwind theme extension / CSS vars). Never write raw hex, `white/5`, `slate-*`, or `glass-panel` — the glassmorphism layer is removed.
2. **Two themes.** Every screen must render in `light` (default) and `dark`. Use semantic tokens (`bg`, `surface`, `text`, `muted`, `accent`, `accent2`), never theme-conditional hex.
3. **Type floor.** Body ≥ 15px, secondary ≥ 13px, captions ≥ 11px. The old 7–9px uppercase micro-labels are banned.
4. **No mascot rendering.** Neo has no avatar, no speech bubbles, no typewriter effect, no chat window. Neo output appears only as Insight cards (see `redesign/screens/07-insights.md`).
5. **No AI-slop styling:** no gradient CTA buttons, no glow/blur halos, no emoji in UI copy, no `animate-pulse` badges, no fake "processing…" theatre beyond one honest progress state.
6. **Motion budget.** One spring for sheet/page transitions (250–300ms). No infinite float/rotate loops. Respect `prefers-reduced-motion`.
7. **Touch targets ≥ 44px.** 
8. **Copy through i18n**, tone per `redesign/UX_COPY.md`.
9. **Paywall policy:** trial-first, shown only at usage limits, always with a free-tier path. Never on app open. See `redesign/screens/09-paywall.md`.

## Flow changes vs current code
- Scanner + ReviewForm merge into one **Capture** flow (camera → editable result on one screen). Kill the intermediate BottomSheet confirm.
- Onboarding shrinks to 2 steps (name → monthly budget). Category editing moves to Settings.
- SettingsModal becomes a **Settings screen** (route, not modal).
- BudgetModal dies; budgets are edited inline on Home.
- AIAssistant chat is replaced by the **Insights** tab (read-only generated cards).

## When regenerating a screen
Use the matching prompt in `redesign/PROMPTS.md` + the screen brief in `redesign/screens/`.
