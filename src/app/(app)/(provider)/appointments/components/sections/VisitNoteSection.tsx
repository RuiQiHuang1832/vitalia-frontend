'use client'

import { type AppointmentWithPatient, type VisitNote } from '@/app/(app)/(provider)/patients/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Check, FileText } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface VisitNoteSectionProps {
  appointment: AppointmentWithPatient
  readOnly: boolean
}

export default function VisitNoteSection({ appointment, readOnly }: VisitNoteSectionProps) {
  const existingContent = appointment.visitNote?.versions?.length
    ? appointment.visitNote.versions[appointment.visitNote.versions.length - 1].content
    : ''
  const [content, setContent] = useState(existingContent)
  const [saved, setSaved] = useState(true)
  const [saving, setSaving] = useState(false)
  const [visitNoteId, setVisitNoteId] = useState<number | undefined>(appointment.visitNote?.id)

  function handleChange(value: string) {
    setContent(value)
    setSaved(false)
  }
  async function handleSave() {
    setSaving(true)
    try {
      let noteId = visitNoteId

      if (noteId === undefined) {
        const res = await fetch(`/api/appointments/${appointment.id}/notes`, {
          method: 'POST',
          credentials: 'include',
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed to create visit note')
        const visitNote: VisitNote = data
        noteId = visitNote.id
        setVisitNoteId(noteId)
      }

      const entryRes = await fetch(`/api/notes/${noteId}/entries`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const entryData = await entryRes.json()
      if (!entryRes.ok) throw new Error(entryData.message || 'Failed to save visit note')

      setSaved(true)
      toast.success('Visit note saved')
    } catch (error) {
      console.error(error)
      toast.error('Failed to save visit note')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="border-l-4 border-blue-500">
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold bg-blue-100 text-blue-800 rounded-r-full px-3 py-1.5 w-fit">
          <FileText className="size-4" />
          Visit Note (SOAP)
        </h3>
        {!readOnly && (
          <Button size="sm" variant="outline" onClick={handleSave} disabled={saved || saving}>
            {saved ? <><Check className="size-4" /> Saved</> : 'Save Note'}
          </Button>
        )}
      </div>
      <Textarea
        placeholder="Write your SOAP note here..."
        className="min-h-[200px] font-mono text-sm ml-3"
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        readOnly={readOnly}
      />
    </div>
  )
}
