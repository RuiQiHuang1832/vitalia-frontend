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
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

type Tab = 'upcoming' | 'past'

export default function AppointmentsClient({ initialData }: { initialData: AppointmentResponse }) {
  const searchParams = useSearchParams()
  const selectId = searchParams.get('select')

  const [tab, setTab] = useState<Tab>('upcoming')
  const [page, setPage] = useState(1)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithPatient | null>(
    null
  )
  const [encounterActive, setEncounterActive] = useState(false)
  const didAutoSelect = useRef(false)

  // Stable "today" value that doesn't change between renders
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const { data, error, isLoading, mutate } = useProviderAppointments({
    page,
    limit: 10,
    status: tab === 'upcoming' ? ['SCHEDULED'] : ['COMPLETED', 'CANCELLED'],
    fromDate: tab === 'upcoming' ? today : undefined,
    initialData: tab === 'upcoming' && page === 1 ? initialData : undefined,
  })

  const appointments = useMemo(() => data?.data ?? [], [data])
  const totalPages = data?.totalPages ?? 0

  // Auto-select appointment from ?select=ID query param
  useEffect(() => {
    if (!selectId || didAutoSelect.current || !appointments.length) return
    const match = appointments.find((a: AppointmentWithPatient) => a.id === Number(selectId))
    if (match) {
      setSelectedAppointment(match)
      didAutoSelect.current = true
    }
  }, [selectId, appointments])

  function handleTabChange(value: string) {
    setTab(value as Tab)
    setPage(1)
  }

  function handleStartEncounter() {
    if (selectedAppointment) setEncounterActive(true)
  }

  function handleEndEncounter() {
    setEncounterActive(false)
  }

  return (
    <div className="py-5">
      <section className="mb-5">
        <h2 className="sr-only">Appointments Header</h2>
        <AppointmentHeader
          tab={tab}
          onTabChange={handleTabChange}
          appointmentCount={appointments.length}
          selectedAppointment={selectedAppointment}
          encounterActive={encounterActive}
          onStartEncounter={handleStartEncounter}
          onEndEncounter={handleEndEncounter}
        />
      </section>
      <Stack align="start" className="flex-nowrap" gap={encounterActive ? 0 : 6}>
        <section
          className={`shrink-0  transition-all duration-300 ease-in-out ${
            encounterActive ? 'w-0 opacity-0' : 'w-1/3 opacity-100'
          }`}
        >
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
        <section
          className={`sticky top-5 self-start h-[95vh] flex flex-col rounded-xl transition-all duration-300 ease-in-out ${
            encounterActive ? 'w-full' : 'w-2/3'
          } ${selectedAppointment && 'border'}`}
        >
          <h2 className="sr-only">Appointments Details</h2>
          <AppointmentDetails
            appointment={selectedAppointment}
            onMutate={mutate}
            onCancel={() => {
              setSelectedAppointment(null)
              setEncounterActive(false)
            }}
          />
        </section>
      </Stack>
    </div>
  )
}
