import AppointmentDetails from '@/app/(app)/(provider)/appointments/components/AppointmentDetails'
import AppointmentList from '@/app/(app)/(provider)/appointments/components/AppointmentList'
import { Stack } from '@/components/ui/stack'
import { getProviderAppointments } from '@/lib/api.server'

export default async function Appointments() {
  const initialData = await getProviderAppointments({ page: 1, limit: 10, status: ['SCHEDULED'] })

  return (
    <Stack align="stretch" className="h-screen flex-nowrap">
      <div className="w-1/3 overflow-y-auto p-4">
        <AppointmentList initialData={initialData} />
      </div>

      <div className="w-2/3 overflow-y-auto p-4">
        <AppointmentDetails />
      </div>
    </Stack>
  )
}
