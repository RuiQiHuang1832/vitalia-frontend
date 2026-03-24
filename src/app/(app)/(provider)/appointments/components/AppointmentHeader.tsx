import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Stack } from '@/components/ui/stack'
import { Play } from 'lucide-react'

interface AppointmentHeaderProps {
  tab: string
  onTabChange: (value: string) => void
  appointmentCount: number
}

export default function AppointmentHeader({
  tab,
  onTabChange,
  appointmentCount,
}: AppointmentHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Select value={tab} onValueChange={onTabChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past Appointments</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Stack>
        {tab === 'upcoming' && appointmentCount > 0 && (
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Play className="size-3" />
            Start Appointment
          </Button>
        )}
      </Stack>
    </div>
  )
}
