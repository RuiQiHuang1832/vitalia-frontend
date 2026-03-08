import { PatientFull } from '@/app/(app)/(provider)/patients/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/utils'
import { Activity, AlertCircle, Pill } from 'lucide-react'
type TabClinicalDataProps = Pick<PatientFull, 'problems' | 'allergies' | 'medications'>

const allergySeverityStyles: Record<string, string> = {
  SEVERE: 'bg-red-100 text-red-700',
  MODERATE: 'bg-orange-100 text-orange-700',
  MILD: 'bg-yellow-100 text-yellow-700',
}

const medicationStatusStyles: Record<string, { className: string; label: string }> = {
  ACTIVE: { className: 'text-green-600', label: 'Active' },
  COMPLETED: { className: 'text-gray-500', label: 'Completed' },
  DISCONTINUED: { className: 'text-red-600', label: 'Discontinued' },
}

const problemStatusStyles: Record<string, { className: string; label: string }> = {
  ACTIVE: { className: 'bg-blue-100 text-blue-700', label: 'Active' },
  RESOLVED: { className: 'bg-green-100 text-green-700', label: 'Resolved' },
}

export default function TabClinical({ data }: { data: TabClinicalDataProps }) {
  const { problems, allergies, medications } = data
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {/* 1. Allergies Section (High Priority) */}
      <Card className="overflow-hidden py-0 gap-0">
        <CardHeader className="border-b bg-red-50/50 !py-5 gap-0">
          <CardTitle className="flex items-center gap-2 ">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Allergies & Sensitivities
          </CardTitle>
        </CardHeader>
        <div className="divide-y divide-gray-100">
          {allergies.map((allergy) => (
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
                    className={`px-2 py-1 rounded-full text-xs font-medium ${allergySeverityStyles[allergy.severity] ?? 'bg-muted text-muted-foreground'}`}
                  >
                    {allergy.severity}
                  </span>
                )}
              </div>
              {allergy.reaction && (
                <CardDescription>
                  <span className="font-medium text-foreground/70">Reaction:</span>
                  {allergy.reaction}
                </CardDescription>
              )}
              {allergy.notes && (
                <CardDescription>
                  <span className="font-medium text-foreground/70">Notes:</span> {allergy.notes}
                </CardDescription>
              )}
              <p className="text-xs text-muted-foreground">
                Recorded: {formatDate(allergy.createdAt)}
              </p>
            </CardContent>
          ))}
        </div>
      </Card>
      {/* 3. Problems/Diagnosis Section */}
      <Card className="py-0 gap-0">
        <CardHeader className="border-b !py-5 gap-0">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Problem List
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {problems.map((problem) => {
            const statusInfo = problemStatusStyles[problem.status] ?? {
              className: 'bg-gray-100 text-gray-700',
              label: problem.status,
            }
            return (
              <Card key={problem.id} className="gap-2 rounded-lg bg-muted/30 p-3 py-3 shadow-none">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-start justify-between gap-2 text-sm">
                    {problem.name}
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </CardTitle>
                  {problem.description && <CardDescription>{problem.description}</CardDescription>}
                </CardHeader>
                <CardFooter className="flex justify-between p-0 text-xs text-muted-foreground">
                  <span>{problem.icdCode ? `ICD-10: ${problem.icdCode}` : 'No ICD code'}</span>
                  <span className="text-right">Added: {formatDate(problem.createdAt)}</span>
                </CardFooter>
                {problem.resolvedAt && (
                  <p className="text-xs text-green-600 px-0">
                    Resolved: {formatDate(problem.resolvedAt)}
                  </p>
                )}
              </Card>
            )
          })}
        </CardContent>
      </Card>
      {/* 2. Medications Section */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm col-span-2">
        <h2 className="sr-only">Medication</h2>
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <Pill className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Medication List</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map((med) => {
              const statusInfo = medicationStatusStyles[med.status] ?? {
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
                    <span className={`text-xs font-semibold ${statusInfo.className}`}>
                      ● {statusInfo.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{med.notes ?? '—'}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}
