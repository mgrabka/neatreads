import supabase from "../supabase"

export const fetchReviews = async (bookId: string) => {
  const ratingsResponse = await supabase
    .from("ratings")
    .select("*")
    .eq("book_id", bookId)

  const ratingsArray = ratingsResponse.data?.map((rating) => rating.id) ?? []

  const reviewsResponse = await supabase
    .from("reviews")
    .select("*")
    .in("rating_id", ratingsArray)

  const ratingsMap = ratingsResponse.data?.reduce((acc, rating) => {
    acc[rating.id] = rating
    return acc
  }, {})

  const reviewsArray = reviewsResponse.data?.map((review) => {
    const associatedRating = ratingsMap[review.rating_id]
    return {
      ...review,
      rating: associatedRating.rating,
      user_id: associatedRating.user_id,
    }
  })

  return reviewsArray
}
