# Design System: SENCAILLE Finance

## 1. Visual Theme & Atmosphere
A restrained, gallery-airy interface with confident minimalist layouts and fluid micro-motion. The atmosphere is clinical yet warm and highly functional — designed for precision in financial tracking. Density is balanced (5), variance is predictable but offset (4), and motion is subtle but present (6).

## 2. Color Palette & Roles
- **Canvas White** (#F8FAFC) — Primary background surface for light mode (if needed).
- **Deep Space** (#020617) — Primary background surface for the app (Slate 950).
- **Pure Surface** (#0F172A) — Card and container fill (Slate 900).
- **Charcoal Ink** (#F8FAFC) — Primary text (Slate 50).
- **Muted Steel** (#94A3B8) — Secondary text, descriptions, metadata (Slate 400).
- **Whisper Border** (rgba(30,41,59,0.5)) — Card borders, 1px structural lines (Slate 800/50).
- **Emerald Accent** (#10B981) — Single accent for positive values, primary CTAs, active states (Emerald 500).
- **Alert Rose** (#F43F5E) — Accent for negative values or debts (Rose 500).
- **Warning Amber** (#F59E0B) — Accent for pending/partial states (Amber 500).

## 3. Typography Rules
- **Display:** `Outfit` — Track-tight, controlled scale, weight-driven hierarchy. Used for headers and primary numbers.
- **Body:** `Inter` is BANNED. We use `Outfit` or a clean sans like `Geist` — Relaxed leading, 65ch max-width, neutral secondary color.
- **Mono:** `JetBrains Mono` or `Geist Mono` — For code, metadata, timestamps, high-density numbers (FCFA amounts).
- **Banned:** Inter, generic system fonts for premium contexts. Serif fonts banned in this dashboard.

## 4. Component Stylings
* **Buttons:** Flat, no outer glow. Tactile -1px translate on active. Emerald fill for primary, ghost/outline for secondary.
* **Cards:** Generously rounded corners (1.5rem to 2rem). Diffused whisper shadow or no shadow at all. Used only when elevation serves hierarchy. We prefer border-top dividers for lists.
* **Inputs:** Label above, error below. Focus ring in accent color. No floating labels.
* **Loaders:** Skeletal shimmer matching exact layout dimensions. No circular spinners.
* **Empty States:** Composed, illustrated compositions — not just "No data" text.

## 5. Layout Principles
Grid-first responsive architecture.
Single-column layout centered for the mobile-first dashboard (max-width containment at `max-w-md`).
No flexbox percentage math. Generous internal padding.
No overlapping elements — every element occupies its own clear spatial zone.
The generic "3 equal cards horizontally" is BANNED — use asymmetric grid or horizontal scroll.

## 6. Motion & Interaction
Spring physics for all interactive elements (stiffness: 100, damping: 20).
Staggered cascade reveals for the operations list.
Perpetual micro-loops on active dashboard components. Hardware-accelerated transforms only.

## 7. Anti-Patterns (Banned)
- No emojis anywhere (replace with SVG icons or semantic colors).
- No `Inter` font.
- No generic serif fonts.
- No pure black (`#000000`).
- No neon glows or oversaturated accents.
- No 3-column equal grids.
- No AI copywriting clichés.
- No filler UI text like "Scroll to explore".
- No overlapping elements.
- No cards with multiple heavy border colors.
