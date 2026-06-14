import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = 'etiennesamake@gmail.com';
  console.log(`Bascule de l'utilisateur ${email} vers le rôle admin...`);
  
  // Get the user by email from Auth
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError) {
    console.error("Erreur listUsers:", usersError.message);
    return;
  }
  
  const user = usersData.users.find(u => u.email === email);
  if (!user) {
    console.log("Utilisateur non trouvé avec cet email.");
    return;
  }
  
  // Update the profiles table
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', user.id);
    
  if (updateError) {
    console.error("Erreur lors de la mise à jour du rôle:", updateError.message);
  } else {
    console.log("Succès ! L'utilisateur est maintenant administrateur.");
  }
}

run();
