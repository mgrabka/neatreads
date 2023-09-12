"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

const BookDescription = ({ description }: { description: string }) => {
  const [showFull, setShowFull] = useState(false)
  const [shouldBeExpandable, setShouldBeExpandable] = useState(false)

  const toggleFullDescription = () => {
    setShowFull(!showFull)
  }
  useEffect(() => {
    if (description.length > 500) {
      setShouldBeExpandable(true)
    }
  }, [description])
  return (
    <div>
      <div
        className={cn(
          "relative w-full",
          showFull || !shouldBeExpandable
            ? "text-muted-foreground"
            : "line-clamp-[7] overflow-hidden bg-gradient-to-b from-muted-foreground bg-clip-text text-transparent"
        )}
      >
        <p className=" whitespace-pre-wrap text-justify text-sm">
          {description}
        </p>
      </div>
      {shouldBeExpandable ? (
        <button
          className="text-sm font-semibold text-muted-foreground"
          onClick={toggleFullDescription}
        >
          {showFull ? "Show Less" : "Show More"}
        </button>
      ) : null}
    </div>
  )
}

export default BookDescription