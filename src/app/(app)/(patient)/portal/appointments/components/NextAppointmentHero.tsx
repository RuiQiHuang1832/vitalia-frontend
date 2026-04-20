'use client'

import type { AppointmentWithProvider } from '@/app/(app)/(patient)/portal/appointments/types'
import { Card } from '@/components/ui/card'
import { formatDate, formatTime } from '@/lib/utils'
import { Calendar, Clock, Stethoscope } from 'lucide-react'

export default function NextAppointmentHero({
  appointment,
}: {
  appointment: AppointmentWithProvider | null
}) {
  if (!appointment) {
    return (
      <Card className="!p-8 gap-3 items-center text-center">
        <Calendar className="size-8 text-muted-foreground" />
        <h2 className="font-semibold text-lg">No upcoming appointments</h2>
        <p className="text-sm text-muted-foreground">
          Your next visit will appear here once it&apos;s scheduled.
        </p>
      </Card>
    )
  }

  const { provider, startTime, endTime, reason } = appointment

  return (
    <Card className="px-6 gap-4 border-primary/30">
      <div className="space-y-1">
        <div className="text-xs font-semibold uppercase tracking-wide text-primary">
          Next Appointment
        </div>
        <h2 className="text-2xl font-semibold leading-tight">{formatDate(startTime, 'full')}</h2>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-4" />
          <span>
            {formatTime(startTime)} – {formatTime(endTime)}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Stethoscope className="size-4 text-muted-foreground" />
          <span className="font-medium">
            Dr. {provider.firstName} {provider.lastName}
          </span>
          <span className="text-muted-foreground">· {provider.specialty}</span>
        </div>
        {reason && (
          <p className="pl-6 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Reason: </span>
            {reason}
          </p>
        )}
      </div>
    </Card>
  )
}
