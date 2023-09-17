"use client"

import { read } from "fs"
import { useEffect, useState } from "react"
import { Book } from "@/types"
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs"
import { BookMarked, BookOpen, Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

type readingStatus = "Want to Read" | "Currently Reading" | "Read"
const handleReadingStatus = (status: string) => {}
// const ManageButton = async ({ book }: { book: Book }) => {
//   const user = await supabase.auth.getUser()
//   console.log(user)
//   if (user) {
//   }
// }

const BookManagement = ({ book }: { book: Book }) => {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<User | null>(null)
  const [readingStatus, setReadingStatus] = useState<readingStatus | null>(null)
  useEffect(() => {
    const getUserAndStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        return
      }

      setUser(session.user)

      const { data } = await supabase
        .from("reading_statuses")
        .select("status")
        .eq("book_id", book.id)
        .eq("user_id", session.user.id)

      if (!data || data.length === 0) {
        return
      }

      setReadingStatus(data[0].status)
    }

    getUserAndStatus()
  }, [book, supabase])

  const handleReadingStatus = async (status: readingStatus) => {
    if (!user) {
      return
    }
    if (status == readingStatus) {
      const { error } = await supabase
        .from("reading_statuses")
        .delete()
        .eq("book_id", book.id)
        .eq("user_id", user.id)

      if (error) {
        console.error(error)
      }

      return setReadingStatus(null)
    }
    setReadingStatus(status)

    const { error } = await supabase
      .from("reading_statuses")
      .upsert(
        { book_id: book.id, user_id: user.id, status },
        { onConflict: "book_id, user_id" }
      )
    if (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex justify-center gap-6 sm:justify-start">
      <div>
        <Button
          onClick={() => handleReadingStatus("Want to Read")}
          className={cn(
            "h-16 w-24 text-muted-foreground",
            readingStatus == "Want to Read" && "border-primary text-primary"
          )}
          variant="outline"
        >
          <BookMarked className="h-6 w-6" />
        </Button>
      </div>
      <div>
        <Button
          onClick={() => handleReadingStatus("Currently Reading")}
          className={cn(
            "h-16 w-24 text-muted-foreground",
            readingStatus == "Currently Reading" &&
              "border-primary text-primary"
          )}
          variant="outline"
        >
          <BookOpen className="h-6 w-6" />
        </Button>
      </div>
      <div>
        <Button
          onClick={() => handleReadingStatus("Read")}
          className={cn(
            "h-16 w-24 text-muted-foreground",
            readingStatus == "Read" && "border-primary text-primary"
          )}
          variant="outline"
        >
          <Check className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

export default BookManagement
