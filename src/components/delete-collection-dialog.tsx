"use client"

import { useRouter } from "next/navigation"
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

const DeleteCollectionDialog = ({ collectionId }: { collectionId: number }) => {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const onContinue = async () => {
    await deleteCollectionById(collectionId, supabase)
    return router.push("/")
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onContinue}>
              Delete collection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DeleteCollectionDialog
