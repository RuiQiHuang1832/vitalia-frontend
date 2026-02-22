import PatientOverview from '@/app/(app)/(provider)/patients/components/PatientOverview'
import { getPatientById } from '@/lib/api.server'

export default async function PatientPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const patient = await getPatientById(Number(id))
  return <PatientOverview id={Number(id)} data={patient}></PatientOverview>
}
