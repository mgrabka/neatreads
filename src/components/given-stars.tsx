"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const ReactStars = dynamic(() => import("react-stars"), {
  ssr: false,
})

const GivenStars = ({ bookId }: { bookId: string }) => {
  const [userRating, setUserRating] = useState(0)
  const supabase = createClientComponentClient()
  const params = useParams()
  const username = params.username

  useEffect(() => {
    const fetchUserRating = async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("username", username)

      if (profiles && profiles.length > 0) {
        const userId = profiles[0].user_id

        const { data: ratings } = await supabase
          .from("ratings")
          .select("rating")
          .eq("book_id", bookId)
          .eq("user_id", userId)

        if (ratings && ratings.length > 0) {
          setUserRating(ratings[0].rating)
        }
      }
    }

    fetchUserRating()
  }, [bookId, supabase, username])

  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
      <ReactStars
        count={5}
        value={userRating}
        size={18}
        color1="#D1D5DB"
        color2="#FBBF24"
        edit={false}
      />
      <span>
        {userRating
          ? `Rated ${userRating} by ${username}`
          : `No rating by ${username}`}
      </span>
    </div>
  )
}

export default GivenStars
