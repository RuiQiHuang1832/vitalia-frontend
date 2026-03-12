import AppointmentsClient from '@/app/(app)/(provider)/appointments/components/AppointmentsClient'
import { getProviderAppointments } from '@/lib/api.server'

export default async function Appointments() {
  const initialData = await getProviderAppointments({ page: 1, limit: 10, status: ['SCHEDULED'] })

  return (
    <div>
      <section className="space-y-3">
        <h1 className="text-left font-semibold text-3xl">Appointments</h1>
        <p className="text-muted-foreground">Manage and review your scheduled and past appointments.</p>
      </section>
      <AppointmentsClient initialData={initialData} />
    </div>
  )
}
