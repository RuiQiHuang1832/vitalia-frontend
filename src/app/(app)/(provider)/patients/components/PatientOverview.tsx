'use client'
import PatientHeader from '@/app/(app)/(provider)/patients/components/PatientOverview/PatientHeader'
import PatientTabs from '@/app/(app)/(provider)/patients/components/PatientOverview/PatientTabs'
import { usePatientOverview } from '@/hooks/usePatientOverview'
import { type PatientOverview } from '../types'

export default function PatientOverview({ id, data: fallback }: PatientOverview) {
  const { data: patient, mutate } = usePatientOverview(id, fallback)

  if (!patient) return null
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
      <section aria-labelledby="patient-header-heading" className="col-span-12">
        <h2 id="patient-header-heading" className="sr-only">
          Patient Header
        </h2>
        <PatientHeader data={patient}></PatientHeader>
      </section>
      <section aria-labelledby="patient-tabs-heading" className="col-span-12">
        <h2 id="patient-tabs-heading" className="sr-only">
          Patient Tabs
        </h2>
        <PatientTabs data={patient}></PatientTabs>
      </section>
    </div>
  )
}
