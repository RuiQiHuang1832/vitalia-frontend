import PatientsList from '@/app/(app)/(provider)/patients/components/PatientsList'

export default function PatientsPage() {
  return (
    <div>
      <section className="space-y-3">
        <h1 className="text-left font-semibold text-3xl">Patients</h1>
        <p className="text-muted-foreground">All patients accessible to this provider.</p>
      </section>
      <PatientsList></PatientsList>
    </div>
  )
}
