"use client"

import ReactStars from "react-stars"

const BookRatings = ({
  bookAvgRating,
  bookRatingsCount,
}: {
  bookAvgRating: number
  bookRatingsCount: number
}) => {
  return (
    <div className="flex items-center space-x-2">
      <ReactStars
        count={5}
        value={bookAvgRating}
        size={18}
        color1="#D1D5DB"
        color2="#FBBF24"
        edit={false}
      />
      <div className="text-muted-foreground">
        <p>
          {bookAvgRating ? bookAvgRating.toFixed(1) : 0} /{" "}
          {bookRatingsCount ? bookRatingsCount : 0} ratings
        </p>
      </div>
    </div>
  )
}

export default BookRatings
