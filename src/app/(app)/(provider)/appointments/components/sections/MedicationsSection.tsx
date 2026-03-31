'use client'

import { type AppointmentWithPatient, type Medication } from '@/app/(app)/(provider)/patients/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import { Pen, Pill, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type MedicationDraft = Pick<
  Medication,
  'name' | 'dosage' | 'frequency' | 'startDate' | 'endDate' | 'status' | 'notes'
>

type MedicationEntry = MedicationDraft & { id?: number }

const emptyMedication: MedicationDraft = {
  name: '',
  dosage: '',
  frequency: '',
  startDate: '',
  endDate: null,
  status: 'ACTIVE',
  notes: null,
}

const statusVariant: Record<Medication['status'], 'default' | 'secondary' | 'destructive'> = {
  ACTIVE: 'default',
  COMPLETED: 'secondary',
  DISCONTINUED: 'destructive',
}

interface MedicationsSectionProps {
  appointment: AppointmentWithPatient
  readOnly: boolean
  onMutate: () => void
}

export default function MedicationsSection({ appointment, readOnly, onMutate }: MedicationsSectionProps) {
  const [meds, setMeds] = useState<MedicationEntry[]>(
    () => appointment.patient.medications?.map((m) => ({
      id: m.id,
      name: m.name,
      dosage: m.dosage,
      frequency: m.frequency,
      startDate: m.startDate,
      endDate: m.endDate,
      status: m.status,
      notes: m.notes,
    })) ?? []
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<MedicationDraft>(emptyMedication)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function openAdd() {
    setDraft(emptyMedication)
    setEditIndex(null)
    setError('')
    setDialogOpen(true)
  }

  function openEdit(i: number) {
    const entry = meds[i]
    setDraft({ name: entry.name, dosage: entry.dosage, frequency: entry.frequency, startDate: entry.startDate, endDate: entry.endDate, status: entry.status, notes: entry.notes })
    setEditIndex(i)
    setError('')
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!draft.name.trim()) {
      setError('Medication name is required.')
      return
    }
    setError('')
    setSaving(true)
    try {
      if (editIndex != null) {
        const existing = meds[editIndex]
        if (existing.id) {
          const res = await fetch(`/api/medications/${existing.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(draft),
          })
          if (!res.ok) {
            const data = await res.json().catch(() => null)
            throw new Error(data?.message || 'Failed to update medication')
          }
        }
        setMeds((prev) => {
          const next = [...prev]
          next[editIndex] = { ...draft, id: existing.id }
          return next
        })
        toast.success('Medication updated')
      } else {
        const res = await fetch('/api/medications', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientId: appointment.patientId, ...draft }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.message || 'Failed to save medication')
        setMeds((prev) => [...prev, { ...draft, id: data.id }])
        toast.success('Medication added')
      }
      setDialogOpen(false)
      onMutate()
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Failed to save medication')
    } finally {
      setSaving(false)
    }
  }

  async function cycleStatus(i: number) {
    const order: Medication['status'][] = ['ACTIVE', 'COMPLETED', 'DISCONTINUED']
    const current = order.indexOf(meds[i].status)
    const newStatus = order[(current + 1) % order.length]

    const existing = meds[i]
    if (existing.id) {
      try {
        const res = await fetch(`/api/medications/${existing.id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          throw new Error(data?.message || 'Failed to update status')
        }
      } catch (error) {
        console.error(error)
        toast.error(error instanceof Error ? error.message : 'Failed to update status')
        return
      }
    }

    setMeds((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], status: newStatus }
      return next
    })
    onMutate()
  }

  return (
    <div className="border-l-4 border-teal-500">
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold bg-teal-100 text-teal-800 rounded-r-full px-3 py-1.5 w-fit">
          <Pill className="size-4" />
          Medications
        </h3>
        {!readOnly && (
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={openAdd}>
            <Plus className="size-3" /> Add
          </Button>
        )}
      </div>

      {meds.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-3 pl-3">No medications prescribed.</p>
      )}

      <div className="space-y-2 pl-3">
        {meds.map((m, i) => (
          <div key={m.id ?? i} className="flex items-center justify-between rounded-md border p-3 text-sm">
            <div>
              <p className="font-medium">{m.name}</p>
              <p className="text-xs text-muted-foreground">
                {m.dosage} · {m.frequency}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={statusVariant[m.status]}
                className={readOnly ? '' : 'cursor-pointer'}
                onClick={readOnly ? undefined : () => cycleStatus(i)}
              >
                {m.status}
              </Badge>
              {!readOnly && (
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => openEdit(i)}>
                  <Pen className="size-3" />
                </Button>
              )}
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
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Dosage</Label>
                <Input
                  value={draft.dosage}
                  onChange={(e) => setDraft({ ...draft, dosage: e.target.value })}
                  placeholder="e.g. 500mg"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Frequency</Label>
                <Input
                  value={draft.frequency}
                  onChange={(e) => setDraft({ ...draft, frequency: e.target.value })}
                  placeholder="e.g. twice daily"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={draft.startDate}
                  onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={draft.endDate ?? ''}
                  onChange={(e) => setDraft({ ...draft, endDate: e.target.value || null })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
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
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                value={draft.notes ?? ''}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value || null })}
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <DialogFooter>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
