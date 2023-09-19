"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Review, UserProfile } from "@/types"
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs"
import Avatar from "boring-avatars"

import { fetchReviews } from "@/lib/books"
import { Separator } from "@/components/ui/separator"

import ReviewForm from "./review-form"

const ReactStars = dynamic(() => import("react-stars"), {
  ssr: false,
})

const ReviewsPage = ({ params }: { params: { bookId: string } }) => {
  const supabase = createClientComponentClient()
  const [reviews, setReviews] = useState<Review[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [user, setUser] = useState<User | null>(null)

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
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        return
      }

      setUser(session.user)
    }
    getReviews()
  }, [params.bookId, supabase])

  return (
    <div>
      <div className="flex gap-8">
        <div className="shrink-0">
          <Avatar
            size={30}
            name={user?.id ?? undefined}
            variant="beam"
            colors={["#320139", "#331B3B", "#333E50", "#5C6E6E", "#F1DEBD"]}
          />
        </div>
        <ReviewForm bookId={params.bookId} />
      </div>
      <div className="flex w-full flex-col gap-4">
        <ul>
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <li key={review.id}>
                <div className="my-6 flex w-full">
                  <div className="shrink-0">
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
                  </div>
                  <div className="ml-8 flex grow flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline">
                        <h1 className="font-semibold">
                          {
                            users.filter(
                              (user) => user.user_id === review.user_id
                            )[0]?.username
                          }
                        </h1>
                        <div className="ml-2 min-w-[90px]">
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
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
                    <p className="mt-2 text-justify">{review.body}</p>
                  </div>
                </div>

                <Separator />
              </li>
            ))
          ) : (
            <div className="relative flex w-full items-center justify-center text-base text-muted-foreground">
              <p>There are no reviews yet</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}
export default ReviewsPage
