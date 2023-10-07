import Link from "next/link"
import { UserProfile } from "@/types"
import Avatar from "boring-avatars"
import { MoveRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

const UserResults = ({ users }: { users: UserProfile[] }) => {
  console.log(users.length)
  return (
    <div>
      <ul className="flex justify-start gap-1">
        {users.slice(0, users.length > 8 ? 7 : 8).map((user) => (
          <li key={user.user_id}>
            <Link
              href={`/user/${user.username}`}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "flex h-[140px] w-[100px] flex-col items-center justify-start"
              )}
            >
              <Avatar
                size={64}
                name={user.user_id}
                variant="beam"
                colors={["#320139", "#331B3B", "#333E50", "#5C6E6E", "#F1DEBD"]}
              />
              <p className="mt-4 break-all">{user.username}</p>
            </Link>
          </li>
        ))}
        {users.length > 8 && (
          <li>
            <Button
              onClick={() => console.log("clicked")}
              variant="ghost"
              className="flex h-[140px] w-[100px]  flex-col items-center justify-start text-muted-foreground hover:text-primary"
            >
              <div className="flex h-[64px] items-center justify-center">
                <MoveRight size={32} />
              </div>
              <p className="mt-4">More...</p>
            </Button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default UserResults
