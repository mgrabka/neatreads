"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Book } from "@/types"

import BookCard from "./book-card"

const BrowsePage = () => {
  const [books, setBooks] = useState([])
  const searchParams = useSearchParams()
  const query = searchParams.get("q")
  useEffect(() => {
    if (query) {
      fetch(`${location.origin}/api/v1/books/list?q=${query}`)
        .then((response) => response.json())
        .then((data) => {
          setBooks(data.items)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [query])

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <h1 className="text-muted-foreground">
        Search Results for &ldquo;{query}&rdquo;
      </h1>
      <ul>
        <div className="grid gap-2">
          {books.length > 0 ? (
            <ul>
              <div className="grid gap-2">
                {books.map((book: Book) => (
                  <li key={book.id}>
                    <BookCard book={book} />
                  </li>
                ))}
              </div>
            </ul>
          ) : (
            <p>Couldn&apos;t fetch books right now. Try again in a minute.</p>
          )}
        </div>
      </ul>
    </section>
  )
}

export default BrowsePage
