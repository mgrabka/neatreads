"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { AlertCircle } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"

type FormData = z.infer<typeof changeUsernameValidationSchema>
const changeUsernameValidationSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required.")
    .min(3, "Username must be at least 3 characters.")
    .max(25, "Username must be at most 25 characters."),
})

const ChangeUsernameForm = () => {
  const [currentUsername, setCurrentUsername] = useState("")
  const [userId, setUserId] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(changeUsernameValidationSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  useEffect(() => {
    const fetchUsername = async () => {
      const fetchUserResponse = await supabase.auth.getUser()

      if (fetchUserResponse.error) {
        return console.error(fetchUserResponse.error)
      }

      const fetchUsernameResponse = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", fetchUserResponse.data.user.id)
        .single()

      if (fetchUsernameResponse.error) {
        return console.error(fetchUsernameResponse.error)
      }
      setUserId(fetchUserResponse.data.user.id)
      setCurrentUsername(fetchUsernameResponse.data.username)
    }

    fetchUsername()
  }, [supabase])

  const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("updated_at")
      .eq("user_id", userId)
      .single()

    if (error) {
      return setError("username", {
        message: "Unable to fetch profile details.",
      })
    }

    const lastUpdated = new Date(data.updated_at)
    const currentDate = new Date()
    const differenceInDays =
      (currentDate.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)

    if (differenceInDays < 30) {
      return setError("username", {
        message: "You can only change your username once every 30 days.",
      })
    }

    const updateResponse = await supabase
      .from("profiles")
      .update({ username: formData.username })
      .eq("user_id", userId)

    if (updateResponse.error) {
      if (updateResponse.error.message.includes("unique constraint")) {
        return setError("username", { message: "Username already taken" })
      }
      return setError("username", { message: updateResponse.error.message })
    } else {
      setCurrentUsername(formData.username)
      toast({
        title: "Username updated successfully!",
        description: "Your username has been updated successfully!",
      })
    }
    router.refresh()
    return reset()
  }

  return (
    <div>
      <Label className="text-muted-foreground" htmlFor="username">
        Username
      </Label>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="relative flex gap-4">
          <div className="relative w-full">
            <Input
              id="Username"
              placeholder={currentUsername}
              type="username"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isSubmitting}
              {...register("username")}
              className={`${
                errors.username ? "border border-red-500 pr-10" : ""
              }`}
            />
            {errors.username && (
              <div className="-translate-y-2/5 absolute right-3 top-1/4 text-red-500">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertCircle size={18} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{errors.username.message}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
          <Button type="submit">Change</Button>
        </div>
      </form>
      <p className="mt-2 text-sm text-muted-foreground">
        Note: Your username can be changed once every 30 days.
      </p>
    </div>
  )
}

export default ChangeUsernameForm
