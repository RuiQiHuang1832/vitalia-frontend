'use client'

import { type Allergy, type AppointmentWithPatient } from '@/app/(app)/(provider)/patients/types'
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
import { AlertTriangle, Pen, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type AllergyDraft = Pick<
  Allergy,
  'name' | 'category' | 'substance' | 'reaction' | 'severity' | 'notes'
>

type AllergyEntry = AllergyDraft & { id?: number }

const emptyAllergy: AllergyDraft = {
  name: '',
  category: 'OTHER',
  substance: '',
  reaction: null,
  severity: null,
  notes: null,
}

const severityColor: Record<string, 'default' | 'secondary' | 'destructive'> = {
  MILD: 'secondary',
  MODERATE: 'default',
  SEVERE: 'destructive',
}

interface AllergiesSectionProps {
  appointment: AppointmentWithPatient
  readOnly: boolean
  onMutate: () => void
}

export default function AllergiesSection({ appointment, readOnly, onMutate }: AllergiesSectionProps) {
  const [allergies, setAllergies] = useState<AllergyEntry[]>(
    () => appointment.patient.allergies?.map((a) => ({
      id: a.id,
      name: a.name,
      category: a.category,
      substance: a.substance,
      reaction: a.reaction,
      severity: a.severity,
      notes: a.notes,
    })) ?? []
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<AllergyDraft>(emptyAllergy)
  const [saving, setSaving] = useState(false)

  function openAdd() {
    setDraft(emptyAllergy)
    setEditIndex(null)
    setDialogOpen(true)
  }

  function openEdit(i: number) {
    const entry = allergies[i]
    setDraft({ name: entry.name, category: entry.category, substance: entry.substance, reaction: entry.reaction, severity: entry.severity, notes: entry.notes })
    setEditIndex(i)
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!draft.substance.trim()) return
    setSaving(true)
    try {
      if (editIndex != null) {
        const existing = allergies[editIndex]
        if (existing.id) {
          const res = await fetch(`/api/allergies/${existing.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(draft),
          })
          if (!res.ok) {
            const data = await res.json().catch(() => null)
            throw new Error(data?.message || 'Failed to update allergy')
          }
        }
        setAllergies((prev) => {
          const next = [...prev]
          next[editIndex] = { ...draft, id: existing.id }
          return next
        })
        toast.success('Allergy updated')
      } else {
        const res = await fetch('/api/allergies', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientId: appointment.patientId, ...draft }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.message || 'Failed to save allergy')
        setAllergies((prev) => [...prev, { ...draft, id: data.id }])
        toast.success('Allergy added')
      }
      setDialogOpen(false)
      onMutate()
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Failed to save allergy')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="border-l-4 border-purple-500">
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold bg-purple-100 text-purple-800 rounded-r-full px-3 py-1.5 w-fit">
          <AlertTriangle className="size-4" />
          Allergies
        </h3>
        {!readOnly && (
          <Button variant="ghost" size="sm" onClick={openAdd}>
            <Plus className="size-3" /> Add
          </Button>
        )}
      </div>

      {allergies.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-3 pl-3">No allergies recorded.</p>
      )}

      <div className="space-y-2 pl-3">
        {allergies.map((a, i) => (
          <div key={a.id ?? i} className="flex items-center justify-between rounded-md border p-3 text-sm">
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
              {!readOnly && (
                <Button variant="ghost" size="sm" onClick={() => openEdit(i)}>
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
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
