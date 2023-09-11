import type { Metadata } from "next"
import Image from "next/image"
import { Book } from "@/types"
import { load } from "cheerio"
import { BookmarkPlus } from "lucide-react"

import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import BookDescription from "./book-description"
import BookRatings from "./book-ratings"

const apiKey = process.env.GOOGLE_BOOKS_API_KEY

export async function generateMetadata({
  params,
}: {
  params: { bookId: string }
}): Promise<Metadata> {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${params.bookId}?key=${apiKey}`
  )

  if (!response.ok) {
    throw new Error(`Couldn't find book with id ${params.bookId}`)
  }

  const book: Book = await response.json()

  return {
    title: book.volumeInfo.title + " by " + book.volumeInfo.authors.join(", "),
  }
}

const parseHTMLDescription = (description: string) => {
  const $ = load(description)
  $("br").replaceWith("\n")
  return $.text().split("\n") as string[]
}

const BookPage = async ({ params }: { params: { bookId: string } }) => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${params.bookId}?key=${apiKey}`
  )

  const book: Book = await response.json()

  const descriptionArray = parseHTMLDescription(book.volumeInfo.description)

  return (
    <section className="flex gap-12">
      <div className="h-[444px] w-[288px] overflow-hidden rounded-3xl bg-white shadow-lg ">
        <Image
          className=" h-full w-full object-cover"
          width={444}
          height={288}
          src={`https://books.google.com/books/publisher/content/images/frontcover/${params.bookId}?fife=w288-h444&source=gbs_api`}
          alt={book.volumeInfo.title}
        />
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="text-muted-foreground">
              by {book.volumeInfo.authors.join(", ")}
            </h1>
            <h1
              className={cn(
                "text-3xl font-bold leading-tight tracking-tighter md:text-4xl",
                fontHeader.className
              )}
            >
              {book.volumeInfo.title}
            </h1>
          </div>
          <BookRatings
            bookAvgRating={book.volumeInfo.averageRating}
            bookRatingsCount={book.volumeInfo.ratingsCount}
          />
        </div>

        <BookDescription descriptionArray={descriptionArray} />
        {/* <Button
          onClick={() => console.log("clicked")}
          size="sm"
          variant="outline"
        >
          <BookmarkPlus className="mr-2" /> Add to library
        </Button> */}
        <div className="space-y-2 text-sm">
          <div className="flex">
            <div className="w-1/4 font-bold">ISBN</div>
            <div className="w-3/4">
              {book.volumeInfo.industryIdentifiers
                ?.map((id) => id.identifier + " (" + id.type + ")")
                .join(", ")}
            </div>
          </div>
          <div className="flex">
            <div className="w-1/4 font-bold">PUBLISHER</div>
            <div className="w-3/4">{book.volumeInfo.publisher}</div>
          </div>
          <div className="flex">
            <div className="w-1/4 font-bold">DATE PUBLISHED</div>
            <div className="w-3/4">{book.volumeInfo.publishedDate}</div>
          </div>
          <div className="flex">
            <div className="w-1/4 font-bold">LANGUAGE</div>
            <div className="w-3/4">{book.volumeInfo.language}</div>
          </div>
          <div className="flex">
            <div className="w-1/4 font-bold">PAGES</div>
            <div className="w-3/4">{book.volumeInfo.pageCount}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookPage
