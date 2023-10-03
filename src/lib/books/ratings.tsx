import { SupabaseClient } from "@supabase/auth-helpers-nextjs"

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

export const upsertRating = async (
  supabase: SupabaseClient,
  userId: string,
  bookId: string,
  rating: number
) => {
  const upsertRatingResponse = await supabase
    .from("ratings")
    .upsert(
      { book_id: bookId, user_id: userId, rating },
      { onConflict: "book_id, user_id" }
    )

  return upsertRatingResponse
}

export const deleteSpecificRating = async (
  supabase: SupabaseClient,
  userId: string,
  bookId: string
) => {
  const deleteRatingResponse = await supabase
    .from("ratings")
    .delete()
    .eq("book_id", bookId)
    .eq("user_id", userId)

  return deleteRatingResponse
}
