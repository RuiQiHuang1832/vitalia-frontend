'use client'

import AppointmentListSkeleton from '@/app/(app)/(provider)/dashboard/components/AppointmentList/AppointmentListSkeleton'
import { type AppointmentWithPatient } from '@/app/(app)/(provider)/patients/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProviderAppointments } from '@/hooks/useProviderAppointments'
import { capitalize, formatTime, getPatientDisplay } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'

export default function AppointmentListCard() {
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const { data, isLoading } = useProviderAppointments({
    limit: 5,
    status: ['SCHEDULED'],
    fromDate: today,
  })

  const appointments: AppointmentWithPatient[] = data?.data ?? []

  if (isLoading) {
    return <AppointmentListSkeleton />
  }

  return (
    <Card className="gap-0">
      <CardHeader className="flex flex-row items-center justify-between px-0 mx-6 border-b">
        <CardTitle>Today&apos;s Schedule</CardTitle>

        <Button variant="link" className="px-0" asChild>
          <Link href="/appointments">View Full Schedule →</Link>
        </Button>
      </CardHeader>
      <CardContent className="divide-y">
        {appointments.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No upcoming appointments today.
          </p>
        )}
        {appointments.map((appt) => {
          const { name: patientName, initials, age, gender, mrn, colors: { bg, border, ring } } = getPatientDisplay(appt.patient, appt.patientId)

          return (
            <Link
              key={appt.id}
              href={`/appointments?select=${appt.id}`}
              className="flex items-center justify-between py-4 group hover:bg-muted/50 rounded-md px-2 -mx-2 transition-colors"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                {/* Time */}
                <div className="w-14 text-sm text-muted-foreground text-right shrink-0">
                  {formatTime(appt.startTime)}
                </div>

                {/* Avatar */}
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium shrink-0 ${bg} ${border} ${ring}`}
                >
                  {initials}
                </div>

                {/* Name + Meta */}
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2 truncate">
                    <span className="font-medium">{patientName}</span>
                    <span className="text-xs text-muted-foreground/60">{mrn}</span>
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {[
                      age != null && `${age} y/o`,
                      gender && capitalize(gender.toLowerCase()),
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                  {appt.reason && (
                    <div className="text-sm text-muted-foreground/80 truncate mt-0.5">
                      {appt.reason}
                    </div>
                  )}
                </div>
              </div>

              {/* Right */}
              <div className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                <ChevronRight className="h-5 w-5 me-1" />
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
