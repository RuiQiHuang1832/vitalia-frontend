'use client'

import AvailabilityForm from '@/app/(app)/(provider)/availability/components/AvailabilityForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useProviderAvailability } from '@/hooks/useProviderAvailability'
import { CalendarPlus, Clock } from 'lucide-react'
import { useState } from 'react'

export default function AvailabilityPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)

  const { data: availability, isLoading } = useProviderAvailability()

  if (isLoading) {
    return (
      <div className="py-5 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full ">
      <section className="space-y-3">
        <h1 className="text-left font-semibold text-3xl">Availability</h1>
        <p className="text-muted-foreground">Manage your working schedule and available hours.</p>
      </section>
      <div className="py-5 flex-1">
        {availability ? (
          <AvailabilityForm availability={availability} mode="edit" />
        ) : showCreateForm ? (
          <AvailabilityForm mode="create" />
        ) : (
          <Card className="h-full border-none bg-transparent shadow-none">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
                <CalendarPlus className="size-6 text-primary" />
              </div>
              <CardTitle>No Availability Set</CardTitle>
              <CardDescription>
                You haven&apos;t configured your working schedule yet. Set your available days and
                hours so patients can book appointments with you.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => setShowCreateForm(true)}>
                <Clock className="size-4" />
                Set Up Availability
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
