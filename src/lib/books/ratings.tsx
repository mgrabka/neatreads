import {
  SupabaseClient,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs"

export const fetchRatings = async (
  supabase: SupabaseClient,
  bookId: string
) => {
  const fetchResponse = await supabase
    .from("ratings")
    .select("rating")
    .eq("book_id", bookId)

  if (fetchResponse.error) {
    console.log(fetchResponse.error)
  }
  return fetchResponse.data
}

export const fetchSpecificRating = async (
  supabase: SupabaseClient,
  userId: string,
  bookId: string
) => {
  const fetchUserRatingResponse = await supabase
    .from("ratings")
    .select("rating")
    .eq("book_id", bookId)
    .eq("user_id", userId)
    .single()

  return fetchUserRatingResponse.data
}
