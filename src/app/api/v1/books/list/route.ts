import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page")
  const query = searchParams.get("q")
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY

  const startIndex = Number(page) > 0 ? 10 * (Number(page) - 1) : 0
  const books = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10&startIndex=${startIndex}&key=${apiKey}`,
    { cache: "force-cache" }
  )

  return NextResponse.json(await books.json())
}
