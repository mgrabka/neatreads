import { SupabaseClient } from "@supabase/auth-helpers-nextjs"

export const fetchReviews = async (
  supabase: SupabaseClient,
  bookId: string,
  page: number
) => {
  const offset = (page - 1) * 10

  const { data, error } = await supabase.rpc("get_sorted_reviews", {
    book_id_param: bookId,
    offset_param: offset,
  })

  if (error) {
    console.error("Failed to fetch sorted reviews:", error)
  }

  return data
}

export const fetchReviewsCount = async (
  supabase: SupabaseClient,
  bookId: string
) => {
  const { count } = await supabase
    .from("ratings")
    .select("*", { count: "exact", head: true })
    .eq("book_id", bookId)

  return count || 0
}
export const fetchSpecificReview = async (
  supabase: SupabaseClient,
  userId: string,
  bookId: string
) => {
  const { data: rating } = await supabase
    .from("ratings")
    .select("*")
    .eq("book_id", bookId)
    .eq("user_id", userId)
    .single()

  const { data: review } = await supabase
    .from("reviews")
    .select("*")
    .eq("rating_id", rating?.id)
    .single()

  return review
}

export const fetchLike = async (
  supabase: SupabaseClient,
  userId: string,
  reviewId: number
) => {
  return await supabase
    .from("reviews_likes")
    .select("*")
    .eq("user_id", userId)
    .eq("review_id", reviewId)
}

export const fetchLikeCount = async (
  supabase: SupabaseClient,
  reviewId: number
) => {
  const { count } = await supabase
    .from("reviews_likes")
    .select("*", { count: "exact", head: true })
    .eq("review_id", reviewId)

  return count || 0
}

export const addLike = async (
  supabase: SupabaseClient,
  userId: string,
  reviewId: number
) => {
  return await supabase
    .from("reviews_likes")
    .insert([{ user_id: userId, review_id: reviewId }])
}

export const removeLike = async (
  supabase: SupabaseClient,
  userId: string,
  reviewId: number
) => {
  return await supabase
    .from("reviews_likes")
    .delete()
    .eq("user_id", userId)
    .eq("review_id", reviewId)
}
