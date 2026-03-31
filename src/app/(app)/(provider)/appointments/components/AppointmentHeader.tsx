import { AppointmentWithPatient } from '@/app/(app)/(provider)/patients/types'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Stack } from '@/components/ui/stack'
import { ArrowLeft, Play } from 'lucide-react'

interface AppointmentHeaderProps {
  tab: string
  onTabChange: (value: string) => void
  appointmentCount: number
  selectedAppointment: AppointmentWithPatient | null
  encounterActive: boolean
  onStartEncounter: () => void
  onEndEncounter: () => void
}

export default function AppointmentHeader({
  tab,
  onTabChange,
  appointmentCount,
  selectedAppointment,
  encounterActive,
  onStartEncounter,
  onEndEncounter,
}: AppointmentHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {encounterActive ? (
          <Button variant="ghost" size="sm" onClick={onEndEncounter}>
            <ArrowLeft className="size-4" />
            Back to Appointments
          </Button>
        ) : (
          <Select value={tab} onValueChange={onTabChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past Appointments</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      <Stack>
        {!encounterActive && tab === 'upcoming' && appointmentCount > 0 && (
          <Button
            disabled={!selectedAppointment}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={onStartEncounter}
          >
            <Play className="size-3" />
            Start Appointment
          </Button>
        )}
      </Stack>
    </div>
  )
}
