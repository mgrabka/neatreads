"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Review, UserProfile } from "@/types"
import Avatar from "boring-avatars"

import { fetchReviews } from "@/lib/books"
import supabase from "@/lib/supabase"
import { Separator } from "@/components/ui/separator"

const ReactStars = dynamic(() => import("react-stars"), {
  ssr: false,
})

const ReviewsPage = ({ params }: { params: { bookId: string } }) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])

  useEffect(() => {
    const getReviews = async () => {
      const reviews = await fetchReviews(params.bookId)
      setReviews(reviews ?? [])
      if (reviews && reviews.length > 0) {
        const usersResponse = await supabase
          .from("profiles")
          .select("id, user_id, username")
        setUsers(usersResponse.data ?? [])
      }
    }
    getReviews()
  }, [params.bookId])

  return (
    <div className="flex flex-col gap-4">
      <ul>
        {reviews && reviews.length > 0
          ? reviews.map((review) => (
              <li key={review.id}>
                <div className="row my-6 flex justify-between">
                  <div className="row flex gap-8">
                    <Avatar
                      size={30}
                      name={review.user_id}
                      variant="beam"
                      colors={[
                        "#320139",
                        "#331B3B",
                        "#333E50",
                        "#5C6E6E",
                        "#F1DEBD",
                      ]}
                    />
                    <div className="flex flex-col">
                      <h1 className="font-semibold">
                        {
                          users.filter(
                            (user) => user.user_id === review.user_id
                          )[0]?.username
                        }
                      </h1>
                      <p>{review.body}</p>
                    </div>
                  </div>
                  <div>
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={18}
                      color1="#D1D5DB"
                      color2="#FBBF24"
                      edit={false}
                    />
                  </div>
                </div>
                <Separator />
              </li>
            ))
          : "No reviews yet"}
      </ul>
    </div>
  )
}
export default ReviewsPage
