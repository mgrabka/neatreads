import "@/styles/globals.css"
import { Metadata } from "next"
import { LayoutProps } from "@/types"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import TailwindIndicator from "@/components/tailwind-indicator"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

const RootLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans text-primary antialiased",
            fontSans.className
          )}
        >
          {children}
          <Toaster />
          <TailwindIndicator />
        </body>
      </html>
    </>
  )
}

export default RootLayout
