'use client'

import { type AppointmentWithPatient, type Problem } from '@/app/(app)/(provider)/patients/types'
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

type ProblemDraft = Pick<Problem, 'name' | 'icdCode' | 'description' | 'status'>

type ProblemEntry = ProblemDraft & { id?: number }

const emptyProblem: ProblemDraft = { name: '', icdCode: '', description: '', status: 'ACTIVE' }

interface ProblemsSectionProps {
  appointment: AppointmentWithPatient
  readOnly: boolean
  onMutate: () => void
}

export default function ProblemsSection({ appointment, readOnly, onMutate }: ProblemsSectionProps) {
  const [problems, setProblems] = useState<ProblemEntry[]>(
    () => appointment.patient.problems?.map((p) => ({
      id: p.id,
      name: p.name,
      icdCode: p.icdCode,
      description: p.description,
      status: p.status,
    })) ?? []
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<ProblemDraft>(emptyProblem)
  const [saving, setSaving] = useState(false)

  function openAdd() {
    setDraft(emptyProblem)
    setEditIndex(null)
    setDialogOpen(true)
  }

  function openEdit(i: number) {
    const entry = problems[i]
    setDraft({ name: entry.name, icdCode: entry.icdCode, description: entry.description, status: entry.status })
    setEditIndex(i)
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!draft.name.trim()) return
    setSaving(true)
    try {
      if (editIndex != null) {
        const existing = problems[editIndex]
        if (existing.id) {
          const res = await fetch(`/api/problems/${existing.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(draft),
          })
          if (!res.ok) {
            const data = await res.json().catch(() => null)
            throw new Error(data?.message || 'Failed to update problem')
          }
        }
        setProblems((prev) => {
          const next = [...prev]
          next[editIndex] = { ...draft, id: existing.id }
          return next
        })
        toast.success('Problem updated')
      } else {
        const res = await fetch('/api/problems', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientId: appointment.patientId, ...draft }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.message || 'Failed to save problem')
        setProblems((prev) => [...prev, { ...draft, id: data.id }])
        toast.success('Problem added')
      }
      setDialogOpen(false)
      onMutate()
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Failed to save problem')
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus(i: number) {
    const existing = problems[i]
    const newStatus = existing.status === 'ACTIVE' ? 'RESOLVED' : 'ACTIVE'

    if (existing.id) {
      try {
        const res = await fetch(`/api/problems/${existing.id}`, {
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

    setProblems((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], status: newStatus }
      return next
    })
    onMutate()
  }

  return (
    <div className="border-l-4 border-amber-500">
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold bg-amber-100 text-amber-800 rounded-r-full px-3 py-1.5 w-fit">
          <AlertTriangle className="size-4" />
          Problems
        </h3>
        {!readOnly && (
          <Button variant="ghost" size="sm" onClick={openAdd}>
            <Plus className="size-3" /> Add
          </Button>
        )}
      </div>

      {problems.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-3 pl-3">No problems recorded.</p>
      )}

      <div className="space-y-2 pl-3">
        {problems.map((p, i) => (
          <div key={p.id ?? i} className="flex items-center justify-between rounded-md border p-3 text-sm">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium">{p.name}</p>
                {p.icdCode && <p className="text-xs text-muted-foreground">ICD: {p.icdCode}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={p.status === 'ACTIVE' ? 'default' : 'secondary'}
                className={readOnly ? '' : 'cursor-pointer'}
                onClick={readOnly ? undefined : () => toggleStatus(i)}
              >
                {p.status}
              </Badge>
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
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
