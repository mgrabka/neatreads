"use client"

import { useParams, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Trash2 } from "lucide-react"

import { deleteCollectionById } from "@/lib/users"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useToast } from "./ui/use-toast"

const RemoveBookFromCollectionDialog = ({
  collectionId,
  bookId,
}: {
  collectionId: number
  bookId: string
}) => {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()
  const onContinue = async () => {
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
      title: "Success!",
      description: "Book has been successfully removed from your collection.",
    })
    return router.refresh()
  }
  return (
    <div className="flex items-center">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="text-muted-foreground hover:text-primary">
            <Trash2 size={24} />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this book from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onContinue}>
              Remove book
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default RemoveBookFromCollectionDialog
