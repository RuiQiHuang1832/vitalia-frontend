import { LoginCredentialsPopover } from '@/app/(auth)/components/LoginCredentialsPopover'
import LoginForm from '@/app/(auth)/components/LoginForm'
import { Stack } from '@/components/ui/stack'
export default function Login() {
  return (
    <Stack justify="center" direction="col" className="min-h-screen max-w-md mx-auto">
      <LoginCredentialsPopover></LoginCredentialsPopover>
      <LoginForm />
    </Stack>
  )
}
