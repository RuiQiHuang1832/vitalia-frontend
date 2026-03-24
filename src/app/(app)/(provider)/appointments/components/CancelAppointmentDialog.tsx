'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate, formatTime } from '@/lib/utils'
import { useState } from 'react'

const CANCELLATION_REASONS = [
  { value: 'patient_request', label: 'Patient requested cancellation' },
  { value: 'provider_unavailable', label: 'Provider unavailable' },
  { value: 'patient_no_show', label: 'Patient no-show' },
  { value: 'scheduling_conflict', label: 'Scheduling conflict' },
  { value: 'medical_reason', label: 'Medical reason' },
  { value: 'other', label: 'Other' },
]

interface CancelAppointmentDialogProps {
  patientName: string
  startTime: string
  endTime: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export default function CancelAppointmentDialog({
  patientName,
  startTime,
  endTime,
  open,
  onOpenChange,
  onConfirm,
}: CancelAppointmentDialogProps) {
  const [reason, setReason] = useState('')

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel{' '}
            {patientName}&apos;s appointment on{' '}
            {formatDate(startTime, 'full')} at {formatTime(startTime)} – {formatTime(endTime)}? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Select value={reason} onValueChange={setReason}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a reason for cancellation" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {CANCELLATION_REASONS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <AlertDialogFooter>
          <AlertDialogCancel>Go Back</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={!reason}
            onClick={() => onConfirm()}
          >
            Yes, Cancel Appointment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
