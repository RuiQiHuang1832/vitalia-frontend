'use client'
import AppointmentListCard from '@/app/(app)/(provider)/dashboard/components/AppointmentList/AppointmentListCard'
import ClinicalPreviewCard from '@/app/(app)/(provider)/dashboard/components/ClinicalPreview/ClinicalPreviewCard'
import NextAppointmentCard from '@/app/(app)/(provider)/dashboard/components/NextAppointment/NextAppointmentCard'
import TasksCard from '@/app/(app)/(provider)/dashboard/components/Tasks/TasksCard'
import { getTimeGreeting } from '@/app/(app)/(provider)/dashboard/lib/helper'
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 ">
        {/* Full-width */}
        <section
          aria-labelledby="next-appointment-heading"
          className="md:col-span-2 lg:col-span-8 "
        >
          <h2 id="next-appointment-heading" className="sr-only">
            Next Appointment
          </h2>
          <NextAppointmentCard />
        </section>
        <section
          aria-labelledby="clinical-preview-heading"
          className="md:col-span-2 lg:col-span-4 "
        >
          <h2 id="clinical-preview-heading" className="sr-only">
            Clinical Preview
          </h2>
          <ClinicalPreviewCard />
        </section>

        {/* Left column */}
        <section aria-labelledby="appointments-heading" className="md:col-span-2 lg:col-span-6">
          <h2 id="appointments-heading" className="sr-only">
            Today&apos;s Appointments
          </h2>
          <AppointmentListCard />
        </section>
        <section aria-labelledby="tasks-heading" className="md:col-span-2 lg:col-span-6">
          <h2 id="tasks-heading" className="sr-only">
            Open Tasks
          </h2>
          <TasksCard />
        </section>
      </div>
    </div>
  )
}
