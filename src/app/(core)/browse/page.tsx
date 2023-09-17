"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Book } from "@/types"

import { BookCard, SkeletonCard } from "./book-card"

type LoadingState = "idle" | "loading" | "loaded" | "error"

const BrowsePage = () => {
  const [books, setBooks] = useState([])
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const searchParams = useSearchParams()
  const query = searchParams.get("q")

  useEffect(() => {
    setLoadingState("loading")

    if (query) {
      fetch(`${location.origin}/api/v1/books/list?q=${query}`)
        .then((response) => response.json())
        .then((data) => {
          setBooks(data.items)
          setLoadingState("loaded")
        })
        .catch((error) => {
          console.error(error)
          setLoadingState("error")
        })
    }
  }, [query])

  return (
    <section className="grid items-center gap-6">
      <h1 className="text-muted-foreground">
        Search Results for &ldquo;{query}&rdquo;
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
        {loadingState === "loaded" && books.length > 0 && (
          <ul>
            <div className="grid gap-2">
              {books.map((book: Book) => (
                <li key={book.id}>
                  <BookCard book={book} />
                </li>
              ))}
            </div>
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
