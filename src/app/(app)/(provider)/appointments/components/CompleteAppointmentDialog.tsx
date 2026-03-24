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
import { TriangleAlert } from 'lucide-react'

interface CompleteAppointmentDialogProps {
  patientName: string
  hasVisitNote: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export default function CompleteAppointmentDialog({
  patientName,
  hasVisitNote,
  open,
  onOpenChange,
  onConfirm,
}: CompleteAppointmentDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign & Lock Encounter</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you are ready to sign this encounter for{' '}
                <span className="font-semibold text-foreground">{patientName}</span>?
              </p>
              <p>
                Doing so will mark the appointment as{' '}
                <strong className="text-foreground">Completed</strong> and permanently lock the
                visit notes, vitals, and billing codes. Any future changes will require a formal
                addendum.
              </p>
              {!hasVisitNote && (
                <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  <TriangleAlert className="size-4 mt-0.5 shrink-0" />
                  <p className="text-sm">
                    You have not entered a visit note. Are you sure you want to sign this encounter
                    without documentation?
                  </p>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Editing</AlertDialogCancel>
          <AlertDialogAction
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={onConfirm}
          >
            Sign & Lock Visit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
