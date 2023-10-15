import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import Avatar from "boring-avatars"
import { CalendarDays } from "lucide-react"

import { Database } from "@/types/database"
import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import ProfileFollowingManagement from "./profile-following-management"

const ProfilePage = async ({ params }: { params: { username: string } }) => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const fetchUserProfileResponse = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.username)
    .single()

  if (!fetchUserProfileResponse.data) {
    return notFound()
  }

  const profiledUser = fetchUserProfileResponse.data
  const {
    data: { user: visitor },
  } = await supabase.auth.getUser()
  const userJoinedAt = new Date(profiledUser.created_at).toLocaleDateString(
    "en-GB",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  )
  const isOwn = visitor ? profiledUser.user_id === visitor.id : false

  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", profiledUser.user_id)

  const { count: followersCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("followed_id", profiledUser.user_id)
  return (
    <section className="grid gap-8">
      <div className="grid grid-cols-5">
        <div className="col-span-1">
          <Avatar
            size={96}
            name={profiledUser.user_id}
            variant="beam"
            colors={["#320139", "#331B3B", "#333E50", "#5C6E6E", "#F1DEBD"]}
          />
        </div>
        <div className="col-span-3 grid gap-5">
          <div className="grid gap-5">
            <div>
              <h1 className={cn("text-4xl", fontHeader.className)}>
                {profiledUser.username}
              </h1>
              <div></div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays size={16} />
                <p>Joined {userJoinedAt}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-5 ">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{followersCount}</Badge>
              <h1>Followers</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{followingCount}</Badge>
              <h1>Following</h1>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          {!isOwn ? (
            <ProfileFollowingManagement
              visitorId={visitor?.id}
              profiledUserId={profiledUser.user_id}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div>
        <p className={cn(fontHeader.className, "pb-3 text-muted-foreground")}>
          Bookshelves
        </p>
        <Separator />
      </div>
      <div>
        <p className={cn(fontHeader.className, "pb-3 text-muted-foreground")}>
          Activity
        </p>
        <Separator />
      </div>
      <div></div>
    </section>
  )
}

export default ProfilePage
