# Capture — merged scan + review (one flow, one screen stack)

Kills Scanner.tsx + ReviewForm.tsx + confirm BottomSheet + FloatingActionButton.

## State A — Viewfinder (always dark chrome)
Full-bleed camera. Rounded corner guides (24px, 2.5px stroke, white 70%). Hint pill top: "Aponte para o cupom". Bottom bar: gallery thumb (44px) · shutter 72px white ring · "Manual" ghost (→ State C empty). Close X top-left.

## State B — Processing (inline, same screen)
Captured photo stays visible, dimmed. Center: 20px spinner + "Lendo o cupom…" body white. One state, honest; no mascot float, no skeleton theatre. Fail → toast "Não conseguimos ler este cupom. Tente com mais luz, ou lance manualmente." + buttons Repetir / Lançar manual.

## State C — Review (slides up as full sheet, editable, one screen)
- Receipt thumb 56px (tap = fullscreen) + merchant field inline.
- Amount: Caprasimo 40, tap to edit (numeric pad), accent underline while editing.
- Date field (compact) · Category chip row (horizontal scroll, selected = accent fill). AI pre-selects; caption "Sugerido a partir do cupom" under chips.
- "{n} itens lidos" collapsed row → expands to editable line items.
- Recurring toggle row (off by default).
- Sticky footer: primary pill "Salvar lançamento". Save → back to Home with the new row highlighted 1s (accent-soft flash).

Editing an existing entry from Home opens State C directly.
