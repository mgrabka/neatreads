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

export const fetchReadBooksCountForCurrentYear = async (
  userId: string,
  supabase: SupabaseClient
) => {
  const currentYear = new Date().getFullYear()
  const { count, error } = await supabase
    .from("reading_statuses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "Read")
    .filter("updated_at", "gte", `${currentYear}-01-01T00:00:00Z`)
    .filter("updated_at", "lte", `${currentYear}-12-31T23:59:59Z`)

  if (error) {
    console.log(error)
  }
  console.log(count)
  if (count) {
    return count
  }
  return 0
}
