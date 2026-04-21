import { clsx, type ClassValue } from 'clsx'
import { getNameColors } from '@/lib/colorMap'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalize = (str: string) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const capitalizeWords = (str: string) => {
  if (!str) return ''

  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
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

export function getTimeGreeting(now: Date) {
  return now.getHours() < 12 ? 'Good morning' : 'Good afternoon'
}

export function formatMrn(id: number): string {
  return `MRN-${String(id).padStart(6, '0')}`
}

export function formatPatientName(firstName: string, lastName: string): string {
  return `${lastName.toUpperCase()}, ${firstName.toUpperCase()}`
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

export function getPatientDisplay(
  patient: { firstName: string; lastName: string; dob: string; gender: string; id: number } | null | undefined,
  fallbackId: number
) {
  const name = patient
    ? formatPatientName(patient.firstName, patient.lastName)
    : `Patient #${fallbackId}`
  const initials = patient
    ? `${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`
    : '?'
  const age = patient ? calculateAge(patient.dob) : null
  const gender = patient ? patient.gender : null
  const mrn = formatMrn(patient?.id ?? fallbackId)
  const colors = getNameColors(name)

  return { name, initials, age, gender, mrn, colors }
}
