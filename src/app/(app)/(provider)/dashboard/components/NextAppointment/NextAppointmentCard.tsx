import NextAppointmentSkeleton from '@/app/(app)/(provider)/dashboard/components/NextAppointment/NextAppointmentSkeleton'
import { type AppointmentWithPatient, type Vital } from '@/app/(app)/(provider)/patients/types'
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
import { capitalize, cn, formatTime, getPatientDisplay } from '@/lib/utils'
import {
  Activity,
  Calendar,
  ClipboardPlus,
  Droplet,
  FileText,
  HeartPulse,
  Play,
  Thermometer,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import { PiClipboardTextDuotone } from 'react-icons/pi'

const vitalConfig = [
  {
    id: 'bp',
    label: 'Blood Pressure',
    unit: 'mmHg',
    icon: Activity,
    accent: 'border-l-orange-300',
    iconColor: 'text-orange-500',
    getValue: (v: Vital) =>
      v.bloodPressureSystolic != null && v.bloodPressureDiastolic != null
        ? `${v.bloodPressureSystolic}/${v.bloodPressureDiastolic}`
        : null,
  },
  {
    id: 'hr',
    label: 'Heart Rate',
    unit: 'bpm',
    icon: HeartPulse,
    accent: 'border-l-blue-300',
    iconColor: 'text-blue-500',
    getValue: (v: Vital) => (v.heartRate != null ? String(v.heartRate) : null),
  },
  {
    id: 'temp',
    label: 'Body Temp.',
    unit: '°F',
    icon: Thermometer,
    accent: 'border-l-cyan-300',
    iconColor: 'text-cyan-500',
    getValue: (v: Vital) => (v.temperature != null ? String(v.temperature) : null),
  },
  {
    id: 'o2',
    label: 'O₂ Saturation',
    unit: '%',
    icon: Droplet,
    accent: 'border-l-emerald-300',
    iconColor: 'text-emerald-500',
    getValue: (v: Vital) => (v.oxygenSaturation != null ? String(v.oxygenSaturation) : null),
  },
]

function getStatusBadge(appointment: AppointmentWithPatient) {
  const now = new Date()
  const start = new Date(appointment.startTime)

  if (appointment.status === 'COMPLETED') return { label: 'Completed', dotColor: 'bg-gray-400' }
  if (appointment.status === 'CANCELLED') return { label: 'Cancelled', dotColor: 'bg-red-400' }

  if (now >= start) return { label: 'In progress', dotColor: 'bg-green-500' }

  const diffMs = start.getTime() - now.getTime()
  const mins = Math.floor(diffMs / 60000)

  if (mins < 60) return { label: `Starts in ${mins} min`, dotColor: 'bg-green-500' }
  return { label: `Starts in ${Math.floor(mins / 60)}h ${mins % 60}m`, dotColor: 'bg-green-500' }
}

export default function NextAppointmentCard() {
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const { data: payload, isLoading, error } = useProviderAppointments({
    limit: 1,
    status: ['SCHEDULED'],
    fromDate: today,
  })

  if (isLoading) return <NextAppointmentSkeleton />

  if (error || !payload?.data?.length || !payload.data[0]?.patient) {
    return (
      <Card className="h-full">
        <CardContent className="py-12">
          <p className="text-sm text-muted-foreground text-center">
            No upcoming appointments.
          </p>
        </CardContent>
      </Card>
    )
  }

  const appointment = payload.data[0] as AppointmentWithPatient
  const { patient, reason, startTime, endTime, vitals } = appointment
  const { gender } = patient
  const { name: patientName, initials, age, mrn, colors: { bg, border, ring } } = getPatientDisplay(patient, appointment.patientId)
  const latestVital = vitals?.[vitals.length - 1] ?? null
  const { label, dotColor } = getStatusBadge(appointment)

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <CardTitle>Next Appointment</CardTitle>
        <CardDescription className="text-xs font-medium px-2 py-1 text-black bg-accent rounded-full">
          <Stack gap={2}>
            <span className="relative flex size-2.5 items-center">
              <span
                className={cn(
                  'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                  dotColor
                )}
              />
              <span className={cn('relative inline-flex size-2.5 rounded-full', dotColor)} />
            </span>
            {label}
          </Stack>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full font-medium ${bg} ${border} ${ring}`}>
            {initials}
          </div>

          <div className="flex-1">
            <Stack justify="between">
              <p className="font-semibold">
                {patientName}
              </p>
              <p className="text-xs text-muted-foreground">{mrn}</p>
            </Stack>
            <div className="space-y-1">
              <Stack gap={2} className="text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>
                  {age} y/o • {capitalize(gender)}
                </span>
              </Stack>
              <Stack gap={2} className="text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatTime(startTime)} – {formatTime(endTime)}
                </span>
              </Stack>
            </div>
          </div>
        </div>

        {reason && (
          <div className="rounded-lg border bg-blue-50/50 border-l-4 border-l-blue-400 p-3 pl-4">
            <div className="flex items-center gap-2 mb-1">
              <PiClipboardTextDuotone className="h-4 w-4" />
              <p className="text-sm font-medium">Reason for visit</p>
            </div>
            <p className="text-sm">{reason}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {vitalConfig.map((vital) => {
            const Icon = vital.icon
            const value = latestVital ? vital.getValue(latestVital) : null

            return (
              <div
                key={vital.id}
                className={`rounded-lg border border-l-4 ${vital.accent} bg-card p-3`}
              >
                <Stack className="mb-2">
                  <p className="text font-medium">
                    {value ?? '—'}
                    {value && (
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        {vital.unit}
                      </span>
                    )}
                  </p>
                </Stack>

                <p className="text-sm font-medium">{vital.label}</p>

                <Stack justify="between" className="mt-2 text-xs">
                  <Stack gap={1} className="text-muted-foreground">
                    <Icon className={`h-3.5 w-3.5 ${vital.iconColor}`} />
                    {value ? `${value} ${vital.unit}` : 'No data'}
                  </Stack>
                </Stack>
              </div>
            )
          })}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
          <Link href={`/appointments?select=${appointment.id}`}>
            <Play className="h-4 w-4" />
            Start Visit
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/patients/${patient.id}`}>
            <FileText className="h-4 w-4" />
            View Chart
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/appointments?select=${appointment.id}`}>
            <ClipboardPlus className="h-4 w-4" />
            Add Vitals
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
