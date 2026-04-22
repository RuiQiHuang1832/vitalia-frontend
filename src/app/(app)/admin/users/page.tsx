import { getUsers } from '@/lib/api.server'
import UsersTable from './UsersTable'
import type { UsersResponse } from './types'

export default async function UsersPage() {
  const initialData = (await getUsers({ page: 1, limit: 10 })) as UsersResponse

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h1 className="text-left font-semibold text-3xl">User Management</h1>
        <p className="text-muted-foreground">
          Manage all user accounts and their permissions.
        </p>
      </section>
      <UsersTable initialData={initialData} />
    </div>
  )
}
