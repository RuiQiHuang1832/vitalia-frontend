import TabAppointment from '@/app/(app)/(provider)/patients/components/PatientTabContent/TabAppointment'
import TabClinical from '@/app/(app)/(provider)/patients/components/PatientTabContent/TabClinical'
import TabOverview from '@/app/(app)/(provider)/patients/components/PatientTabContent/TabOverview'
import TabVitals from '@/app/(app)/(provider)/patients/components/PatientTabContent/TabVitals'
import { PatientFull } from '@/app/(app)/(provider)/patients/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
export default function PatientTabs({ data }: { data: PatientFull }) {
  const { appointments, problems, vitals, allergies, medications } = data
  const appointmentsData = {
    appointments,
  }
  const overviewData = {
    appointments,
    problems,
    medications,
    vitals,
  }
  const clinicalData = {
    problems,
    allergies,
    medications,
  }
  const vitalsData = {
    vitals,
    appointments,
  }
  return (
    <Tabs defaultValue="overview">
      <TabsList className="w-[500px] mb-1">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="clinical">Clinical</TabsTrigger>
        <TabsTrigger value="vitals">Vitals</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <TabOverview data={overviewData}></TabOverview>
      </TabsContent>
      <TabsContent value="appointments">
        <TabAppointment data={appointmentsData}></TabAppointment>
      </TabsContent>
      <TabsContent value="clinical">
        <TabClinical data={clinicalData}></TabClinical>
      </TabsContent>
      <TabsContent value="vitals">
        <TabVitals data={vitalsData}></TabVitals>
      </TabsContent>
    </Tabs>
  )
}
