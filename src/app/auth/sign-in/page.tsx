import Link from "next/link"

import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SignInForm } from "@/app/auth/sign-in/form"

export default function SignInPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-2 text-left">
        <h1
          className={cn(
            "text-2xl font-semibold tracking-tight",
            fontHeader.className
          )}
        >
          Sign in to Neatreads
        </h1>
        <p className="text-sm text-muted-foreground">
          We missed you! Enter your credentials below to sign in
        </p>
      </div>
      <SignInForm />
    </div>
  )
}
