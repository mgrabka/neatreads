"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { PenSquare } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { fontHeader } from "@/lib/fonts"
import { fetchReadBooksCountForCurrentYear } from "@/lib/users"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

import { useToast } from "./ui/use-toast"

const ReadingGoal = () => {
  const supabase = createClientComponentClient()
  const [progress, setProgress] = useState(0)
  const [goal, setGoal] = useState(0)
  useEffect(() => {
    const getReadingGoal = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return
      }
      const readingGoal = await supabase
        .from("reading_goals")
        .select("*")
        .eq("user_id", user.id)
        .eq("year", new Date().getFullYear())
        .single()

      if (readingGoal.error) {
        return
      }
      setGoal(readingGoal.data.goal)
      const readBooks = await fetchReadBooksCountForCurrentYear(
        user.id,
        supabase
      )
      setProgress(readBooks)
    }
    getReadingGoal()
  }, [supabase])

  return (
    <div className="rounded-xl border-4 border-primary-foreground p-5">
      <div className="grid gap-2">
        <div className="flex items-end justify-between">
          <h1
            className={cn(
              "text-2xl font-semibold tracking-tight",
              fontHeader.className
            )}
          >
            {new Date().getFullYear()} Reading Goal
          </h1>
          <p className="flex items-center gap-2 text-muted-foreground">
            {progress} out of {goal} books{" "}
            <EditReadingGoalDialog goal={goal} setGoal={setGoal} />
          </p>
        </div>
        <Progress
          value={progress / goal <= 1 ? (progress / goal) * 100 : 100}
          className="red w-full"
        />
      </div>
    </div>
  )
}

type FormData = z.infer<typeof readingGoalValidationSchema>
const readingGoalValidationSchema = z.object({
  readingGoal: z.coerce.number().min(1).max(100),
})

const EditReadingGoalDialog = ({
  goal,
  setGoal,
}: {
  goal: number
  setGoal: any
}) => {
  const supabase = createClientComponentClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(readingGoalValidationSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  const onSubmit = async (formData: FormData) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return router.push("/auth/sign-up")
    }

    const { data: _, error } = await supabase
      .from("reading_goals")
      .update({ goal: formData.readingGoal })
      .eq("user_id", user.id)
      .eq("year", new Date().getFullYear())
    if (error) {
      return toast({
        title: "Error updating reading goal",
        description: error.message,
      })
    }
    setIsDialogOpen(false)
    toast({
      title: "Reading goal updated!",
      description: `You have set your reading goal to ${formData.readingGoal}.`,
    })
    setGoal(formData.readingGoal)
    return reset()
  }
  return (
    <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
      <DialogTrigger asChild>
        <button>
          <PenSquare size={16} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit reading goal</DialogTitle>
          <DialogDescription>
            Set the reading goal for this year.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reading_goal" className="text-right">
                No. of books
              </Label>
              <Input
                type="number"
                id="reading_goal"
                placeholder={goal.toString()}
                className="col-span-3"
                {...register("readingGoal")}
              />
            </div>
          </div>
          {errors.readingGoal && (
            <span className="test-sm text-red-500">
              {errors.readingGoal.message}
            </span>
          )}
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default ReadingGoal
