'use client'

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
import { Plus } from 'lucide-react'
import { useState } from 'react'

const AVAILABLE_TIMES = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']

type AddAppointmentDialogProps = {
  patientId: number
}

export default function AddAppointmentDialog({ patientId }: AddAppointmentDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const [open, setOpen] = useState(false)

  function handleSubmit() {
    if (!selectedDate || !selectedTime) return

    const [hours, minutes] = selectedTime.split(':').map(Number)

    const startTime = new Date(selectedDate)
    startTime.setHours(hours, minutes, 0, 0)

    const endTime = new Date(startTime)
    endTime.setHours(startTime.getHours() + 1)

    const payload = {
      patientId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      reason: reason || null,
    }

    console.log('Appointment payload:', payload)
    // TODO: call API to create appointment
    // await fetch('/api/appointments', { method: 'POST', body: JSON.stringify(payload) })

    setOpen(false)
    setSelectedDate(undefined)
    setSelectedTime(null)
    setReason('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hover:bg-teal-700 bg-teal-600 text-white">
          <Plus />
          New Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Schedule Appointment</DialogTitle>
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
              disabled={{ before: new Date() }}
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
                AVAILABLE_TIMES.map((time) => (
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
            placeholder="e.g. Routine follow-up visit"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Submit */}
        <Button
          className="w-full hover:bg-teal-700 bg-teal-600 text-white"
          disabled={!selectedDate || !selectedTime}
          onClick={handleSubmit}
        >
          Confirm Appointment
        </Button>
      </DialogContent>
    </Dialog>
  )
}
