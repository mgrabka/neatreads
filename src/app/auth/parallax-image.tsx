"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import AuthIllustration from "public/assets/auth.svg"

const ParallaxImage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event

      const xOffset = (window.innerWidth / 2 - clientX) / 100
      const yOffset = (window.innerHeight / 2 - clientY) / 100

      const factorX = 1.5
      const factorY = 1.5

      if (containerRef.current) {
        containerRef.current.style.transform = `translate(${
          xOffset * factorX
        }px, ${yOffset * factorY}px)`
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="hidden h-screen flex-1 items-center justify-center md:flex"
    >
      <Image
        src={AuthIllustration}
        width={500}
        height={400}
        alt="Books stacked on top of each other"
      />
    </div>
  )
}

export default ParallaxImage
