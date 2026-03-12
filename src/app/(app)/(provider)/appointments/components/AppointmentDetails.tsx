'use client'

import {
  type Allergy,
  type AppointmentWithPatient,
  type Medication,
  type Problem,
  type Vital,
} from '@/app/(app)/(provider)/patients/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { formatDate, formatTime } from '@/lib/utils'
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Heart,
  Pen,
  Pill,
  Plus,
  Thermometer,
  User,
  Weight,
} from 'lucide-react'
import { useState } from 'react'

interface AppointmentDetailsProps {
  appointment: AppointmentWithPatient | null
}

function VisitNoteSection({ appointment }: { appointment: AppointmentWithPatient }) {
  const existingContent = appointment.visitNote?.versions?.length
    ? appointment.visitNote.versions[appointment.visitNote.versions.length - 1].content
    : ''
  const [content, setContent] = useState(existingContent)
  const [saved, setSaved] = useState(true)

  function handleChange(value: string) {
    setContent(value)
    setSaved(false)
  }

  function handleSave() {
    // TODO: POST to backend to create a new VisitNoteVersion
    setSaved(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <FileText className="size-4" />
          Visit Note (SOAP)
        </h3>
        <Button size="sm" onClick={handleSave} disabled={saved}>
          {saved ? 'Saved' : 'Save Note'}
        </Button>
      </div>
      <Textarea
        placeholder="Write your SOAP note here..."
        className="min-h-[200px] font-mono text-sm"
        value={content}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  )
}

type VitalDraft = Omit<Vital, 'id' | 'appointmentId' | 'patientId' | 'providerId' | 'recordedAt'>

const emptyVital: VitalDraft = {
  heartRate: null,
  bloodPressureSystolic: null,
  bloodPressureDiastolic: null,
  temperature: null,
  weight: null,
  oxygenSaturation: null,
}

function VitalsSection() {
  const [vitals, setVitals] = useState<VitalDraft>(emptyVital)
  const [editing, setEditing] = useState(false)

  function handleChange(field: keyof VitalDraft, value: string) {
    setVitals((prev) => ({ ...prev, [field]: value === '' ? null : Number(value) }))
  }

  const vitalFields: {
    key: keyof VitalDraft
    label: string
    unit: string
    icon: React.ReactNode
  }[] = [
    { key: 'heartRate', label: 'Heart Rate', unit: 'bpm', icon: <Heart className="size-3" /> },
    {
      key: 'bloodPressureSystolic',
      label: 'BP Systolic',
      unit: 'mmHg',
      icon: <Activity className="size-3" />,
    },
    {
      key: 'bloodPressureDiastolic',
      label: 'BP Diastolic',
      unit: 'mmHg',
      icon: <Activity className="size-3" />,
    },
    {
      key: 'temperature',
      label: 'Temperature',
      unit: '°F',
      icon: <Thermometer className="size-3" />,
    },
    { key: 'weight', label: 'Weight', unit: 'lbs', icon: <Weight className="size-3" /> },
    { key: 'oxygenSaturation', label: 'O₂ Sat', unit: '%', icon: <Activity className="size-3" /> },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <Heart className="size-4" />
          Vitals
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
          <Pen className="size-3" />
          {editing ? 'Done' : 'Edit'}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {vitalFields.map(({ key, label, unit, icon }) => (
          <div key={key} className="rounded-md border p-3">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
              {icon} {label}
            </div>
            {editing ? (
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  className="h-7 text-sm"
                  value={vitals[key] ?? ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
                <span className="text-xs text-muted-foreground">{unit}</span>
              </div>
            ) : (
              <p className="font-semibold text-sm">
                {vitals[key] != null ? `${vitals[key]} ${unit}` : '—'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

type ProblemDraft = Pick<Problem, 'name' | 'icdCode' | 'description' | 'status'>

const emptyProblem: ProblemDraft = { name: '', icdCode: '', description: '', status: 'ACTIVE' }

function ProblemsSection() {
  const [problems, setProblems] = useState<ProblemDraft[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<ProblemDraft>(emptyProblem)

  function openAdd() {
    setDraft(emptyProblem)
    setEditIndex(null)
    setDialogOpen(true)
  }

  function openEdit(i: number) {
    setDraft(problems[i])
    setEditIndex(i)
    setDialogOpen(true)
  }

  function handleSave() {
    if (!draft.name.trim()) return
    setProblems((prev) => {
      if (editIndex != null) {
        const next = [...prev]
        next[editIndex] = draft
        return next
      }
      return [...prev, draft]
    })
    setDialogOpen(false)
  }

  function toggleStatus(i: number) {
    setProblems((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], status: next[i].status === 'ACTIVE' ? 'RESOLVED' : 'ACTIVE' }
      return next
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <AlertTriangle className="size-4" />
          Problems
        </h3>
        <Button variant="ghost" size="sm" onClick={openAdd}>
          <Plus className="size-3" /> Add
        </Button>
      </div>

      {problems.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-3">No problems recorded.</p>
      )}

      <div className="space-y-2">
        {problems.map((p, i) => (
          <div key={i} className="flex items-center justify-between rounded-md border p-3 text-sm">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium">{p.name}</p>
                {p.icdCode && <p className="text-xs text-muted-foreground">ICD: {p.icdCode}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={p.status === 'ACTIVE' ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => toggleStatus(i)}
              >
                {p.status}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => openEdit(i)}>
                <Pen className="size-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editIndex != null ? 'Edit Problem' : 'Add Problem'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div>
              <Label>ICD Code</Label>
              <Input
                value={draft.icdCode ?? ''}
                onChange={(e) => setDraft({ ...draft, icdCode: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={draft.description ?? ''}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={draft.status}
                onValueChange={(v) => setDraft({ ...draft, status: v as Problem['status'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

type MedicationDraft = Pick<
  Medication,
  'name' | 'dosage' | 'frequency' | 'startDate' | 'endDate' | 'status' | 'notes'
>

const emptyMedication: MedicationDraft = {
  name: '',
  dosage: '',
  frequency: '',
  startDate: '',
  endDate: null,
  status: 'ACTIVE',
  notes: null,
}

function MedicationsSection() {
  const [meds, setMeds] = useState<MedicationDraft[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<MedicationDraft>(emptyMedication)

  function openAdd() {
    setDraft(emptyMedication)
    setEditIndex(null)
    setDialogOpen(true)
  }

  function openEdit(i: number) {
    setDraft(meds[i])
    setEditIndex(i)
    setDialogOpen(true)
  }

  function handleSave() {
    if (!draft.name.trim()) return
    setMeds((prev) => {
      if (editIndex != null) {
        const next = [...prev]
        next[editIndex] = draft
        return next
      }
      return [...prev, draft]
    })
    setDialogOpen(false)
  }

  function cycleStatus(i: number) {
    const order: Medication['status'][] = ['ACTIVE', 'COMPLETED', 'DISCONTINUED']
    setMeds((prev) => {
      const next = [...prev]
      const current = order.indexOf(next[i].status)
      next[i] = { ...next[i], status: order[(current + 1) % order.length] }
      return next
    })
  }

  const statusVariant: Record<Medication['status'], 'default' | 'secondary' | 'destructive'> = {
    ACTIVE: 'default',
    COMPLETED: 'secondary',
    DISCONTINUED: 'destructive',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <Pill className="size-4" />
          Medications
        </h3>
        <Button variant="ghost" size="sm" onClick={openAdd}>
          <Plus className="size-3" /> Add
        </Button>
      </div>

      {meds.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-3">No medications prescribed.</p>
      )}

      <div className="space-y-2">
        {meds.map((m, i) => (
          <div key={i} className="flex items-center justify-between rounded-md border p-3 text-sm">
            <div>
              <p className="font-medium">{m.name}</p>
              <p className="text-xs text-muted-foreground">
                {m.dosage} · {m.frequency}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={statusVariant[m.status]}
                className="cursor-pointer"
                onClick={() => cycleStatus(i)}
              >
                {m.status}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => openEdit(i)}>
                <Pen className="size-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editIndex != null ? 'Edit Medication' : 'Add Medication'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Dosage</Label>
                <Input
                  value={draft.dosage}
                  onChange={(e) => setDraft({ ...draft, dosage: e.target.value })}
                  placeholder="e.g. 500mg"
                />
              </div>
              <div>
                <Label>Frequency</Label>
                <Input
                  value={draft.frequency}
                  onChange={(e) => setDraft({ ...draft, frequency: e.target.value })}
                  placeholder="e.g. twice daily"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={draft.startDate}
                  onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={draft.endDate ?? ''}
                  onChange={(e) => setDraft({ ...draft, endDate: e.target.value || null })}
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={draft.status}
                onValueChange={(v) => setDraft({ ...draft, status: v as Medication['status'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={draft.notes ?? ''}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value || null })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

type AllergyDraft = Pick<
  Allergy,
  'name' | 'category' | 'substance' | 'reaction' | 'severity' | 'notes'
>

const emptyAllergy: AllergyDraft = {
  name: '',
  category: 'OTHER',
  substance: '',
  reaction: null,
  severity: null,
  notes: null,
}

function AllergiesSection() {
  const [allergies, setAllergies] = useState<AllergyDraft[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<AllergyDraft>(emptyAllergy)

  function openAdd() {
    setDraft(emptyAllergy)
    setEditIndex(null)
    setDialogOpen(true)
  }

  function openEdit(i: number) {
    setDraft(allergies[i])
    setEditIndex(i)
    setDialogOpen(true)
  }

  function handleSave() {
    if (!draft.substance.trim()) return
    setAllergies((prev) => {
      if (editIndex != null) {
        const next = [...prev]
        next[editIndex] = draft
        return next
      }
      return [...prev, draft]
    })
    setDialogOpen(false)
  }

  const severityColor: Record<string, 'default' | 'secondary' | 'destructive'> = {
    MILD: 'secondary',
    MODERATE: 'default',
    SEVERE: 'destructive',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <AlertTriangle className="size-4" />
          Allergies
        </h3>
        <Button variant="ghost" size="sm" onClick={openAdd}>
          <Plus className="size-3" /> Add
        </Button>
      </div>

      {allergies.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-3">No allergies recorded.</p>
      )}

      <div className="space-y-2">
        {allergies.map((a, i) => (
          <div key={i} className="flex items-center justify-between rounded-md border p-3 text-sm">
            <div>
              <p className="font-medium">{a.substance}</p>
              <p className="text-xs text-muted-foreground">
                {a.category}
                {a.reaction ? ` · ${a.reaction}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {a.severity && (
                <Badge variant={severityColor[a.severity] ?? 'secondary'}>{a.severity}</Badge>
              )}
              <Button variant="ghost" size="sm" onClick={() => openEdit(i)}>
                <Pen className="size-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editIndex != null ? 'Edit Allergy' : 'Add Allergy'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Substance</Label>
              <Input
                value={draft.substance}
                onChange={(e) => setDraft({ ...draft, substance: e.target.value })}
              />
            </div>
            <div>
              <Label>Name</Label>
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={draft.category}
                onValueChange={(v) => setDraft({ ...draft, category: v as Allergy['category'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FOOD">Food</SelectItem>
                  <SelectItem value="MEDICATION">Medication</SelectItem>
                  <SelectItem value="ENVIRONMENTAL">Environmental</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reaction</Label>
              <Input
                value={draft.reaction ?? ''}
                onChange={(e) => setDraft({ ...draft, reaction: e.target.value || null })}
              />
            </div>
            <div>
              <Label>Severity</Label>
              <Select
                value={draft.severity ?? ''}
                onValueChange={(v) => setDraft({ ...draft, severity: v || null })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MILD">Mild</SelectItem>
                  <SelectItem value="MODERATE">Moderate</SelectItem>
                  <SelectItem value="SEVERE">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={draft.notes ?? ''}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value || null })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AppointmentDetails({ appointment }: AppointmentDetailsProps) {
  if (!appointment) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-sm text-muted-foreground text-center">
            Select an appointment to view details.
          </p>
        </CardContent>
      </Card>
    )
  }

  const patientName = appointment.patient
    ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
    : `Patient #${appointment.patientId}`

  return (
    <Card className="border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Appointment Details</CardTitle>
            <p className="text-sm text-muted-foreground">
              {patientName} · {formatDate(appointment.startTime, 'full')}
            </p>
          </div>
          <div className="flex gap-2">
            {appointment.status === 'SCHEDULED' && (
              <Button size="sm">
                <CheckCircle className="size-3" />
                Complete Visit
              </Button>
            )}
            <Button variant="outline" size="sm">
              Reschedule
            </Button>
            <Button variant="destructive" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Patient Info */}
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold mb-3">
            <User className="size-4" />
            Patient Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{patientName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{formatDate(appointment.patient.dob, 'full')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{appointment.patient.phone || '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Gender</p>
              <p className="font-medium">{appointment.patient.gender}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Appointment Info */}
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold mb-3">
            <Calendar className="size-4" />
            Appointment Info
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="size-3" /> Date:
              </span>
              <p className="font-medium">{formatDate(appointment.startTime, 'full')}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <Clock className="size-3" /> Time:
              </span>
              <p className="font-medium">
                {formatTime(appointment.startTime)} – {formatTime(appointment.endTime)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Reason:</span>
              <p className="font-medium">{appointment.reason ?? 'No reason provided'}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Status:</span>
              <Badge>{appointment.status}</Badge>
            </div>
          </div>
        </div>

        <Separator />
        <VisitNoteSection appointment={appointment} />
        <Separator />
        <VitalsSection />
        <Separator />
        <ProblemsSection />
        <Separator />
        <MedicationsSection />
        <Separator />
        <AllergiesSection />
      </CardContent>
    </Card>
  )
}
