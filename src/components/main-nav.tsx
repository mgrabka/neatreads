import * as React from "react"
import Link from "next/link"
import { BookOpen } from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

import SearchBar from "./search-bar"

const username = "maks"

const MainNav = () => {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <BookOpen className="h-6 w-6" />
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>
      <nav className="flex gap-6">
        <Link
          href="/"
          className={cn(
            "flex items-center text-sm font-medium text-muted-foreground"
          )}
        >
          Home
        </Link>
        <Link
          href={`/${username}/library`}
          className={cn(
            "flex items-center text-sm font-medium text-muted-foreground"
          )}
        >
          My library
        </Link>
      </nav>
      <SearchBar />
    </div>
  )
}

export default MainNav
