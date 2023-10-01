"use client"

import dynamic from "next/dynamic"

const ReactStars = dynamic(() => import("react-stars"), {
  ssr: false,
})

const StarsRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center space-x-2">
      <ReactStars
        count={5}
        value={rating}
        size={18}
        color1="#D1D5DB"
        color2="#FBBF24"
        edit={false}
      />
    </div>
  )
}

export default StarsRating
