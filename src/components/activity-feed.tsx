import { cookies } from "next/headers"
import Link from "next/link"
import { Database } from "@/types"
import {
  User,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs"

import ActivityItem from "./activity-item"

interface ActivityFeedProps {
  user: User
  shouldListFollowed?: boolean
}
const ActivityFeed = async ({
  user,
  shouldListFollowed = false,
}: ActivityFeedProps) => {
  const supabase = createServerComponentClient<Database>({ cookies })
  let trackedUsers = [user.id]

  if (shouldListFollowed) {
    const { data } = await supabase
      .from("follows")
      .select("followed_id")
      .eq("follower_id", user.id)

    const followedIds = data?.map((follow) => follow.followed_id) || []
    trackedUsers = followedIds
  }
  const { data: trackedProfiles } = await supabase
    .from("profiles")
    .select("username, user_id")
    .in("user_id", trackedUsers)

  const { data: otherActivities } = await supabase
    .from("activities")
    .select("*")
    .in("user_id", trackedUsers)
    .not("did_what", "eq", "followed")
    .order("created_at", { ascending: false })
    .limit(20)

  const { data: followedActivities } = await supabase
    .from("activities")
    .select("*")
    .eq("did_what", "followed")
    .eq("did_to_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  const combinedActivities = [
    ...(otherActivities || []),
    ...(followedActivities || []),
  ]

  const activities = combinedActivities.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="mt-2 w-full p-2">
      <ul>
        {activities && activities.length > 0 ? (
          activities?.map((activity) => (
            <ActivityItem
              activity={activity}
              trackedProfiles={trackedProfiles}
            />
          ))
        ) : (
          <p className="mt-6 flex justify-center text-muted-foreground">
            No activity yet
          </p>
        )}
      </ul>
    </div>
  )
}
export default ActivityFeed
