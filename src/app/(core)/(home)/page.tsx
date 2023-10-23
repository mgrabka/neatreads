import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/database"

import AnonHomePage from "./anon-page"
import SignedInHomePage from "./signed-in-page"

const HomePage = async () => {
  const cookieStore = cookies()

  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <AnonHomePage />
  }
  /* @ts-expect-error Server Component*/
  return <SignedInHomePage user={user} />
}

export default HomePage
