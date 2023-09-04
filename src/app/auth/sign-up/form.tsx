"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { AlertCircle, Loader2 } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import { Database } from "@/types/database"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof formSchema>

const formSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Email is invalid."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),
})
export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })
  const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
    const { data: _, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError("email", { message: error.message })
      setError("password", { message: error.message })
      console.log(error)
      return
    }
    router.push("/")
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-2">
          <div className="grid gap-6">
            <div className="grid gap-4">
              <div>
                <Label className="sr-only" htmlFor="email">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isSubmitting}
                    {...register("email")}
                    className={`${errors.email ? "border-red-500 pr-10" : ""}`}
                  />
                  {errors.email && (
                    <div className="-translate-y-2/5 absolute right-3 top-1/4 text-red-500">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertCircle size={18} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{errors.email.message}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label className="sr-only" htmlFor="password">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect="off"
                    disabled={isSubmitting}
                    {...register("password")}
                    className={`${
                      errors.password ? "border-red-500 pr-10" : ""
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
              </div>
            </div>
            <Button disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create an account
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
