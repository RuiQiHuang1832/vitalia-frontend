import { PatientFull } from '@/app/(app)/(provider)/patients/types'

type TabClinicalDataProps = Pick<PatientFull, 'problems' | 'allergies' | 'medications'>

export default function TabClinical({ data }: { data: TabClinicalDataProps }) {
  return <div>TabClinical</div>
}
