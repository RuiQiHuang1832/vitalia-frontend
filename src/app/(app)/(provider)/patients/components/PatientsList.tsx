import { columns, Patient } from '../table/columns'
import { DataTable } from '../table/data-table'

async function getData(): Promise<Patient[]> {
  return [
    {
      mrn: 'MRN-102938',
      name: 'John Smith',
      dob: new Date(1988, 0, 7), // Jan 7, 1988
      gender: 'Male',
      provider: 'Dr. Sarah Lee',
      status: 'active',
    },
    {
      mrn: 'MRN-550392',
      name: 'Mary Johnson',
      dob: new Date(1993, 2, 11), // March 11, 1993
      gender: 'Female',
      provider: 'Dr. Sarah Lee',
      status: 'active',
    },
    {
      mrn: 'MRN-882930',
      name: 'James Williams',
      dob: new Date(1983, 11, 13), // Dec 13, 1983
      gender: 'Male',
      provider: 'Dr. James Kim',
      status: 'active',
    },
    {
      mrn: 'MRN-601905',
      name: 'Patricia Brown',
      dob: new Date(1985, 11, 13),
      gender: 'Female',
      provider: 'Dr. Sarah Lee',
      status: 'active',
    },
    {
      mrn: 'MRN-703690',
      name: 'Michael Jones',
      dob: new Date(1983, 6, 9),
      gender: 'Male',
      provider: 'Dr. Sarah Lee',
      status: 'active',
    },
    {
      mrn: 'MRN-846690',
      name: 'Robert Martinez',
      dob: new Date(1982, 9, 23),
      gender: 'Male',
      provider: 'Dr. James Kim',
      status: 'inactive',
    },
    {
      mrn: 'MRN-843114',
      name: 'Susan Davis',
      dob: new Date(1986, 2, 29),
      gender: 'Female',
      provider: 'Dr. Sarah Lee',
      status: 'active',
    },
    {
      mrn: 'MRN-207500',
      name: 'David Wilson',
      dob: new Date(1988, 11, 4),
      gender: 'Male',
      provider: 'Dr. Sarah Lee',
      status: 'discharged',
    },
    {
      mrn: 'MRN-755072',
      name: 'Karen Anderson',
      dob: new Date(1983, 5, 6),
      gender: 'Female',
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
