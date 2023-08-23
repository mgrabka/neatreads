import Link from "next/link"

import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SignUpForm } from "@/app/auth/sign-up/form"

export default function SignUpPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-2 text-center">
        <h1
          className={cn(
            "text-2xl font-semibold tracking-tight",
            fontHeader.className
          )}
        >
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter credentials below to create your account
        </p>
      </div>
      <SignUpForm />
      <p className="px-8 text-center text-xs text-muted-foreground">
        By creating an account you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account? {""}
        <Link
          href="/auth/sign-in"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
