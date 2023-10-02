import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const bookId = searchParams.get("bookId")
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`,
    { cache: "force-cache" }
  )

  return NextResponse.json(await response.json())
}
