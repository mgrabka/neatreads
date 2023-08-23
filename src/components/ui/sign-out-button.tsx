"use client"

import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/database"

import { Button } from "./button"

const SignOutButton = () => {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const onClick = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      return console.log(error)
    }
    router.refresh()
  }
  return (
    <Button onClick={onClick} size="sm">
      Sign Out
    </Button>
  )
}

export default SignOutButton
