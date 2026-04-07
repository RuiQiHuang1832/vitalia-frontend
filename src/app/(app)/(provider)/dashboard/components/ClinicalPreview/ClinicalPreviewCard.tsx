'use client'

import ClinicalPreviewSkeleton from '@/app/(app)/(provider)/dashboard/components/ClinicalPreview/ClinicalPreviewSkeleton'
import { type AppointmentWithPatient } from '@/app/(app)/(provider)/patients/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProviderAppointments } from '@/hooks/useProviderAppointments'
import { Activity, AlertCircle, Pill } from 'lucide-react'
import { useMemo } from 'react'

export default function ClinicalPreviewCard() {
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const { data: payload, isLoading, error } = useProviderAppointments({
    limit: 1,
    status: ['SCHEDULED'],
    fromDate: today,
  })

  if (isLoading) return <ClinicalPreviewSkeleton />

  if (error || !payload?.data?.length || !payload.data[0]?.patient) {
    return (
      <Card className="gap-0 h-full">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle>Clinical Preview</CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <p className="text-sm text-muted-foreground text-center">
            No patient data to preview.
          </p>
        </CardContent>
      </Card>
    )
  }

  const appointment = payload.data[0] as AppointmentWithPatient
  const { problems, allergies, medications } = appointment.patient

  const activeProblems = problems?.filter((p) => p.status === 'ACTIVE') ?? []
  const activeMedications = medications?.filter((m) => m.status === 'ACTIVE') ?? []

  return (
    <Card className="gap-0 h-full">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <CardTitle>Clinical Preview</CardTitle>
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          Current Patient
        </span>
      </CardHeader>
      <CardContent className="space-y-4 mt-4">
        {/* Active Problems */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-600 mb-2">
            <Activity className="size-3.5" />
            Active Problems
          </div>
          {activeProblems.length > 0 ? (
            <ul className="space-y-1">
              {activeProblems.map((problem) => (
                <li key={problem.id} className="flex items-center text-sm">
                  <span className="size-1.5 rounded-full bg-purple-400 mr-2 shrink-0" />
                  {problem.name}
                  {problem.icdCode && (
                    <span className="ml-1 text-muted-foreground text-xs">({problem.icdCode})</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No active problems</p>
          )}
        </div>

        {/* Allergies */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 mb-2">
            <AlertCircle className="size-3.5" />
            Allergies
          </div>
          {allergies?.length > 0 ? (
            <ul className="space-y-1">
              {allergies.map((allergy) => (
                <li key={allergy.id} className="flex items-center text-sm">
                  <span className="size-1.5 rounded-full bg-red-400 mr-2 shrink-0" />
                  {allergy.substance}
                  {allergy.severity && (
                    <span className="ml-1 text-muted-foreground text-xs">({allergy.severity})</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No known allergies</p>
          )}
        </div>

        {/* Medications */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            <Pill className="size-3.5" />
            Medications
          </div>
          {activeMedications.length > 0 ? (
            <ul className="space-y-1">
              {activeMedications.map((med) => (
                <li key={med.id} className="flex items-center text-sm">
                  <span className="size-1.5 rounded-full bg-blue-400 mr-2 shrink-0" />
                  {med.name}
                  {med.dosage && (
                    <span className="ml-1 text-muted-foreground text-xs">({med.dosage})</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No active medications</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
