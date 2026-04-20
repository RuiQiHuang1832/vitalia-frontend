'use client'

import AppointmentRow from '@/app/(app)/(patient)/portal/appointments/components/AppointmentRow'
import NextAppointmentHero from '@/app/(app)/(patient)/portal/appointments/components/NextAppointmentHero'
import type { PatientAppointmentsResponse } from '@/app/(app)/(patient)/portal/appointments/types'
import { usePatientAppointments } from '@/hooks/usePatientAppointments'

export default function AppointmentsClient({
  initialUpcoming,
  initialPast,
}: {
  initialUpcoming: PatientAppointmentsResponse
  initialPast: PatientAppointmentsResponse
}) {
  const { data: upcomingData } = usePatientAppointments({
    page: 1,
    limit: 10,
    status: ['SCHEDULED'],
    initialData: initialUpcoming,
  })
  const { data: pastData } = usePatientAppointments({
    page: 1,
    limit: 10,
    status: ['COMPLETED', 'CANCELLED'],
    initialData: initialPast,
  })

  const upcoming = upcomingData?.data ?? []
  const past = pastData?.data ?? []

  const [nextAppt, ...otherUpcoming] = upcoming

  return (
    <div className="py-5 space-y-8 max-w-3xl">
      <NextAppointmentHero appointment={nextAppt ?? null} />

      {otherUpcoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Other upcoming ({otherUpcoming.length})
          </h2>
          <div className="space-y-2">
            {otherUpcoming.map((appt) => (
              <AppointmentRow key={appt.id} appointment={appt} />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Past appointments</h2>
        {past.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No past appointments yet.</p>
        ) : (
          <div className="space-y-2">
            {past.map((appt) => (
              <AppointmentRow key={appt.id} appointment={appt} showStatus />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
