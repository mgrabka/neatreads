import { LayoutProps } from "@/types"

import Footer from "@/components/footer"
import SiteHeader from "@/components/site-header"

const CoreLayout = ({ children }: LayoutProps) => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <div className="container mt-10 flex-1 md:w-[800px] lg:w-[900px]">
        <div className="min-h-screen pb-8 md:py-10 ">{children}</div>
        {/* @ts-expect-error Server Component*/}
        <Footer />
      </div>
    </div>
  )
}

export default CoreLayout
