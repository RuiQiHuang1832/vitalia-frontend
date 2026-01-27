import TasksSkeleton from '@/app/(app)/dashboard/components/Tasks/TasksSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight, FileText, HeartPulse } from 'lucide-react'

const tasks = [
  {
    id: 'missing-vitals',
    label: 'visits missing vitals',
    count: 1,
    href: '#',
    icon: HeartPulse,
  },
  {
    id: 'missing-notes',
    label: 'visits missing notes',
    count: 1,
    href: '#',
    icon: FileText,
  },
]

export default function TasksCard() {
  const isLoading = false
  if (isLoading) {
    return <TasksSkeleton />
  }
  return (
    <Card className="gap-0 h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Open Tasks</CardTitle>

        <Button variant="link" className="px-0">
          View All Tasks →
        </Button>
      </CardHeader>

      <CardContent className="divide-y">
        {tasks.map((task) => (
          <Button
            key={task.id}
            variant="ghost"
            className="h-auto w-full p-0 justify-between"
            asChild
          >
            <div className={`flex items-center justify-between py-4`}>
              {/* Left */}
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {<task.icon className="size-5" />}
                </div>
                {/* Name + Meta */}
                <div className="font-medium">
                  {task.count} {task.label}
                </div>
              </div>
              {/* Right */}
              <div className="text-muted-foreground">
                <ChevronRight className="h-5 w-5 me-1" />
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
