'use client'
import AppointmentListCard from '@/app/(app)/dashboard/components/AppointmentListCard'
import NextAppointmentCard from '@/app/(app)/dashboard/components/NextAppointmentCard'
import TasksCard from '@/app/(app)/dashboard/components/TasksCard'
import { getTimeGreeting } from '@/app/(app)/dashboard/lib/helper'
import { useCurrentUserDisplay } from '@/hooks/useCurrentUserDisplay'
export default function Dashboard() {
  const { greeting } = useCurrentUserDisplay()
  const timeGreeting = getTimeGreeting(new Date())

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-left font-semibold text-3xl">My Day</h1>
        <p className="text-muted-foreground">
          {timeGreeting}, {greeting}. Here&apos;s an overview of your day:
        </p>
      </section>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Full-width */}
        <section aria-labelledby="next-appointment-heading" className="lg:col-span-2">
          <h2 id="next-appointment-heading" className="sr-only">
            Next Appointment
          </h2>
          <NextAppointmentCard />
        </section>

        {/* Left column */}
        <section aria-labelledby="appointments-heading">
          <h2 id="appointments-heading" className="sr-only">
            Today&apos;s Appointments
          </h2>
          <AppointmentListCard />
        </section>
        <section aria-labelledby="tasks-heading">
          <h2 id="tasks-heading" className="sr-only">
            Open&apos;s Tasks
          </h2>
          <TasksCard />
        </section>
      </div>
    </div>
  )
}
