"use client"

import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { LogOut } from "lucide-react"

import { Database } from "@/types/database"

const SignOutButton = () => {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      return console.log(error)
    }
    router.refresh()
  }
  return (
    <button className="flex items-center" onClick={handleSignOut}>
      <LogOut className="mr-2 h-4 w-4" /> Sign Out
    </button>
  )
}

export default SignOutButton
