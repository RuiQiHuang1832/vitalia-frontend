import { PatientFull } from '@/app/(app)/(provider)/patients/types'

type TabAppointmentDataProps = Pick<PatientFull, 'appointments'>

export default function TabAppointment({ data }: { data: TabAppointmentDataProps }) {
  return <div>TabAppointment</div>
}
