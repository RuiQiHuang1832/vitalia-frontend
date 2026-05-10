import AuthShell from '@/app/(app)/AuthShell'
import { getCurrentRole } from '@/lib/api.server'

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const initialRole = await getCurrentRole()

  return <AuthShell initialRole={initialRole}>{children}</AuthShell>
}
