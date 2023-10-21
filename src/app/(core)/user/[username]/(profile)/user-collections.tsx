import Link from "next/link"
import { UserProfile } from "@/types"
import { SupabaseClient } from "@supabase/supabase-js"
import { PlusCircle } from "lucide-react"

import {
  fetchBookCountsByCollectionId,
  fetchReadingStatusCounts,
} from "@/lib/users"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"

import NewCollectionDialog from "../../../../../components/new-collection-dialog"

interface readingStatusCounts {
  want_to_read: number
  currently_reading: number
  read: number
}
const UserCollections = async ({
  user,
  isOwn,
  supabase,
}: {
  user: UserProfile
  isOwn: boolean
  supabase: SupabaseClient
}) => {
  const readingStatusCounts = (await fetchReadingStatusCounts(
    user.user_id,
    supabase
  )) as readingStatusCounts
  const customCollections = await supabase
    .from("collections")
    .select("*")
    .eq("user_id", user.user_id)

  const collectionsCountDict = await fetchBookCountsByCollectionId(
    user.user_id,
    supabase
  )
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
        href={`/user/${user.username}/collections/Want to Read`}
      >
        Wants To Read
        <Badge variant="secondary">{readingStatusCounts.want_to_read}</Badge>
      </Link>
      <Link
        className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
        href={`/user/${user.username}/collections/Currently Reading`}
      >
        Currently Reading
        <Badge variant="secondary">
          {readingStatusCounts.currently_reading}
        </Badge>
      </Link>
      <Link
        className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
        href={`/user/${user.username}/collections/Read`}
      >
        Read <Badge variant="secondary">{readingStatusCounts.read}</Badge>
      </Link>
      {customCollections.data && customCollections.data.length > 0
        ? customCollections.data.map((collection) => (
            <Link
              className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
              href={`/user/${user.username}/collections/${collection.name}`}
            >
              {collection.name}{" "}
              <Badge variant="secondary">
                {collectionsCountDict[collection.id]}
              </Badge>
            </Link>
          ))
        : null}
      {isOwn ? <NewCollectionDialog /> : null}
    </div>
  )
}

export default UserCollections
