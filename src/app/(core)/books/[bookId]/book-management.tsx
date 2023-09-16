"use client"

import { BookmarkPlus } from "lucide-react"

import { Button } from "@/components/ui/button"

const BookManagement = ({ bookId }: { bookId?: string }) => {
  return (
    <div className="mt-5">
      <Button
        onClick={() => console.log("clicked")}
        className="w-full rounded-3xl"
        size="lg"
        variant="outline"
      >
        <BookmarkPlus className="mr-2" /> Add to library
      </Button>
    </div>
  )
}

export default BookManagement
