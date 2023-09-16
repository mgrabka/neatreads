import supabase from "../supabase"

const fetchRatings = async (bookId: string) => {
  const fetchResponse = await supabase
    .from("ratings")
    .select("rating")
    .eq("book_id", bookId)

  if (fetchResponse.error) {
    console.log(fetchResponse.error)
  }
  return fetchResponse.data
}

export default fetchRatings
