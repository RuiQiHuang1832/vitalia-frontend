'use client'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type DateOfBirthFieldProps = {
  value?: Date
  onChange: (date?: Date) => void
}
export function DateOfBirthField({ value, onChange }: DateOfBirthFieldProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP') : 'Select date'}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          disabled={(date) => date > new Date()}
          selected={value}
          onSelect={onChange}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}
