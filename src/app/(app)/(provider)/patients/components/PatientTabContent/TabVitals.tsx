import React from 'react'
import { PatientFull } from '@/app/(app)/(provider)/patients/types'
type TabVitalsDataProps = Pick<
  PatientFull,
  'vitals' | 'appointments'
>
export default function TabVitals({data}: {data: TabVitalsDataProps}) {
  return (
    <div>TabVitals</div>
  )
}
