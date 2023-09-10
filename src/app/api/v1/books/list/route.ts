import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY

  const books = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`,
    { cache: "force-cache" }
  )

  return NextResponse.json(await books.json())
}
