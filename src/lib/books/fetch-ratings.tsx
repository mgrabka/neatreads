import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export const fetchRatings = async (bookId: string) => {
  const supabase = createClientComponentClient()
  const fetchResponse = await supabase
    .from("ratings")
    .select("rating")
    .eq("book_id", bookId)

  if (fetchResponse.error) {
    console.log(fetchResponse.error)
  }
  return fetchResponse.data
}
