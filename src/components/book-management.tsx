"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Book, readingStatus } from "@/types"
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs"
import { BookMarked, BookOpen, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const activeClass = "bg-accent text-primary"
const BookManagement = ({ book }: { book: Book }) => {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<User | null>(null)
  const [readingStatus, setReadingStatus] = useState<readingStatus | null>(null)
  const router = useRouter()
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
      return router.push("/auth/sign-up")
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
    <div className="flex justify-start gap-6">
      <div>
        <Button
          onClick={() => handleReadingStatus("Want to Read")}
          className={cn(
            "h-16 w-24 text-muted-foreground",
            readingStatus == "Want to Read" && activeClass
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
            readingStatus == "Currently Reading" && activeClass
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
            readingStatus == "Read" && activeClass
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
