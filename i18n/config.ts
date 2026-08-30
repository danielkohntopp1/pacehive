export const locales = ["pt", "en"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "pt"
export const localeCookieName = "PACEHIVE_LOCALE"

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}
