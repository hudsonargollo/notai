# NotAI — Design specification

Direction: **warm, editorial, calm.** Cream paper ground, terracotta accent, sage second voice. Rounded but restrained. The app should feel like a well-made ledger, not a game. Derived from the Organic design system.

## 1. Color tokens

Semantic names; both themes required. (Tailwind: extend `colors` with these names reading CSS vars on `:root` / `[data-theme=dark]`.)

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#f5ead8` | `#1d1712` | App background |
| `surface` | `#ebddc5` | `#2a221a` | Cards, sheets, nav |
| `surface-2` | `#e2d2b6` | `#362c22` | Nested fills, input bg, progress tracks |
| `border` | `rgba(32,30,29,.12)` | `rgba(245,234,216,.12)` | Hairlines |
| `text` | `#201e1d` | `#f2e7d5` | Primary text |
| `muted` | `#6d6152` | `#b3a48d` | Secondary text, labels |
| `accent` | `#c67139` | `#d98a52` | Primary actions, active states |
| `accent-deep` | `#8a4a20` | `#e8a877` | Accent-colored *text* (contrast-safe) |
| `accent-soft` | `#eeD9c2` | `#463122` | Accent tinted fills |
| `accent2` | `#7a8a5e` | `#97a878` | Positive/progress, insight voice |
| `accent2-deep` | `#4c5837` | `#c2d1a6` | accent2-colored text |
| `accent2-soft` | `#e0e0c4` | `#2d3122` | Insight card fill |
| `danger` | `#a8402f` | `#d97862` | Destructive, over-budget |

Rules: over-budget = `danger`, on-track = `accent2`. Charts use `accent` for the highlighted series and `surface-2` for the rest — never rainbow categories.

## 2. Type

- **Display:** Caprasimo 400 — screen titles, hero amounts, empty-state headlines. Never below 22px, never for labels.
- **Body:** Figtree 400/600/700 — everything else.

Scale (px / line-height): display-xl 40/1.1 (hero amount) · display 28/1.15 (screen title) · title 20/1.3 (card title, Figtree 700) · body 15/1.5 · secondary 13/1.45 · caption 11/1.35 (Figtree 600, sentence case — **no uppercase-tracked micro labels**).

Numbers: tabular figures (`font-variant-numeric: tabular-nums`) in lists and tables.

## 3. Shape, space, elevation

- Radius: cards/sheets 20px · inputs 14px · buttons & chips 999px (pill) · thumbnails 12px.
- Spacing scale: 4 / 8 / 12 / 16 / 20 / 24 / 32. Screen gutter 20px. Card padding 20px.
- Elevation: flat by default; sheets and the capture shutter get `0 12px 32px rgba(32,30,29,.14)` (light) / `0 12px 32px rgba(0,0,0,.4)` (dark). No blur/glass anywhere.

## 4. Iconography

Lucide, stroke-width 2.5, 20px in rows, 24px in nav. Icons are always `muted` or `accent-deep` — never multicolored per category. Category identity comes from the label, not icon color.

## 5. Components

- **Button primary:** pill, `accent` fill, white text, 52px tall, Figtree 700 16px. Pressed: darken one step. No gradients, no icon unless it adds meaning.
- **Button secondary:** pill, `surface-2` fill, `text` color. **Ghost:** text-only `accent-deep`.
- **Input:** 14px radius, `surface-2` fill, 1px `border`, 16px text, floating none — label above in caption style. Focus: 2px `accent` outline.
- **Chip (category select):** pill, `surface-2`; selected = `accent` fill white text.
- **Card:** `surface` fill, 20px radius, no border in light (1px `border` in dark).
- **Insight card:** `accent2-soft` fill, leading ✳-style Lucide `sparkle`? No — use `leaf` or `asterisk` glyph 18px in `accent2-deep`; body 15px; optional one ghost action. Signed with caption "Insight · gerado dos seus lançamentos".
- **List row (transaction):** 56px min height, no per-row card chrome — flat rows separated by hairlines inside one card. Left: 36px round `surface-2` icon disc. Middle: merchant (body 600) + category (secondary muted). Right: amount (body 700, tabular).
- **Progress bar:** 6px tall, 999px radius, track `surface-2`, fill `accent2` (or `danger` when >100%).
- **Bottom nav:** `surface` bar, hairline top border, 3 tabs (Início, Insights, Ajustes) + a raised 56px `accent` circular Capture button center. Labels 11px under 24px icons; active = `accent-deep`.
- **Sheet:** bottom sheet 24px top radius, drag handle 36×4px `border` color.

## 6. Motion

- Page transitions: 260ms ease-out slide+fade, subtle (12px travel).
- Sheets: spring 300ms.
- Amount count-up on Home hero: once, 400ms, on data load only.
- Nothing loops. `prefers-reduced-motion` disables all of it.

## 7. Theme switching

`data-theme="dark"` on root. Default follows system; user override in Settings. Camera/viewfinder screens are always dark-chrome regardless of theme.

## 8. Accessibility

Contrast: text on bg/surface ≥ 4.5:1 (use `accent-deep`/`accent2-deep` for colored text). Hit targets ≥ 44px. All icons paired with visible labels in nav. Focus visible: 2px accent outline.
