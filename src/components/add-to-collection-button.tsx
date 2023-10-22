"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Check, PlusCircle } from "lucide-react"

import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import NewCollectionDialog from "./new-collection-dialog"
import { Button } from "./ui/button"
import { useToast } from "./ui/use-toast"

const AddToCollectionButton = ({ bookId }: { bookId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [refetch, setRefetch] = useState(false)
  const [bookInCollections, setBookInCollections] = useState<
    Record<number, boolean>
  >({})

  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [collections, setCollections] = useState<any>([])
  const router = useRouter()
  useEffect(() => {
    const fetchCollections = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        return
      }

      const collections = await supabase
        .from("collections")
        .select("*")
        .eq("user_id", user.id)

      if (collections.data) {
        const collectionIds = collections.data.map((c: any) => c.id)

        const { data: booksInCollections } = await supabase
          .from("collections_content")
          .select("collection_id")
          .in("collection_id", collectionIds)
          .eq("book_id", bookId)

        const bookPresenceData: Record<number, boolean> = {}
        collectionIds.forEach((id) => {
          bookPresenceData[id] = !!booksInCollections?.find(
            (b) => b.collection_id === id
          )
        })

        setBookInCollections(bookPresenceData)
        setCollections(collections)
      }
    }
    fetchCollections()
  }, [supabase, refetch, bookId])
  const handleAddToCollection = async (collectionId: number) => {
    const { data: user } = await supabase.auth.getUser()
    if (!user) {
      return router.push("/auth/sign-up")
    }

    const isAdded = bookInCollections[collectionId]

    if (isAdded) {
      // If the book is already added, remove it
      const { error } = await supabase
        .from("collections_content")
        .delete()
        .eq("collection_id", collectionId)
        .eq("book_id", bookId)

      if (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Couldn't remove book from collection.",
        })
        return
      }
      toast({
        title: "Removed!",
        description: "Book removed from collection.",
      })
    } else {
      // If the book is not added, add it
      const { error } = await supabase
        .from("collections_content")
        .insert([{ collection_id: collectionId, book_id: bookId }])

      if (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Couldn't add book to collection.",
        })
        return
      }
      toast({
        title: "Added!",
        description: "Book added to collection.",
      })
    }
    setRefetch((prev) => !prev) // Toggle refetch to refresh collections and presence data
  }
  return (
    <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 text-muted-foreground">
          <PlusCircle size={16} />
          Add to collection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className={cn("text-2xl", fontHeader.className)}>
            Add to collection
          </DialogTitle>
        </DialogHeader>
        <NewCollectionDialog setRefetch={setRefetch} />
        <ul className="flex flex-col gap-4">
          {collections.data && collections.data.length > 0
            ? collections.data.map((collection: any) => {
                const isAdded = bookInCollections[collection.id]
                return (
                  <li className="flex w-full" key={collection.id}>
                    <Button
                      onClick={() => handleAddToCollection(collection.id)}
                      variant="outline"
                      className="flex w-full justify-start gap-2"
                    >
                      {isAdded ? <Check size={16} /> : null} {collection.name}
                    </Button>
                  </li>
                )
              })
            : null}
        </ul>
        <Button onClick={() => setIsDialogOpen(false)}>Done</Button>
      </DialogContent>
    </Dialog>
  )
}

export default AddToCollectionButton
