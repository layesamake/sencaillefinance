// Types pour la base de données SENCAILLE Finance

export type OperationType = "income" | "expense";
export type CategoryStatus = "active" | "inactive";
export type ProfileRole = "admin" | "user";
export type ProfileStatus = "active" | "disabled";

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
