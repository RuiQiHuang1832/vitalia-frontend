import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalize = (str: string) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function calculateAge(dobIso: string): number {
  const dob = new Date(dobIso)
  const today = new Date()

  let age = today.getFullYear() - dob.getFullYear()

  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate())

  if (!hasHadBirthdayThisYear) {
    age--
  }

  return age
}

export function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

type DateFormatStyle = 'date' | 'datetime' | 'short' | 'full'

export function formatDate(dateStr: string | null, style: DateFormatStyle = 'date'): string {
  if (!dateStr) return '—'

  const date = new Date(dateStr)

  switch (style) {
    case 'datetime':
      return date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    case 'short':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    case 'full':
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    case 'date':
    default:
      return date.toLocaleDateString()
  }
}
