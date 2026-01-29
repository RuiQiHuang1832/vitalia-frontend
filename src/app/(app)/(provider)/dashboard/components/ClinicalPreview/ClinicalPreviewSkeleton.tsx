import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ClinicalPreviewSkeleton() {
  return (
    <Card className="gap-0 h-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <Skeleton className="w-50 h-4" />
      </CardHeader>
      <CardContent className="space-y-4 mt-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="w-[50%] h-3" />
            <ul className="space-y-2">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
