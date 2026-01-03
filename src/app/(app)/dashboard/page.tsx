'use client'
import NextAppointmentCard from '@/app/(app)/dashboard/components/NextAppointmentCard'
import { getTimeGreeting } from '@/app/(app)/dashboard/lib/helper'
import { useCurrentUserDisplay } from '@/hooks/useCurrentUserDisplay'

export default function Dashboard() {
  const { greeting } = useCurrentUserDisplay()
  const timeGreeting = getTimeGreeting(new Date())

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-left font-semibold text-3xl">My Day</h1>
        <p className="text-muted-foreground">
          {timeGreeting}, {greeting}. Here&apos;s an overview of your day:
        </p>
      </section>
      <section aria-labelledby="next-appointment-heading" className="">
        <h2 id="next-appointment-heading" className="sr-only">
          Next Appointment
        </h2>
        <NextAppointmentCard />
      </section>
    </div>
  )
}
