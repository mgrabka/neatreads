"use client"

import { useEffect } from "react"
import { RotateCw } from "lucide-react"

import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="grid items-center gap-6">
      <div className="flex max-w-[980px] flex-col items-start gap-8">
        <div className="flex flex-col gap-2">
          <h1
            className={cn(
              "text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl",
              fontHeader.className
            )}
          >
            Oops! <br className="hidden sm:inline" />
            something went wrong.
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            {error.message}
          </p>
        </div>
        <Button onClick={() => reset()}>
          <RotateCw size={16} className="mr-2" />
          Try again
        </Button>
      </div>
    </section>
  )
}
