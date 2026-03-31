'use client'

import CancelAppointmentDialog from '@/app/(app)/(provider)/appointments/components/CancelAppointmentDialog'
import CompleteAppointmentDialog from '@/app/(app)/(provider)/appointments/components/CompleteAppointmentDialog'
import AllergiesSection from '@/app/(app)/(provider)/appointments/components/sections/AllergiesSection'
import MedicationsSection from '@/app/(app)/(provider)/appointments/components/sections/MedicationsSection'
import ProblemsSection from '@/app/(app)/(provider)/appointments/components/sections/ProblemsSection'
import VisitNoteSection from '@/app/(app)/(provider)/appointments/components/sections/VisitNoteSection'
import VitalsSection from '@/app/(app)/(provider)/appointments/components/sections/VitalsSection'
import AddAppointmentDialog from '@/app/(app)/(provider)/patients/components/AddAppointmentDialog'
import { type AppointmentWithPatient } from '@/app/(app)/(provider)/patients/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useClampedText } from '@/hooks/useClampedText'
import { getNameColors } from '@/lib/colorMap'
import { formatDate, formatPatientName, formatTime } from '@/lib/utils'
import {
  Calendar,
  CalendarClock,
  CheckCircle,
  ChevronDown,
  ExternalLink,
  User,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

interface AppointmentDetailsProps {
  appointment: AppointmentWithPatient | null
  onMutate: () => void
  onCancel: () => void
}

export default function AppointmentDetails({
  appointment,
  onMutate,
  onCancel,
}: AppointmentDetailsProps) {
  const [completeOpen, setCompleteOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const {
    ref: reasonRef,
    expanded: reasonExpanded,
    showToggle: reasonShowToggle,
    toggle: reasonToggle,
  } = useClampedText(appointment?.id)

  async function handleCompleteAppointment() {
    try {
      const res = await fetch(`/api/appointments/${appointment?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.message ?? 'Failed to complete appointment')
      }
      toast.success('Encounter signed and locked')
      onMutate?.()
      onCancel()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred')
      console.error(error)
    }
  }

  async function handleCancelAppointment() {
    try {
      const res = await fetch(`/api/appointments/${appointment?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'CANCELLED' }),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.message ?? 'Failed to cancel appointment')
      }
      toast.success('Appointment cancelled')
      onMutate?.()
      onCancel()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred')
      console.error(error)
    }
  }

  if (!appointment) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-sm text-muted-foreground text-center">
            Select an appointment to view details, start the appointment and manage the visit note,
            vitals, problems, medications, and allergies.
          </p>
        </CardContent>
      </Card>
    )
  }

  const patientName = appointment.patient
    ? formatPatientName(appointment.patient.firstName, appointment.patient.lastName)
    : `Patient #${appointment.patientId}`

  const readOnly = appointment.status !== 'SCHEDULED'
  const { bg, border } = getNameColors(patientName)

  const statusStyles: Record<string, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-700 border border-blue-300',
    COMPLETED: 'bg-emerald-100 text-emerald-700 border border-emerald-300',
    CANCELLED: 'bg-red-100 text-red-700 border border-red-300',
  }

  return (
    <Card className="border-0 pt-0 gap-0 h-full flex flex-col shadow-md bg-slate-50/60">
      <CardHeader className={` rounded-t-xl border-b-2 ${border} p-5 shrink-0`}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{patientName}</CardTitle>
            <p className="text-sm text-gray-600">
              {formatDate(appointment.startTime, 'full')} · {formatTime(appointment.startTime)} –{' '}
              {formatTime(appointment.endTime)}
            </p>
          </div>
          <div className="flex items-center">
            {!readOnly && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-blue-500 text-white border-blue-600 hover:bg-blue-600"
                    >
                      Manage
                      <ChevronDown className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setCompleteOpen(true)}>
                      <CheckCircle className="size-4 text-teal-600" />
                      Complete Visit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRescheduleOpen(true)}>
                      <CalendarClock className="size-4 text-blue-600" />
                      Reschedule
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setCancelOpen(true)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <XCircle color="red" className="size-4" />
                      Cancel Appointment
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <CompleteAppointmentDialog
                  patientName={patientName}
                  hasVisitNote={!!appointment.visitNote?.versions?.length}
                  open={completeOpen}
                  onOpenChange={setCompleteOpen}
                  onConfirm={handleCompleteAppointment}
                />
                <AddAppointmentDialog
                  patientId={appointment.patientId}
                  appointment={appointment}
                  open={rescheduleOpen}
                  onOpenChange={setRescheduleOpen}
                  onSuccess={() => {
                    onMutate()
                    onCancel()
                  }}
                />
                <CancelAppointmentDialog
                  patientName={patientName}
                  startTime={appointment.startTime}
                  endTime={appointment.endTime}
                  open={cancelOpen}
                  onOpenChange={setCancelOpen}
                  onConfirm={handleCancelAppointment}
                />
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6 overflow-y-auto">
        {/* Patient Info */}
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-4">
          <h3 className="flex items-center gap-2 text-base font-semibold mb-3">
            <User className="size-4" />
            Patient Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <Link
                href={`/patients/${appointment.patientId}`}
                className="font-medium text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                {patientName}
                <ExternalLink className="size-3" />
              </Link>
            </div>
            <div>
              <p className="text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{formatDate(appointment.patient.dob, 'full')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{appointment.patient.phone || '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Gender</p>
              <p className="font-medium">{appointment.patient.gender}</p>
            </div>
            <div>
              <p className="text-muted-foreground">MRN</p>
              <p className="font-medium">{String(appointment.patient.id).padStart(6, '0')}</p>
            </div>
          </div>
        </div>

        {/* Appointment Info */}
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-4">
          <h3 className="flex items-center gap-2 text-base font-semibold mb-3">
            <Calendar className="size-4" />
            Appointment Info
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">{formatDate(appointment.startTime, 'full')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Time</p>
              <p className="font-medium">
                {formatTime(appointment.startTime)} – {formatTime(appointment.endTime)}
              </p>
            </div>
            <div className="min-w-0">
              <p className="text-muted-foreground">Reason</p>
              <p
                ref={reasonRef}
                className={`font-medium wrap-break-word ${!reasonExpanded ? 'line-clamp-3' : ''}`}
              >
                {appointment.reason ?? 'No reason provided'}
              </p>
              {reasonShowToggle && (
                <button
                  type="button"
                  onClick={reasonToggle}
                  className="text-xs text-blue-600 hover:underline mt-1"
                >
                  {reasonExpanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <span
                className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 ${statusStyles[appointment.status]}`}
              >
                {appointment.status}
              </span>
            </div>
          </div>
        </div>

        <VisitNoteSection
          key={`note-${appointment.id}`}
          appointment={appointment}
          readOnly={readOnly}
          onMutate={onMutate}
        />
        <VitalsSection
          key={`vitals-${appointment.id}`}
          appointment={appointment}
          readOnly={readOnly}
          onMutate={onMutate}
        />
        <ProblemsSection
          key={`problems-${appointment.id}`}
          appointment={appointment}
          readOnly={readOnly}
          onMutate={onMutate}
        />
        <MedicationsSection
          key={`meds-${appointment.id}`}
          appointment={appointment}
          readOnly={readOnly}
          onMutate={onMutate}
        />
        <AllergiesSection
          key={`allergies-${appointment.id}`}
          appointment={appointment}
          readOnly={readOnly}
          onMutate={onMutate}
        />
      </CardContent>
    </Card>
  )
}
