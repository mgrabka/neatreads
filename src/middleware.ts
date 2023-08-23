import { NextResponse, type NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/types/database"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (
    req.nextUrl.pathname.startsWith("/auth/sign-in") ||
    req.nextUrl.pathname.startsWith("/auth/sign-up")
  ) {
    if (session) {
      return NextResponse.redirect(new URL(`/maks/library`, req.url))
    }
  }
  return res
}

// if (
//   req.nextUrl.pathname.startsWith("/sign-in") ||
//   req.nextUrl.pathname.startsWith("/sign-up")
// ) {
//   if (user != null) {
//     return NextResponse.redirect(new URL(`/${user}/library`, req.url))
//   }
// }
