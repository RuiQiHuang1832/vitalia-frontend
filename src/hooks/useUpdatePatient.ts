import { useCallback, useState } from 'react'

type UpdatePatientPayload = Partial<{
  email: string
  firstName: string
  lastName: string
  dob: string
  status: string
  password: string
  phone: string
}>

export function useUpdatePatient() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updatePatient = useCallback(
    async (patientId: number, updatedData: UpdatePatientPayload) => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/patients/${patientId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        })

        if (!res.ok) {
          throw new Error('Failed to update patient')
        }
      } catch (err) {
        setError(err as Error)
        throw err
      } finally {
        setIsLoading(false)
      }
    }, [])

  return { updatePatient, isLoading, error }
}
