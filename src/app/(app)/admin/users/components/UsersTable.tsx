'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useUsers } from '@/hooks/useUsers'
import { formatMrn } from '@/lib/utils'
import { format } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  USER_ROLE_FILTER_OPTIONS,
  type UserRoleFilter,
  type UserRow,
  type UserStatus,
  type UsersFilters,
  type UsersResponse,
} from '../types'
import { AddProviderSheet } from './AddProviderSheet'

const ROLE_VARIANT: Record<UserRow['role'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ADMIN: 'default',
  PROVIDER: 'secondary',
  PATIENT: 'outline',
}

const STATUS_VARIANT: Record<UserStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ACTIVE: 'default',
  INACTIVE: 'destructive',
  DISCHARGED: 'secondary',
}

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const
const DEFAULT_PAGE_SIZE = 10

function formatName(row: UserRow) {
  if (!row.firstName && !row.lastName) return '—'
  return `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim()
}

function formatProfileId(row: UserRow): string {
  if (row.profileId === null) return '—'
  if (row.role === 'PATIENT') return formatMrn(row.profileId)
  return `ID-${String(row.profileId).padStart(6, '0')}`
}

interface UsersTableProps {
  initialData: UsersResponse
}

export default function UsersTable({ initialData }: UsersTableProps) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE)
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>('ALL')
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [confirmDeactivate, setConfirmDeactivate] = useState<UserRow | null>(null)

  const filters: UsersFilters = roleFilter !== 'ALL' ? { role: roleFilter } : {}

  const { data, isLoading, error, mutate } = useUsers(
    page,
    pageSize,
    filters,
    page === 1 && roleFilter === 'ALL' && pageSize === DEFAULT_PAGE_SIZE ? initialData : undefined
  )

  function handleToggleClick(row: UserRow) {
    if (row.role !== 'PROVIDER' || !row.status) return
    if (row.status === 'ACTIVE') {
      setConfirmDeactivate(row)
      return
    }
    updateProviderStatus(row, 'ACTIVE')
  }

  async function updateProviderStatus(row: UserRow, nextStatus: UserStatus) {
    setTogglingId(row.userId)
    try {
      const res = await fetch(`/api/users/${row.userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.message ?? 'Failed to update status')
      }
      toast.success(`Provider ${nextStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`)
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An unexpected error occurred')
      console.error(err)
    } finally {
      setTogglingId(null)
      setConfirmDeactivate(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={roleFilter}
          onValueChange={(v) => {
            setPage(1)
            setRoleFilter(v as UserRoleFilter)
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {USER_ROLE_FILTER_OPTIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r === 'ALL' ? 'All roles' : r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto">
          <AddProviderSheet onCreated={() => mutate()} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[120px]">Role</TableHead>
              <TableHead className="w-[130px]">Status</TableHead>
              <TableHead className="w-[180px]">Created</TableHead>
              <TableHead className="w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && !data ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-destructive">
                  Failed to load users. {error instanceof Error ? error.message : 'Unknown error'}
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((row) => {
                const isProvider = row.role === 'PROVIDER'
                const isToggling = togglingId === row.userId
                return (
                  <TableRow key={row.userId}>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {formatProfileId(row)}
                    </TableCell>
                    <TableCell>{formatName(row)}</TableCell>
                    <TableCell className="text-sm">{row.email}</TableCell>
                    <TableCell>
                      <Badge variant={ROLE_VARIANT[row.role]}>{row.role}</Badge>
                    </TableCell>
                    <TableCell>
                      {row.status ? (
                        <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(row.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      {isProvider && row.status ? (
                        <Button
                          variant={row.status === 'ACTIVE' ? 'destructive' : 'default'}
                          size="sm"
                          disabled={isToggling}
                          onClick={() => handleToggleClick(row)}
                        >
                          {isToggling ? '...' : row.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Page {data.page} of {data.totalPages} ({data.totalCount} total)
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Display:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(v) => {
                  setPage(1)
                  setPageSize(Number(v))
                }}
              >
                <SelectTrigger className="w-[80px]" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog
        open={confirmDeactivate !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmDeactivate(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate provider</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDeactivate
                ? `Are you sure you want to deactivate ${formatName(confirmDeactivate)}? They will lose access to the system until reactivated.`
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={togglingId === confirmDeactivate?.userId}
              onClick={(e) => {
                e.preventDefault()
                if (confirmDeactivate) {
                  updateProviderStatus(confirmDeactivate, 'INACTIVE')
                }
              }}
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
