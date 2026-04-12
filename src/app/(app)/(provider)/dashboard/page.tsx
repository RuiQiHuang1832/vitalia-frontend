'use client'
import AppointmentListCard from '@/app/(app)/(provider)/dashboard/components/AppointmentList/AppointmentListCard'
import ClinicalPreviewCard from '@/app/(app)/(provider)/dashboard/components/ClinicalPreview/ClinicalPreviewCard'
import NextAppointmentCard from '@/app/(app)/(provider)/dashboard/components/NextAppointment/NextAppointmentCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUserDisplay } from '@/hooks/useCurrentUserDisplay'
import { useProviderAppointmentCount } from '@/hooks/useProviderAppointmentCount'
import { getTimeGreeting } from '@/lib/utils'
import { AlertTriangle, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
export default function Dashboard() {
  const { greeting, isLoading } = useCurrentUserDisplay()
  const timeGreeting = getTimeGreeting(new Date())

  const now = useMemo(() => new Date().toISOString(), [])
  const { data: overdue } = useProviderAppointmentCount({
    status: ['SCHEDULED'],
    endTimeBefore: now,
  })
  const overdueCount = overdue?.count ?? 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-left font-semibold text-3xl">My Day</h1>
        <p className="text-muted-foreground">
          {timeGreeting},{' '}
          {isLoading ? (
            <Skeleton className="inline-block h-5 w-24 align-middle rounded" />
          ) : (
            greeting
          )}
          . Here&apos;s an overview of your day:
        </p>
      </section>

      {overdueCount > 0 && (
        <Link
          href="/appointments?tab=overdue"
          className="flex items-center justify-between gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900 hover:bg-amber-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 shrink-0 text-amber-600" />
            <p className="text-sm">
              You have{' '}
              <span className="font-semibold">
                {overdueCount} overdue appointment{overdueCount === 1 ? '' : 's'}
              </span>
              . Please review them. Overdue appointments will be automatically marked as cancelled
              after <span className="font-semibold">24 hours.</span>
            </p>
          </div>
          <ChevronRight className="size-4 text-amber-700" />
        </Link>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        <section aria-labelledby="next-appointment-heading" className="md:col-span-2 lg:col-span-8">
          <h2 id="next-appointment-heading" className="sr-only">
            Next Appointment
          </h2>
          <NextAppointmentCard />
        </section>
        <section aria-labelledby="clinical-preview-heading" className="md:col-span-2 lg:col-span-4">
          <h2 id="clinical-preview-heading" className="sr-only">
            Clinical Preview
          </h2>
          <ClinicalPreviewCard />
        </section>

        <section aria-labelledby="appointments-heading" className="md:col-span-2 lg:col-span-12">
          <h2 id="appointments-heading" className="sr-only">
            Today&apos;s Appointments
          </h2>
          <AppointmentListCard />
        </section>
      </div>
    </div>
  )
}
