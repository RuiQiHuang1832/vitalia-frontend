'use client'

import { type AppointmentWithPatient, type Vital } from '@/app/(app)/(provider)/patients/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Activity, Heart, Pen, Save, Thermometer, Weight } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type VitalDraft = Omit<Vital, 'id' | 'appointmentId' | 'patientId' | 'providerId' | 'recordedAt'>

const emptyVital: VitalDraft = {
  heartRate: null,
  bloodPressureSystolic: null,
  bloodPressureDiastolic: null,
  temperature: null,
  weight: null,
  oxygenSaturation: null,
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

interface VitalsSectionProps {
  appointment: AppointmentWithPatient
  readOnly: boolean
  onMutate: () => void
}

export default function VitalsSection({ appointment, readOnly, onMutate }: VitalsSectionProps) {
  const existing = appointment.vitals?.[appointment.vitals.length - 1]
  const [vitals, setVitals] = useState<VitalDraft>(existing ? {
    heartRate: existing.heartRate,
    bloodPressureSystolic: existing.bloodPressureSystolic,
    bloodPressureDiastolic: existing.bloodPressureDiastolic,
    temperature: existing.temperature,
    weight: existing.weight,
    oxygenSaturation: existing.oxygenSaturation,
  } : emptyVital)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [vitalId, setVitalId] = useState<number | undefined>(existing?.id)

  function handleChange(field: keyof VitalDraft, value: string) {
    setVitals((prev) => ({ ...prev, [field]: value === '' ? null : Number(value) }))
  }

  async function handleDone() {
    setSaving(true)
    try {
      if (vitalId) {
        const res = await fetch(`/api/vitals/${vitalId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vitals),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          throw new Error(data?.message || 'Failed to update vitals')
        }
      } else {
        const res = await fetch('/api/vitals', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appointmentId: appointment.id, ...vitals }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.message || 'Failed to save vitals')
        setVitalId(data.id)
      }
      toast.success('Vitals saved')
      setEditing(false)
      onMutate()
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Failed to save vitals')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="border-l-4 border-rose-500">
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold bg-rose-100 text-rose-800 rounded-r-full px-3 py-1.5 w-fit">
          <Heart className="size-4" />
          Vitals
        </h3>
        {!readOnly && (
          editing ? (
            <Button variant="outline" size="sm" onClick={handleDone} disabled={saving}>
              {saving ? 'Saving…' : <><Save className="size-3" /> Save</>}
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => setEditing(true)}>
              <Pen className="size-3" />
              {vitalId ? 'Edit' : 'Record'}
            </Button>
          )
        )}
      </div>
      <div className="grid grid-cols-3 gap-3 pl-3">
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
