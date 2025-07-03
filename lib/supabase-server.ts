import { createClient } from "@supabase/supabase-js"
import { auth } from "@clerk/nextjs/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!


export async function createServerSupabaseClient() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("User not authenticated")
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // Set the user context for RLS
  await supabase.auth.admin.getUserById(userId)

  return supabase
}
