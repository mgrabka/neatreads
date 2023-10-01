import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/database"

import AnonHomePage from "./anon-page"
import SignedInHomePage from "./signed-in-page"

const HomePage = async () => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <AnonHomePage />
  }

  return <SignedInHomePage user={user} />
}

export default HomePage
