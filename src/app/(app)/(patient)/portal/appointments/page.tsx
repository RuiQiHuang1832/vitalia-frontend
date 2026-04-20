import AppointmentsClient from '@/app/(app)/(patient)/portal/appointments/components/AppointmentsClient'
import GreetingHeader from '@/app/(app)/(patient)/portal/appointments/components/GreetingHeader'
import { getPatientAppointments } from '@/lib/api.server'

export default async function PatientPortalAppointments() {
  const [upcoming, past] = await Promise.all([
    getPatientAppointments({ page: 1, limit: 10, status: ['SCHEDULED'] }),
    getPatientAppointments({ page: 1, limit: 10, status: ['COMPLETED', 'CANCELLED'] }),
  ])

  return (
    <div>
      <GreetingHeader />
      <AppointmentsClient initialUpcoming={upcoming} initialPast={past} />
    </div>
  )
}
