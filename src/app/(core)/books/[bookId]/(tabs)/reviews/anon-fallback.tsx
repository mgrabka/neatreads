import Link from "next/link"

import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AnonFallback = () => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className={cn("text-xl font-semibold", fontHeader.className)}>
        Let everyone know what you think!
      </h1>
      <Link href="/auth/sign-up" className={buttonVariants({ size: "sm" })}>
        Sign up
      </Link>
    </div>
  )
}

export default AnonFallback
