import * as React from 'react'

import { cn } from '@/lib/utils'

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col'
  gap?: keyof typeof gapMap
  align?: keyof typeof alignMap
  justify?: keyof typeof justifyMap
}

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
} as const

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
} as const

const gapMap = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
  16: 'gap-16',
  20: 'gap-20',
} as const

function Stack({
  direction = 'row',
  gap = 4,
  align = 'center',
  justify,
  className,
  children,
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        'flex',
        '',
        direction === 'col' ? 'flex-col' : 'flex-row flex-wrap',
        gapMap[gap],
        alignMap[align],
        justify && justifyMap[justify],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Stack }
