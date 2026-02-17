'use client'
import { usePatients } from '@/hooks/usePatients'
import { ColumnFiltersState, SortingState } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { columns } from '../table/columns'
import { DataTable } from '../table/data-table'
import type { Patient } from '../types'
import { PatientsResponse } from '../types'

export default function PatientsTable({ initialData }: { initialData: PatientsResponse }) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const nameFilter = columnFilters.find((f) => f.id === 'name')?.value as string | undefined
  const statusFilter = columnFilters.find((f) => f.id === 'status')?.value as string[] | undefined

  const sort = sorting[0]
  const sortBy = sort?.id
  const sortOrder: 'asc' | 'desc' | undefined = sort ? (sort.desc ? 'desc' : 'asc') : undefined

  // Reset to first page when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [nameFilter, statusFilter, sortBy, sortOrder])

  const { data: payload, error } = usePatients(
    pagination.pageIndex + 1,
    pagination.pageSize,
    nameFilter,
    statusFilter,
    initialData,
    sortBy,
    sortOrder
  )
  const tableData: Patient[] = useMemo(() => {
    const rows = payload?.data ?? []
    return rows.map((p) => ({
      mrn: `MRN-${String(p.id).padStart(6, '0')}`,
      name: `${p.firstName.charAt(0).toUpperCase() + p.firstName.slice(1)} ${p.lastName.charAt(0).toUpperCase() + p.lastName.slice(1)}`,
      age: new Date(p.dob),
      lastVisit: p.appointments[0]?.startTime ?? null,
      status: p.status,
    }))
  }, [payload?.data])

  if (error) {
    return <div>Error loading patient data. Try refreshing the page.</div>
  }
  if (!payload) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={tableData}
        pagination={pagination}
        setPagination={setPagination}
        pageCount={payload.totalPages}
        totalCount={payload.totalCount}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        sorting={sorting}
        setSorting={setSorting}
      />
    </div>
  )
}
