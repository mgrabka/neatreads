import { cookies } from "next/headers"
import {
  User,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/database"
import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import ActivityFeed from "@/components/activity-feed"
import ReadingGoal from "@/components/reading-goal"
import SearchBar from "@/components/search-bar"

import TrendingShowcase from "./trending-showcase"

const SignedInHomePage = async ({ user }: { user: User }) => {
  const cookieStore = cookies()

  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  })
  const {
    data: { username },
  } = (await supabase
    .from("profiles")
    .select("username")
    .eq("user_id", user.id)
    .single()) as { data: { username: string } }

  return (
    <section className="relative grid gap-8">
      <div className="z-20 flex max-w-[980px] flex-col items-start gap-2">
        <h1
          className={cn(
            "text-3xl font-semibold leading-tight tracking-tight md:text-4xl",
            fontHeader.className
          )}
        >
          Hello, {username}! 👋🏻
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Complete your shelf with some new books.
        </p>
      </div>
      <div>
        <SearchBar />
      </div>
      <div>
        <ReadingGoal />
      </div>
      <div className="mt-12">
        <TrendingShowcase />
      </div>
      <div className="mt-12">
        <h1
          className={cn(
            "text-xl font-semibold leading-tight tracking-tighter",
            fontHeader.className
          )}
        >
          Latest Activity
        </h1>
        {/* @ts-expect-error Server Component*/}
        <ActivityFeed user={user} shouldListFollowed={true} />
      </div>
    </section>
  )
}

export default SignedInHomePage
