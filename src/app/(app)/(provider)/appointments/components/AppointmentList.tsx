import AppointmentListSkeleton from '@/app/(app)/(provider)/appointments/components/AppointmentListSkeleton'
import {
  type Appointment,
  type AppointmentWithPatient,
} from '@/app/(app)/(provider)/patients/types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { getNameColors } from '@/lib/colorMap'
import { formatDate, formatTime } from '@/lib/utils'
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react'

const statusVariant: Record<Appointment['status'], 'default' | 'secondary' | 'destructive'> = {
  SCHEDULED: 'default',
  COMPLETED: 'secondary',
  CANCELLED: 'destructive',
}

interface AppointmentListProps {
  tab: string
  appointments: AppointmentWithPatient[]
  totalPages: number
  page: number
  onPageChange: (page: number) => void
  onSelect: (appointment: AppointmentWithPatient) => void
  selectedId: number | null
  error: boolean
  isLoading: boolean
  hasData: boolean
}

export default function AppointmentList({
  tab,
  appointments,
  totalPages,
  page,
  onPageChange,
  onSelect,
  selectedId,
  error,
  isLoading,
  hasData,
}: AppointmentListProps) {
  return (
    <div className="space-y-6">
      {error && (
        <div className="text-destructive text-sm">Failed to load appointments. Try refreshing.</div>
      )}

      {isLoading && !hasData && <AppointmentListSkeleton />}

      {!error && appointments.length === 0 && !isLoading && (
        <div className="text-muted-foreground text-sm py-8 text-center">
          No {tab === 'upcoming' ? 'upcoming' : 'past'} appointments.
        </div>
      )}

      <div className="space-y-3">
        {appointments.map((appt) => {
          const patientName = appt.patient
            ? `${appt.patient.firstName} ${appt.patient.lastName}`
            : `Patient #${appt.patientId}`
          const initials = appt.patient
            ? `${appt.patient.firstName.charAt(0)}${appt.patient.lastName.charAt(0)}`
            : '?'
          const { bg, text } = getNameColors(patientName)

          return (
            <Card
              key={appt.id}
              className={`cursor-pointer transition-colors hover:border-blue-400 ${selectedId === appt.id ? 'border-blue-400 ring-1 ring-primary/20' : ''}`}
              onClick={() => onSelect(appt)}
            >
              <CardHeader>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Calendar className="size-3" />
                  {formatDate(appt.startTime, 'full')}
                </div>
                <CardTitle className="text-base">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarFallback className={`${bg} ${text}  font-medium`}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {patientName}
                  </div>
                </CardTitle>
                <CardDescription>{appt.reason ?? 'No reason provided'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-3" />
                    {formatTime(appt.startTime)} – {formatTime(appt.endTime)}
                  </div>
                  <Badge variant={statusVariant[appt.status]}>{appt.status}</Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
