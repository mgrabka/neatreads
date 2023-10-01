"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Review, UserProfile, readingStatus } from "@/types"
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs"
import Avatar from "boring-avatars"

import { fetchReviews } from "@/lib/books"
import { fetchUserRating } from "@/lib/books/fetch-user-rating"
import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import ReviewFormDialog from "./review-form-dialog"

const ReactStars = dynamic(() => import("react-stars"), {
  ssr: false,
})

const ReviewsPage = ({ params }: { params: { bookId: string } }) => {
  const supabase = createClientComponentClient()
  const [reviews, setReviews] = useState<Review[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [readingStatus, setReadingStatus] = useState<readingStatus | null>(null)
  const [rating, setRating] = useState<number>(0)

  useEffect(() => {
    const getReviews = async () => {
      const reviews = await fetchReviews(supabase, params.bookId)
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

      const fetchRatingResponse = await fetchUserRating(params.bookId)

      if (fetchRatingResponse) {
        setRating(fetchRatingResponse.rating)
      }

      const fetchReadingStatusResponse = await supabase
        .from("reading_statuses")
        .select("status")
        .eq("book_id", params.bookId)
        .eq("user_id", session.user.id)

      if (
        !fetchReadingStatusResponse.data ||
        fetchReadingStatusResponse.data.length === 0
      ) {
        return
      }

      setReadingStatus(fetchReadingStatusResponse.data[0].status)
    }
    getReviews()
  }, [params.bookId, supabase])

  const handleSubmitRating = async (newRating: number) => {
    if (!user) {
      return
    }
    if (readingStatus != "Read") {
      setReadingStatus("Read")
      return await supabase
        .from("reading_statuses")
        .upsert(
          { book_id: params.bookId, user_id: user.id, status: "Read" },
          { onConflict: "book_id, user_id" }
        )
    }
    if (newRating == rating) {
      setRating(0)
      return await supabase
        .from("ratings")
        .delete()
        .eq("book_id", params.bookId)
        .eq("user_id", user.id)
    }

    setRating(newRating)
    return await supabase
      .from("ratings")
      .upsert(
        { book_id: params.bookId, user_id: user.id, rating: newRating },
        { onConflict: "book_id, user_id" }
      )
  }

  return (
    <div className="mt-4 flex flex-col gap-8 sm:flex-row sm:gap-4">
      <div className="mr-5 mt-6 flex w-full flex-col gap-8 border-black sm:w-[400px]">
        <div className="shrink-0">
          <Avatar
            size={30}
            name={user?.id ?? undefined}
            variant="beam"
            colors={["#320139", "#331B3B", "#333E50", "#5C6E6E", "#F1DEBD"]}
          />
        </div>
        <div className="flex flex-col gap-6">
          <h1 className={cn("text-xl font-semibold", fontHeader.className)}>
            Let everyone know what you think!
          </h1>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-muted-foreground">
              Your rating
            </p>
            <ReactStars
              count={5}
              value={rating ?? 0}
              size={24}
              color1="#D1D5DB"
              color2="#FBBF24"
              edit={true}
              onChange={(newRating) => handleSubmitRating(newRating)}
            />
          </div>
          <ReviewFormDialog user={user} bookId={params.bookId} />
        </div>
      </div>
      <div className="flex w-full flex-col gap-4">
        <ul>
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => {
              const matchingUser = users.find(
                (user) => user.user_id === review.user_id
              )
              const username = matchingUser?.username
              return (
                <li key={review.id}>
                  <div className="my-6 flex w-full">
                    <div className="shrink-0">
                      <Link href={`/user/${username}`}>
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
                      </Link>
                    </div>
                    <div className="ml-8 flex grow flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline">
                          <Link href={`/user/${username}`}>
                            <h1 className="font-semibold">{username}</h1>
                          </Link>
                          <div className="ml-2 min-w-[90px]">
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString(
                                "en-GB",
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
              )
            })
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
