'use client'

import type { AppointmentWithProvider } from '@/app/(app)/(patient)/portal/appointments/types'
import type { Allergy, Medication, Vital } from '@/app/(app)/(provider)/patients/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/utils'
import {
  Activity,
  AlertCircle,
  ClipboardList,
  Droplets,
  FileText,
  Heart,
  Pill,
  Thermometer,
  Weight,
} from 'lucide-react'
import { useMemo } from 'react'

type Props = {
  vitals: Vital[]
  medications: Medication[]
  allergies: Allergy[]
  appointments: AppointmentWithProvider[]
}

export default function MedicalRecordsView({
  vitals,
  medications,
  allergies,
  appointments,
}: Props) {
  return (
    <div className="space-y-6 max-w-5xl">
      <section className="space-y-3">
        <h1 className="text-left font-semibold text-3xl">
           Medical Records
        </h1>
        <p className="text-muted-foreground">
          Review your health information, including vitals, medications, allergies, and visit notes. Contact your provider if you have any questions or need to update your records.
        </p>
      </section>

      <Tabs defaultValue="vitals" className="gap-6">
        <TabsList className="w-full md:w-fit gap-3">
          <TabsTrigger value="vitals">
            <Activity className="w-4 h-4" />
            Vitals
          </TabsTrigger>
          <TabsTrigger value="medications">
            <Pill className="w-4 h-4" />
            Medications
          </TabsTrigger>
          <TabsTrigger value="allergies">
            <AlertCircle className="w-4 h-4" />
            Allergies
          </TabsTrigger>
          <TabsTrigger value="notes">
            <FileText className="w-4 h-4" />
            Visit Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vitals">
          <VitalsSection vitals={vitals} />
        </TabsContent>
        <TabsContent value="medications">
          <MedicationsSection medications={medications} />
        </TabsContent>
        <TabsContent value="allergies">
          <AllergiesSection allergies={allergies} />
        </TabsContent>
        <TabsContent value="notes">
          <VisitNotesSection appointments={appointments} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// --- Vitals ---

function formatVital(value: number | null, unit: string) {
  return value == null ? '—' : `${value} ${unit}`
}

function getLatest<K extends keyof Vital>(
  vitals: Vital[],
  key: K
): { value: Vital[K]; recordedAt: string } | null {
  for (const v of vitals) {
    if (v[key] != null) return { value: v[key], recordedAt: v.recordedAt }
  }
  return null
}

function VitalCard({
  title,
  icon,
  value,
  recordedAt,
}: {
  title: string
  icon: React.ReactNode
  value: string
  recordedAt: string | null
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          {icon}
          {title}
        </CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          {recordedAt ? `Recorded ${formatDate(recordedAt)}` : 'No data recorded'}
        </p>
      </CardContent>
    </Card>
  )
}

function VitalsSection({ vitals }: { vitals: Vital[] }) {
  const sorted = useMemo(
    () =>
      [...vitals].sort(
        (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
      ),
    [vitals]
  )

  const hr = getLatest(sorted, 'heartRate')
  const bpSys = getLatest(sorted, 'bloodPressureSystolic')
  const bpDia = getLatest(sorted, 'bloodPressureDiastolic')
  const temp = getLatest(sorted, 'temperature')
  const weight = getLatest(sorted, 'weight')
  const o2 = getLatest(sorted, 'oxygenSaturation')

  const bpValue =
    bpSys?.value != null && bpDia?.value != null ? `${bpSys.value}/${bpDia.value} mmHg` : '—'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <VitalCard
          title="Heart Rate"
          icon={<Heart className="w-4 h-4 text-red-500" />}
          value={formatVital(hr?.value ?? null, 'bpm')}
          recordedAt={hr?.recordedAt ?? null}
        />
        <VitalCard
          title="Blood Pressure"
          icon={<Activity className="w-4 h-4 text-blue-500" />}
          value={bpValue}
          recordedAt={bpSys?.recordedAt ?? null}
        />
        <VitalCard
          title="Temperature"
          icon={<Thermometer className="w-4 h-4 text-orange-500" />}
          value={formatVital(temp?.value ?? null, '°F')}
          recordedAt={temp?.recordedAt ?? null}
        />
        <VitalCard
          title="Weight"
          icon={<Weight className="w-4 h-4 text-purple-500" />}
          value={formatVital(weight?.value ?? null, 'lbs')}
          recordedAt={weight?.recordedAt ?? null}
        />
        <VitalCard
          title="O₂ Saturation"
          icon={<Droplets className="w-4 h-4 text-cyan-500" />}
          value={formatVital(o2?.value ?? null, '%')}
          recordedAt={o2?.recordedAt ?? null}
        />
      </div>

      <Card className="py-0 gap-0">
        <CardHeader className="border-b !py-5 gap-0">
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-muted-foreground" />
            History
          </CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recorded</TableHead>
              <TableHead className="text-right">HR (bpm)</TableHead>
              <TableHead className="text-right">BP (mmHg)</TableHead>
              <TableHead className="text-right">Temp (°F)</TableHead>
              <TableHead className="text-right">Weight (lbs)</TableHead>
              <TableHead className="text-right">O₂ (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center text-sm text-muted-foreground">
                  No vitals recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{formatDate(v.recordedAt)}</TableCell>
                  <TableCell className="text-right">{v.heartRate ?? '—'}</TableCell>
                  <TableCell className="text-right">
                    {v.bloodPressureSystolic != null && v.bloodPressureDiastolic != null
                      ? `${v.bloodPressureSystolic}/${v.bloodPressureDiastolic}`
                      : '—'}
                  </TableCell>
                  <TableCell className="text-right">{v.temperature ?? '—'}</TableCell>
                  <TableCell className="text-right">{v.weight ?? '—'}</TableCell>
                  <TableCell className="text-right">{v.oxygenSaturation ?? '—'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

// --- Medications ---

const medStatusStyles: Record<string, { className: string; label: string }> = {
  ACTIVE: { className: 'text-green-600', label: 'Active' },
  COMPLETED: { className: 'text-gray-500', label: 'Completed' },
  DISCONTINUED: { className: 'text-red-600', label: 'Discontinued' },
}

function MedicationsSection({ medications }: { medications: Medication[] }) {
  const active = medications.filter((m) => m.status === 'ACTIVE')
  const past = medications.filter((m) => m.status !== 'ACTIVE')

  return (
    <div className="space-y-6">
      <Card className="py-0 gap-0">
        <CardHeader className="border-b !py-5 gap-0">
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-600" />
            Current Medications
          </CardTitle>
        </CardHeader>
        <MedicationTable medications={active} emptyMessage="No active medications." />
      </Card>

      <Card className="py-0 gap-0">
        <CardHeader className="border-b !py-5 gap-0">
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-muted-foreground" />
            Past Medications
          </CardTitle>
        </CardHeader>
        <MedicationTable medications={past} emptyMessage="No past medications." />
      </Card>
    </div>
  )
}

function MedicationTable({
  medications,
  emptyMessage,
}: {
  medications: Medication[]
  emptyMessage: string
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Medication</TableHead>
          <TableHead>Dosage</TableHead>
          <TableHead>Frequency</TableHead>
          <TableHead>Start</TableHead>
          <TableHead>End</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {medications.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          medications.map((med) => {
            const status = medStatusStyles[med.status] ?? {
              className: 'text-gray-500',
              label: med.status,
            }
            return (
              <TableRow key={med.id}>
                <TableCell className="font-medium">{med.name}</TableCell>
                <TableCell>{med.dosage}</TableCell>
                <TableCell>{med.frequency}</TableCell>
                <TableCell>{formatDate(med.startDate)}</TableCell>
                <TableCell>{formatDate(med.endDate)}</TableCell>
                <TableCell>
                  <span className={`text-xs font-semibold ${status.className}`}>
                    ● {status.label}
                  </span>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}

// --- Allergies ---

const allergySeverityStyles: Record<string, string> = {
  SEVERE: 'bg-red-100 text-red-700',
  MODERATE: 'bg-orange-100 text-orange-700',
  MILD: 'bg-yellow-100 text-yellow-700',
}

function AllergiesSection({ allergies }: { allergies: Allergy[] }) {
  return (
    <Card className="overflow-hidden py-0 gap-0">
      <CardHeader className="border-b bg-red-50/50 !py-5 gap-0">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          Allergies & Sensitivities
        </CardTitle>
      </CardHeader>
      <div className="divide-y divide-gray-100">
        {allergies.length === 0 ? (
          <CardContent className="py-6 text-sm text-muted-foreground">
            No known allergies on file.
          </CardContent>
        ) : (
          allergies.map((allergy) => (
            <CardContent key={allergy.id} className="flex flex-col gap-2 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{allergy.substance}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                    {allergy.category}
                  </span>
                </div>
                {allergy.severity && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      allergySeverityStyles[allergy.severity] ?? 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {allergy.severity}
                  </span>
                )}
              </div>
              {allergy.reaction && (
                <CardDescription>
                  <span className="font-medium text-foreground/70">Reaction: </span>
                  {allergy.reaction}
                </CardDescription>
              )}
              {allergy.notes && (
                <CardDescription>
                  <span className="font-medium text-foreground/70">Notes: </span>
                  {allergy.notes}
                </CardDescription>
              )}
              <p className="text-xs text-muted-foreground">
                Recorded: {formatDate(allergy.createdAt)}
              </p>
            </CardContent>
          ))
        )}
      </div>
    </Card>
  )
}

// --- Visit Notes ---

function VisitNotesSection({ appointments }: { appointments: AppointmentWithProvider[] }) {
  const withNotes = useMemo(
    () =>
      appointments
        .filter((a) => a.visitNote && a.visitNote.versions.length > 0)
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()),
    [appointments]
  )

  if (withNotes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No visit notes yet.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {withNotes.map((appt) => {
        const latest = appt.visitNote!.versions.reduce((a, b) => (a.version >= b.version ? a : b))
        return (
          <Card key={appt.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Visit on {formatDate(appt.startTime)}
              </CardTitle>
              <CardDescription>
                Dr. {appt.provider.firstName} {appt.provider.lastName}
                {appt.provider.specialty ? ` · ${appt.provider.specialty}` : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{latest.content}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
