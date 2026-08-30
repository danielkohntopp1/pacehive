import type { Metadata } from "next"
import localFont from "next/font/local"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages, getTranslations } from "next-intl/server"
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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("rootMeta")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale === "en" ? "en-US" : "pt-BR"} className={`${plusJakartaSans.variable} ${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
