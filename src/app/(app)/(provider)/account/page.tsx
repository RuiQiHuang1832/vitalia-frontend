'use client'

import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUserDisplay } from '@/hooks/useCurrentUserDisplay'
import { useUserProfile } from '@/hooks/useUserProfile'
import { getNameColors } from '@/lib/colorMap'
import { capitalize } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ImSpinner2 } from 'react-icons/im'
import { toast } from 'sonner'
import { z } from 'zod'

const accountSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .regex(/^\d+$/, { message: 'Phone number must contain only digits' }),
  specialty: z.string().min(1, { message: 'Specialty is required' }),
})

type AccountFormValues = z.infer<typeof accountSchema>

export default function AccountPage() {
  const { fullName, avatar, isLoading: displayLoading } = useCurrentUserDisplay()
  const { bg } = getNameColors(fullName)
  const { data: profile, isLoading } = useUserProfile()
  const providerId = useAuthStore((s) => s.providerId)

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialty: '',
    },
  })

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
        specialty: profile.specialty ?? '',
      })
    }
  }, [profile, form])

  const onSubmit = async (data: AccountFormValues) => {
    console.log('Account update payload:', { providerId, ...data })
    toast.success('Account updated successfully')
  }

  const loading = isLoading || displayLoading

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-left font-semibold text-3xl">Account</h1>
        <p className="text-muted-foreground">
          Update your personal details below.
        </p>
      </section>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            {loading ? (
              <Skeleton className="h-16 w-16 rounded-full" />
            ) : (
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatar} alt={fullName} />
                <AvatarFallback className={`text-lg ${bg}`}>
                  {capitalize(fullName.charAt(0))}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <CardTitle>{loading ? <Skeleton className="h-5 w-32" /> : fullName}</CardTitle>
              <CardDescription>
                {loading ? (
                  <Skeleton className="mt-1 h-4 w-48" />
                ) : (
                  'Update your personal details below'
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Personal Information
                </h3>
                <FieldGroup className="grid grid-cols-2 gap-5">
                  <Controller
                    name="firstName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                        <Input {...field} id="firstName" aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="lastName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                        <Input {...field} id="lastName" aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <Controller
                  name="specialty"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="specialty">Specialty</FieldLabel>
                      <Input {...field} id="specialty" aria-invalid={fieldState.invalid} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-muted-foreground">Contact Information</h3>
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
                          type="email"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="phone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="phone">Phone</FieldLabel>
                        <Input {...field} id="phone" type="tel" aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting || !form.formState.isDirty}
              >
                {form.formState.isSubmitting ? (
                  <ImSpinner2 className="animate-spin" />
                ) : (
                  'Save Changes'
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
