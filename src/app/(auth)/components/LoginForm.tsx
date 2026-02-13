'use client'
import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ImSpinner2 } from 'react-icons/im'
import * as z from 'zod'
// Define the schema for form validation using Zod
const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(1, 'Password is required'),
})

export default function LoginForm() {
  const { user, status } = useAuthStore()
  const router = useRouter()
  // Initialize the form with React Hook Form and Zod resolver
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        console.error('Login failed:', res.statusText, res.status)
        return
      }

      const json = await res.json()
      const payload = {
        user: {
          id: json.user.id,
          email: json.user.email,
          role: json.user.role,
        },
        providerId: json.user.providerId ?? null,
        patientId: json.user.patientId ?? null,
      }

      useAuthStore.getState().setSession(payload)
      // Set flag to skip hydration, fixes COOKIE RACE
      sessionStorage.setItem('justLoggedIn', 'true')
      // Redirect by role
      switch (payload.user.role) {
        case 'PATIENT':
          router.replace('/portal')
          break
        case 'PROVIDER':
          router.replace('/dashboard')
          break
        case 'ADMIN':
          router.replace('/admin')
          break
      }
    } catch (error) {
      console.error('Network error:', error)
    }
  }

  useEffect(() => {
    console.log('User state updated:', user)
    console.log('Current status:', status)
  }, [user, status]) //debugging purpose

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="text-center relative">
        <CardTitle className="text-2xl font-bold">Vitalia</CardTitle>
        <CardDescription>
          Modern clinical records, simplified. <br /> Built for providers, patients, and care teams.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-5">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type="password"
                  />
                  <Link
                    href="#"
                    className="text-muted-foreground text-sm leading-normal font-normal hover:underline"
                  >
                    Forgot your password?
                  </Link>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="vertical" className="space-y-3 justify-center ">
          <Button
            type="submit"
            form="login-form"
            disabled={form.formState.isSubmitting}
            className={cn(form.formState.isSubmitting && 'bg-gray-400')}
          >
            {form.formState.isSubmitting ? <ImSpinner2 className="animate-spin" /> : 'Sign in'}
          </Button>
          <FieldDescription className=" text-center">
            Accounts are created by your healthcare organization.{' '}
            <span className="text-blue-400">Contact your administrator if you need access.</span>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  )
}
