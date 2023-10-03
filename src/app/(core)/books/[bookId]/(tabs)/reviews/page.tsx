"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Review, UserProfile, readingStatus } from "@/types"
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs"
import Avatar from "boring-avatars"
import { Heart } from "lucide-react"

import {
  addLike,
  deleteSpecificRating,
  fetchLike,
  fetchLikeCount,
  fetchReviews,
  fetchSpecificRating,
  removeLike,
  upsertRating,
} from "@/lib/books"
import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

import AnonFallback from "./anon-fallback"
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
  const [isReviewDisabled, setIsReviewDisabled] = useState<boolean>(true)

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
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return
      }

      setUser(user)

      const fetchRatingResponse = await fetchSpecificRating(
        supabase,
        user.id,
        params.bookId
      )

      if (fetchRatingResponse) {
        setRating(fetchRatingResponse.rating)
        setIsReviewDisabled(false)
      }

      const fetchReadingStatusResponse = await supabase
        .from("reading_statuses")
        .select("status")
        .eq("book_id", params.bookId)
        .eq("user_id", user.id)

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
      const deleteRatingResponse = await deleteSpecificRating(
        supabase,
        user.id,
        params.bookId
      )
      if (!deleteRatingResponse.error) {
        setRating(0)
        setIsReviewDisabled(true)
        return
      }
    }

    const upsertRatingResponse = await upsertRating(
      supabase,
      user.id,
      params.bookId,
      newRating
    )
    if (!upsertRatingResponse.error) {
      setRating(newRating)
      setIsReviewDisabled(false)
      return
    }
    console.log(upsertRatingResponse.error)
    return
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
        {user ? (
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
            <ReviewFormDialog
              isDisabled={isReviewDisabled}
              user={user}
              bookId={params.bookId}
            />
          </div>
        ) : (
          <AnonFallback />
        )}
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
                  <Comment username={username} review={review} />
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

const Comment = ({ username, review }: any) => {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<User | null>(null)
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [likeCount, setLikeCount] = useState<number>(0)
  const router = useRouter()
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return
      }

      setUser(user)

      const fetchLikeResponse = await fetchLike(supabase, user.id, review.id)
      if (fetchLikeResponse.data && fetchLikeResponse.data.length > 0) {
        setIsLiked(true)
      } else {
        setIsLiked(false)
      }
      const count = await fetchLikeCount(supabase, review.id)

      setLikeCount(count)
    }

    fetchData()
  }, [supabase, review])

  const handleLike = async (review: Review) => {
    if (!user) {
      return router.push("/auth/sign-up")
    }
    const fetchLikeResponse = await fetchLike(supabase, user.id, review.id)
    if (fetchLikeResponse.data && fetchLikeResponse.data.length > 0) {
      removeLike(supabase, user.id, review.id)
      setIsLiked(false)
      setLikeCount(likeCount - 1)
    } else {
      addLike(supabase, user.id, review.id)
      setIsLiked(true)
      setLikeCount(likeCount + 1)
    }
  }

  return (
    <div className="my-6 flex w-full">
      <div className="shrink-0">
        <Link href={`/user/${username}`}>
          <Avatar
            size={30}
            name={review.user_id}
            variant="beam"
            colors={["#320139", "#331B3B", "#333E50", "#5C6E6E", "#F1DEBD"]}
          />
        </Link>
      </div>
      <div className="ml-6 flex grow flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline">
            <Link href={`/user/${username}`}>
              <h1 className="font-semibold">{username}</h1>
            </Link>
            <div className="ml-2 min-w-[90px]">
              <p className="text-sm text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
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
        <div className="mt-5 flex flex-row">
          <button onClick={() => handleLike(review)}>
            <Heart
              className={cn(
                isLiked
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-primary"
              )}
              size={18}
            />
          </button>
          <p className="ml-2 text-sm text-muted-foreground">{likeCount}</p>
        </div>
      </div>
    </div>
  )
}
export default ReviewsPage
