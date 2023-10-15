"use client"

import { useRouter } from "next/navigation"
import { MoveLeft } from "lucide-react"

const NavigationBackButton = () => {
  const router = useRouter()
  return (
    <button
      className="flex w-[120px] items-center space-x-2 text-sm text-muted-foreground hover:text-primary "
      onClick={() => router.back()}
    >
      <MoveLeft className="h-4 w-4" />
      <span>go back</span>
    </button>
  )
}

export default NavigationBackButton
