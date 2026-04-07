
import AuditLogsTable from './AuditLogsTable'

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h1 className="text-left font-semibold text-3xl">Audit Logs</h1>
        <p className="text-muted-foreground">
          Track all actions performed across the system.
        </p>
      </section>
      <AuditLogsTable />
    </div>
  )
}
