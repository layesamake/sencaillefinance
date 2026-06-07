---
name: SENCAILLE Finance
colors:
  surface: '#18181b'
  surface-dim: '#18181b'
  surface-bright: '#27272a'
  surface-container-lowest: '#000000'
  surface-container-low: '#09090b'
  surface-container: '#18181b'
  surface-container-high: '#27272a'
  surface-container-highest: '#3f3f46'
  on-surface: '#f4f4f5'
  on-surface-variant: '#a1a1aa'
  inverse-surface: '#f4f4f5'
  inverse-on-surface: '#09090b'
  outline: '#27272a'
  outline-variant: '#3f3f46'
  surface-tint: '#3b82f6'
  primary: '#3b82f6'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#eff6ff'
  inverse-primary: '#93c5fd'
  secondary: '#a1a1aa'
  on-secondary: '#09090b'
  secondary-container: '#27272a'
  on-secondary-container: '#e4e4e7'
  tertiary: '#10b981'
  on-tertiary: '#000000'
  tertiary-container: '#065f46'
  on-tertiary-container: '#d1fae5'
  error: '#ef4444'
  on-error: '#ffffff'
  error-container: '#991b1b'
  on-error-container: '#fee2e2'
  primary-fixed: '#bfdbfe'
  primary-fixed-dim: '#93c5fd'
  on-primary-fixed: '#1e3a8a'
  on-primary-fixed-variant: '#1e40af'
  secondary-fixed: '#e4e4e7'
  secondary-fixed-dim: '#d4d4d8'
  on-secondary-fixed: '#18181b'
  on-secondary-fixed-variant: '#27272a'
  tertiary-fixed: '#d1fae5'
  tertiary-fixed-dim: '#a7f3d0'
  on-tertiary-fixed: '#064e3b'
  on-tertiary-fixed-variant: '#065f46'
  background: '#09090b'
  on-background: '#f4f4f5'
  surface-variant: '#27272a'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-bold:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 24px
---

# Design System: SENCAILLE Finance

## 1. Visual Theme & Atmosphere
Une interface de gestion agricole financière qui refuse le minimalisme générique "SaaS". L'atmosphère doit être "Daily App Balanced", offrant une densité modérée mais avec des contrastes assurés. Les ombres sont diffuses et élégantes, la géométrie utilise des coins généreusement arrondis, et le design s'articule autour de 3 thèmes sémantiques distincts : Charcoal (Sombre), Canvas (Clair), et Nature (Agricole).

## 2. Color Palette & Roles

### Thème 1 : Midnight Charcoal (Défaut)
- **Canvas** (`#09090b`) — Fond principal très sombre (Zinc-950)
- **Surface** (`#18181b`) — Cartes et conteneurs (Zinc-900)
- **Border** (`#27272a`) — Lignes de séparation structurelles (Zinc-800)
- **Primary Text** (`#f4f4f5`) — Texte principal très lisible (Zinc-50)
- **Muted Text** (`#a1a1aa`) — Texte secondaire, descriptions (Zinc-400)
- **Accent** (`#3b82f6`) — Bleu profond, boutons principaux, focus (Blue-500)

### Thème 2 : Canvas Light
- **Canvas** (`#fafafa`) — Blanc cassé chaud pour le fond (Neutral-50)
- **Surface** (`#ffffff`) — Blanc pur pour les cartes (White)
- **Border** (`#e5e5e5`) — Séparateurs très subtils (Neutral-200)
- **Primary Text** (`#171717`) — Encre profonde (Neutral-900)
- **Muted Text** (`#737373`) — Texte secondaire (Neutral-500)
- **Accent** (`#0f172a`) — Bleu nuit très foncé presque noir pour l'accentuation (Slate-900)

### Thème 3 : Sencaille Nature
- **Canvas** (`#141b14`) — Vert forêt extrêmement profond
- **Surface** (`#1c251c`) — Fond de carte teinté olive sombre
- **Border** (`#2c392c`) — Lignes structurelles verdâtres
- **Primary Text** (`#f0fdf4`) — Blanc cassé légèrement vert (Green-50)
- **Muted Text** (`#86efac`) — Texte secondaire vert pastel (Green-300)
- **Accent** (`#eab308`) — Jaune or (Yellow-500), rappelant le blé et le soleil

## 3. Typography Rules
- **Display & Body:** Utilisation de `Inter` (remplacé par une police système clean ou Outfit si dispo). L'interface requiert de la clarté financière.
- **Mono:** Pour les montants financiers (F CFA), privilégier les tabular nums.
- **Banned:** Polices serif (inadaptées pour un tableau de bord financier).

## 4. Component Stylings
* **Buttons:** Coins arrondis (`rounded-xl`). Changement de couleur au survol avec transition douce. L'accent fill pour les actions primaires.
* **Cards:** Bords généreusement arrondis (`rounded-2xl` ou `rounded-3xl`). Ombres subtiles (`shadow-sm` en sombre, `shadow-lg` en clair).
* **Inputs:** Bordure subtile, fond de l'input correspond à Surface, `focus:ring-1 focus:border-accent`. Pas de placeholder générique.
* **Badges:** Pilules avec fond semi-transparent de la couleur associée (ex: bg-green-950/50 text-green-400).

## 5. Layout Principles
- Architecture "Grid-first" pour les statistiques et les résumés.
- Espacement généreux entre les blocs (`space-y-6`).
- Max-width maîtrisé (`max-w-2xl` et `max-w-md`) pour éviter que les éléments ne s'étirent démesurément sur les grands écrans.
- Strict single-column collapse en dessous de 768px.

## 6. Motion & Interaction
- Transitions systématiques sur toutes les couleurs et ombres (`transition-all duration-300 ease-in-out`).
- Retour haptique visuel (hover, active/disabled states) sur les boutons.

## 7. Anti-Patterns (Banned)
- Pas de "neon glows" excessifs sur les boutons.
- Pas de bordures de 2px ou 3px d'épaisseur (uniquement des lignes de 1px structurelles).
- Pas d'emojis en remplacement d'icônes (utiliser Lucide-react).
- Jamais de texte noir pur (`#000000`).
