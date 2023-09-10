import { LayoutProps } from "@/types"

import SiteHeader from "@/components/site-header"

const CoreLayout = ({ children }: LayoutProps) => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <div className="container flex-1">{children}</div>
    </div>
  )
}

export default CoreLayout
