import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
export default function TasksSkeleton() {
  return (
    <Card className="sticky  flex-none size-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <Skeleton className="w-50 h-4" />
        <Skeleton className="w-50 h-4" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="w-full h-6" />
        ))}
      </CardContent>
    </Card>
  )
}
