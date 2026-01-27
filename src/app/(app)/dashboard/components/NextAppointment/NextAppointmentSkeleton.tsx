import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import { Skeleton } from '@/components/ui/skeleton'

export default function NextAppointmentSkeleton() {
  return (
    <Card className="w-full sticky flex-none">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <Skeleton className="w-50 h-5" />
        <Skeleton className="w-50 h-5" />
      </CardHeader>
      <CardContent className="space-y-5">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="w-full h-5" />
        ))}
      </CardContent>
      <CardFooter>
        <div className="flex items-start gap-2">
          <Skeleton className="w-30 h-5" />
          <Skeleton className="w-30 h-5" />
          <Skeleton className="w-30 h-5" />
        </div>
      </CardFooter>
    </Card>
  )
}
