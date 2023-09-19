import type { Metadata } from "next"
import Image from "next/image"
import { Book } from "@/types"

import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import BookManagement from "@/components/book-management"
import BookStars from "@/components/book-stars"

const apiKey = process.env.GOOGLE_BOOKS_API_KEY

const fetchBook = async (bookId: string) => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`,
    { cache: "force-cache" }
  )

  if (!response.ok) {
    throw new Error(`Code: ` + response.status)
  }

  return response.json()
}

export async function generateMetadata({
  params,
}: {
  params: { bookId: string }
}): Promise<Metadata> {
  const book: Book = await fetchBook(params.bookId)
  return {
    title:
      book.volumeInfo.title +
      " by " +
      (book.volumeInfo.authors
        ? book.volumeInfo.authors.join(", ")
        : "Unknown Author"),
  }
}

const BookLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { bookId: string }
}) => {
  const book: Book = await fetchBook(params.bookId)
  return (
    <section className="flex flex-col gap-8">
      <section className="flex flex-col gap-12 md:flex-row">
        <div className="flex flex-col justify-center">
          <div className=" h-[305px] w-[198px] overflow-hidden rounded-md border bg-white md:min-h-[305px] md:min-w-[198px]">
            <Image
              className="h-full w-full object-cover"
              width={198}
              height={305}
              src={`https://books.google.com/books/publisher/content/images/frontcover/${params.bookId}?fife=w288-h444&source=gbs_api`}
              alt={book.volumeInfo.title}
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-8">
          <div className="flex h-[305px] flex-col justify-between">
            <div>
              <p className="font-medium text-muted-foreground">
                by{" "}
                {book.volumeInfo.authors
                  ? book.volumeInfo.authors.map((author, idx, arr) => (
                      <span key={author}>
                        <a
                          href={`/browse?q=inauthor:${author}`}
                          className="hover:text-primary hover:underline hover:underline-offset-2"
                        >
                          {author}
                        </a>
                        {idx !== arr.length - 1 && ", "}
                      </span>
                    ))
                  : "Unknown Authors"}
              </p>
              <h1
                className={cn(
                  "line-clamp-4 py-0.5 text-2xl font-bold leading-loose tracking-tighter md:text-4xl",
                  fontHeader.className
                )}
              >
                {book.volumeInfo.title}
              </h1>
              <BookStars bookId={book.id} />
            </div>
            <div className="w-full">
              <BookManagement book={book} />
            </div>
          </div>
        </div>
      </section>
      <section>{children}</section>
    </section>
  )
}

export default BookLayout
