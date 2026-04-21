import { expect, test } from '@playwright/test'
import { loginAsPatient } from './utils/login'

test.describe('patient profile', () => {
  test('patient can update their own contact info (happy path)', async ({ page }) => {
    await loginAsPatient(page)

    await page.goto('/portal/profile')

    await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible()

    // Personal Information fields should be disabled (read-only)
    await expect(page.getByLabel('First Name')).toBeDisabled()
    await expect(page.getByLabel('Date of Birth')).toBeDisabled()

    // Generate a unique phone to keep the form dirty on re-runs
    const suffix = String(Math.floor(1000 + Math.random() * 9000))
    const newPhone = `555-123-${suffix}`

    const phoneInput = page.getByLabel('Phone')
    await phoneInput.fill(newPhone)

    await page.getByRole('button', { name: 'Save Changes' }).click()

    await expect(page.getByText('Contact info updated successfully')).toBeVisible()

    // Reload and confirm the value persisted
    await page.reload()
    await expect(page.getByLabel('Phone')).toHaveValue(newPhone)
  })

  test('patient cannot update restricted fields (bad path)', async ({ page }) => {
    await loginAsPatient(page)

    const patientId = process.env.E2E_PATIENT_ID
    expect(patientId, 'E2E_PATIENT_ID must be set in .env.test').toBeTruthy()

    // Attempt to update firstName on own record — backend should reject with 403
    const res = await page.request.put(`/api/patients/${patientId}`, {
      data: { firstName: 'Hacker' },
    })

    expect(res.status()).toBe(403)
    const body = await res.json()
    expect(body.message).toMatch(/email, phone/i)
  })
})
