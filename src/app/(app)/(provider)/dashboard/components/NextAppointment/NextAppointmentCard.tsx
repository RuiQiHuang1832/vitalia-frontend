import NextAppointmentSkeleton from '@/app/(app)/(provider)/dashboard/components/NextAppointment/NextAppointmentSkeleton'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'
import { useProviderAppointments } from '@/hooks/useProviderAppointments'
import { getNameColors } from '@/lib/colorMap'
import { calculateAge, capitalize, cn } from '@/lib/utils'
import { Activity, Calendar, Droplet, HeartPulse, MapPin, Thermometer, User } from 'lucide-react'
import { PiClipboardTextDuotone } from 'react-icons/pi'
import { generateUiMrn } from '../../lib/helper'

export const vitalsSummary = [
  {
    id: 'bp',
    label: 'Blood Pressure',
    value: '120/80',
    unit: 'mmHg',
    subtext: '120 / 80 MT',
    trend: 'higher',
    trendValue: '1%',
    icon: Activity,
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    trendColor: 'text-green-600',
  },
  {
    id: 'glucose',
    label: 'Blood Glucose',
    value: '97.22',
    unit: 'mmol/L',
    subtext: '97.22',
    trend: 'lower',
    trendValue: '2%',
    icon: Droplet,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    trendColor: 'text-red-500',
  },
  {
    id: 'temp',
    label: 'Body Temp.',
    value: '99.5',
    unit: '°F',
    subtext: '99.5 °F',
    trend: 'higher',
    trendValue: '2%',
    icon: Thermometer,
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    trendColor: 'text-emerald-600',
  },
  {
    id: 'hr',
    label: 'Heart Rate',
    value: '72',
    unit: 'bpm',
    subtext: '72 bpm',
    trend: 'lower',
    trendValue: '2%',
    icon: HeartPulse,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    trendColor: 'text-fuchsia-500',
  },
]

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
  const { bg, text } = getNameColors(firstName)

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <CardTitle>Next Appointment</CardTitle>
        <CardDescription className="text-xs font-medium  px-2 py-1 text-black bg-accent rounded-full">
          <Stack gap={2}>
            <span className="relative flex size-2.5 items-center">
              <span
                className={cn(
                  'absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75'
                )}
              ></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-green-500"></span>
            </span>
            {label}
          </Stack>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Patient + Appointment Info */}
        <div className="flex items-start gap-4">
          {/* Avatar / Initials */}
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${bg} ${text} font-medium`}
          >
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

        <div className="rounded-lg border bg-blue-50/50 border-l-4 border-l-blue-400 p-3 pl-4 space-y-2">
          <div>
            <div className="flex items-center gap-2 mb-1 ">
              <PiClipboardTextDuotone className="h-4 w-4" />
              <p className="text font-medium text-sm">Reason for visit</p>
            </div>

            <p className="font-medium text text-slate-900 text-sm">{reason}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {vitalsSummary.map((vital) => {
            const Icon = vital.icon

            return (
              <div key={vital.id} className={`rounded-lg border p-3 ${vital.bg}`}>
                <Stack className="mb-2">
                  <p className={`text font-medium ${vital.text}`}>
                    {vital.value}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      {vital.unit}
                    </span>
                  </p>
                </Stack>

                <p className="text-sm font-medium text-slate-900">{vital.label}</p>

                <Stack justify="between" className=" mt-2 text-xs">
                  <Stack gap={1} className="text-muted-foreground">
                    <Icon className="h-3.5 w-3.5" />
                    {vital.subtext}
                  </Stack>
                  <span className={vital.trendColor}>
                    {vital.trendValue} {vital.trend}
                  </span>
                </Stack>
              </div>
            )
          })}
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
