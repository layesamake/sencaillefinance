import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ocnhzcjkhmhsahwkridt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jbmh6Y2praG1oc2Fod2tyaWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MDI3MDcsImV4cCI6MjA5NjE3ODcwN30.5HFhPmGA_CjcIhidKN2O4_sab_yX0cfzB_bKFRR9qpU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from("operations")
    .select(`
      *,
      categories ( name ),
      parties ( name, phone ),
      accounts!operations_initial_account_id_fkey ( name ),
      profiles!operations_created_by_fkey ( full_name )
    `)
    .limit(1);

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Success! Rows:", data.length);
  }
}

test();
