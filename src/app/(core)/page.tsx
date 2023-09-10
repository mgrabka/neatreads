import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"

const HomePage = () => {
  return (
    <section className="grid gap-6">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1
          className={cn(
            "text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl",
            fontHeader.className
          )}
        >
          Beautifully designed components <br className="hidden sm:inline" />
          built with Radix UI and Tailwind CSS.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Accessible and customizable components that you can copy and paste
          into your apps. Free. Open Source. And Next.js 13 Ready.
        </p>
      </div>
    </section>
  )
}

export default HomePage
