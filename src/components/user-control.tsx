import Link from "next/link"

import { Button, buttonVariants } from "./ui/button"

const UserControl = () => {
  return (
    <div className="flex flex-1 items-center justify-end space-x-4">
      <nav className="flex items-center space-x-1">
        <Link
          href="/sign-in"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          Sign in
        </Link>
        <Link href="/sign-up" className={buttonVariants({ size: "sm" })}>
          Sign up
        </Link>
      </nav>
    </div>
  )
}

export default UserControl
