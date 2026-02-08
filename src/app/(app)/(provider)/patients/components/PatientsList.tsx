import { columns, Patient } from '../table/columns'
import { DataTable } from '../table/data-table'

async function getData(): Promise<Patient[]> {
  return [
    {
      mrn: 'MRN-102938',
      name: 'John Smith',
      age: new Date(1988, 0, 7), // Jan 7, 1988
      provider: 'Dr. Sarah Lee',
      status: 'active',
    },
    {
      mrn: 'MRN-550392',
      name: 'Mary Johnson',
      age: new Date(1993, 2, 11), // March 11, 1993
      provider: 'Dr. Sarah Lee',
      status: 'active',
    },
    {
      mrn: 'MRN-882930',
      name: 'James Williams',
      age: new Date(1983, 11, 13), // Dec 13, 1983
      provider: 'Dr. James Kim',
      status: 'active',
    },
    {
      mrn: 'MRN-601905',
      name: 'Patricia Brown',
      age: new Date(1985, 11, 13),
      provider: 'Dr. Sarah Lee',
      status: 'active',
    },
    {
      mrn: 'MRN-703690',
      name: 'Michael Jones',
      age: new Date(1983, 6, 9),
      provider: 'Dr. Sarah Lee',
      status: 'active',
    },
    {
      mrn: 'MRN-846690',
      name: 'Robert Martinez',
      age: new Date(1982, 9, 23),
      provider: 'Dr. James Kim',
      status: 'inactive',
    },
    {
      mrn: 'MRN-843114',
      name: 'Susan Davis',
      age: new Date(1986, 2, 29),
      provider: 'Dr. Sarah Lee',
      status: 'active',
    },
    {
      mrn: 'MRN-207500',
      name: 'David Wilson',
      age: new Date(1988, 11, 4),
      provider: 'Dr. Sarah Lee',
      status: 'discharged',
    },
    {
      mrn: 'MRN-755072',
      name: 'Karen Anderson',
      age: new Date(1983, 5, 6),
      provider: 'Dr. James Kim',
      status: 'discharged',
    },
  ]
}

export default async function PatientsList() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
