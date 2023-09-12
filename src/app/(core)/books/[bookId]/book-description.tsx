"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

const BookDescription = ({ description }: { description: string }) => {
  const [showFull, setShowFull] = useState(false)

  const toggleFullDescription = () => {
    setShowFull(!showFull)
  }

  return (
    <div>
      <div
        className={cn(
          "relative max-w-[700px]",
          showFull
            ? "text-muted-foreground"
            : "line-clamp-[7] overflow-hidden bg-gradient-to-b from-muted-foreground bg-clip-text text-transparent"
        )}
      >
        <p className=" whitespace-pre-wrap text-justify text-sm">
          {description}
        </p>
      </div>

      <button
        className="text-sm font-semibold text-muted-foreground"
        onClick={toggleFullDescription}
      >
        {showFull ? "Show Less" : "Show More"}
      </button>
    </div>
  )
}

export default BookDescription
