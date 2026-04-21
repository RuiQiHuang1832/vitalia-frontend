import { redirect } from 'next/navigation'

export default function PatientPortalIndex() {
  redirect('/portal/appointments')
}
