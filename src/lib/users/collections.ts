import { SupabaseClient } from "@supabase/supabase-js"

interface CollectionCount {
  collection_id: number
  book_count: number
}

type CountsDict = {
  [key: number]: number
}

export const fetchBookCountsByCollectionId = async (
  userId: string,
  supabase: SupabaseClient
) => {
  const { data, error } = await supabase.rpc("get_book_counts_by_collection", {
    p_user_id: userId,
  })

  if (error) {
    console.error("Error fetching counts:", error)
    return {}
  }
  const countsDict = data.reduce((acc: CountsDict, curr: CollectionCount) => {
    acc[curr.collection_id] = curr.book_count
    return acc
  }, {})

  return countsDict
}

export const deleteCollectionById = async (
  collectionId: number,
  supabase: SupabaseClient
) => {
  const { data, error } = await supabase
    .from("collections")
    .delete()
    .eq("id", collectionId)
  if (error) {
    console.error("Error deleting collection:", error)
    return false
  }
  return true
}
