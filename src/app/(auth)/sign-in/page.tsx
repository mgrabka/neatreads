import Link from "next/link"

import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SignInForm } from "@/app/(auth)/sign-in/sign-in-form"

export default function SignInPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-2 text-center">
        <h1
          className={cn(
            "text-2xl font-semibold tracking-tight",
            fontHeader.className
          )}
        >
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to sign in
        </p>
      </div>
      <SignInForm />
      <p className=" text-center text-sm text-muted-foreground">
        Don&apos;t have an account? {""}
        <Link
          href="/sign-up"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
