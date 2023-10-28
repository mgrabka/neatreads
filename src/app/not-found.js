import Image from "next/image"
import Link from "next/link"
import { Home } from "lucide-react"
import NotFoundImage from "public/assets/404.svg"

import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import CoreLayout from "./(core)/layout"

export default function NotFound() {
  return (
    <CoreLayout>
      <section className="grid h-full max-w-[980px] items-center gap-6">
        <div className="flex h-full flex-col items-start gap-8">
          <div className="flex flex-col gap-2">
            <h1
              className={cn(
                "text-3xl font-extrabold leading-tight tracking-tight md:text-4xl",
                fontHeader.className
              )}
            >
              Oops! <br className="hidden sm:inline" />
              there&apos;s nothing here.
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              We can&apos;t seem to find the page you&apos;re looking for.
            </p>
          </div>
          <Link href="/" className={cn(buttonVariants("default"), "px-5")}>
            <Home size={16} className="mr-2" />
            Return Home
          </Link>
          <Image
            className="w-full select-none"
            src={NotFoundImage}
            alt="404"
            width={500}
            height={500}
          />
        </div>
      </section>
    </CoreLayout>
  )
}
