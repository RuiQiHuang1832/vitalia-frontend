import MedicalRecordsView from '@/app/(app)/(patient)/portal/medical-records/components/MedicalRecordsView'
import {
  getPatientAllergies,
  getPatientAppointments,
  getPatientMedications,
  getPatientVitals,
} from '@/lib/api.server'

export default async function PatientPortalMedicalRecords() {
  const [vitals, medications, allergies, pastAppointments] = await Promise.all([
    getPatientVitals(),
    getPatientMedications(),
    getPatientAllergies(),
    getPatientAppointments({ page: 1, limit: 50, status: ['COMPLETED'] }),
  ])

  return (
    <MedicalRecordsView
      vitals={vitals}
      medications={medications}
      allergies={allergies}
      appointments={pastAppointments.data}
    />
  )
}
