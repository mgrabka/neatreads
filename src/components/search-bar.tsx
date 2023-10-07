"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

const SearchBar = ({ initialQuery }: { initialQuery?: string }) => {
  const [query, setQuery] = useState(initialQuery || "")

  useEffect(() => {
    setQuery(initialQuery ?? "")
  }, [initialQuery])

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
    <div className="relative flex w-full items-center">
      <Input
        type="search"
        placeholder="Search books or users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full rounded-lg pr-10"
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
