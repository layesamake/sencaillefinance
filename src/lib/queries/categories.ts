import { createClient } from "@/lib/supabase/server";
import type { Category, OperationType } from "@/types/database";

/**
 * Récupère les catégories, optionnellement filtrées par type.
 */
export async function getCategories(type?: OperationType): Promise<Category[]> {
  const supabase = await createClient();

  let query = supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (type) {
    query = query.eq("operation_type", type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getCategories] Erreur:", error);
    return [];
  }

  return data as Category[];
}

/**
 * Récupère uniquement les catégories actives, filtrées par type.
 */
export async function getActiveCategories(type?: OperationType): Promise<Category[]> {
  const supabase = await createClient();

  let query = supabase
    .from("categories")
    .select("*")
    .eq("status", "active")
    .order("name", { ascending: true });

  if (type) {
    query = query.eq("operation_type", type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getActiveCategories] Erreur:", error);
    return [];
  }

  return data as Category[];
}

/**
 * Récupère une catégorie par son ID.
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[getCategoryById] Erreur:", error);
    return null;
  }

  return data as Category;
}

/**
 * Cherche des catégories dont le nom ressemble à une chaîne donnée.
 * Utilisé pour la détection de doublons.
 */
export async function findSimilarCategories(
  name: string,
  type: OperationType
): Promise<Category[]> {
  const supabase = await createClient();

  // Recherche par inclusion (case-insensitive)
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("operation_type", type)
    .ilike("name", `%${name}%`);

  if (error) {
    console.error("[findSimilarCategories] Erreur:", error);
    return [];
  }

  return data as Category[];
}
