'use client'

import { WEEKDAYS } from '@/app/(app)/(provider)/availability/types'
import type { ProviderAvailability, Weekday } from '@/app/(app)/(provider)/patients/types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Clock, Save } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

function generateTimeOptions() {
  const options: string[] = []
  for (let h = 0; h < 24; h++) {
    options.push(`${String(h).padStart(2, '0')}:00`)
  }
  return options
}

function formatTime(time: string) {
  const h = parseInt(time.split(':')[0], 10)
  const period = h >= 12 ? 'PM' : 'AM'
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${displayH}:00 ${period}`
}

const TIME_OPTIONS = generateTimeOptions()

type AvailabilityFormProps = {
  availability?: ProviderAvailability
  mode: 'create' | 'edit'
  onSaved?: (data: ProviderAvailability) => void
}

export default function AvailabilityForm({ availability, mode, onSaved }: AvailabilityFormProps) {
  const [workingDays, setWorkingDays] = useState<Weekday[]>(availability?.workingDays ?? [])
  const [startTime, setStartTime] = useState(availability?.startTime ?? '09:00')
  const [endTime, setEndTime] = useState(availability?.endTime ?? '17:00')
  const [saving, setSaving] = useState(false)

  function toggleDay(day: Weekday) {
    setWorkingDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  async function handleSubmit() {
    if (workingDays.length === 0) {
      toast.error('Please select at least one working day.')
      return
    }

    const startMinutes = timeToMinutes(startTime)
    const endMinutes = timeToMinutes(endTime)

    if (startMinutes >= endMinutes) {
      toast.error('Start time must be before end time.')
      return
    }

    setSaving(true)
    try {
      if (mode === 'create') {
        const res = await fetch('/api/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ workingDays, startTime, endTime }),
          credentials: 'include',
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.message || 'Failed to create availability.')
        }
        toast.success('Availability created.')
        onSaved?.(data)
      } else if (mode === 'edit' && availability) {
        const res = await fetch(`/api/availability/${availability.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ workingDays, startTime, endTime }),
          credentials: 'include',
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.message || 'Failed to update availability.')
        }
        toast.success('Availability updated.')
        onSaved?.(data)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="size-5" />
          {mode === 'create' ? 'Set Your Availability' : 'Update Your Availability'}
        </CardTitle>
        <CardDescription>
          Choose the days and hours you are available for appointments.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Working Days */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Working Days</Label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {WEEKDAYS.map(({ value, label }) => {
              const checked = workingDays.includes(value)
              return (
                <label
                  key={value}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                    checked
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <Checkbox checked={checked} onCheckedChange={() => toggleDay(value)} />
                  {label}
                </label>
              )
            })}
          </div>
        </div>

        {/* Time Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Working Hours</Label>
          <div className="flex items-center gap-3">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs">Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {formatTime(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="text-muted-foreground mt-5">to</span>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs">End Time</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {formatTime(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Summary */}
        {workingDays.length > 0 && (
          <div className="rounded-lg bg-muted/50 p-4 text-sm">
            <p className="font-medium">Schedule Summary</p>
            <p className="text-muted-foreground mt-1">
              {workingDays
                .sort(
                  (a, b) =>
                    WEEKDAYS.findIndex((w) => w.value === a) -
                    WEEKDAYS.findIndex((w) => w.value === b)
                )
                .map((d) => WEEKDAYS.find((w) => w.value === d)?.label)
                .join(', ')}
            </p>
            <p className="text-muted-foreground">
              {formatTime(startTime)} – {formatTime(endTime)}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button onClick={handleSubmit} disabled={saving}>
          <Save className="size-4" />
          {saving ? 'Saving...' : mode === 'create' ? 'Create Availability' : 'Update Availability'}
        </Button>
      </CardFooter>
    </Card>
  )
}

function timeToMinutes(time: string) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}
