import { Book } from "@/types"
import { load } from "cheerio"

import BookDescription from "../../book-description"

const apiKey = process.env.GOOGLE_BOOKS_API_KEY

const parseHTMLDescription = (description: string) => {
  const $ = load(description)
  $("br").replaceWith("\n")
  return $.text() as string
}
const DescriptionPage = async ({ params }: { params: { bookId: string } }) => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${params.bookId}?key=${apiKey}`,
    { cache: "force-cache" }
  )

  const book: Book = await response.json()

  const description = book.volumeInfo.description
    ? parseHTMLDescription(book.volumeInfo.description)
    : null

  return description ? (
    <BookDescription description={description} />
  ) : (
    <div className="relative flex w-full items-center justify-center text-base text-muted-foreground">
      <p>There is no description</p>
    </div>
  )
}

export default DescriptionPage
