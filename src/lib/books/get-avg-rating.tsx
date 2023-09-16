interface Rating {
  rating: number
}

export const getAvgRating = (ratings: Rating[]) => {
  const total = ratings.reduce(
    (acc, currentRatingObj) => acc + currentRatingObj.rating,
    0
  )
  return total / ratings.length
}
