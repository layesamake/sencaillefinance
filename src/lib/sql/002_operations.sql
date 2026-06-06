-- ============================================
-- SENCAILLE Finance — Mission 5
-- Tables: accounts, parties, operations, payments
-- ============================================

-- ============================================
-- 0. Fonction utilitaire pour updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 1. Table accounts
-- ============================================
CREATE TABLE IF NOT EXISTS public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  account_type text NOT NULL CHECK (account_type IN ('wave', 'cash', 'bank', 'other')),
  opening_balance numeric NOT NULL DEFAULT 0,
  opening_date date NOT NULL DEFAULT current_date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.accounts TO authenticated;

CREATE POLICY "Anyone can read active accounts"
  ON public.accounts FOR SELECT
  USING (true);

CREATE POLICY "Admins can update accounts"
  ON public.accounts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP TRIGGER IF EXISTS set_accounts_updated_at ON public.accounts;
CREATE TRIGGER set_accounts_updated_at
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Données initiales
INSERT INTO public.accounts (name, account_type) VALUES
  ('WAVE SENCAILLE', 'wave'),
  ('Caisse SENCAILLE', 'cash');

-- ============================================
-- 2. Table parties
-- ============================================
CREATE TABLE IF NOT EXISTS public.parties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  party_type text NOT NULL CHECK (party_type IN ('customer', 'supplier', 'both')),
  phone text,
  notes text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.parties TO authenticated;

CREATE POLICY "Anyone can read parties" ON public.parties FOR SELECT USING (true);
CREATE POLICY "Anyone can create parties" ON public.parties FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can update parties" ON public.parties FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP TRIGGER IF EXISTS set_parties_updated_at ON public.parties;
CREATE TRIGGER set_parties_updated_at
  BEFORE UPDATE ON public.parties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. Table operations
-- ============================================
CREATE TABLE IF NOT EXISTS public.operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type text NOT NULL CHECK (operation_type IN ('income', 'expense')),
  category_id uuid REFERENCES public.categories(id) NOT NULL,
  party_id uuid REFERENCES public.parties(id),
  total_amount numeric NOT NULL CHECK (total_amount > 0),
  initial_paid_amount numeric NOT NULL DEFAULT 0,
  settlement_mode text NOT NULL CHECK (settlement_mode IN ('paid', 'credit', 'partial')),
  initial_account_id uuid REFERENCES public.accounts(id),
  operation_date date NOT NULL DEFAULT current_date,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deleted')),
  created_by uuid REFERENCES public.profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_by uuid REFERENCES public.profiles(id),
  deleted_at timestamptz,
  CONSTRAINT check_paid_amount CHECK (initial_paid_amount >= 0 AND initial_paid_amount <= total_amount),
  CONSTRAINT check_settlement_paid CHECK (
    (settlement_mode != 'paid') OR (initial_paid_amount = total_amount AND initial_account_id IS NOT NULL)
  ),
  CONSTRAINT check_settlement_credit CHECK (
    (settlement_mode != 'credit') OR (initial_paid_amount = 0 AND party_id IS NOT NULL)
  ),
  CONSTRAINT check_settlement_partial CHECK (
    (settlement_mode != 'partial') OR (initial_paid_amount > 0 AND initial_paid_amount < total_amount AND initial_account_id IS NOT NULL AND party_id IS NOT NULL)
  )
);

ALTER TABLE public.operations ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.operations TO authenticated;

-- Lecture : admin voit tout, user voit ses opérations (pour simplifier la V1)
CREATE POLICY "Admins can read all operations" ON public.operations FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );
CREATE POLICY "Users can read own operations" ON public.operations FOR SELECT
  USING (created_by = auth.uid());

-- Création : tout le monde
CREATE POLICY "Users can insert operations" ON public.operations FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Modification/Suppression logique : admin ou créateur
CREATE POLICY "Users can update own operations" ON public.operations FOR UPDATE
  USING (created_by = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP TRIGGER IF EXISTS set_operations_updated_at ON public.operations;
CREATE TRIGGER set_operations_updated_at
  BEFORE UPDATE ON public.operations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. Table payments
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_id uuid REFERENCES public.operations(id) NOT NULL,
  account_id uuid REFERENCES public.accounts(id) NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  payment_date date NOT NULL DEFAULT current_date,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deleted')),
  created_by uuid REFERENCES public.profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_by uuid REFERENCES public.profiles(id),
  deleted_at timestamptz
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.payments TO authenticated;

CREATE POLICY "Admins can read all payments" ON public.payments FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
CREATE POLICY "Users can read own payments" ON public.payments FOR SELECT USING (created_by = auth.uid());
CREATE POLICY "Users can insert payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own payments" ON public.payments FOR UPDATE
  USING (created_by = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP TRIGGER IF EXISTS set_payments_updated_at ON public.payments;
CREATE TRIGGER set_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
