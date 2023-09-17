"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { fetchReviews } from "@/lib/books"
import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const TabsLayout = ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { bookId: string }
}) => {
  const [reviewsCount, setReviewsCount] = useState(0)
  const route = usePathname()
  const selectedTabClassname =
    "text-primary border-b-2 border-offset-2 border-black"

  useEffect(() => {
    const getReviewsCount = async () => {
      const reviews = await fetchReviews(params.bookId)
      if (reviews) {
        setReviewsCount(reviews.length)
      }
    }

    getReviewsCount()
  }, [params.bookId])

  return (
    <div className="flex flex-col gap-4 pt-5">
      <div>
        <div
          className={cn(
            "flex gap-10 px-3 font-medium text-muted-foreground",
            fontHeader.className
          )}
        >
          <Link
            className={cn(
              "pb-3 hover:text-primary",
              route == `/books/${params.bookId}` && selectedTabClassname
            )}
            href={`/books/${params.bookId}`}
          >
            Description
          </Link>
          <Link
            className={cn(
              "pb-3 hover:text-primary",
              route == `/books/${params.bookId}/reviews` && selectedTabClassname
            )}
            href={`/books/${params.bookId}/reviews`}
          >
            Reviews <Badge variant="secondary">{reviewsCount}</Badge>
          </Link>
          <Link
            className={cn(
              "pb-3 hover:text-primary",
              route == `/books/${params.bookId}/details` && selectedTabClassname
            )}
            href={`/books/${params.bookId}/details`}
          >
            Details
          </Link>
        </div>
        <Separator />
      </div>
      {children}
    </div>
  )
}

export default TabsLayout
