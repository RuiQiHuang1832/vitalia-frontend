'use client'

import { useState } from 'react'
import { Appointment, PatientFull } from '@/app/(app)/(provider)/patients/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Stack } from '@/components/ui/stack'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, formatTime } from '@/lib/utils'
import { useClampedText } from '@/hooks/useClampedText'
import Link from 'next/link'
import { Calendar, ChevronDown, Clock, FileText, NotepadText } from 'lucide-react'

type TabAppointmentDataProps = Pick<PatientFull, 'appointments'>

function statusVariant(status: Appointment['status']) {
  switch (status) {
    case 'SCHEDULED':
      return 'default'
    case 'COMPLETED':
      return 'secondary'
    case 'CANCELLED':
      return 'destructive'
  }
}

function CurrentAppointmentCard({ appointment }: { appointment: Appointment }) {
  const { ref: reasonRef, expanded, showToggle, toggle } = useClampedText(appointment.reason)

  return (
    <Link href={`/appointments?select=${appointment.id}`} className="block">
    <Card className="transition-colors hover:border-blue-400 hover:bg-muted/50 cursor-pointer">
      <CardHeader>
        <Stack gap={0} justify="between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {formatDate(appointment.startTime, 'short')}
          </CardTitle>
          <Badge variant={statusVariant(appointment.status)}>{appointment.status}</Badge>
        </Stack>
        <CardDescription className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" />
          {formatTime(appointment.startTime)} – {formatTime(appointment.endTime)}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        {appointment.reason && (
          <div>
            <p ref={reasonRef} className={`wrap-break-word ${!expanded ? 'line-clamp-3' : ''}`}>
              <span className="text-muted-foreground">Reason:</span> {appointment.reason}
            </p>
            {showToggle && (
              <button
                type="button"
                onClick={toggle}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                {expanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}

        {appointment.visitNote ? (
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:underline cursor-pointer [&[data-state=open]>svg.chevron]:rotate-180">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Visit Note (v{appointment.visitNote.latestVersion})
              <ChevronDown className="chevron h-4 w-4 text-muted-foreground transition-transform" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              {appointment.visitNote.versions.map((version) => (
                <div key={version.id} className="rounded-md border p-3 text-sm space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium">Version {version.version}</span>
                    <span>{formatDate(version.createdAt, 'datetime')}</span>
                  </div>
                  <p className="whitespace-pre-wrap">{version.content}</p>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <p className="text-muted-foreground text-xs">No visit note recorded.</p>
        )}
      </CardContent>
    </Card>
    </Link>
  )
}

const INITIAL_PAST_LIMIT = 5

export default function TabAppointment({ data }: { data: TabAppointmentDataProps }) {
  const [showAllPast, setShowAllPast] = useState(false)
  const now = new Date()
  const current: Appointment[] = []
  const past: Appointment[] = []

  for (const appt of data.appointments) {
    if (appt.status === 'SCHEDULED' && new Date(appt.startTime) >= now) {
      current.push(appt)
    } else {
      past.push(appt)
    }
  }

  // Backend returns appointments sorted by startTime desc.
  // Reverse current so upcoming shows soonest first (asc).
  current.reverse()

  const visiblePast = showAllPast ? past : past.slice(0, INITIAL_PAST_LIMIT)
  const hiddenCount = past.length - INITIAL_PAST_LIMIT

  return (
    <div className="space-y-6">
      {/* Current / Upcoming Appointments */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          Upcoming Appointments
        </h3>
        {current.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {current.map((appt) => (
              <CurrentAppointmentCard key={appt.id} appointment={appt} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground text-sm">
              No upcoming appointments scheduled.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Previous Appointments Table */}
      <Card className="py-0 gap-0">
        <CardHeader className="border-b !py-5 gap-0">
          <CardTitle className="flex items-center gap-2">
            <NotepadText className="w-5 h-5 text-muted-foreground" />
            Previous Appointments
          </CardTitle>
        </CardHeader>
        {past.length > 0 ? (
          <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Visit Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visiblePast.map((appt) => (
                <Collapsible key={appt.id} asChild>
                  <>
                    <CollapsibleTrigger asChild>
                      <TableRow className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {formatDate(appt.startTime, 'short')}
                        </TableCell>
                        <TableCell>
                          {formatTime(appt.startTime)} – {formatTime(appt.endTime)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(appt.status)}>{appt.status}</Badge>
                        </TableCell>
                        <TableCell className="max-w-48 truncate" title={appt.reason ?? undefined}>
                          {appt.reason ?? '—'}
                        </TableCell>
                        <TableCell>
                          {appt.visitNote ? (
                            <span className="flex items-center gap-1 text-xs">
                              <FileText className="h-3.5 w-3.5" />v{appt.visitNote.latestVersion}
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    </CollapsibleTrigger>
                    {appt.visitNote && (
                      <CollapsibleContent asChild>
                        <TableRow>
                          <TableCell colSpan={5} className="bg-muted/30 p-4">
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground">
                                Visit Note Versions
                              </p>
                              {appt.visitNote.versions.map((version) => (
                                <div
                                  key={version.id}
                                  className="rounded-md border bg-background p-3 text-sm space-y-1"
                                >
                                  <Stack
                                    justify="between"
                                    className="text-xs text-muted-foreground"
                                  >
                                    <span className="font-medium">Version {version.version}</span>
                                    <span>{formatDate(version.createdAt, 'datetime')}</span>
                                  </Stack>
                                  <p className="whitespace-pre-wrap">{version.content}</p>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    )}
                  </>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
          {hiddenCount > 0 && (
            <div className="border-t px-4 py-3 text-center">
              <button
                type="button"
                onClick={() => setShowAllPast(!showAllPast)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                {showAllPast ? 'Show less' : `Show ${hiddenCount} more`}
              </button>
            </div>
          )}
          </>
        ) : (
          <CardContent className="py-6 text-center text-muted-foreground text-sm">
            No previous appointments.
          </CardContent>
        )}
      </Card>
    </div>
  )
}
