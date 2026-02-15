'use client'
import { usePatients } from '@/hooks/usePatients'
import { useMemo } from 'react'
import { columns } from '../table/columns'
import { DataTable } from '../table/data-table'
import type { Patient } from '../types'
import { PatientsResponse } from '../types'

export default function PatientsTable({ initialData }: { initialData: PatientsResponse }) {
  const { data: payload, error } = usePatients(initialData)

  const tableData: Patient[] = useMemo(() => {
    const rows = payload?.data ?? []
    return rows.map((p) => ({
      mrn: `MRN-${String(p.id).padStart(6, '0')}`,
      name: `${p.firstName} ${p.lastName}`,
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
      <DataTable columns={columns} data={tableData} />
    </div>
  )
}
