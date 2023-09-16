interface Rating {
  rating: number
}

const getAvgRating = (ratings: Rating[]) => {
  const total = ratings.reduce(
    (acc, currentRatingObj) => acc + currentRatingObj.rating,
    0
  )
  return total / ratings.length
}

export default getAvgRating
