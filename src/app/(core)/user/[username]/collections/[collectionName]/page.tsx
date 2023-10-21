import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Dot } from "lucide-react"

import { Database } from "@/types/database"
import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import DeleteCollectionDialog from "@/components/delete-collection-dialog"
import EditCollectionDialog from "@/components/edit-collection-dialog"
import NavigationBackButton from "@/components/navigation-back-button"

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
      <div className="flex flex-wrap gap-4">
        {collection && collection.length > 0 ? (
          collection.map((book) => (
            <div
              key={book.book_id}
              className="h-[183px] w-[119px]  overflow-hidden rounded-md border bg-white hover:shadow-lg"
            >
              <Link href={`/books/${book.book_id}`}>
                <Image
                  className="h-[183px] w-[119px] object-cover"
                  width={119}
                  height={183}
                  src={`https://books.google.com/books/publisher/content/images/frontcover/${book.book_id}?fife=w288-h444&source=gbs_api`}
                  alt={book.book_id}
                />
              </Link>
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

export default CollectionPage
