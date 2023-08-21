import { NextResponse, type NextRequest } from "next/server"

// const user = "maks"
const user = null

export const middleware = (request: NextRequest) => {
  if (
    request.nextUrl.pathname.startsWith("/sign-in") ||
    request.nextUrl.pathname.startsWith("/sign-up")
  ) {
    if (user != null) {
      return NextResponse.redirect(new URL(`/${user}/library`, request.url))
    }
  }
}
