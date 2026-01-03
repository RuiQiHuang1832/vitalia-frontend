import LoginForm from '@/app/(auth)/components/LoginForm'
import { Stack } from '@/components/ui/stack'
export default function Login() {
  return (
    <Stack justify='center' className="min-h-screen">
      <LoginForm />
    </Stack>
  )
}
