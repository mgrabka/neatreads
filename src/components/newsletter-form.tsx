"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronRight } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Input } from "./ui/input"
import { useToast } from "./ui/use-toast"

type FormData = z.infer<typeof emailValidationSchema>
const emailValidationSchema = z.object({
  email: z.string().email(),
})

const NewsletterForm = () => {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(emailValidationSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  const handleSubscribe = (formData: FormData) => {
    toast({
      title: "Thank you for signing up!",
      description: `Please check your email to confirm: ${formData.email}`,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleSubscribe)}>
      <div className="flex flex-col gap-2">
        <div className="relative flex w-full">
          <Input
            id="email"
            placeholder="Email address"
            type="email"
            className="w-full rounded-lg pr-10"
            {...register("email")}
          />

          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-primary"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {errors.email && (
          <span className="test-sm text-red-500">This email is invalid.</span>
        )}
      </div>
    </form>
  )
}

export default NewsletterForm
