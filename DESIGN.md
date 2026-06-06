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
