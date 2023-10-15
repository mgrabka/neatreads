"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { LogOut } from "lucide-react"

import { Database } from "@/types/database"

const SignOutButton = () => {
  const supabase = createClientComponentClient<Database>()
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      return console.log(error)
    }
    location.reload()
  }
  return (
    <button className="flex h-full w-full items-center" onClick={handleSignOut}>
      <LogOut className="mr-2 h-4 w-4" /> Sign Out
    </button>
  )
}

export default SignOutButton
