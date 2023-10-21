"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, MoveLeft } from "lucide-react"

import { Button } from "./ui/button"

const NavigationBackButton = () => {
  const router = useRouter()
  return (
    <Button
      onClick={() => router.back()}
      variant="outline"
      className="flex h-[40px] w-[40px] rounded-3xl p-0 text-muted-foreground hover:text-primary"
    >
      <ChevronLeft size={16} />
      {/* <MoveLeft size={16} /> */}
    </Button>
  )
}

export default NavigationBackButton
