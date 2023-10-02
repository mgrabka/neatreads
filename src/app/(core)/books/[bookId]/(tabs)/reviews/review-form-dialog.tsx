"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs"
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

const placeholderText = `What did you think of this book?`

const FormSchema = z.object({
  review: z
    .string()
    .min(10, {
      message: "Review must be at least 10 characters.",
    })
    .max(160, {
      message: "Review must not be longer than 30 characters.",
    }),
})

const ReviewFormDialog = ({
  isDisabled,
  user,
  bookId,
}: {
  isDisabled: boolean
  user: User | null
  bookId: string
}) => {
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (user == null) {
      return
    }

    const fetchRatingIdResponse = await supabase
      .from("ratings")
      .select("id")
      .eq("user_id", user.id)
      .eq("book_id", bookId)
      .single()

    const submitReviewResponse = await supabase.from("reviews").upsert(
      {
        rating_id: fetchRatingIdResponse.data?.id,
        body: data.review,
      },
      { onConflict: "rating_id" }
    )
    setIsDialogOpen(false)
    if (submitReviewResponse.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: submitReviewResponse.error.message,
      })
    }
    if (submitReviewResponse.data || submitReviewResponse.status === 201) {
      router.refresh()
      toast({
        title: "Review submitted!",
        description: "Thanks for contributing to the community.",
      })
    }
  }
  return (
    <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={isDisabled}>
          <p className="px-5">Write a review</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <DialogHeader>
                <DialogTitle className={cn("text-2xl", fontHeader.className)}>
                  Add a review
                </DialogTitle>
              </DialogHeader>
              <FormField
                control={form.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder={placeholderText}
                        className="h-[150px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit">Add a review</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default ReviewFormDialog
