import dynamic from "next/dynamic"

import { Textarea } from "@/components/ui/textarea"

const ReactStars = dynamic(() => import("react-stars"), {
  ssr: false,
})
const ReviewForm = ({ bookId }: { bookId: string }) => {
  return (
    <div className="flex grow flex-col">
      <div className="ml-2 min-w-[90px]">
        <ReactStars
          count={5}
          value={0}
          size={18}
          color1="#D1D5DB"
          color2="#FBBF24"
          edit={true}
        />
      </div>
      <Textarea placeholder="Write a review." />
    </div>
  )
}
export default ReviewForm
