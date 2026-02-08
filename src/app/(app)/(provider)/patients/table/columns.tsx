'use client'

import { ColumnDef } from '@tanstack/react-table'
// Note: Columns are where you define the core of what your table will look like. They define the data that will be displayed, how it will be formatted, sorted and filtered.
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { calculateAge } from '@/lib/utils'
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { MdClear } from 'react-icons/md'

export type Patient = {
  mrn: string
  name: string
  age: Date
  provider: string
  status: 'active' | 'inactive' | 'discharged'
}

export const columns: ColumnDef<Patient>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'mrn',
    header: 'MRN',
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 -ml-3">
              Name
              {!isSorted && <ArrowUpDown className="h-4 w-4" />}
              {isSorted === 'asc' && <ArrowUp className="h-4 w-4" />}
              {isSorted === 'desc' && <ArrowDown className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUp className="mr-2 h-4 w-4" />
              Sort ascending
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown className="mr-2 h-4 w-4" />
              Sort descending
            </DropdownMenuItem>

            {isSorted && (
              <DropdownMenuItem onClick={() => column.clearSorting()}>
                <MdClear className="mr-2 h-4 w-4" />
                Clear sorting
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  {
    accessorKey: 'age',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 -ml-3">
              Age
              {!isSorted && <ArrowUpDown className="h-4 w-4" />}
              {isSorted === 'asc' && <ArrowUp className="h-4 w-4" />}
              {isSorted === 'desc' && <ArrowDown className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUp className="mr-2 h-4 w-4" />
              Sort ascending
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown className="mr-2 h-4 w-4" />
              Sort descending
            </DropdownMenuItem>

            {isSorted && (
              <DropdownMenuItem onClick={() => column.clearSorting()}>
                <MdClear className="mr-2 h-4 w-4" />
                Clear sorting
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    cell: ({ getValue }) => {
      const dob = getValue() as string
      const age = calculateAge(dob)
      return <div>{age}</div>
    },
  },
  {
    accessorKey: 'provider',
    header: 'Provider',
  },
  {
    accessorKey: 'status',
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)

      // No filter → keep row
      if (!filterValue) return true

      // Multi-select
      if (Array.isArray(filterValue)) {
        return filterValue.includes(value)
      }

      // Single-select
      return value === filterValue
    },
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 -ml-3">
              Status
              {!isSorted && <ArrowUpDown className="h-4 w-4" />}
              {isSorted === 'asc' && <ArrowUp className="h-4 w-4" />}
              {isSorted === 'desc' && <ArrowDown className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUp className="mr-2 h-4 w-4" />
              Sort ascending
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown className="mr-2 h-4 w-4" />
              Sort descending
            </DropdownMenuItem>

            {isSorted && (
              <DropdownMenuItem onClick={() => column.clearSorting()}>
                <MdClear className="mr-2 h-4 w-4" />
                Clear sorting
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const patient = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText('stuff')}>
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
