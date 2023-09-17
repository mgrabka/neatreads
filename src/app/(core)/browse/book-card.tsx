import Image from "next/image"
import Link from "next/link"
import { Book } from "@/types"
import { BookmarkPlus, Check } from "lucide-react"

import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import BookStars from "@/components/book-stars"

export const BookCard = ({ book }: { book: Book }) => {
  return (
    <Card className="flex flex-row items-center">
      <div className="relative pl-2">
        <div className="h-[148px] w-[96px] overflow-hidden rounded-lg border bg-white ">
          {book.volumeInfo.imageLinks?.thumbnail ? (
            <Image
              className=" h-full w-full object-cover"
              width={96}
              height={148}
              src={book.volumeInfo.imageLinks?.thumbnail}
              alt={book.volumeInfo.title}
            />
          ) : (
            <div className="h-full w-full rounded bg-gray-300"></div>
          )}
        </div>
      </div>
      <div className="grow">
        <CardHeader>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              by{" "}
              {book.volumeInfo.authors
                ? book.volumeInfo.authors.map((author, idx, arr) => (
                    <span key={author}>
                      <a
                        href={`/browse?q=inauthor:${author}`}
                        className="hover:underline hover:underline-offset-2"
                      >
                        {author}
                      </a>
                      {idx !== arr.length - 1 && ", "}
                    </span>
                  ))
                : "Unknown Authors"}
            </p>
            <Link href={`/books/${book.id}`}>
              <p
                className={cn(
                  "line-clamp-1 text-base font-semibold hover:underline hover:underline-offset-2",
                  fontHeader.className
                )}
              >
                {book.volumeInfo.title}
              </p>
            </Link>
          </div>
          <BookStars bookId={book.id} />
        </CardHeader>
        <CardContent>
          <div className="row flex h-8 items-center space-x-4">
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground">pages</span>
              <span
                className={cn("text-base font-semibold", fontHeader.className)}
              >
                {book.volumeInfo.pageCount}
              </span>
            </div>
            <Separator orientation="vertical" />

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => console.log("clicked")}
                size="sm"
                variant="outline"
              >
                <BookmarkPlus className="mr-2" /> Add to library
              </Button>
              {/* <Button size="sm" variant="secondary">
                <Check size={18} className="mr-2" /> In your library
              </Button> */}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export const SkeletonCard = () => {
  return (
    <div className="border-muted-foreground">
      <div className="flex flex-row p-2">
        <Skeleton className="h-[148px] w-[96px] rounded-lg" />
        <div className="flex flex-col">
          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-3 w-[100px]" />
          </div>
          <div className="pl-6">
            <div className="flex flex-row space-x-4">
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-2 w-[50px]" />
                <Skeleton className="h-4 w-[50px]" />
              </div>
              <div>
                <Skeleton className="h-8 w-[150px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
