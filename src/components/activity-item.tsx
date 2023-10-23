import { cookies } from "next/headers"
import Link from "next/link"
import { getTimeAgo } from "@/lib"
import { Database, UserProfile } from "@/types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import Avatar from "boring-avatars"

import { fetchSpecificReview } from "@/lib/books"
import StarsRating from "@/components/ui/stars-rating"

const apiKey = process.env.GOOGLE_BOOKS_API_KEY

const ActivityItem = async ({ activity }: any) => {
  const cookieStore = cookies()

  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  })
  const { data: originUser } = await supabase
    .from("profiles")
    .select("username, user_id")
    .eq("user_id", activity.user_id)
    .single()
  return (
    <li key={activity.id}>
      <div className="flex w-full justify-between gap-2 py-5">
        <div className="flex">
          <Link href={`/user/${originUser?.username}`}>
            <Avatar
              size={30}
              name={originUser?.user_id ?? undefined}
              variant="beam"
              colors={["#320139", "#331B3B", "#333E50", "#5C6E6E", "#F1DEBD"]}
            />
          </Link>
          <div className="ml-6">
            {activity.did_to_user_id ? (
              <ActionToUserDescription originUser={originUser} />
            ) : (
              /* @ts-expect-error Server Component*/
              <ActionToBookDescription
                originUser={originUser}
                activity={activity}
              />
            )}
          </div>
        </div>
        <span className="text-muted-foreground">
          {getTimeAgo(new Date(activity.created_at))}
        </span>
      </div>
    </li>
  )
}

const ActionToUserDescription = ({ originUser }: any) => {
  return (
    <p>
      <Link href={`/user/${originUser?.username}`} className="font-semibold">
        {originUser?.username}
      </Link>{" "}
      started following you.
    </p>
  )
}

const ActionToBookDescription = async ({ originUser, activity }: any) => {
  const cookieStore = cookies()

  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  })
  const targetBookId = activity.did_to_book_id

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${targetBookId}?key=${apiKey}`,
    { cache: "force-cache" }
  )

  const targetBook = await response.json()

  switch (activity.did_what) {
    case "wants to read":
      return (
        <div className="flex flex-col">
          <p>
            <Link
              href={`/user/${originUser?.username}`}
              className="font-semibold"
            >
              {originUser?.username}
            </Link>{" "}
            wants to read{" "}
            <Link href={`/books/${targetBookId}`} className="font-semibold">
              {targetBook.volumeInfo.title}
            </Link>
            .
          </p>
        </div>
      )
    case "is currently reading":
      return (
        <div className="flex flex-col">
          <p>
            <Link
              href={`/user/${originUser?.username}`}
              className="font-semibold"
            >
              {originUser?.username}
            </Link>{" "}
            started reading{" "}
            <Link href={`/books/${targetBookId}`} className="font-semibold">
              {targetBook.volumeInfo.title}
            </Link>
            .
          </p>
        </div>
      )
    case "read":
      return (
        <div className="flex flex-col">
          <p>
            <Link
              href={`/user/${originUser?.username}`}
              className="font-semibold"
            >
              {originUser?.username}
            </Link>{" "}
            has read{" "}
            <Link href={`/books/${targetBookId}`} className="font-semibold">
              {targetBook.volumeInfo.title}
            </Link>
            .
          </p>
        </div>
      )
    case "rated":
      return (
        <div className="flex flex-col">
          <p>
            <Link
              href={`/user/${originUser?.username}`}
              className="font-semibold"
            >
              {originUser?.username}
            </Link>{" "}
            rated{" "}
            <Link href={`/books/${targetBookId}`} className="font-semibold">
              {targetBook.volumeInfo.title}
            </Link>
          </p>
          <StarsRating rating={activity.rating_value} />
        </div>
      )
    case "reviewed":
      const review = await fetchSpecificReview(
        supabase,
        originUser?.user_id,
        targetBookId
      )
      return (
        <div className="flex grow flex-col">
          <p>
            <Link
              href={`/user/${originUser?.username}`}
              className="font-semibold"
            >
              {originUser?.username}
            </Link>{" "}
            left a review for{" "}
            <Link href={`/books/${targetBookId}`} className="font-semibold">
              {targetBook.volumeInfo.title}
            </Link>
            :
          </p>
          <p className="mt-1 rounded-md bg-gray-100 px-4 py-2">
            {review?.body}
          </p>
        </div>
      )
    default:
      break
  }
}

export default ActivityItem
