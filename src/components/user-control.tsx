import { cookies } from "next/headers"
import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/database"

import { buttonVariants } from "./ui/button"
import SignOutButton from "./ui/sign-out-button"

const UserControl = async () => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session) {
    return (
      <div className="flex flex-1 items-center justify-end space-x-4">
        <nav className="flex items-center space-x-1">
          <SignOutButton />
        </nav>
      </div>
    )
  }
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

export default UserControl
