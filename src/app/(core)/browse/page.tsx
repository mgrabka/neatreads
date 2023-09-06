"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Book } from "@/types"

import { fontHeader } from "@/lib/fonts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const BrowsePage = () => {
  const [books, setBooks] = useState([])
  const searchParams = useSearchParams()
  const query = searchParams.get("q")

  useEffect(() => {
    if (query) {
      fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
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
      <h1>Search Results for &ldquo;{query}&rdquo;</h1>
      <ul>
        <div className="grid gap-2">
          {books.map((book: Book) => (
            <li key={book.id}>
              <BookCard book={book} />
            </li>
          ))}
        </div>
      </ul>
    </section>
  )
}

const BookCard = ({ book }: { book: Book }) => {
  return (
    <Card className="flex flex-row">
      <div>
        <Image
          className="shrink-0 rounded-l object-cover"
          width={96}
          height={148}
          src={book.volumeInfo.imageLinks?.thumbnail}
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = "none"
          }}
        />
        <div
          className="shrink-0 rounded-l bg-gray-300"
          style={{
            width: 96,
            height: 148,
            display: book.volumeInfo.imageLinks?.thumbnail ? "none" : "block",
          }}
        />
      </div>
      <div className="grow">
        <CardHeader>
          <CardTitle>
            <h1 className={fontHeader.className}>{book.volumeInfo.title}</h1>
          </CardTitle>
          <CardDescription>
            by{" "}
            {book.volumeInfo.authors
              ? book.volumeInfo.authors.join(", ")
              : "Unknown Author"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>[todo: ratings, set reading status, go to page etc.]</p>
        </CardContent>
      </div>
    </Card>
  )
}
export default BrowsePage
