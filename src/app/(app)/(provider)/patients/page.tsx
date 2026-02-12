import PatientsTable from '@/app/(app)/(provider)/patients/components/PatientsTable'
import { getPatients } from '@/lib/api.server'

export default async function PatientsPage() {
  // Fetch patients on the server to avoid hydration/loading states on the client. Server sends fully rendered HTML with data, improving performance and SEO.
  const initialData = await getPatients()

  return (
    <div>
      <section className="space-y-3">
        <h1 className="text-left font-semibold text-3xl">Patients</h1>
        <p className="text-muted-foreground">All patients accessible to this provider.</p>
      </section>
      <PatientsTable initialData={initialData}></PatientsTable>
    </div>
  )
}
