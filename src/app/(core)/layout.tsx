import { LayoutProps } from "@/types"

import SiteHeader from "@/components/site-header"

const CoreLayout = ({ children }: LayoutProps) => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <div className="container mt-10 flex-1 pb-8 md:w-[800px] md:py-10 lg:w-[900px]">
        {children}
      </div>
    </div>
  )
}

export default CoreLayout
