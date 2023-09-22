import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export const fetchUserRating = async (bookId: string) => {
  const supabase = createClientComponentClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return
  }

  const fetchUserRatingResponse = await supabase
    .from("ratings")
    .select("rating")
    .eq("book_id", bookId)
    .eq("user_id", session.user.id)
    .single()

  return fetchUserRatingResponse.data
}
