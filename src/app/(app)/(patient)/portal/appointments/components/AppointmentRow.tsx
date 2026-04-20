'use client'

import type { AppointmentWithProvider } from '@/app/(app)/(patient)/portal/appointments/types'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatTime } from '@/lib/utils'

const STATUS_VARIANT: Record<
  AppointmentWithProvider['status'],
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  SCHEDULED: 'secondary',
  COMPLETED: 'outline',
  CANCELLED: 'destructive',
}

export default function AppointmentRow({
  appointment,
  showStatus = false,
}: {
  appointment: AppointmentWithProvider
  showStatus?: boolean
}) {
  const { provider, startTime, status, reason } = appointment

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border bg-card hover:bg-accent/40 transition-colors">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>{formatDate(startTime, 'short')}</span>
          <span className="text-muted-foreground">· {formatTime(startTime)}</span>
        </div>
        <div className="mt-0.5 text-sm text-muted-foreground truncate">
          Dr. {provider.firstName} {provider.lastName} · {provider.specialty}
          {reason && ` · ${reason}`}
        </div>
      </div>
      {showStatus && (
        <Badge variant={STATUS_VARIANT[status]} className="capitalize">
          {status.toLowerCase()}
        </Badge>
      )}
    </div>
  )
}
