import { useState } from "react"
import Link from "next/link"
import { UserProfile } from "@/types"
import Avatar from "boring-avatars"
import { MoveLeft, MoveRight } from "lucide-react"
import { useMediaQuery } from "react-responsive"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

const UserResults = ({ users }: { users: UserProfile[] }) => {
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1024px)" })
  const isMediumScreen = useMediaQuery({
    query: "(min-width: 640px) and (max-width: 1023px)",
  })

  let displayLimit
  if (isDesktopOrLaptop) {
    displayLimit = 8
  } else if (isMediumScreen) {
    displayLimit = 6
  } else {
    displayLimit = 4
  }

  const [isExpanded, setIsExpanded] = useState(false)
  const showMoreButton = users.length > displayLimit && !isExpanded
  const usersToDisplay = isExpanded
    ? users
    : users.slice(0, displayLimit - (showMoreButton ? 1 : 0))

  return (
    <div>
      <ul
        className={`flex flex-wrap justify-start gap-1 overflow-x-auto whitespace-nowrap`}
      >
        {usersToDisplay.map((user) => (
          <li key={user.user_id} className="w-[100px]">
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

        {showMoreButton && (
          <li className="w-[100px]">
            <Button
              onClick={() => setIsExpanded(true)}
              variant="ghost"
              className="flex h-[140px] w-[100px] flex-col items-center justify-start text-muted-foreground hover:text-primary"
            >
              <div className="flex h-[64px] items-center justify-center">
                <MoveRight size={32} />
              </div>
              <p className="mt-4">More...</p>
            </Button>
          </li>
        )}
        {isExpanded && (
          <li className="w-[100px]">
            <Button
              onClick={() => setIsExpanded(false)}
              variant="ghost"
              className="flex h-[140px] w-[100px] flex-col items-center justify-start text-muted-foreground hover:text-primary"
            >
              <div className="flex h-[64px] items-center justify-center">
                <MoveLeft size={32} />
              </div>
              <p className="mt-4">Less...</p>
            </Button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default UserResults
