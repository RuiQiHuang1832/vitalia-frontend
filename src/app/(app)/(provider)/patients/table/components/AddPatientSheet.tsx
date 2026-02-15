import { DateOfBirthField } from '@/app/(app)/(provider)/patients/table/components/DateOfBirthField'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { ImSpinner2 } from 'react-icons/im'
import { IoMdAdd } from 'react-icons/io'
import { z } from 'zod'

const createPatientSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Minimum 6 characters' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  dob: z
    .date({ message: 'Date of birth is required' })
    .max(new Date(), { message: 'Date of birth cannot be in the future' }),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .regex(/^\d+$/, { message: 'Phone number must contain only digits' }),
})

export function AddPatientSheet() {
  const form = useForm<z.infer<typeof createPatientSchema>>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      email: '',
      password: 'admin123', // Default temporary password
      firstName: '',
      lastName: '',
      phone: '',
    },
  })
  const onSubmit = async (data: z.infer<typeof createPatientSchema>) => {
    const payload = {
      ...data,
      dob: data.dob.toISOString().split('T')[0], // converts to YYYY-MM-DD
    }
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await res.json() // 👈 THIS is key

      if (!res.ok) {
        throw new Error(result.message || 'Something went wrong')
      }

      console.log('Created:', result)
    } catch (err) {
      console.error('Error creating patient:', err)
    }
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <IoMdAdd className="!text-white h-4 w-4 mr-2" />
          Add New Patient
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Add New Patient</SheetTitle>
          <SheetDescription>
            Enter the patient&apos;s details below to create a new account.
          </SheetDescription>
        </SheetHeader>

        <form id="create-patient-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid py-6 px-4 gap-8">
            {/* -------------------- Basic Info -------------------- */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-muted-foreground">Basic Information</h3>

              <FieldGroup className="grid grid-cols-2 gap-5">
                <Controller
                  name="firstName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                      <Input
                        {...field}
                        id="firstName"
                        aria-invalid={fieldState.invalid}
                        placeholder="First Name"
                      />
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
                      <Input
                        {...field}
                        id="lastName"
                        aria-invalid={fieldState.invalid}
                        placeholder="Last Name"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>

              {/* Date of Birth */}
              <Controller
                name="dob"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Date of Birth</FieldLabel>
                    <DateOfBirthField {...field} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {/* -------------------- Contact Info -------------------- */}
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
                        autoComplete="username"
                        aria-invalid={fieldState.invalid}
                        placeholder="patient@example.com"
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
                        aria-invalid={fieldState.invalid}
                        placeholder="555-123-4567"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>

            {/* -------------------- Account Security -------------------- */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-muted-foreground">Account Security</h3>

              <FieldGroup>
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password">Temporary Password</FieldLabel>

                      <Input
                        {...field}
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Create temporary password"
                      />

                      <p className="text-xs text-muted-foreground">
                        Patient will be required to change this after first login.
                      </p>

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>
          </div>
        </form>

        <SheetFooter className="pt-4">
          <Field orientation="vertical" className="space-y-3 justify-center ">
            <Button
              type="submit"
              form="create-patient-form"
              disabled={form.formState.isSubmitting}
              className={cn(form.formState.isSubmitting && 'bg-gray-400')}
            >
              {form.formState.isSubmitting ? (
                <ImSpinner2 className="animate-spin" />
              ) : (
                'Create Patient'
              )}
            </Button>
          </Field>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
