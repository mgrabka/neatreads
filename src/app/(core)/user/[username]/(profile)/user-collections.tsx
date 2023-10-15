import Link from "next/link"
import { UserProfile } from "@/types"
import { SupabaseClient } from "@supabase/supabase-js"

import { fetchReadingStatusCounts } from "@/lib/users"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"

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
  const readingStatuses = (await fetchReadingStatusCounts(
    user.user_id,
    supabase
  )) as readingStatusCounts
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
        href={`/user/${user.username}/collections/Want to Read`}
      >
        Wants To Read
        <Badge variant="secondary">{readingStatuses.want_to_read}</Badge>
      </Link>
      <Link
        className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
        href={`/user/${user.username}/collections/Currently Reading`}
      >
        Currently Reading
        <Badge variant="secondary">{readingStatuses.currently_reading}</Badge>
      </Link>
      <Link
        className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
        href={`/user/${user.username}/collections/Read`}
      >
        Read <Badge variant="secondary">{readingStatuses.read}</Badge>
      </Link>
    </div>
  )
}

export default UserCollections
