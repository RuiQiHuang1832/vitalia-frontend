import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const SkeletonLine = ({ width, height = 'h-5' }: { width: string; height?: string }) => (
  <div className={`${width} ${height} rounded bg-muted`}></div>
)

export default function TasksSkeleton() {
  return (
    <Card className="w-full sticky animate-pulse flex-none">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <CardTitle>
          <SkeletonLine width="w-50" />
        </CardTitle>
        <CardAction>
          <SkeletonLine width="w-50" />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <SkeletonLine key={index} width="w-full h-10" />
        ))}
      </CardContent>
    </Card>
  )
}
