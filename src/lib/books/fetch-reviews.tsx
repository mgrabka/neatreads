import { SupabaseClient } from "@supabase/auth-helpers-nextjs"

export const fetchReviews = async (
  supabase: SupabaseClient,
  bookId: string
) => {
  const fetchRatingsResponse = await supabase
    .from("ratings")
    .select("*")
    .eq("book_id", bookId)

  const ratingsArray =
    fetchRatingsResponse.data?.map((rating) => rating.id) ?? []

  const fetchReviewsResponse = await supabase
    .from("reviews")
    .select("*")
    .in("rating_id", ratingsArray)

  const ratingsMap = fetchRatingsResponse.data?.reduce((acc, rating) => {
    acc[rating.id] = rating
    return acc
  }, {})

  const reviewsArray = fetchReviewsResponse.data?.map((review) => {
    const associatedRating = ratingsMap[review.rating_id]
    return {
      ...review,
      rating: associatedRating.rating,
      user_id: associatedRating.user_id,
    }
  })

  return reviewsArray
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
    .eq("rating_id", rating.id)
    .single()

  return review
}
