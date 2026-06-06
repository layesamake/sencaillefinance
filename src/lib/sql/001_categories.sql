-- ============================================
-- SENCAILLE Finance — Mission 4
-- Table categories + RLS + données initiales
-- ============================================

-- 1. Créer la table categories
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  operation_type text NOT NULL CHECK (operation_type IN ('income', 'expense')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Activer RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3. Accorder les droits de base
GRANT SELECT, INSERT, UPDATE ON public.categories TO authenticated;
GRANT SELECT ON public.categories TO anon;

-- 4. Policies RLS
-- Tous les utilisateurs connectés peuvent lire les catégories
CREATE POLICY "Anyone can read categories"
  ON public.categories FOR SELECT
  USING (true);

-- Tous les utilisateurs connectés peuvent créer des catégories
CREATE POLICY "Authenticated users can create categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Seuls les admins peuvent modifier les catégories
CREATE POLICY "Admins can update categories"
  ON public.categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 5. Index
CREATE INDEX IF NOT EXISTS idx_categories_operation_type ON public.categories(operation_type);
CREATE INDEX IF NOT EXISTS idx_categories_status ON public.categories(status);

-- 6. Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. Données initiales — Catégories de recettes
-- ============================================
INSERT INTO public.categories (name, operation_type) VALUES
  ('Vente œufs de caille', 'income'),
  ('Vente œufs fécondés', 'income'),
  ('Vente cailleteaux', 'income'),
  ('Vente cailles reproductrices', 'income'),
  ('Vente chair de caille', 'income'),
  ('Vente poussins', 'income'),
  ('Vente poulets', 'income'),
  ('Vente cages', 'income'),
  ('Vente accessoires', 'income'),
  ('Autres recettes', 'income');

-- ============================================
-- 8. Données initiales — Catégories de dépenses
-- ============================================
INSERT INTO public.categories (name, operation_type) VALUES
  ('Achat aliment volaille', 'expense'),
  ('Achat vitamines', 'expense'),
  ('Achat médicaments', 'expense'),
  ('Achat caille préponte', 'expense'),
  ('Achat reproducteurs', 'expense'),
  ('Achat emballages', 'expense'),
  ('Transport', 'expense'),
  ('Main-d''œuvre', 'expense'),
  ('Réparation matériel', 'expense'),
  ('Communication / publicité', 'expense'),
  ('Eau / électricité', 'expense'),
  ('Achat matériel', 'expense'),
  ('Autres dépenses', 'expense');
