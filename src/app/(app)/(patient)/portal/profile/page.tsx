'use client'

import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUserDisplay } from '@/hooks/useCurrentUserDisplay'
import { useUserProfile } from '@/hooks/useUserProfile'
import { getNameColors } from '@/lib/colorMap'
import { capitalize, formatDate } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { ImSpinner2 } from 'react-icons/im'
import { toast } from 'sonner'
import { z } from 'zod'

const contactSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/, { message: 'Phone number must be in XXX-XXX-XXXX format' }),
})

type ContactFormValues = z.infer<typeof contactSchema>

export default function PatientProfilePage() {
  const { fullName, avatar, isLoading: displayLoading } = useCurrentUserDisplay()
  const { bg } = getNameColors(fullName)
  const { data: profile, isLoading, mutate } = useUserProfile()
  const patientId = useAuthStore((s) => s.patientId)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    values: profile
      ? {
          email: profile.email ?? '',
          phone: profile.phone ?? '',
        }
      : undefined,
  })

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const res = await fetch(`/api/patients/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error(body?.message ?? 'Failed to update profile')
      }

      await mutate()
      toast.success('Contact info updated successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile')
    }
  }

  const loading = isLoading || displayLoading

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-left font-semibold text-3xl">My Profile</h1>
        <p className="text-muted-foreground">
          Review your information on file. Contact your provider to correct personal details.
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
                  'Keep your contact details up to date'
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
            <div className="space-y-8">
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Personal Information
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Read-only
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  These details are verified by your provider. Contact your provider&apos;s office
                  to request a change.
                </p>
                <div className="grid grid-cols-2 gap-5 pt-2">
                  <Field>
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <Input id="firstName" value={profile?.firstName ?? ''} readOnly disabled />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input id="lastName" value={profile?.lastName ?? ''} readOnly disabled />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="dob">Date of Birth</FieldLabel>
                    <Input
                      id="dob"
                      value={profile?.dob ? formatDate(profile.dob, 'short') : ''}
                      readOnly
                      disabled
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="gender">Gender</FieldLabel>
                    <Input id="gender" value={capitalize(profile?.gender ?? '')} readOnly disabled />
                  </Field>
                </div>
              </section>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <h3 className="text-sm font-semibold text-muted-foreground">Contact Information</h3>
                <div className="flex flex-col gap-5">
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
                        <Input
                          {...field}
                          id="phone"
                          type="tel"
                          placeholder="XXX-XXX-XXXX"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
