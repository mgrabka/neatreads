import MainNav from "@/components/main-nav"

import UserControl from "./user-control"

const SiteHeader = () => {
  return (
    <div className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background px-2 sm:px-10">
      <MainNav />
      {/* @ts-expect-error Server Component*/}
      <UserControl />
    </div>
  )
}

export default SiteHeader
