import MainNav from "@/components/main-nav"

import UserControl from "./user-control"

const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        {/* @ts-expect-error Server Component */}
        <UserControl />
      </div>
    </header>
  )
}

export default SiteHeader
