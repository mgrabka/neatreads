import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import SearchBar from "@/components/search-bar"

const AnonHomePage = () => {
  return (
    <section className="relative grid gap-8">
      <div className="z-20 flex max-w-[980px] flex-col items-start gap-2">
        <h1
          className={cn(
            "text-3xl font-semibold leading-tight tracking-tighter md:text-4xl",
            fontHeader.className
          )}
        >
          Discover your next favourite book!
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Connect, review, and dive deep into the world of literary treasures.
        </p>
      </div>
      <div>
        <SearchBar />
      </div>
      <div className="mt-12">
        <h1
          className={cn(
            "text-xl font-semibold leading-tight tracking-tighter",
            fontHeader.className
          )}
        >
          Trending
        </h1>
      </div>
    </section>
  )
}

export default AnonHomePage
