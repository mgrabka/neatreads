"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { AlertCircle, PenSquare } from "lucide-react"
import { useForm } from "react-hook-form"
import z from "zod"

import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"

const placeholderText = "Cool name for your collection"
type FormData = z.infer<typeof collectionNameValidationSchema>
const collectionNameValidationSchema = z.object({
  collectionName: z
    .string()
    .min(3, {
      message: "Collection name must be at least 3 characters.",
    })
    .max(50, {
      message: "Collection name must not be longer than 50 characters.",
    }),
})

const EditCollectionDialog = ({ collectionId }: { collectionId: number }) => {
  const supabase = createClientComponentClient()
  const params = useParams()
  const { toast } = useToast()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(collectionNameValidationSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })
  const onSubmit = async (FormData: FormData) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return
    }
    const { data: _, error } = await supabase
      .from("collections")
      .update([
        {
          name: FormData.collectionName,
        },
      ])
      .eq("id", collectionId)

    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Couldn't edit this collection.",
      })
      return
    }
    toast({
      title: "Collection name changed",
      description: "Your collection's name has been changed.",
    })
    setIsDialogOpen(false)
    reset()
    return router.push(
      `/user/${params.username}/collections/${FormData.collectionName}`
    )
  }
  return (
    <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
      <DialogTrigger asChild>
        <button className="text-muted-foreground hover:text-primary">
          <PenSquare size={24} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className={cn("text-2xl", fontHeader.className)}>
            Edit the collection
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="relative flex gap-4">
            <div className="relative w-full">
              <Input
                id="collectionName"
                placeholder={placeholderText}
                type="text"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                disabled={isSubmitting}
                {...register("collectionName")}
                className={`${
                  errors.collectionName ? "border border-red-500 pr-10" : ""
                }`}
              />
              {errors.collectionName && (
                <div className="-translate-y-2/5 absolute right-3 top-1/4 text-red-500">
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle size={18} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{errors.collectionName.message}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditCollectionDialog
