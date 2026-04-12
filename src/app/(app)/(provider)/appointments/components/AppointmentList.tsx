import AppointmentListSkeleton from '@/app/(app)/(provider)/appointments/components/AppointmentListSkeleton'
import {
  type Appointment,
  type AppointmentWithPatient,
} from '@/app/(app)/(provider)/patients/types'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { formatDate, formatTime, getPatientDisplay } from '@/lib/utils'
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react'

const statusStyles: Record<Appointment['status'], string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700 border border-blue-300',
  COMPLETED: 'bg-emerald-100 text-emerald-700 border border-emerald-300',
  CANCELLED: 'bg-red-100 text-red-700 border border-red-300',
}

const overdueStyle = 'bg-amber-100 text-amber-800 border border-amber-300'

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
          No {tab} appointments.
        </div>
      )}

      <div className="space-y-3">
        {appointments.map((appt) => {
          const { name: patientName, mrn: patientMrn, colors: { bg, border, ring } } = getPatientDisplay(appt.patient, appt.patientId)

          return (
            <Card
              key={appt.id}
              className={`cursor-pointer transition-all duration-200 border-0 border-r-6 ${border} rounded-xl ${bg} ${selectedId === appt.id ? `ring-2 ${ring} scale-[1.02] shadow-md` : 'hover:opacity-90'}`}
              onClick={() => onSelect(appt)}
            >
              <CardContent className="px-4">
                <div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className="font-semibold text-base truncate">{patientName}</p>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${tab === 'overdue' ? overdueStyle : statusStyles[appt.status]}`}
                      >
                        {tab === 'overdue' ? 'OVERDUE' : appt.status}
                      </span>
                    </div>
                    <p
                      className="text-sm text-gray-600 italic line-clamp-1"
                      title={appt.reason ?? undefined}
                    >
                      {appt.reason ?? 'No reason provided'}
                    </p>
                    <div className="flex items-end justify-between mt-1">
                      <div className="flex flex-col text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {formatDate(appt.startTime, 'full')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatTime(appt.startTime)} – {formatTime(appt.endTime)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {patientMrn}
                      </span>
                    </div>
                  </div>
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
