import { expect, test } from '@playwright/test'
import { randomUUID } from 'crypto'
import { loginAsProvider } from './utils/login'

test('provider can create a new patient', async ({ page }) => {
  await loginAsProvider(page)

  await page.goto('/patients')

  // Click "Add New Patient" button
  await page.getByRole('button', { name: 'Add New Patient' }).click()

  // Ensure modal is visible
  await expect(page.getByRole('heading', { name: 'Add New Patient' })).toBeVisible()

  // Fill form fields
  await page.getByLabel('First Name').fill('John')
  await page.getByLabel('Last Name').fill('Doe')

  // Date picker — depends how yours works
  await page.getByRole('button', { name: 'Select date' }).click()
  await page.getByRole('gridcell', { name: '15' }).click() // example day

  const uniqueEmail = `john.${randomUUID()}@test.com`

  await page.getByLabel('Email').fill(uniqueEmail)
  await page.getByLabel('Phone').fill('5551234567')

  // Submit form
  await page.getByRole('button', { name: 'Create Patient' }).click()

  // Assert toast appears
  await expect(page.locator('text=Patient created successfully')).toBeVisible()
})
