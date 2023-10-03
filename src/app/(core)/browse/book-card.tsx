import Image from "next/image"
import Link from "next/link"
import { Book } from "@/types"

import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export const BookCard = ({ book }: { book: Book }) => {
  return (
    <Link href={`/books/${book.id}`}>
      <div className="transition-bg flex h-full flex-col gap-2 rounded-xl border py-2 duration-300 ease-in-out hover:bg-muted">
        <div className="flex h-full flex-row gap-8 px-2">
          <div className="relative">
            <div className="h-[111px] w-[72px] overflow-hidden rounded-lg border bg-white ">
              {book.volumeInfo.imageLinks?.thumbnail ? (
                <Image
                  className="h-full w-full object-cover"
                  width={72}
                  height={111}
                  src={book.volumeInfo.imageLinks?.thumbnail}
                  alt={book.volumeInfo.title}
                />
              ) : (
                <div className="h-full w-full rounded bg-gray-300"></div>
              )}
            </div>
          </div>
          <div className="flex h-full flex-col justify-center">
            <p
              className={cn(
                "line-clamp-2 text-lg font-semibold",
                fontHeader.className
              )}
            >
              {book.volumeInfo.title}
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              by{" "}
              {book.volumeInfo.authors
                ? book.volumeInfo.authors.map((author, idx, arr) => (
                    <span key={author}>
                      {author}
                      {idx !== arr.length - 1 && ", "}
                    </span>
                  ))
                : "Unknown Authors"}
            </p>
          </div>
        </div>
      </div>
    </Link>
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
