import PatientOverview from '@/app/(app)/(provider)/patients/components/PatientOverview'

export default async function PatientPage({ params }: { params: { id: string } }) {
  const { id } = await params
  return <PatientOverview id={Number(id)}></PatientOverview>
}
