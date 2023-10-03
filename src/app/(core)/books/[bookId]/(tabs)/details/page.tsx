import { Book } from "@/types"

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
const DetailsPage = async ({ params }: { params: { bookId: string } }) => {
  const book: Book = await fetchBook(params.bookId)
  return (
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
  )
}

export default DetailsPage
