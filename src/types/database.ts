// Types pour la base de données SENCAILLE Finance

export type OperationType = "income" | "expense";
export type CategoryStatus = "active" | "inactive";
export type ProfileRole = "admin" | "user";
export type ProfileStatus = "active" | "disabled";

// Nouveaux types
export type AccountType = "wave" | "cash" | "bank" | "other";
export type PartyType = "customer" | "supplier" | "both";
export type SettlementMode = "paid" | "credit" | "partial";
export type RecordStatus = "active" | "inactive" | "deleted";

export interface Category {
  id: string;
  name: string;
  operation_type: OperationType;
  status: CategoryStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  phone?: string;
  role: ProfileRole;
  status: ProfileStatus;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  name: string;
  account_type: AccountType;
  opening_balance: number;
  opening_date: string;
  status: RecordStatus;
  created_at: string;
  updated_at: string;
}

export interface Party {
  id: string;
  name: string;
  party_type: PartyType;
  phone?: string | null;
  notes?: string | null;
  status: RecordStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Operation {
  id: string;
  operation_type: OperationType;
  category_id: string;
  party_id?: string | null;
  total_amount: number;
  initial_paid_amount: number;
  settlement_mode: SettlementMode;
  initial_account_id?: string | null;
  operation_date: string;
  description?: string | null;
  status: RecordStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_by?: string | null;
  deleted_at?: string | null;
}

export interface Payment {
  id: string;
  operation_id: string;
  account_id: string;
  amount: number;
  payment_date: string;
  description?: string | null;
  status: RecordStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_by?: string | null;
  deleted_at?: string | null;
}

export interface OperationWithDetails extends Operation {
  categories?: { name: string };
  parties?: { name: string; phone?: string | null };
  accounts?: { name: string };
  profiles?: { full_name: string };
}
