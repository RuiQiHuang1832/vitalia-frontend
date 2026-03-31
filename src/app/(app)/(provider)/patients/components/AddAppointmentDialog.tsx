'use client'

import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useProviderAppointments } from '@/hooks/useProviderAppointments'
import { useProviderAvailability } from '@/hooks/useProviderAvailability'
import { addDays, addMonths, startOfDay } from 'date-fns'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import type { Appointment, Weekday } from '../types'
const WEEKDAY_MAP: Record<number, Weekday> = {
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
}

function parseHour(time: string): number {
  // Handles both "HH:mm" and ISO "...THH:mm..." formats
  const isoMatch = time.match(/T(\d{2}):/)
  if (isoMatch) return parseInt(isoMatch[1], 10)
  const plainMatch = time.match(/^(\d{2}):(\d{2})$/)
  if (plainMatch) return parseInt(plainMatch[1], 10)
  return 0
}

function generateTimeSlots(startTime: string, endTime: string): string[] {
  const startHour = parseHour(startTime)
  const endHour = parseHour(endTime)
  const slots: string[] = []
  for (let h = startHour; h < endHour; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
  }
  return slots
}

type AddAppointmentDialogProps = {
  patientId: number
  trigger?: React.ReactNode
  appointment?: Appointment
  onSuccess?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function AddAppointmentDialog({
  patientId,
  trigger,
  appointment,
  onSuccess,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddAppointmentDialogProps) {
  const { mutate } = useSWRConfig()
  const providerId = useAuthStore((s) => s.providerId)

  const isReschedule = !!appointment

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [reason, setReason] = useState(isReschedule ? (appointment.reason ?? '') : '')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen
  const { data: availability } = useProviderAvailability()
  const { data: appointments } = useProviderAppointments({
    enabled: !!availability,
    status: ['SCHEDULED'],
    limit: 200,
  })

  const minDate = useMemo(() => startOfDay(addDays(new Date(), 2)), [])
  const twoMonthsOut = useMemo(() => addMonths(new Date(), 2), [])

  const allTimeSlots = useMemo(() => {
    if (!availability) return []
    return generateTimeSlots(availability.startTime, availability.endTime)
  }, [availability])

  // Build a set of booked time strings like "2026-03-15T09:00" for quick lookup
  const bookedSlots = useMemo(() => {
    const set = new Set<string>()
    if (!appointments?.data) return set
    const now = new Date()
    for (const apt of appointments.data) {
      if (apt.status !== 'SCHEDULED') continue
      // When rescheduling, exclude the current appointment's slot so it shows as available
      if (isReschedule && apt.id === appointment.id) continue
      const start = new Date(apt.startTime)
      // Ignore past appointments
      if (start < now) continue
      // Ignore appointments beyond 2 months
      if (start > twoMonthsOut) continue
      // Ignore non-hour-aligned times (e.g. 1:02)
      if (start.getMinutes() !== 0) continue
      // Key: YYYY-MM-DD|HH:00
      const dateKey = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`
      const timeKey = `${String(start.getHours()).padStart(2, '0')}:00`
      set.add(`${dateKey}|${timeKey}`)
    }
    return set
  }, [appointments, twoMonthsOut, isReschedule, appointment?.id])

  const availableTimesForDate = useMemo(() => {
    if (!selectedDate || !availability) return []
    const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    return allTimeSlots.filter((time) => !bookedSlots.has(`${dateKey}|${time}`))
  }, [selectedDate, allTimeSlots, bookedSlots, availability])

  // Disable dates that are not working days, in the past, beyond 2 months, or fully booked
  const disabledDays = useMemo(() => {
    if (!availability) return () => true
    const workingDays = new Set(availability.workingDays)
    return (date: Date) => {
      const dayOfWeek = date.getDay() // 0=Sun, 1=Mon, ...
      const weekday = WEEKDAY_MAP[dayOfWeek]
      // Disable weekends or non-working days
      if (!weekday || !workingDays.has(weekday)) return true
      // Disable beyond 2 months
      if (date > twoMonthsOut) return true
      // Check if all slots are booked for this date
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      const allBooked =
        allTimeSlots.length > 0 &&
        allTimeSlots.every((time) => bookedSlots.has(`${dateKey}|${time}`))
      return allBooked
    }
  }, [availability, twoMonthsOut, allTimeSlots, bookedSlots])

  function resetForm() {
    setSelectedDate(undefined)
    setSelectedTime(null)
    setReason(isReschedule ? (appointment.reason ?? '') : '')
    setError(null)
  }

  async function handleSubmit() {
    if (!selectedDate || !selectedTime) return
    setIsLoading(true)

    const [hours, minutes] = selectedTime.split(':').map(Number)

    const startTime = new Date(selectedDate)
    startTime.setHours(hours, minutes, 0, 0)

    const endTime = new Date(startTime)
    endTime.setHours(startTime.getHours() + 1)

    const pad = (n: number) => String(n).padStart(2, '0')
    const formatLocal = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`

    try {
      if (isReschedule) {
        const res = await fetch(`/api/appointments/${appointment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startTime: formatLocal(startTime),
            endTime: formatLocal(endTime),
            reason: reason || appointment.reason,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data?.message || 'Failed to reschedule appointment')
        }
        toast.success(
          `Appointment rescheduled to ${selectedDate.toLocaleDateString()} at ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        )
      } else {
        const res = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            providerId,
            patientId,
            startTime: formatLocal(startTime),
            endTime: formatLocal(endTime),
            reason: reason || 'No reason provided',
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data?.message || 'Failed to create appointment')
        }
        toast.success(
          `Appointment scheduled for ${selectedDate.toLocaleDateString()} at ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        )
      }

      mutate(`/patients/${patientId}`)
      // Invalidate any cached appointments so the Appointments page
      // doesn't flash stale SWR data before revalidating
      mutate(
        (key) => typeof key === 'string' && key.startsWith('/appointments/provider/'),
        undefined,
        { revalidate: false }
      )
      onSuccess?.()
      setOpen(false)
      resetForm()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      console.error(err)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (v) resetForm()
      }}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {isReschedule ? 'Reschedule Appointment' : 'Schedule Appointment'}
          </DialogTitle>
          <DialogDescription>Pick a date and available time slot.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Left — Calendar */}
          <div className="shrink-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date)
                setSelectedTime(null)
              }}
              disabled={[{ before: minDate }, disabledDays]}
              startMonth={new Date()}
              endMonth={twoMonthsOut}
            />
          </div>

          {/* Right — Time slots */}
          <div className="flex flex-col flex-1 min-w-0 gap-2">
            <Label className="text-sm font-medium">
              {selectedDate
                ? selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Select a date'}
            </Label>
            <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
              {selectedDate ? (
                availableTimesForDate.length > 0 ? (
                  availableTimesForDate.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      className="justify-center"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No available time slots for this date.
                  </p>
                )
              ) : (
                <p className="text-sm text-muted-foreground">
                  Please select a date to view available times.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-2">
          <Label htmlFor="appointment-reason">Reason for visit</Label>
          <Textarea
            id="appointment-reason"
            className="field-sizing-fixed"
            placeholder="e.g. Routine follow-up visit"
            rows={7}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Submit */}
        <Button
          className="w-full hover:bg-teal-700 bg-teal-600 text-white"
          disabled={!selectedDate || !selectedTime || isLoading}
          onClick={handleSubmit}
        >
          {isLoading
            ? isReschedule
              ? 'Rescheduling...'
              : 'Scheduling...'
            : isReschedule
              ? 'Confirm Reschedule'
              : 'Confirm Appointment'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
