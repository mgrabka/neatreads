import Image from "next/image"
import { LayoutProps } from "@/types"

const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <div className="relative flex h-screen w-screen select-none items-center justify-center md:justify-start">
      <div className="flex h-screen shrink-0 flex-col justify-center md:px-16">
        <div className="p-8 sm:w-[400px]">{children}</div>
      </div>

      <div className="relative hidden h-full grow md:block">
        <Image
          src="/assets/auth-books.jpg"
          fill={true}
          style={{ objectFit: "cover" }}
          alt="Books stacked on top of each other"
        />
        <div className="absolute inset-0 bg-orange-950 opacity-50"></div>
      </div>
    </div>
  )
}

export default AuthLayout
//return (
//   <div className="relative flex min-h-screen items-center justify-center">
//   <div className="absolute top-1/2 -translate-y-1/2 space-y-6 p-8 sm:w-[400px]">
//     {children}
//   </div>
// </div>
// )
