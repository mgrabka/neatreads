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

type FormData = z.infer<typeof changePasswordValidationSchema>
const changePasswordValidationSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),
})

const ChangePasswordForm = () => {
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(changePasswordValidationSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
    await supabase.auth.updateUser({ password: formData.password })
    toast({
      title: "Password changed",
      description: "Your password has been changed.",
    })
    return reset()
  }

  return (
    <div>
      <Label className="text-muted-foreground" htmlFor="username">
        Change your password
      </Label>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="relative flex gap-4">
          <div className="relative w-full">
            <Input
              id="password"
              placeholder="New password"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              disabled={isSubmitting}
              {...register("password")}
              className={`${
                errors.password ? "border border-red-500 pr-10" : ""
              }`}
            />
            {errors.password && (
              <div className="-translate-y-2/5 absolute right-3 top-1/4 text-red-500">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertCircle size={18} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{errors.password.message}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
          <Button type="submit">Change</Button>
        </div>
      </form>
    </div>
  )
}

export default ChangePasswordForm
