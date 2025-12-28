'use client'
import { useCurrentUserDisplay } from '@/hooks/useCurrentUserDisplay'
export default function Dashboard() {
  const { greeting } = useCurrentUserDisplay()

  return (
    <div>
      <div>My Day</div>
      <div>Good Morning, {greeting}. Here&apos;s an overview of your day.</div>
    </div>
  )
}
