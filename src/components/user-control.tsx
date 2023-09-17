import { cookies } from "next/headers"
import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import Avatar from "boring-avatars"
import { Library, LogOut, Settings, UserSquare2, Users2 } from "lucide-react"

import { Database } from "@/types/database"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button, buttonVariants } from "./ui/button"
import SignOutButton from "./ui/sign-out-button"

const UserControl = async () => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-end space-x-4">
        <nav className="flex items-center space-x-1">
          <Link
            href="/auth/sign-in"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Sign in
          </Link>
          <Link href="/auth/sign-up" className={buttonVariants({ size: "sm" })}>
            Sign up
          </Link>
        </nav>
      </div>
    )
  }

  const profileResponse = await supabase
    .from("profiles")
    .select("username")
    .eq("user_id", user.id)

  const username = profileResponse.data![0].username //it should always exist, as it's created on sign up and is the base for all of the social features

  return (
    <div className="flex flex-1 items-center justify-end space-x-4">
      <nav className="flex items-center gap-6">
        <Link
          href={`/user/${username}/library`}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "text-muted-foreground"
          )}
        >
          <Library className="mr-2 h-6 w-6" />
          Library
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="hover:grayscale">
            <Avatar
              size={40}
              name={user.id}
              variant="beam"
              colors={["#320139", "#331B3B", "#333E50", "#5C6E6E", "#F1DEBD"]}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-2 w-screen sm:mr-10 sm:w-56">
            <DropdownMenuLabel className="flex flex-row gap-2">
              <Avatar
                size={20}
                name={user.id}
                variant="beam"
                colors={["#320139", "#331B3B", "#333E50", "#5C6E6E", "#F1DEBD"]}
              />
              {username}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/user/${username}/profile`}>
                <UserSquare2 className="mr-2 h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/user/${username}/library`}>
                <Library className="mr-2 h-4 w-4" />
                Library
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users2 className="mr-2 h-4 w-4" />
              Friends
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/user/settings`}>
                <Settings className="mr-2 h-4 w-4" /> Account settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  )
}

export default UserControl
