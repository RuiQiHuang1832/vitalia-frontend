import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const SkeletonLine = ({ width, height = 'h-5' }: { width: string; height?: string }) => (
  <div className={`${width} ${height} rounded bg-muted`}></div>
)

const SkeletonGroup = ({ lines }: { lines: string[] }) => (
  <div className="space-y-3 mt-5">
    {lines.map((width, index) => (
      <SkeletonLine key={index} width={width} />
    ))}
  </div>
)

export default function NextAppointmentSkeleton() {
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
        <div className="flex items-start gap-2">
          <SkeletonLine width="w-70" />
          <SkeletonLine width="w-50" />
          <SkeletonLine width="w-20" />
        </div>
        <SkeletonGroup lines={['w-[80%]', 'w-1/3', 'w-1/4']} />
      </CardContent>
      <CardFooter>
        <div className="flex items-start gap-2">
          <SkeletonLine width="w-30" />
          <SkeletonLine width="w-30" />
          <SkeletonLine width="w-30" />
        </div>
      </CardFooter>
    </Card>
  )
}
