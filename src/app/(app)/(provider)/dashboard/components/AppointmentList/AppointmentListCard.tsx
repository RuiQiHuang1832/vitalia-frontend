import AppointmentListSkeleton from '@/app/(app)/(provider)/dashboard/components/AppointmentList/AppointmentListSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getNameColors } from '@/lib/colorMap'
import { ChevronRight } from 'lucide-react'

type Appointment = {
  id: string
  time: string
  name: string
  age: number
  gender: string
}

const appointments: Appointment[] = [
  {
    id: '1',
    time: '9:00 AM',
    name: 'Stephanie Lee',
    age: 36,
    gender: 'Female',
  },
  {
    id: '2',
    time: '9:45 AM',
    name: 'David Carter',
    age: 36,
    gender: 'Male',
  },
  {
    id: '3',
    time: '11:00 AM',
    name: 'Michael Chen',
    age: 36,
    gender: 'Male',
  },
  {
    id: '4',
    time: '11:45 AM',
    name: 'John Chen',
    age: 36,
    gender: 'Male',
  },
]

export default function AppointmentListCard() {
  const isLoading = false
  if (isLoading) {
    return <AppointmentListSkeleton />
  }
  return (
    <Card className="gap-0">
      <CardHeader className="flex flex-row items-center justify-between px-0 mx-6 border-b">
        <CardTitle>Today’s Schedule</CardTitle>

        <Button variant="link" className="px-0">
          View Full Schedule →
        </Button>
      </CardHeader>
      <CardContent className="divide-y">
        {appointments.map((appt) => {
          const { bg, text } = getNameColors(appt.name)
          return (
            <Button
              key={appt.id}
              variant="ghost"
              className={`h-auto w-full p-0 justify-between`}
              asChild
            >
              <div className={`flex items-center justify-between py-4`}>
                {/* Left */}
                <div className="flex items-center gap-4">
                  {/* Time */}
                  <div className="w-10 text-sm text-muted-foreground text-right text-wrap">
                    {appt.time}
                  </div>

                  {/* Avatar */}
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${bg} ${text} text-sm font-medium`}
                  >
                    {appt.name
                      .split(' ')
                      .map((n) => n.charAt(0))
                      .join('')}
                  </div>

                  {/* Name + Meta */}
                  <div>
                    <div className="font-medium">{appt.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {appt.age} y/o · {appt.gender}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="text-muted-foreground">
                  <ChevronRight className="h-5 w-5 me-1" />
                </div>
              </div>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
