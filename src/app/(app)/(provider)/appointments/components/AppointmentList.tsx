'use client'
import AppointmentListSkeleton from '@/app/(app)/(provider)/appointments/components/AppointmentListSkeleton'
import {
  type Appointment,
  type AppointmentResponse,
  type PatientBase,
} from '@/app/(app)/(provider)/patients/types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProviderAppointments } from '@/hooks/useProviderAppointments'
import { getNameColors } from '@/lib/colorMap'
import { formatDate, formatTime } from '@/lib/utils'
import { Calendar, ChevronLeft, ChevronRight, Clock, Play, Plus } from 'lucide-react'
import { useState } from 'react'
type Tab = 'upcoming' | 'past'

type AppointmentWithPatient = Appointment & {
  patient: PatientBase
}

const statusVariant: Record<Appointment['status'], 'default' | 'secondary' | 'destructive'> = {
  SCHEDULED: 'default',
  COMPLETED: 'secondary',
  CANCELLED: 'destructive',
}

export default function AppointmentList({ initialData }: { initialData: AppointmentResponse }) {
  const [tab, setTab] = useState<Tab>('upcoming')
  const [page, setPage] = useState(1)

  const { data, error, isLoading } = useProviderAppointments({
    page,
    limit: 10,
    status: tab === 'upcoming' ? ['SCHEDULED'] : ['COMPLETED', 'CANCELLED'],
    initialData: tab === 'upcoming' && page === 1 ? initialData : undefined,
  })

  const appointments = (data?.data ?? []) as AppointmentWithPatient[]
  const totalPages = data?.totalPages ?? 0

  function handleTabChange(value: string) {
    setTab(value as Tab)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={tab} onValueChange={handleTabChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past Appointments</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-center gap-2">
          {tab === 'upcoming' && appointments.length > 0 && (
            <Button size="sm">
              <Play className="size-3" />
              Start Appointment
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Plus className="size-3" />
            New Appointment
          </Button>
        </div>
      </div>
      {error && (
        <div className="text-destructive text-sm">Failed to load appointments. Try refreshing.</div>
      )}

      {isLoading && !data && <AppointmentListSkeleton />}

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
            <Card key={appt.id}>
              <CardHeader>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Calendar className="size-3" />
                  {formatDate(appt.startTime, 'full')}
                </div>
                <CardTitle className="text-base">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
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
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
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
