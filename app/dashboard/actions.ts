'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addOperation(formData: FormData) {
    const supabase = await createClient()

    // 1. Vérification de l'utilisateur
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { success: false, error: "Vous devez être connecté pour effectuer cette action." }
    }

    // 2. Extraction des données du formulaire
    const operation_type = formData.get('operation_type') as string
    const total_amount_raw = formData.get('total_amount') as string
    const category_id = formData.get('category_id') as string
    const party_id = formData.get('party_id') as string // peut être vide
    const initial_account_id = formData.get('initial_account_id') as string
    const description = formData.get('description') as string

    if (!operation_type || !total_amount_raw || !category_id || !initial_account_id) {
        return { success: false, error: "Veuillez remplir tous les champs obligatoires (Montant, Catégorie, Compte)." }
    }

    const total_amount = parseFloat(total_amount_raw)
    if (isNaN(total_amount) || total_amount <= 0) {
        return { success: false, error: "Le montant doit être un nombre positif." }
    }

    // Préparation de l'objet d'insertion
    const operationData: any = {
        operation_type,
        total_amount,
        category_id,
        initial_account_id,
        created_by: user.id
    }

    // La description est optionnelle
    if (description && description.trim() !== '') {
        operationData.description = description.trim()
    }

    // Le party_id (Tiers) est optionnel
    if (party_id && party_id.trim() !== '') {
        operationData.party_id = party_id
    }

    // 3. Insertion dans la table `operations`
    const { error: insertError } = await supabase
        .from('operations')
        .insert(operationData)

    if (insertError) {
        console.error("Erreur d'insertion d'opération:", insertError)
        return { success: false, error: insertError.message || "Une erreur est survenue lors de l'enregistrement." }
    }

    // 4. Rafraîchissement de la page Dashboard pour mettre à jour les compteurs
    revalidatePath('/dashboard')

    return { success: true }
}
