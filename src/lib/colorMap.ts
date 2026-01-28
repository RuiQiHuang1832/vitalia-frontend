export const COLORS = [
  { bg: 'bg-red-100', text: 'text-red-700' },
  { bg: 'bg-blue-100', text: 'text-blue-700' },
  { bg: 'bg-green-100', text: 'text-green-700' },
  { bg: 'bg-purple-100', text: 'text-purple-700' },
  { bg: 'bg-yellow-100', text: 'text-yellow-700' },
] as const

export function getNameColors(name: string) {
  if (!name) return COLORS[0]

  const firstChar = name.trim().charAt(0).toUpperCase()
  const index = firstChar.charCodeAt(0) % COLORS.length

  return COLORS[index]
}
