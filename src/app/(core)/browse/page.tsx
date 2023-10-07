"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Book, SearchResult, UserProfile } from "@/types"
import { Loader2 } from "lucide-react"
import InfiniteScroll from "react-infinite-scroll-component"

import SearchBar from "@/components/search-bar"

import { BookCard, SkeletonCard } from "./book-card"
import UserResults from "./user-results"

type LoadingState = "idle" | "loading" | "loaded" | "error"

const BrowsePage = () => {
  const [bookResults, setBookResults] = useState<SearchResult | null>(null)
  const [userResults, setUserResults] = useState<UserProfile[] | null>(null)
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const searchParams = useSearchParams()
  const query = searchParams.get("q") ?? ""

  const fetchUsers = async () => {
    const fetchResponse = await fetch(
      `${location.origin}/api/v1/users/list?q=${query}&limit=24`
    )
    const results = await fetchResponse.json()
    setUserResults(results)
  }

  const fetchBookResults = async (currentPage?: number) => {
    const fetchResponse = await fetch(
      `${location.origin}/api/v1/books/list?page=${
        currentPage ?? page
      }&q=${query}`
    )
    const newResults: SearchResult = await fetchResponse.json()

    setHasMore(newResults.items.length === 10)

    if (currentPage === 1 || !bookResults) {
      setBookResults(newResults)
    } else {
      const combinedItems: Book[] = [
        ...(bookResults?.items || []),
        ...newResults.items,
      ]

      const uniqueItems: Book[] = combinedItems.reduce(
        (acc: Book[], current: Book) => {
          const x = acc.find((item) => item.id === current.id)
          if (!x) {
            return acc.concat([current])
          } else {
            return acc
          }
        },
        []
      )

      setBookResults({
        ...newResults,
        items: uniqueItems,
      })
    }
  }

  useEffect(() => {
    setBookResults(null)
    setHasMore(true)
    setPage(1)
    setLoadingState("loading")

    fetchBookResults(1)
      .then(() => {
        setLoadingState("loaded")
        setPage(2)
      })
      .catch(() => setLoadingState("error"))

    fetchUsers()
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="grid items-center gap-6">
      <SearchBar initialQuery={query} />
      {userResults && userResults.length > 0 && (
        <div className="w-full overflow-hidden">
          <UserResults users={userResults} />
        </div>
      )}
      <h1 className="text-muted-foreground">
        Search Results for &ldquo;{query}&rdquo; ({bookResults?.totalItems ?? 0}
        )
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
        {loadingState === "loaded" &&
          bookResults &&
          bookResults.items.length > 0 && (
            <ul>
              <InfiniteScroll
                dataLength={bookResults.items.length}
                next={() =>
                  fetchBookResults(page).then(() => setPage((prev) => prev + 1))
                }
                hasMore={hasMore}
                className="grid gap-4"
                loader={
                  <Loader2 className="mt-10 h-4 w-4 animate-spin justify-self-center text-muted-foreground" />
                }
              >
                {bookResults.items.map((book: Book) => (
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
