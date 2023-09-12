import {
  Literata as FontHeader,
  JetBrains_Mono as FontMono,
  Work_Sans as FontSans,
} from "next/font/google"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const fontHeader = FontHeader({
  subsets: ["latin"],
  variable: "--font-header",
})
