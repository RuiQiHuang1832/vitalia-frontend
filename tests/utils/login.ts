import { Page } from '@playwright/test'

export async function loginAsProvider(page: Page) {
  await page.goto('http://localhost:3000/login')

  await page.getByRole('textbox', { name: 'Email' }).fill(process.env.E2E_PROVIDER_EMAIL!)
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.E2E_PROVIDER_PASSWORD!)

  await page.getByRole('button', { name: 'Sign in' }).click()

  // Wait for redirect
  await page.waitForURL('**/dashboard')

  // Optional: confirm login succeeded
  await page.getByText('My Day').waitFor()
}
