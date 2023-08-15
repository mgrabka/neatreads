import { NextResponse, type NextRequest } from "next/server"

const user = "maks"

export const middleware = (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith("/sign-in" || "/sign-up")) {
    if (user != null) {
      return NextResponse.redirect(new URL(`/${user}/library`, request.url))
    }
  }
}
