import * as React from "react"
import Link from "next/link"
import { BookOpen } from "lucide-react"

import { siteConfig } from "@/config/site"

import SearchBar from "./search-bar"

const MainNav = () => {
  return (
    <div className="mr-6 flex w-full gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <BookOpen className="h-6 w-6" />
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>
      <div className="grow md:max-w-[500px]">
        <SearchBar />
      </div>
    </div>
  )
}

export default MainNav
