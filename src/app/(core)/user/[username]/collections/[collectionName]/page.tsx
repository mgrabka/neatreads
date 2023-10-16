import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Dot } from "lucide-react"

import { Database } from "@/types/database"
import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
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

  if (!fetchUserIdResponse.data) {
    return notFound()
  }

  let collection

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
    // todo fetch collections
    const fetchCollectionResponse = { data: null }
    if (!fetchCollectionResponse.data) {
      return notFound()
    }
  }
  return (
    <div>
      <NavigationBackButton />
      <div className="flex items-center">
        <div className={cn("my-8 text-4xl", fontHeader.className)}>
          {collectionName}
        </div>
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
