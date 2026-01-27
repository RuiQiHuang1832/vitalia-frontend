import NextAppointmentSkeleton from '@/app/(app)/dashboard/components/NextAppointment/NextAppointmentSkeleton'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'
import { useProviderAppointments } from '@/hooks/useProviderAppointments'
import { calculateAge, capitalize, cn } from '@/lib/utils'
import { Calendar, MapPin, User } from 'lucide-react'
import { generateUiMrn } from '../../lib/helper'

function formatTimeRange(startTime: string, endTime?: string) {
  const start = new Date(startTime.replace(' ', 'T'))
  const end = endTime ? new Date(endTime.replace(' ', 'T')) : undefined

  const isoDate = startTime.split(' ')[0]
  const startDateText = isoDate.length >= 10 ? isoDate.slice(5, 10) : isoDate

  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date)

  const startText = formatTime(start)
  const endText = end ? formatTime(end) : undefined

  const timeRangeText = endText ? `${startText} – ${endText}` : startText
  return `${startDateText} • ${timeRangeText}`
}

function getAppointmentStatus(startTime: string) {
  const now = new Date()
  const start = new Date(startTime.replace(' ', 'T'))

  if (now >= start) {
    const arrivedVariants = ['Patient arrived • Ready', 'Waiting room • Telehealth']

    return {
      status: 'ACTIVE',
      label: arrivedVariants[Math.floor(Math.random() * arrivedVariants.length)],
    }
  }

  const diffMs = start.getTime() - now.getTime()
  const mins = Math.max(1, Math.floor(diffMs / 60000))

  return {
    status: 'UPCOMING',
    label: `Starts in ${mins} mins`,
  }
}

export default function NextAppointmentCard() {
  // pretend this came from backend
  const appointment = {
    startTime: '2025-05-12 22:00:00',
    endTime: '2025-05-12 23:00:00',
  }
  const { data: payload, isLoading, error } = useProviderAppointments()
  const { label } = getAppointmentStatus(appointment.startTime)
  const timeText = formatTimeRange(appointment.startTime, appointment.endTime)
  if (isLoading) {
    return <NextAppointmentSkeleton />
  }
  if (error || !payload?.data?.length || !payload.data[0]?.patient) {
    return <div>Error loading appointment data. Try refreshing the page.</div>
  }
  const patientInfo = payload.data[0].patient
  // console.log(payload.data[0])
  const appointmentInfo = payload.data[0]
  const { reason, startTime, endTime, status } = appointmentInfo
  const { firstName, lastName, dob, gender } = patientInfo
  // console.log(patientInfo)
  const age = calculateAge(dob)
  const MRN = generateUiMrn(patientInfo.id)
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>
            <Stack gap={2} className="items-center">
              <span className="relative flex size-2.5 items-center">
                <span
                  className={cn(
                    'absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75'
                  )}
                ></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-green-500"></span>
              </span>
              Next Appointment
            </Stack>
          </CardTitle>
          <CardDescription>{label}</CardDescription>
        </div>

        <CardAction>
          <Button variant="link" size="sm">
            View Full Schedule →
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Patient + Appointment Info */}
        <div className="flex items-start gap-4">
          {/* Avatar / Initials */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted font-medium">
            {firstName.charAt(0)}
            {lastName.charAt(0)}
          </div>

          <div className="flex-1">
            <Stack justify="between">
              <div>
                <p className="font-semibold">
                  {firstName} {lastName}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{MRN}</p>
            </Stack>
            <div className=" space-y-1">
              <Stack gap={2} className="text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>
                  {age} y/o • {capitalize(gender)}
                </span>
              </Stack>
              <Stack gap={2} className="text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{timeText}</span>
              </Stack>
              <Stack gap={2} className="text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Room 3 • Internal Medicine</span>
              </Stack>
            </div>
          </div>
        </div>

        {/* Primary Concern */}
        <div className="rounded-lg border bg-muted/40 p-3 space-y-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Primary Concern</p>
            <p className="font-medium">{reason}</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm">
            <span className="text-slate-500">
              HR
              <span className="ml-1 font-semibold text-slate-900">72 bpm</span>
            </span>

            <span className="text-slate-500">
              BP
              <span className="ml-1 font-semibold text-slate-900">118 / 76</span>
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button>Start Visit</Button>
        <Button variant="outline">View Chart</Button>
        <Button variant="outline">Add Vitals</Button>
      </CardFooter>
    </Card>
  )
}
