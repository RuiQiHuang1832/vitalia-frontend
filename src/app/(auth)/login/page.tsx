import { LoginCredentialsPopover } from '@/app/(auth)/components/LoginCredentialsPopover'
import LoginForm from '@/app/(auth)/components/LoginForm'
import { Stack } from '@/components/ui/stack'
import { Info } from 'lucide-react'
export default function Login() {
  return (
    <Stack justify="center" direction="col" className="min-h-screen max-w-md mx-auto">
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Work in Progress</p>
            <p className="mt-1 text-blue-700 dark:text-blue-300">
              This site is under active development. The{' '}
              <span className="font-semibold">Provider</span> dashboard and{' '}
              <span className="font-semibold">Patient</span> portal are functional.
              Please log in with a <span className="font-semibold">provider</span> or{' '}
              <span className="font-semibold">patient</span> account — the admin portal
              is not yet available.
            </p>
          </div>
        </div>
      </div>
      <LoginCredentialsPopover></LoginCredentialsPopover>
      <LoginForm />
    </Stack>
  )
}
