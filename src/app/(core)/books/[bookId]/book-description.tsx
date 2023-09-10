"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

const BookDescription = ({
  descriptionArray,
}: {
  descriptionArray: string[]
}) => {
  const [showFull, setShowFull] = useState(false)

  const toggleFullDescription = () => {
    setShowFull(!showFull)
  }

  const displayedDescription = showFull
    ? descriptionArray
    : descriptionArray.slice(0, 4)

  return (
    <div>
      <div
        className={cn(
          "relative max-w-[700px]",
          showFull
            ? "text-muted-foreground"
            : "bg-gradient-to-b from-muted-foreground bg-clip-text text-transparent"
        )}
      >
        <p className=" whitespace-pre-wrap text-justify text-sm">
          <span className="font-semibold">{displayedDescription[0]}</span>
          {"\n"}
          {displayedDescription.slice(1).join("\n")}
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
