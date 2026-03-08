import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function AppointmentCardSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <Skeleton className="h-3 w-40" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-3 w-52" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function AppointmentListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <AppointmentCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
