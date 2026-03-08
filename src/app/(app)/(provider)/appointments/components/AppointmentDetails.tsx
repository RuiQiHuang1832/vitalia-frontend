import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, FileText, MapPin, Phone, User } from 'lucide-react'

export default function AppointmentDetails() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Appointment Details</h2>
          <p className="text-sm text-muted-foreground">Review and manage this appointment</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Reschedule
          </Button>
          <Button variant="destructive" size="sm">
            Cancel
          </Button>
        </div>
      </div>

      <Separator />

      {/* Patient Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="size-4" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="font-medium">Jane Doe</p>
          </div>
          <div>
            <p className="text-muted-foreground">Date of Birth</p>
            <p className="font-medium">Mar 15, 1990 (35 y/o)</p>
          </div>
          <div>
            <p className="text-muted-foreground">Phone</p>
            <p className="font-medium flex items-center gap-1">
              <Phone className="size-3" /> (555) 123-4567
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Gender</p>
            <p className="font-medium">Female</p>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="size-4" />
            Appointment Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-3" />
              Date
            </div>
            <p className="font-medium">Fri, Mar 7, 2026</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-3" />
              Time
            </div>
            <p className="font-medium">09:00 AM – 09:30 AM</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-3" />
              Location
            </div>
            <p className="font-medium">Room 3 — Internal Medicine</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge>SCHEDULED</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Reason */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="size-4" />
            Reason for Visit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Patient reports persistent lower back pain for the past two weeks. Pain worsens with
            prolonged sitting and bending. No radiating symptoms. Requesting evaluation and possible
            imaging.
          </p>
        </CardContent>
      </Card>

      {/* Visit Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="size-4" />
            Visit Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No visit notes recorded yet.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
