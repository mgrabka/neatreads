import { SupabaseClient } from "@supabase/auth-helpers-nextjs"

export const searchUsers = async (
  supabase: SupabaseClient,
  username: string,
  limit: number
) => {
  const { data, error } = await supabase.rpc("search_users", {
    search_username: username,
    result_limit: limit,
  })

  if (error) {
    console.error("Error fetching data:", error)
    return []
  }

  return data
}
