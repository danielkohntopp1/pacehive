import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

const plusJakartaSans = localFont({
  src: [
    { path: "../public/fonts/PlusJakartaSans/PlusJakartaSans-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/PlusJakartaSans/PlusJakartaSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/PlusJakartaSans/PlusJakartaSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/PlusJakartaSans/PlusJakartaSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/PlusJakartaSans/PlusJakartaSans-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/PlusJakartaSans/PlusJakartaSans-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-plus-jakarta",
  display: "swap",
})

const roboto = localFont({
  src: [
    { path: "../public/fonts/Roboto/Roboto-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Roboto/Roboto-Medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-roboto",
  display: "swap",
})

export const metadata: Metadata = {
  title: "PaceHive — Conectando corredores com novas experiências",
  description:
    "Marketplace de guias de corrida. Encontre um corredor local para guiar você em qualquer cidade do mundo.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} ${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  )
}
