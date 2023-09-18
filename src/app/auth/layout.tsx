import Link from "next/link"
import { LayoutProps } from "@/types"
import { MoveLeft } from "lucide-react"

import ParallaxImage from "./parallax-image"

const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <div className="relative flex h-screen w-screen select-none items-center justify-center md:justify-start">
      <div className="flex h-screen flex-1 flex-col items-center justify-center">
        <div className="p-8 sm:w-[400px]">
          {children}
          <div className="mt-12">
            <Link
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary "
              href="/"
            >
              <MoveLeft className="h-4 w-4" />
              <span>go to home screen</span>
            </Link>
          </div>
        </div>
      </div>
      <ParallaxImage />
    </div>
  )
}

export default AuthLayout
