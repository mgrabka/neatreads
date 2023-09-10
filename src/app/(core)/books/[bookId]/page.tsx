import type { Metadata } from "next"
import Image from "next/image"
import { Book } from "@/types"

export async function generateMetadata({
  params,
}: {
  params: { bookId: string }
}): Promise<Metadata> {
  const book: Book = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${params.bookId}`
  )
    .then((res) => res.json())
    .catch((error) => {
      console.error(error)
    })

  return {
    title: book.volumeInfo.title + " by " + book.volumeInfo.authors.join(", "),
  }
}
const BookPage = async ({ params }: { params: { bookId: string } }) => {
  const book: Book = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${params.bookId}`
  )
    .then((res) => res.json())
    .catch((error) => {
      console.error(error)
    })
  return (
    <section className="grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="h-[444px] w-[288px] overflow-hidden rounded-3xl bg-white shadow-lg ">
        <Image
          className=" h-full w-full object-cover"
          width={444}
          height={288}
          src={`https://books.google.com/books/publisher/content/images/frontcover/${params.bookId}?fife=w288-h444&source=gbs_api`}
          alt={book.volumeInfo?.title}
        />
      </div>
      Book {book.volumeInfo?.title}
    </section>
  )
}

export default BookPage
