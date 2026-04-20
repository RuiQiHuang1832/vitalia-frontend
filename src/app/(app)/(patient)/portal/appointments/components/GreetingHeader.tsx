'use client'

import { useCurrentUserDisplay } from '@/hooks/useCurrentUserDisplay'

export default function GreetingHeader() {
  const { greeting, isLoading } = useCurrentUserDisplay()

  return (
    <section className="space-y-3">
      <h1 className="text-left font-semibold text-3xl">
        {isLoading ? (
          <span className="inline-block h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700 align-middle" />
        ) : (
          <>Hello, {greeting}</>
        )}
      </h1>
      <p className="text-muted-foreground">
        Here are your upcoming and past appointments. Contact your provider to reschedule or cancel.
      </p>
    </section>
  )
}
