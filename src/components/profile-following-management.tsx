"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { UserMinus2, UserPlus2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

const ProfileFollowingManagement = ({
  visitorId,
  profiledUserId,
}: {
  visitorId: string | undefined
  profiledUserId: string
}) => {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const getFollowStatus = async () => {
      const fetchFollowStatusResponse = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", visitorId)
        .eq("followed_id", profiledUserId)

      if (
        fetchFollowStatusResponse.data &&
        fetchFollowStatusResponse.data.length > 0
      ) {
        setIsFollowing(true)
      }
    }
    getFollowStatus()
  })

  const unfollow = async () => {
    const unfollowResponse = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", visitorId)
      .eq("followed_id", profiledUserId)

    if (unfollowResponse.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Couldn't unfollow this user.",
      })
    }
    if (unfollowResponse.data || unfollowResponse.status === 204) {
      setIsFollowing(false)
      router.refresh()
      toast({
        title: "Unfollowed!",
        description: "You are no longer following this user.",
      })
    }
  }

  const follow = async () => {
    const followResponse = await supabase
      .from("follows")
      .insert([{ follower_id: visitorId, followed_id: profiledUserId }])
    if (followResponse.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Couldn't follow this user.",
      })
    }
    if (followResponse.data || followResponse.status === 201) {
      setIsFollowing(true)
      router.refresh()
      toast({
        title: "Followed!",
        description: "You are now following this user.",
      })
    }
  }

  const handleFollow = async () => {
    if (visitorId == undefined) {
      return router.push("/auth/sign-up")
    }

    const followStatusResponse = await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", visitorId)
      .eq("followed_id", profiledUserId)

    if (followStatusResponse.data && followStatusResponse.data.length > 0) {
      return unfollow()
    }

    return follow()
  }
  return (
    <div>
      <Button
        variant={!isFollowing ? "default" : "secondary"}
        className="px-5"
        onClick={handleFollow}
      >
        {!isFollowing ? (
          <div className="flex items-center">
            <UserPlus2 size={16} className="mr-2" />
            Follow
          </div>
        ) : (
          <div className="flex items-center">
            <UserMinus2 size={16} className="mr-2" />
            Unfollow
          </div>
        )}
      </Button>
    </div>
  )
}

export default ProfileFollowingManagement
