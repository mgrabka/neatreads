import { SupabaseClient } from "@supabase/supabase-js"

export const fetchReadingStatusCounts = async (
  userId: string,
  supabase: SupabaseClient
) => {
  const { data, error } = await supabase
    .rpc("get_reading_status_counts", {
      p_user_id: userId,
    })
    .single()

  if (error) {
    console.error("Error fetching counts:", error)
    return { read: 0, currently_reading: 0, want_to_read: 0 }
  }

  return data
}
