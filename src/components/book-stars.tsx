"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { fetchRatings, getAvgRating } from "@/lib/books"

const ReactStars = dynamic(() => import("react-stars"), {
  ssr: false,
})

const BookStars = ({
  bookId,
  isInBrowse = false,
}: {
  bookId: string
  isInBrowse?: boolean
}) => {
  const [bookAvgRating, setBookAvgRating] = useState(0)
  const [bookRatingsCount, setBookRatingsCount] = useState(0)
  const supabase = createClientComponentClient()
  useEffect(() => {
    const fetchRatingsData = async () => {
      const ratings = await fetchRatings(supabase, bookId)
      if (ratings == null) {
        return setBookAvgRating(0), setBookRatingsCount(0)
      }
      const avgRating = getAvgRating(ratings)
      setBookAvgRating(avgRating)
      setBookRatingsCount(ratings.length)
    }
    fetchRatingsData()
  }, [bookId, supabase])

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
      {isInBrowse ? (
        <></>
      ) : (
        <div className="ml-1 text-muted-foreground">
          <p>
            {bookAvgRating ? bookAvgRating.toFixed(1) : 0} / {bookRatingsCount}{" "}
            ratings
          </p>
        </div>
      )}
    </div>
  )
}

export default BookStars
