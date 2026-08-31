import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, locale: 'pt' | 'en' = 'pt'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

// Data curta usada em notificações (ex: "21/05" em PT, "May 21" em EN).
// Recebe uma data no formato "YYYY-MM-DD" e monta como data local, sem fuso.
export function formatShortDate(dateStr: string, locale: 'pt' | 'en' = 'pt'): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return locale === 'en'
    ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export function formatTime(time: string): string {
  return time.slice(0, 5)
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}
