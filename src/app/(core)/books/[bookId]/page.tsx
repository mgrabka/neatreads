import type { Metadata } from "next"
import Image from "next/image"
import { Book } from "@/types"
import { load } from "cheerio"

import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"

import BookDescription from "./book-description"

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
        <div>
          <h1 className="text-muted-foreground">
            by {book.volumeInfo.authors.join(", ")}
          </h1>
          <h1
            className={cn(
              "text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl",
              fontHeader.className
            )}
          >
            {book.volumeInfo.title}
          </h1>
        </div>
        <BookDescription descriptionArray={descriptionArray} />
      </div>
    </section>
  )
}

export default BookPage
