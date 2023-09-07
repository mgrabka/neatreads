import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/types/database"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const reqUrl = new URL(req.url)
  const code = reqUrl.searchParams.get("code")

  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(reqUrl.origin)
}
