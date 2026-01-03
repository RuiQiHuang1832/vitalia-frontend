export function getTimeGreeting(now: Date) {
  return now.getHours() < 12 ? 'Good morning' : 'Good afternoon'
}
