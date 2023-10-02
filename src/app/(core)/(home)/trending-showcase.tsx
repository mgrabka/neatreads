import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { Database } from "@/types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

const apiKey = process.env.GOOGLE_BOOKS_API_KEY

const TrendingShowcase = async () => {
  const fetchBookDetails = async (book: any) => {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${book.book_id}?key=${apiKey}`,
      { cache: "force-cache" }
    )
    const bookData = await response.json()
    return {
      ...book,
      details: bookData,
    }
  }

  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: trendingBooks }: any = await supabase.rpc(
    "get_trending_books" as never
  )

  if (!trendingBooks) return null

  const booksWithDetails = await Promise.all(
    trendingBooks.map(fetchBookDetails)
  )

  return (
    <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
      {booksWithDetails.map((book) => (
        <div
          key={book.book_id}
          className="mx-auto overflow-hidden rounded-md border bg-white hover:shadow-lg"
        >
          <Link href={`/books/${book.book_id}`}>
            <Image
              className="h-[183px] w-[119px] object-cover"
              width={119}
              height={183}
              src={`https://books.google.com/books/publisher/content/images/frontcover/${book.book_id}?fife=w288-h444&source=gbs_api`}
              alt={book.details.volumeInfo.title}
            />
          </Link>
        </div>
      ))}

      {Array(6 - booksWithDetails.length)
        .fill(null)
        .map((_, idx) => (
          <div
            key={`placeholder-${idx}`}
            className="mx-auto overflow-hidden rounded-md border bg-white"
          >
            <div className="h-[183px] w-[119px] rounded bg-gray-300"></div>
          </div>
        ))}
    </div>
  )
}
export default TrendingShowcase
