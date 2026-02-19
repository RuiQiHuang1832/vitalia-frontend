type PatientOverviewProps = {
  id: number
}

export default function PatientOverview({ id }: PatientOverviewProps) {
  return <div>PatientOverview for patient {id}</div>
}
