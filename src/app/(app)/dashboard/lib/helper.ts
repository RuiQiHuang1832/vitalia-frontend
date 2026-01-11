export function getTimeGreeting(now: Date) {
  return now.getHours() < 12 ? 'Good morning' : 'Good afternoon'
}

export function generateUiMrn(patientId: number): string {
  const base = Number(patientId)
  const padded = (100000 + base).toString().slice(-6)
  return `MRN #${padded}`
}
