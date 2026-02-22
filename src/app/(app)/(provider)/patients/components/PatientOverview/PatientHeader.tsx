import { PatientBase, type Patient } from '@/app/(app)/(provider)/patients/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'
import { calculateAge } from '@/lib/utils'
import { Calendar, Clock, Mail, Phone, User } from 'lucide-react'
import { IoMdMedical } from 'react-icons/io'
import { AvatarWithBadge } from './PatientAvatar'
type PatientHeaderProps = {
  data: PatientBase
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatText(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

function getStatusBadge(status: PatientBase['status']) {
  const statusOptions: Array<{ value: Patient['status']; label: string; color: string }> = [
    { value: 'ACTIVE', label: 'Active', color: 'bg-green-50 text-green-700' },
    { value: 'INACTIVE', label: 'Inactive', color: 'bg-amber-50 text-amber-700' },
    { value: 'DISCHARGED', label: 'Discharged', color: 'bg-blue-50 text-blue-700' },
  ]
  const option = statusOptions.find((option) => option.value === status)
  return <Badge className={option?.color}>{option?.label} Patient</Badge>
}

export default function PatientHeader({ data: patient }: PatientHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <Stack gap={2}>
          <AvatarWithBadge />
          <div className="space-y-1">
            <CardTitle className="ps-2 text-2xl">
              {patient.firstName} {patient.lastName}
            </CardTitle>
            <CardDescription>{getStatusBadge(patient.status)}</CardDescription>
          </div>
        </Stack>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          <Stack gap={2} align="center">
            <IoMdMedical className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">MRN</p>
              <p className="text-sm font-medium">MRN-{patient.id.toString().padStart(6, '0')}</p>
            </div>
          </Stack>
          <Stack gap={2} align="center">
            <Calendar className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Date of Birth</p>
              <p className="text-sm font-medium">
                {formatDate(patient.dob)} ({calculateAge(patient.dob)}y)
              </p>
            </div>
          </Stack>

          <Stack gap={2} align="center">
            <User className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Gender</p>
              <p className="text-sm font-medium">{formatText(patient.gender)}</p>
            </div>
          </Stack>

          <Stack gap={2} align="center">
            <Phone className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{patient.phone}</p>
            </div>
          </Stack>

          <Stack gap={2} align="center">
            <Mail className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{patient.email}</p>
            </div>
          </Stack>

          <Stack gap={2} align="center">
            <Clock className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Joined</p>
              <p className="text-sm font-medium">{formatDate(patient.createdAt)}</p>
            </div>
          </Stack>
        </div>
      </CardContent>
    </Card>
  )
}
