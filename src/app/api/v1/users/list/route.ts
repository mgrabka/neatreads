import { NextRequest, NextResponse } from "next/server"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { searchUsers } from "@/lib/users"

export async function GET(req: NextRequest) {
  const supabase = createClientComponentClient()
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")
  const limit = Number(searchParams.get("limit"))

  const users = await searchUsers(supabase, query || "", limit)

  return NextResponse.json(users)
}
