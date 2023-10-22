import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Book } from "@/types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Dot } from "lucide-react"

import { Database } from "@/types/database"
import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import BookStars from "@/components/book-stars"
import DeleteCollectionDialog from "@/components/delete-collection-dialog"
import EditCollectionDialog from "@/components/edit-collection-dialog"
import GivenStars from "@/components/given-stars"
import NavigationBackButton from "@/components/navigation-back-button"
import RemoveBookFromCollectionDialog from "@/components/remove-book-from-collection-dialog"

const CollectionPage = async ({
  params,
}: {
  params: { username: string; collectionName: string }
}) => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const collectionName = decodeURIComponent(params.collectionName)
  const username = params.username
  const fetchUserIdResponse = await supabase
    .from("profiles")
    .select("user_id")
    .eq("username", username)
    .single()
  const {
    data: { user: visitor },
  } = await supabase.auth.getUser()
  if (!fetchUserIdResponse.data) {
    return notFound()
  }

  const isOwn = visitor
    ? fetchUserIdResponse.data.user_id === visitor.id
    : false

  let collection

  type collectionId = null | number
  let collectionId: collectionId = null

  if (
    collectionName == "Want to Read" ||
    collectionName == "Currently Reading" ||
    collectionName == "Read"
  ) {
    const fetchDefaultCollectionResponse = await supabase
      .from("reading_statuses")
      .select("book_id")
      .eq("user_id", fetchUserIdResponse.data.user_id)
      .eq("status", collectionName)

    if (!fetchDefaultCollectionResponse.data) {
      return notFound()
    }

    collection = fetchDefaultCollectionResponse.data
  } else {
    const fetchCollectionNameResponse = await supabase
      .from("collections")
      .select("*")
      .eq("name", collectionName)
      .eq("user_id", fetchUserIdResponse.data.user_id)
      .single()
    if (!fetchCollectionNameResponse.data) {
      return notFound()
    }
    collectionId = fetchCollectionNameResponse.data.id
    const fetchBooksInCollectionResponse = await supabase
      .from("collections_content")
      .select("book_id")
      .eq("collection_id", fetchCollectionNameResponse.data.id)

    collection = fetchBooksInCollectionResponse.data
  }
  collection = await fetchDetailsForCollection(collection)

  return (
    <div>
      <NavigationBackButton />
      <div className="flex items-center">
        <div className={cn("my-8 text-4xl", fontHeader.className)}>
          {collectionName}
        </div>
        {isOwn && collectionId ? (
          <div className="ml-3 flex gap-4">
            <EditCollectionDialog collectionId={collectionId} />
            <DeleteCollectionDialog collectionId={collectionId} />
          </div>
        ) : null}
        <Dot className="mx-2" size={24} />
        <div className="text-muted-foreground">
          <Link className=" hover:underline" href={`/user/${username}`}>
            {username}
          </Link>
          &apos;s collection
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {collection && collection.length > 0 ? (
          collection.map((book: Book) => (
            <div key={book.id} className="flex flex-row gap-4">
              <div className="h-[183px] w-[119px] shrink-0 overflow-hidden rounded-md border bg-white hover:shadow-lg">
                <Link href={`/books/${book.id}`}>
                  <Image
                    className="h-[183px] w-[119px] object-cover"
                    width={119}
                    height={183}
                    src={`https://books.google.com/books/publisher/content/images/frontcover/${book.id}?fife=w288-h444&source=gbs_api`}
                    alt={book.id}
                  />
                </Link>
              </div>

              <div className="flex h-[183px] min-w-0 flex-1 flex-col justify-between p-4 ">
                <div className="flex flex-col gap-2">
                  <div>
                    <Link href={`/books/${book.id}`}>
                      <p
                        className={cn(
                          "line-clamp-1 truncate text-lg font-semibold",
                          fontHeader.className
                        )}
                      >
                        {book.volumeInfo.title}
                      </p>
                    </Link>
                    <p className="line-clamp-1 truncate text-sm font-medium text-muted-foreground">
                      by{" "}
                      {book.volumeInfo.authors
                        ? book.volumeInfo.authors.map((author, idx, arr) => (
                            <span key={author}>
                              {author}
                              {idx !== arr.length - 1 && ", "}
                            </span>
                          ))
                        : "Unknown Authors"}
                    </p>
                  </div>
                  <GivenStars bookId={book.id} />
                </div>
                {isOwn && collectionId ? (
                  <RemoveBookFromCollectionDialog
                    bookId={book.id}
                    collectionId={collectionId}
                  />
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">
            there&apos;s nothing here yet :)
          </p>
        )}
      </div>
    </div>
  )
}

const apiKey = process.env.GOOGLE_BOOKS_API_KEY

const fetchBook = async (bookId: string): Promise<Book> => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`,
    { cache: "force-cache" }
  )

  if (!response.ok) {
    throw new Error(`Code: ` + response.status)
  }

  const bookData = await response.json()

  return bookData
}

const fetchDetailsForCollection = async (
  collection: any[] | undefined | null
): Promise<Book[]> => {
  if (collection == null) {
    return []
  }
  const bookPromises = collection.map((book) => fetchBook(book.book_id))
  return await Promise.all(bookPromises)
}

export default CollectionPage
