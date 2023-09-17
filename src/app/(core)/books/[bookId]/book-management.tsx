"use client"

import { BookmarkPlus, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

const BookManagement = ({ bookId }: { bookId?: string }) => {
  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button onClick={() => console.log("clicked")} variant="outline">
            <div className="row flex h-5 items-center">
              <BookmarkPlus className="mr-2" /> Add to library
              <Separator className="ml-6 mr-3" orientation="vertical" />
              <ChevronDown size={16} />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent>Place content for the popover here.</PopoverContent>
      </Popover>
    </div>
  )
}

export default BookManagement
