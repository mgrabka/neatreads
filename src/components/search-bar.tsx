"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Label } from "./ui/label"

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
    <div className="relative flex items-center">
      <Input
        type="search"
        placeholder="Search books..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-3 pr-10 md:w-[400px]"
      />
      <button
        type="button"
        onClick={handleSearch}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-primary"
      >
        <Search size={16} />
      </button>
    </div>
  )
}

export default SearchBar
