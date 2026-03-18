'use client'
import AppointmentDetails from '@/app/(app)/(provider)/appointments/components/AppointmentDetails'
import AppointmentHeader from '@/app/(app)/(provider)/appointments/components/AppointmentHeader'
import AppointmentList from '@/app/(app)/(provider)/appointments/components/AppointmentList'
import {
  type AppointmentResponse,
  type AppointmentWithPatient,
} from '@/app/(app)/(provider)/patients/types'
import { Stack } from '@/components/ui/stack'
import { useProviderAppointments } from '@/hooks/useProviderAppointments'
import { useState } from 'react'

type Tab = 'upcoming' | 'past'

export default function AppointmentsClient({ initialData }: { initialData: AppointmentResponse }) {
  const [tab, setTab] = useState<Tab>('upcoming')
  const [page, setPage] = useState(1)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithPatient | null>(
    null
  )

  const { data, error, isLoading } = useProviderAppointments({
    page,
    limit: 10,
    status: tab === 'upcoming' ? ['SCHEDULED'] : ['COMPLETED', 'CANCELLED'],
    initialData: tab === 'upcoming' && page === 1 ? initialData : undefined,
  })

  const now = new Date()
  const appointments =
    tab === 'upcoming'
      ? (data?.data ?? []).filter((appt: AppointmentWithPatient) => new Date(appt.startTime) >= now)
      : (data?.data ?? [])
  const totalPages = data?.totalPages ?? 0

  function handleTabChange(value: string) {
    setTab(value as Tab)
    setPage(1)
  }

  return (
    <div className="py-5">
      <section className="mb-5">
        <h2 className="sr-only">Appointments Header</h2>
        <AppointmentHeader
          tab={tab}
          onTabChange={handleTabChange}
          appointmentCount={appointments.length}
        />
      </section>
      <Stack align="start" className="flex-nowrap" gap={6}>
        <section className="w-1/3">
          <h2 className="sr-only">Appointments List</h2>
          <AppointmentList
            tab={tab}
            appointments={appointments}
            totalPages={totalPages}
            page={page}
            onPageChange={setPage}
            onSelect={setSelectedAppointment}
            selectedId={selectedAppointment?.id ?? null}
            error={!!error}
            isLoading={isLoading}
            hasData={!!data}
          />
        </section>
        <section className={`w-2/3 sticky top-5 self-start h-[95vh] overflow-y-auto rounded-xl ${selectedAppointment && 'border'}`}>
          <h2 className="sr-only">Appointments Details</h2>
          <AppointmentDetails appointment={selectedAppointment} />
        </section>
      </Stack>
    </div>
  )
}
