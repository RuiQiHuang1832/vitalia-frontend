'use client'

import { ColumnDef } from '@tanstack/react-table'
// Note: Columns are where you define the core of what your table will look like. They define the data that will be displayed, how it will be formatted, sorted and filtered.
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Stack } from '@/components/ui/stack'
import { getNameColors } from '@/lib/colorMap'
import { calculateAge } from '@/lib/utils'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Copy,
  Eye,
  History,
  ListChecks,
  MoreHorizontal,
  X,
} from 'lucide-react'

import type { Patient } from '../types'

export const columns: ColumnDef<Patient>[] = [
  {
    id: 'select',
    size: 40,
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
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 -ml-3">
              MRN
              {!isSorted && <ArrowUpDown className="h-4 w-4" />}
              {isSorted === 'asc' && <ArrowUp className="h-4 w-4" />}
              {isSorted === 'desc' && <ArrowDown className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUp className="h-4 w-4" />
              Sort ascending
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown className="h-4 w-4" />
              Sort descending
            </DropdownMenuItem>

            {isSorted && (
              <DropdownMenuItem onClick={() => column.clearSorting()}>
                <X className="h-4 w-4" />
                Clear sorting
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    size: 120,
  },
  {
    accessorKey: 'name',
    size: 200,
    cell: ({ getValue }) => {
      const fullName = getValue() as string
      const { bg, text } = getNameColors(fullName || 'User')
      return (
        <Stack>
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full ${bg} ${text} text-sm font-medium`}
          >
            {fullName
              .split(' ')
              .map((n) => n.charAt(0))
              .join('')}
          </div>
          <div className="font-medium">{fullName.trim()}</div>
        </Stack>
      )
    },
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
              <ArrowUp className="h-4 w-4" />
              Sort ascending
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown className="h-4 w-4" />
              Sort descending
            </DropdownMenuItem>

            {isSorted && (
              <DropdownMenuItem onClick={() => column.clearSorting()}>
                <X className="h-4 w-4" />
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
    size: 80,
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
              <ArrowUp className="h-4 w-4" />
              Sort ascending
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown className="h-4 w-4" />
              Sort descending
            </DropdownMenuItem>

            {isSorted && (
              <DropdownMenuItem onClick={() => column.clearSorting()}>
                <X className="h-4 w-4" />
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
    accessorKey: 'lastVisit',
    header: ({ column }) => {
      return <div>Last Visit</div>
    },
    cell: ({ getValue }) => {
      const lastVisit = getValue() as Date | null
      return (
        <Stack>
          <History className="h-4 w-4" />
          {lastVisit
            ? new Date(lastVisit).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'No visits'}
        </Stack>
      )
    },
    enableSorting: false,
    size: 200,
  },
  {
    accessorKey: 'status',
    size: 150,
    cell: ({ getValue }) => {
      const status = getValue() as Patient['status']
      const statusOptions: Array<{ value: Patient['status']; label: string; color: string }> = [
        { value: 'ACTIVE', label: 'Active', color: 'bg-green-50 text-green-700' },
        { value: 'INACTIVE', label: 'Inactive', color: 'bg-amber-50 text-amber-700' },
        { value: 'DISCHARGED', label: 'Discharged', color: 'bg-blue-50 text-blue-700' },
      ]
      const option = statusOptions.find((option) => option.value === status)
      return <Badge className={option?.color}>{option?.label}</Badge>
    },
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
              <ArrowUp className="h-4 w-4" />
              Sort ascending
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown className="h-4 w-4" />
              Sort descending
            </DropdownMenuItem>

            {isSorted && (
              <DropdownMenuItem onClick={() => column.clearSorting()}>
                <X className="h-4 w-4" />
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
    size: 50,
    cell: ({ row }) => {
      const patient = row.original
      const statusOptions: Array<{ value: Patient['status']; label: string; color: string }> = [
        { value: 'ACTIVE', label: 'Active', color: 'bg-green-50 text-green-700' },
        { value: 'INACTIVE', label: 'Inactive', color: 'bg-gray-50 text-gray-700' },
        { value: 'DISCHARGED', label: 'Discharged', color: 'bg-blue-50 text-blue-700' },
      ]

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(patient.mrn)}>
              <Copy className="h-4 w-4" />
              Copy MRN
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Eye className="h-4 w-4" />
              View Patient
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2">
                <ListChecks className="h-4 w-4" />
                Set Status
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuLabel className="text-muted-foreground text-xs">
                    Status
                  </DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={patient.status}>
                    {statusOptions.map((option) => (
                      <DropdownMenuRadioItem key={option.value} value={option.value}>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
