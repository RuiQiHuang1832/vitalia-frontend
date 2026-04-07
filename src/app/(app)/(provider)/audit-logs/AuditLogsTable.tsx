'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
import { useAuditLogs } from '@/hooks/useAuditLogs'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
  USER_ROLES,
  type AuditAction,
  type AuditEntity,
  type AuditLog,
  type AuditLogFilters,
  type UserRole,
} from './types'

const ACTION_VARIANT: Record<AuditAction, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  CREATE: 'default',
  UPDATE: 'secondary',
  DELETE: 'destructive',
  VIEW: 'outline',
}

const LIMIT = 20

function formatEntity(entity: string) {
  return entity.replace(/_/g, ' ')
}

function getUserName(user: AuditLog['user']) {
  const profile = user.patient ?? user.provider
  return profile ? `${profile.firstName} ${profile.lastName}` : `User #${user.id}`
}

function getChangedFields(previous: Record<string, unknown>, updated: Record<string, unknown>) {
  const changes: { field: string; from: unknown; to: unknown }[] = []
  for (const key of Object.keys(updated)) {
    const prev = previous[key]
    const next = updated[key]
    if (JSON.stringify(prev) !== JSON.stringify(next)) {
      changes.push({ field: key, from: prev, to: next })
    }
  }
  return changes
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export default function AuditLogsTable() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<AuditLogFilters>({})
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const { data, isLoading, error } = useAuditLogs(page, LIMIT, filters)

  function updateFilter<K extends keyof AuditLogFilters>(
    key: K,
    value: AuditLogFilters[K] | undefined
  ) {
    setPage(1)
    setFilters((prev) => {
      const next = { ...prev }
      if (value) {
        next[key] = value
      } else {
        delete next[key]
      }
      return next
    })
  }

  const hasFilters = Object.keys(filters).length > 0

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filters.action ?? ''}
          onValueChange={(v) => updateFilter('action', v ? (v as AuditAction) : undefined)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            {AUDIT_ACTIONS.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.entity ?? ''}
          onValueChange={(v) => updateFilter('entity', v ? (v as AuditEntity) : undefined)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Entity" />
          </SelectTrigger>
          <SelectContent>
            {AUDIT_ENTITIES.map((e) => (
              <SelectItem key={e} value={e}>
                {formatEntity(e)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.userRole ?? ''}
          onValueChange={(v) => updateFilter('userRole', v ? (v as UserRole) : undefined)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {USER_ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-[150px] justify-start text-left font-normal',
                !filters.from && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {filters.from ? format(new Date(filters.from), 'MMM d, yyyy') : 'From'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.from ? new Date(filters.from) : undefined}
              onSelect={(date) => updateFilter('from', date ? date.toISOString() : undefined)}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-[150px] justify-start text-left font-normal',
                !filters.to && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {filters.to ? format(new Date(filters.to), 'MMM d, yyyy') : 'To'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.to ? new Date(filters.to) : undefined}
              onSelect={(date) => updateFilter('to', date ? date.toISOString() : undefined)}
            />
          </PopoverContent>
        </Popover>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilters({})
              setPage(1)
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="w-[180px]">Entity</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && !data ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-destructive">
                  Failed to load audit logs.{' '}
                  {error instanceof Error ? error.message : 'Unknown error'}
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No audit logs found.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((log) => {
                const isExpanded = expandedId === log.id
                return (
                  <>
                    <TableRow
                      key={log.id}
                      className="cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    >
                      <TableCell className="text-muted-foreground text-sm">
                        <div className="flex items-center gap-2">
                          <ChevronDown
                            className={cn(
                              'size-4 shrink-0 transition-transform',
                              !isExpanded && '-rotate-90'
                            )}
                          />
                          {format(new Date(log.createdAt), 'MMM d, yyyy h:mm a')}
                        </div>
                      </TableCell>
                      <TableCell>{getUserName(log.user)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.userRole}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={ACTION_VARIANT[log.action]}>{log.action}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{formatEntity(log.entity)}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                        {(log.details?.description as string) ?? '—'}
                      </TableCell>
                    </TableRow>
                    {isExpanded && log.details && (
                      <TableRow key={`${log.id}-details`}>
                        <TableCell colSpan={6} className="bg-muted/50 px-6 py-4">
                          <p className="text-sm font-medium mb-3">
                            {(log.details.description as string) ?? '—'}
                          </p>
                          {(log.details.previousData as Record<string, unknown> | undefined) &&
                            (log.details.updatedData as Record<string, unknown> | undefined) && (
                              <div className="rounded-md border bg-background p-4 space-y-3">
                                <p className="text-xs font-medium text-muted-foreground">
                                  Changelog:
                                </p>
                                <div className="space-y-2">
                                  {getChangedFields(
                                    log.details.previousData as Record<string, unknown>,
                                    log.details.updatedData as Record<string, unknown>
                                  ).map(({ field, from, to }) => (
                                    <div key={field} className="flex items-center gap-2 text-sm">
                                      <Badge variant="outline" className="font-mono text-xs">
                                        {field}
                                      </Badge>
                                      <span className="text-muted-foreground line-through">
                                        {formatValue(from)}
                                      </span>
                                      <span className="text-muted-foreground">→</span>
                                      <span>{formatValue(to)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.page} of {data.totalPages} ({data.totalCount} total)
          </p>
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
    </div>
  )
}
