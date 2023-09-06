"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"

const SearchBar = () => {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const handleSearch = () => {
    router.push(`/browse?q=${query}`)
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch()
    }
  }
  return (
    <div>
      <Input
        type="search"
        placeholder="Search books..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="md:w-[300px] lg:w-[600px]"
      />
    </div>
  )
}

export default SearchBar
