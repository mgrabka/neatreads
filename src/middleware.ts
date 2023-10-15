import { NextResponse, type NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/types/database"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    (req.nextUrl.pathname.startsWith("/auth/sign-in") ||
      req.nextUrl.pathname.startsWith("/auth/sign-up")) &&
    user
  ) {
    return NextResponse.redirect(new URL(`/`, req.url))
  }

  if (req.nextUrl.pathname.startsWith("/user/settings") && !user) {
    return NextResponse.redirect(new URL(`/`, req.url))
  }

  return res
}
