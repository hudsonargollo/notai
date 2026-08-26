# Insights — replaces Neo chat (AIAssistant.tsx deleted)

Read-only feed of generated cards. No chat input, no mic, no TTS, no typewriter, no status LEDs, no persona.

Header: "Insights" (Caprasimo 28) + month selector caption.

Card types (each accent2-soft fill, asterisk glyph, signed caption "Gerado a partir dos seus lançamentos"):
1. **Resumo do mês**: total vs target, 1 sentence.
2. **Tendência por categoria**: sentence + mini bar chart (4 weekly bars, CSS, accent for current week, surface-2 others). Optional ghost action "Ajustar orçamento" → inline budget edit.
3. **Recorrentes detectadas**: "Netflix aparece todo dia 12 (R$ 39,90). Marcar como recorrente?" → one ghost action.
4. **Alerta de limite** (only when >85% of a budget): factual, danger accent on the number only.

Rules: max 4 cards, newest first, facts before suggestions, never first-person, no exclamation marks. Free plan: full history locked after 30 days → one quiet locked card at feed end (ghost "Conhecer o Ilimitado").
