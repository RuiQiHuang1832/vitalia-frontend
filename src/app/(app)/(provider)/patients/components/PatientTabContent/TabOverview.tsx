import { PatientFull } from '@/app/(app)/(provider)/patients/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type TabOverviewDataProps = Pick<
  PatientFull,
  'appointments' | 'problems' | 'medications' | 'vitals'
>

export default function TabOverview({ data }: { data: TabOverviewDataProps }) {
  const nextAppointment = data.appointments
    .filter((a) => a.status === 'SCHEDULED' && new Date(a.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0]

  const latestVisitNote = data.appointments
    .filter((a) => a.visitNote)
    .sort(
      (a, b) =>
        new Date(b.visitNote!.updatedAt).getTime() - new Date(a.visitNote!.updatedAt).getTime()
    )[0]?.visitNote

  const latestVitals = data.vitals.sort(
    (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
  )[0]

  const activeMedications = data.medications.filter((m) => m.status === 'ACTIVE')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Next Appointment</CardTitle>
          <CardDescription>Upcoming scheduled appointment</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          {nextAppointment ? (
            <div className="space-y-1">
              <p>
                <span className="text-muted-foreground">Date:</span>{' '}
                {new Date(nextAppointment.startTime).toLocaleDateString()}
              </p>
              <p>
                <span className="text-muted-foreground">Time:</span>{' '}
                {new Date(nextAppointment.startTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {' – '}
                {new Date(nextAppointment.endTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {nextAppointment.reason && (
                <p>
                  <span className="text-muted-foreground">Reason:</span> {nextAppointment.reason}
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No upcoming appointments.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Latest Visit Note</CardTitle>
          <CardDescription>Most recent clinical note</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          {latestVisitNote ? (
            <div className="space-y-1">
              <p>
                <span className="text-muted-foreground">Date:</span>{' '}
                {new Date(latestVisitNote.updatedAt).toLocaleDateString()}
              </p>
              <p>
                <span className="text-muted-foreground">Version:</span>{' '}
                {latestVisitNote.latestVersion}
              </p>
              {latestVisitNote.versions.length > 0 && (
                <p className="line-clamp-3">
                  {latestVisitNote.versions.sort((a, b) => b.version - a.version)[0].content}
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No visit notes on file.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Latest Vitals</CardTitle>
          <CardDescription>Most recently recorded vital signs</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          {latestVitals ? (
            <div className="space-y-1">
              <p className="text-muted-foreground mb-2">
                Recorded {new Date(latestVitals.recordedAt).toLocaleDateString()}
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {latestVitals.heartRate != null && (
                  <p>
                    <span className="text-muted-foreground">HR:</span> {latestVitals.heartRate} bpm
                  </p>
                )}
                {latestVitals.bloodPressureSystolic != null &&
                  latestVitals.bloodPressureDiastolic != null && (
                    <p>
                      <span className="text-muted-foreground">BP:</span>{' '}
                      {latestVitals.bloodPressureSystolic}/{latestVitals.bloodPressureDiastolic}{' '}
                      mmHg
                    </p>
                  )}
                {latestVitals.temperature != null && (
                  <p>
                    <span className="text-muted-foreground">Temp:</span> {latestVitals.temperature}
                    °F
                  </p>
                )}
                {latestVitals.weight != null && (
                  <p>
                    <span className="text-muted-foreground">Weight:</span> {latestVitals.weight} lbs
                  </p>
                )}
                {latestVitals.oxygenSaturation != null && (
                  <p>
                    <span className="text-muted-foreground">SpO₂:</span>{' '}
                    {latestVitals.oxygenSaturation}%
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No vitals recorded.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Medications</CardTitle>
          <CardDescription>
            {activeMedications.length} active medication{activeMedications.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          {activeMedications.length > 0 ? (
            <ul className="space-y-2">
              {activeMedications.map((med) => (
                <li key={med.id}>
                  <p className="font-medium">{med.name}</p>
                  <p className="text-muted-foreground">
                    {med.dosage} — {med.frequency}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No active medications.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Problems</CardTitle>
          <CardDescription>
            {data.problems.length} problem{data.problems.length !== 1 ? 's' : ''} on file
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          {data.problems.length > 0 ? (
            <ul className="space-y-2">
              {data.problems.map((problem) => (
                <li key={problem.id} className="flex justify-between">
                  <span>{problem.description}</span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(problem.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No problems on file.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
