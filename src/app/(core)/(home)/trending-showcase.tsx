"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Book } from "@/types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"

const TrendingShowcase = () => {
  const [timeFrame, setTimeFrame] = useState("this_week")
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([])
  const supabase = createClientComponentClient()
  useEffect(() => {
    const fetchTrendingBooks = async () => {
      const fetchTrendingBooksResponse = await supabase.rpc(
        "get_trending_books",
        { time_frame: timeFrame }
      )

      const detailedBooks = await Promise.all(
        fetchTrendingBooksResponse.data.map(async (book: any) => {
          const fetchResponse = await fetch(
            `${location.origin}/api/v1/books/get?bookId=${book.book_id}`
          )
          return await fetchResponse.json()
        })
      )
      setTrendingBooks(detailedBooks)
    }

    fetchTrendingBooks()
  }, [timeFrame, supabase])

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1
          className={cn(
            "text-xl font-semibold leading-tight tracking-tight",
            fontHeader.className
          )}
        >
          Trending
        </h1>
        <div className="flex gap-2 text-sm">
          <button
            className={cn(
              "hover:text-primary ",
              timeFrame == "this_week"
                ? "text-primary"
                : "text-muted-foreground"
            )}
            onClick={() => setTimeFrame("this_week")}
          >
            This week
          </button>
          <button
            className={cn(
              "hover:text-primary",
              timeFrame == "this_month"
                ? "text-primary"
                : "text-muted-foreground"
            )}
            onClick={() => setTimeFrame("this_month")}
          >
            This month
          </button>
          <button
            className={cn(
              "hover:text-primary",
              timeFrame == "all_time" ? "text-primary" : "text-muted-foreground"
            )}
            onClick={() => setTimeFrame("all_time")}
          >
            All time
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {trendingBooks.map((book: any) => (
          <div
            key={book?.id}
            className="mx-auto overflow-hidden rounded-md border bg-white hover:shadow-lg"
          >
            <Link href={`/books/${book.id}`}>
              <Image
                className="h-[183px] w-[119px] object-cover"
                width={119}
                height={183}
                src={`https://books.google.com/books/publisher/content/images/frontcover/${book?.id}?fife=w288-h444&source=gbs_api`}
                alt={book.volumeInfo?.title}
              />
            </Link>
          </div>
        ))}

        {Array(6 - trendingBooks.length)
          .fill(null)
          .map((_, idx) => (
            <div
              key={`placeholder-${idx}`}
              className="mx-auto overflow-hidden rounded-md bg-white"
            >
              <div className="h-[183px] w-[119px] rounded bg-primary-foreground"></div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default TrendingShowcase
