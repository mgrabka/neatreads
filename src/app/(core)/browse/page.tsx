"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Book, SearchResult } from "@/types"
import { Loader2 } from "lucide-react"
import InfiniteScroll from "react-infinite-scroll-component"

import SearchBar from "@/components/search-bar"

import { BookCard, SkeletonCard } from "./book-card"

type LoadingState = "idle" | "loading" | "loaded" | "error"

const BrowsePage = () => {
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const searchParams = useSearchParams()
  const query = searchParams.get("q")

  const fetchResults = async (currentPage?: number) => {
    const fetchResponse = await fetch(
      `${location.origin}/api/v1/books/list?page=${
        currentPage ?? page
      }&q=${query}`
    )
    const results = await fetchResponse.json()

    setHasMore(results.items.length === 10)
    setResults((prev) => ({
      ...results,
      items: [...(prev?.items || []), ...results.items],
    }))
  }

  useEffect(() => {
    setResults(null)
    setHasMore(true)
    setPage(1)
    setLoadingState("loading")

    fetchResults(1)
      .then(() => {
        setLoadingState("loaded")
        setPage(2)
      })
      .catch(() => setLoadingState("error"))
  }, [query]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="grid items-center gap-6">
      <SearchBar initialQuery={query ?? ""} />
      <h1 className="text-muted-foreground">
        Search Results for &ldquo;{query}&rdquo; ({results?.totalItems ?? 0})
      </h1>
      <div className="grid gap-2">
        {loadingState === "loading" && (
          <ul>
            <div className="grid gap-2">
              {Array.from({ length: 10 }).map((_, idx) => (
                <li key={idx}>
                  <SkeletonCard />
                </li>
              ))}
            </div>
          </ul>
        )}
        {loadingState === "loaded" && results && results.items.length > 0 && (
          <ul>
            <InfiniteScroll
              dataLength={results.items.length}
              next={() =>
                fetchResults(page).then(() => setPage((prev) => prev + 1))
              }
              hasMore={hasMore}
              className="grid gap-4"
              loader={
                <Loader2 className="mt-10 h-4 w-4 animate-spin justify-self-center text-muted-foreground" />
              }
            >
              {results.items.map((book: Book) => (
                <li key={book.id}>
                  <BookCard book={book} />
                </li>
              ))}
            </InfiniteScroll>
          </ul>
        )}
        {loadingState === "error" && (
          <p>Couldn&apos;t fetch books right now. Try again in a minute.</p>
        )}
      </div>
    </section>
  )
}

export default BrowsePage
