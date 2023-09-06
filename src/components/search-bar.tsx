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
    <div className="flex items-center space-x-2">
      <Input
        type="search"
        placeholder="Search books..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="md:w-[300px] lg:w-[600px]"
      />
      <Button type="button" onClick={handleSearch}>
        <Search size={16} />
      </Button>
    </div>
  )
}

export default SearchBar
