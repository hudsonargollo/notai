# NotAI redesign — implementation handoff

Drop this whole `redesign/` folder into the repo root of `hudsonargollo/notai`, then move `redesign/AGENTS.md` to the repo root as `AGENTS.md` (Claude Code reads it automatically; merge if one already exists).

## About these files
These are **design references, not production code**. The task is to recreate the specified screens inside the existing app environment (React + Vite + Tailwind + shadcn), reusing its services (`expenseService`, `geminiService`) and i18n. Hi-fi mockups exist in the design workspace; every measurement, hex and string a developer needs is written into these specs, so the docs are self-sufficient.

## Fidelity
**High-fidelity.** Colors, type, spacing, radii and copy in `DESIGN_SPEC.md` and `UX_COPY.md` are final. Implement pixel-close using Tailwind theme extensions mapped to the token table (DESIGN_SPEC §1).

## Contents
- `AGENTS.md` — commands, structure, 9 non-negotiable guardrails, flow changes vs current code
- `DESIGN_SPEC.md` — full token table (light + dark), type scale, shape/space/elevation, component specs, motion budget
- `UX_COPY.md` — voice rules + pt/en string table (all copy goes through `utils/i18n.ts`)
- `PROMPTS.md` — base context block + one prompt per screen + post-regen review checklist
- `screens/01–09` — per-screen briefs (layouts, states, behaviors)
- `mockups/01–12` — hi-fi reference screenshots (2x, iPhone frame; 11–12 are dark theme). When implementing a screen, open its screenshot alongside the brief — match it pixel-close.

## Suggested order (each is one Claude Code session)
1. **Foundation** — Tailwind theme extension from DESIGN_SPEC §1 (semantic tokens on CSS vars, `data-theme="dark"`), load Caprasimo + Figtree, add i18n strings from UX_COPY.md, delete `glass-panel`/mesh-gradient CSS.
2. **Splash + Login** (prompt in PROMPTS.md)
3. **Onboarding** (2 steps)
4. **Home** + bottom nav (this creates the app shell the other tabs use)
5. **Capture** (merge Scanner + ReviewForm; delete both + FloatingActionButton)
6. **Budgets inline** (delete BudgetModal)
7. **Insights** (delete AIAssistant)
8. **Settings** (delete SettingsModal)
9. **Paywall** (rebuild PaywallModal, wire limit triggers)

After each step, run the review checklist at the bottom of PROMPTS.md.
