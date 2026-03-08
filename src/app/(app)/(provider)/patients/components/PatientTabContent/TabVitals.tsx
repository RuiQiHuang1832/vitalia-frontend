import { PatientFull, Vital } from '@/app/(app)/(provider)/patients/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/utils'
import { Activity, ClipboardList, Droplets, Heart, Thermometer, Weight } from 'lucide-react'
import { useMemo } from 'react'
type TabVitalsDataProps = Pick<PatientFull, 'vitals'>

function formatValue(value: number | null, unit: string) {
  if (value == null) return '—'
  return `${value} ${unit}`
}

type VitalCardProps = {
  title: string
  icon: React.ReactNode
  value: string
  recordedAt: string | null
}

function VitalCard({ title, icon, value, recordedAt }: VitalCardProps) {
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
// Defining a type parameter (generic variable), not the return type. This allows us to specify which vital sign we want to extract (e.g., 'heartRate', 'temperature') while ensuring type safety.  This is Indexed access types in TypeScript, which allows us to look up the type of a specific property (like 'heartRate') on the Vital type. By using a generic K that extends the keys of Vital, we can ensure that the function only accepts valid vital sign keys and returns the correct type for that key.
function getLatestVitalValue<K extends keyof Vital>(
  vitals: Vital[],
  key: K
): { value: Vital[K]; recordedAt: string } | null {
  for (const vital of vitals) {
    if (vital[key] != null) return { value: vital[key], recordedAt: vital.recordedAt }
  }
  return null
}

export default function TabVitals({ data }: { data: TabVitalsDataProps }) {
  const { vitals } = data

  // Sort descending (most recent first) — used for both cards and table
  const sorted = useMemo(
    () =>
      [...vitals].sort(
        (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
      ),
    [vitals]
  )

  const latestHR = getLatestVitalValue(sorted, 'heartRate')
  const latestBPSys = getLatestVitalValue(sorted, 'bloodPressureSystolic')
  const latestBPDia = getLatestVitalValue(sorted, 'bloodPressureDiastolic')
  const latestTemp = getLatestVitalValue(sorted, 'temperature')
  const latestWeight = getLatestVitalValue(sorted, 'weight')
  const latestO2 = getLatestVitalValue(sorted, 'oxygenSaturation')

  const bpValue =
    latestBPSys?.value != null && latestBPDia?.value != null
      ? `${latestBPSys.value}/${latestBPDia.value} mmHg`
      : '—'

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <VitalCard
          title="Heart Rate"
          icon={<Heart className="w-4 h-4 text-red-500" />}
          value={formatValue(latestHR?.value ?? null, 'bpm')}
          recordedAt={latestHR?.recordedAt ?? null}
        />
        <VitalCard
          title="Blood Pressure"
          icon={<Activity className="w-4 h-4 text-blue-500" />}
          value={bpValue}
          recordedAt={latestBPSys?.recordedAt ?? null}
        />
        <VitalCard
          title="Temperature"
          icon={<Thermometer className="w-4 h-4 text-orange-500" />}
          value={formatValue(latestTemp?.value ?? null, '°F')}
          recordedAt={latestTemp?.recordedAt ?? null}
        />
        <VitalCard
          title="Weight"
          icon={<Weight className="w-4 h-4 text-purple-500" />}
          value={formatValue(latestWeight?.value ?? null, 'lbs')}
          recordedAt={latestWeight?.recordedAt ?? null}
        />
        <VitalCard
          title="O₂ Saturation"
          icon={<Droplets className="w-4 h-4 text-cyan-500" />}
          value={formatValue(latestO2?.value ?? null, '%')}
          recordedAt={latestO2?.recordedAt ?? null}
        />
      </div>

      {/* Vitals History Table */}
      <Card className="py-0 gap-0">
        <CardHeader className="border-b !py-5 gap-0">
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-muted-foreground" />
            Vitals History
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
            {sorted.map((vital) => (
              <TableRow key={vital.id}>
                <TableCell className="font-medium">{formatDate(vital.recordedAt)}</TableCell>
                <TableCell className="text-right">{vital.heartRate ?? '—'}</TableCell>
                <TableCell className="text-right">
                  {vital.bloodPressureSystolic != null && vital.bloodPressureDiastolic != null
                    ? `${vital.bloodPressureSystolic}/${vital.bloodPressureDiastolic}`
                    : '—'}
                </TableCell>
                <TableCell className="text-right">{vital.temperature ?? '—'}</TableCell>
                <TableCell className="text-right">{vital.weight ?? '—'}</TableCell>
                <TableCell className="text-right">{vital.oxygenSaturation ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
